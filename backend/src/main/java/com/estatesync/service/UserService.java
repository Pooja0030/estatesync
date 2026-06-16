package com.estatesync.service;

import com.estatesync.model.User;
import com.estatesync.model.LeadStatus;
import com.estatesync.repository.UserRepository;
import com.estatesync.repository.LeadRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final LeadRepository leadRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, LeadRepository leadRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.leadRepository = leadRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User createUser(User user) {
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long id, User updatedUser) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());
        user.setRole(updatedUser.getRole());
        user.setRegion(updatedUser.getRegion());
        return userRepository.save(user);
    }

    @Transactional
    public void deactivateAgent(Long agentId) {
        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (leadRepository.existsByAgentIdAndStatusNot(agentId, LeadStatus.CLOSED)) {
            throw new IllegalStateException("Cannot deactivate agent with active leads.");
        }

        agent.setIsActive(false);
        userRepository.save(agent);
    }
}
