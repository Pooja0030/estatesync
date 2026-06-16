package com.estatesync.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "lead_history")
public class LeadHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", nullable = false)
    private Lead lead;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prev_agent_id")
    private User prevAgent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "new_agent_id")
    private User newAgent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by")
    private User changedBy;

    @Column(name = "changed_at", insertable = false, updatable = false)
    private LocalDateTime changedAt;
}
