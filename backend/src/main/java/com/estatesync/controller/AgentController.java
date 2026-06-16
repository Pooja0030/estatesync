package com.estatesync.controller;

import com.estatesync.model.Lead;
import com.estatesync.repository.LeadRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/agent")
@PreAuthorize("hasRole('AGENT')")
public class AgentController {

    private final LeadRepository leadRepository;

    public AgentController(LeadRepository leadRepository) {
        this.leadRepository = leadRepository;
    }

    @GetMapping("/leads")
    public ResponseEntity<?> getMyLeads(org.springframework.security.core.Authentication authentication) {
        com.estatesync.security.CustomUserDetails userDetails = (com.estatesync.security.CustomUserDetails) authentication.getPrincipal();
        Long agentId = userDetails.getUser().getId();
        
        List<Lead> leads = leadRepository.findByAgentId(agentId);
        return ResponseEntity.ok(leads);
    }

    @PutMapping("/leads/{id}/status")
    public ResponseEntity<?> updateLeadStatus(@PathVariable Long id, @RequestBody Map<String, String> payload, org.springframework.security.core.Authentication authentication) {
        com.estatesync.security.CustomUserDetails userDetails = (com.estatesync.security.CustomUserDetails) authentication.getPrincipal();
        Long agentId = userDetails.getUser().getId();

        Lead lead = leadRepository.findById(id).orElse(null);
        if (lead == null || lead.getAgent() == null || !lead.getAgent().getId().equals(agentId)) {
            return ResponseEntity.badRequest().body("Not authorized to update this lead");
        }

        try {
            com.estatesync.model.LeadStatus newStatus = com.estatesync.model.LeadStatus.valueOf(payload.get("status"));
            lead.setStatus(newStatus);
            leadRepository.save(lead);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status");
        }
    }
}
