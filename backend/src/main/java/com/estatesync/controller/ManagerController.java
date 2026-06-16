package com.estatesync.controller;

import com.estatesync.service.LeadService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/manager")
@PreAuthorize("hasRole('MANAGER')")
public class ManagerController {

    private final LeadService leadService;
    private final com.estatesync.repository.UserRepository userRepository;
    private final com.estatesync.repository.LeadRepository leadRepository;
    private final com.estatesync.repository.LeadHistoryRepository leadHistoryRepository;

    public ManagerController(LeadService leadService, com.estatesync.repository.UserRepository userRepository, com.estatesync.repository.LeadRepository leadRepository, com.estatesync.repository.LeadHistoryRepository leadHistoryRepository) {
        this.leadService = leadService;
        this.userRepository = userRepository;
        this.leadRepository = leadRepository;
        this.leadHistoryRepository = leadHistoryRepository;
    }

    @GetMapping("/leads")
    public ResponseEntity<?> getRegionalLeads(org.springframework.security.core.Authentication authentication) {
        com.estatesync.security.CustomUserDetails userDetails = (com.estatesync.security.CustomUserDetails) authentication.getPrincipal();
        Long regionId = userDetails.getUser().getRegion() != null ? userDetails.getUser().getRegion().getId() : null;
        if (regionId == null) return ResponseEntity.badRequest().body("Manager has no assigned region");
        return ResponseEntity.ok(leadRepository.findByRegionId(regionId));
    }

    @GetMapping("/agents")
    public ResponseEntity<?> getRegionalAgents(org.springframework.security.core.Authentication authentication) {
        com.estatesync.security.CustomUserDetails userDetails = (com.estatesync.security.CustomUserDetails) authentication.getPrincipal();
        Long regionId = userDetails.getUser().getRegion() != null ? userDetails.getUser().getRegion().getId() : null;
        if (regionId == null) return ResponseEntity.badRequest().body("Manager has no assigned region");
        
        java.util.List<com.estatesync.model.User> agents = userRepository.findAll().stream()
            .filter(u -> u.getRole() == com.estatesync.model.Role.AGENT && u.getRegion() != null && u.getRegion().getId().equals(regionId))
            .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(agents);
    }

    @PostMapping("/assign-lead")
    public ResponseEntity<?> assignLead(@RequestBody Map<String, Long> payload, org.springframework.security.core.Authentication authentication) {
        com.estatesync.security.CustomUserDetails userDetails = (com.estatesync.security.CustomUserDetails) authentication.getPrincipal();
        Long managerId = userDetails.getUser().getId();
        Long leadId = payload.get("leadId");
        Long agentId = payload.get("agentId");
        
        leadService.assignAgent(leadId, agentId, managerId);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/lead/{id}/history")
    public ResponseEntity<?> getLeadHistory(@PathVariable Long id, org.springframework.security.core.Authentication authentication) {
        com.estatesync.security.CustomUserDetails userDetails = (com.estatesync.security.CustomUserDetails) authentication.getPrincipal();
        Long regionId = userDetails.getUser().getRegion() != null ? userDetails.getUser().getRegion().getId() : null;
        if (regionId == null) return ResponseEntity.badRequest().body("Manager has no assigned region");

        com.estatesync.model.Lead lead = leadRepository.findById(id).orElse(null);
        if (lead == null || lead.getRegion() == null || !lead.getRegion().getId().equals(regionId)) {
            return ResponseEntity.badRequest().body("Lead not found or doesn't belong to your region");
        }
        
        return ResponseEntity.ok(leadHistoryRepository.findByLeadId(id));
    }

    @PostMapping("/lead")
    public ResponseEntity<?> createLead(@RequestBody CreateLeadRequest request, org.springframework.security.core.Authentication authentication) {
        com.estatesync.security.CustomUserDetails userDetails = (com.estatesync.security.CustomUserDetails) authentication.getPrincipal();
        com.estatesync.model.User manager = userDetails.getUser();
        
        if (manager.getRegion() == null) {
            return ResponseEntity.badRequest().body("Manager has no assigned region");
        }

        com.estatesync.model.Customer customer = new com.estatesync.model.Customer();
        customer.setName(request.getCustomerName());
        customer.setPhone(request.getCustomerPhone());
        customer.setEmail(request.getCustomerEmail());

        com.estatesync.model.Lead lead = new com.estatesync.model.Lead();
        lead.setCustomer(customer);
        lead.setRegion(manager.getRegion());
        lead.setManager(manager);
        lead.setStatus(com.estatesync.model.LeadStatus.NEW);

        if (request.getAgentId() != null) {
            userRepository.findById(request.getAgentId()).ifPresent(lead::setAgent);
        }

        com.estatesync.model.Lead savedLead = leadService.createLead(lead);
        return ResponseEntity.ok(savedLead);
    }

    public static class CreateLeadRequest {
        private String customerName;
        private String customerPhone;
        private String customerEmail;
        private Long agentId;
        
        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }
        public String getCustomerPhone() { return customerPhone; }
        public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
        public String getCustomerEmail() { return customerEmail; }
        public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
        public Long getAgentId() { return agentId; }
        public void setAgentId(Long agentId) { this.agentId = agentId; }
    }
}
