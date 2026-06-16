package com.estatesync.repository;

import com.estatesync.model.Lead;
import com.estatesync.model.LeadStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface LeadRepository extends JpaRepository<Lead, Long> {
    List<Lead> findByCustomerIdAndRegionIdAndStatusNot(Long customerId, Long regionId, LeadStatus status);
    List<Lead> findByAgentId(Long agentId);
    List<Lead> findByRegionId(Long regionId);
    boolean existsByAgentIdAndStatusNot(Long agentId, LeadStatus status);
}
