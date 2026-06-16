package com.estatesync.service;

import com.estatesync.model.*;
import com.estatesync.repository.*;
import com.estatesync.dto.InterestRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
public class LeadService {

    private final LeadRepository leadRepository;
    private final CustomerRepository customerRepository;
    private final PropertyRepository propertyRepository;
    private final LeadHistoryRepository leadHistoryRepository;
    private final UserRepository userRepository;

    public LeadService(LeadRepository leadRepository, CustomerRepository customerRepository,
                       PropertyRepository propertyRepository, LeadHistoryRepository leadHistoryRepository,
                       UserRepository userRepository) {
        this.leadRepository = leadRepository;
        this.customerRepository = customerRepository;
        this.propertyRepository = propertyRepository;
        this.leadHistoryRepository = leadHistoryRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public boolean processInterest(InterestRequest request) {
        boolean[] nameIgnored = {false};
        
        Customer customer = customerRepository.findByPhone(request.getPhone())
                .map(existing -> {
                    if (request.getName() != null && !request.getName().trim().equalsIgnoreCase(existing.getName().trim())) {
                        nameIgnored[0] = true;
                    }
                    return existing;
                })
                .orElseGet(() -> {
                    Customer newCustomer = new Customer();
                    newCustomer.setName(request.getName());
                    newCustomer.setEmail(request.getEmail());
                    newCustomer.setPhone(request.getPhone());
                    newCustomer.setIsEmailVerified(true); // Assuming OTP was just verified
                    newCustomer.setPreferredLocation(request.getPreferredLocation());
                    newCustomer.setPropertyType(request.getPropertyType());
                    return customerRepository.save(newCustomer);
                });

        List<Property> properties = propertyRepository.findAllById(request.getPropertyIds());
        
        // Group properties by Region
        java.util.Map<Region, java.util.List<Property>> propertiesByRegion = properties.stream()
            .filter(p -> p.getRegion() != null)
            .collect(java.util.stream.Collectors.groupingBy(Property::getRegion));

        for (java.util.Map.Entry<Region, java.util.List<Property>> entry : propertiesByRegion.entrySet()) {
            Region region = entry.getKey();
            List<Property> regionProperties = entry.getValue();

            // Find existing active lead for this customer and region
            List<Lead> existingLeads = leadRepository.findByCustomerIdAndRegionIdAndStatusNot(customer.getId(), region.getId(), LeadStatus.CLOSED);
            
            if (!existingLeads.isEmpty()) {
                // Append to the most recent active lead
                Lead existingLead = existingLeads.get(0);
                if (existingLead.getInterestedProperties() == null) {
                    existingLead.setInterestedProperties(new HashSet<>());
                }
                existingLead.getInterestedProperties().addAll(regionProperties);
                leadRepository.save(existingLead);
            } else {
                // Create a new lead
                Lead newLead = new Lead();
                newLead.setCustomer(customer);
                newLead.setStatus(LeadStatus.NEW);
                newLead.setInterestedProperties(new HashSet<>(regionProperties));
                newLead.setRegion(region);

                // Auto-route: assign to oldest Manager for this region
                userRepository.findFirstByRoleAndRegionIdAndIsActiveTrueOrderByIdAsc(Role.MANAGER, region.getId())
                    .ifPresent(newLead::setManager);

                leadRepository.save(newLead);
            }
        }
        
        return nameIgnored[0];
    }

    @Transactional
    public void assignAgent(Long leadId, Long newAgentId, Long managerId) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new IllegalArgumentException("Lead not found"));
        
        User newAgent = userRepository.findById(newAgentId)
                .orElseThrow(() -> new IllegalArgumentException("Agent not found"));
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new IllegalArgumentException("Manager not found"));

        User prevAgent = lead.getAgent();
        lead.setAgent(newAgent);
        leadRepository.save(lead);

        LeadHistory history = new LeadHistory();
        history.setLead(lead);
        history.setPrevAgent(prevAgent);
        history.setNewAgent(newAgent);
        history.setChangedBy(manager);
        leadHistoryRepository.save(history);
    }
    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }

    @Transactional
    public Lead createLead(Lead lead) {
        if (lead.getCustomer() != null && lead.getCustomer().getPhone() != null) {
            Optional<Customer> existing = customerRepository.findByPhone(lead.getCustomer().getPhone());
            if (existing.isPresent()) {
                Customer c = existing.get();
                c.setName(lead.getCustomer().getName());
                c.setEmail(lead.getCustomer().getEmail());
                customerRepository.save(c);
                lead.setCustomer(c);
            } else {
                lead.getCustomer().setIsEmailVerified(true);
                lead.setCustomer(customerRepository.save(lead.getCustomer()));
            }
        }
        return leadRepository.save(lead);
    }

    @Transactional
    public Lead updateLead(Long id, Lead updatedLead) {
        Lead existing = leadRepository.findById(id).orElseThrow();
        existing.setStatus(updatedLead.getStatus());
        
        if (updatedLead.getCustomer() != null && existing.getCustomer() != null) {
            Customer c = existing.getCustomer();
            c.setName(updatedLead.getCustomer().getName());
            c.setEmail(updatedLead.getCustomer().getEmail());
            c.setPhone(updatedLead.getCustomer().getPhone());
            customerRepository.save(c);
        }

        existing.setAgent(updatedLead.getAgent());
        existing.setManager(updatedLead.getManager());
        existing.setRegion(updatedLead.getRegion());
        
        if (updatedLead.getInterestedProperties() != null) {
            existing.getInterestedProperties().clear();
            existing.getInterestedProperties().addAll(updatedLead.getInterestedProperties());
        }

        return leadRepository.save(existing);
    }

    @Transactional
    public void deleteLead(Long id) {
        leadRepository.deleteById(id);
    }
}
