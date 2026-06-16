package com.estatesync.repository;

import com.estatesync.model.Visit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VisitRepository extends JpaRepository<Visit, Long> {
    List<Visit> findByLeadId(Long leadId);
    List<Visit> findByLeadAgentId(Long agentId);
}
