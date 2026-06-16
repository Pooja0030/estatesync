package com.estatesync.repository;

import com.estatesync.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import com.estatesync.model.Role;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findFirstByRoleAndRegionIdAndIsActiveTrueOrderByIdAsc(Role role, Long regionId);
}
