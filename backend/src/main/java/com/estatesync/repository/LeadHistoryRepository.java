package com.estatesync.repository;

import com.estatesync.model.LeadHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LeadHistoryRepository extends JpaRepository<LeadHistory, Long> {
    List<LeadHistory> findByLeadId(Long leadId);
}
