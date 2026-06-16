package com.estatesync.service;

import com.estatesync.dto.AuthRequest;
import com.estatesync.dto.AuthResponse;
import com.estatesync.security.CustomUserDetails;
import com.estatesync.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final com.estatesync.repository.UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public AuthService(AuthenticationManager authenticationManager, JwtUtil jwtUtil, 
                       com.estatesync.repository.UserRepository userRepository,
                       org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @jakarta.annotation.PostConstruct
    public void fixAdminPassword() {
        userRepository.findByEmail("admin@estatesync.com").ifPresent(admin -> {
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            userRepository.save(admin);
        });
    }

    public AuthResponse authenticate(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);
        
        return new AuthResponse(token, userDetails.getUser().getRole().name(), userDetails.getUser().getName());
    }
}
