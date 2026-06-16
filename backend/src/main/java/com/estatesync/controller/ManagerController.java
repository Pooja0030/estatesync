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

    public ManagerController(LeadService leadService, com.estatesync.repository.UserRepository userRepository, com.estatesync.repository.LeadRepository leadRepository) {
        this.leadService = leadService;
        this.userRepository = userRepository;
        this.leadRepository = leadRepository;
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
}
