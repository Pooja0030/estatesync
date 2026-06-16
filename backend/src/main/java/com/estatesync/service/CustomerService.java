package com.estatesync.service;

import com.estatesync.model.Customer;
import com.estatesync.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Long id, Customer updated) {
        Customer existing = customerRepository.findById(id).orElseThrow();
        existing.setName(updated.getName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setPreferredLocation(updated.getPreferredLocation());
        existing.setPropertyType(updated.getPropertyType());
        return customerRepository.save(existing);
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }
}
