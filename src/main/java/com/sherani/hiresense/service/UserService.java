package com.sherani.hiresense.service;

import com.sherani.hiresense.dto.AuthResponseDto;
import com.sherani.hiresense.dto.RegisterRequestDto;
import com.sherani.hiresense.entity.User;
import com.sherani.hiresense.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponseDto registerUser(RegisterRequestDto request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return new AuthResponseDto("Email already registered", false);
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(encodedPassword)
                .role(request.getRole())
                .build();

        userRepository.save(user);

        return new AuthResponseDto("User registered successfully", true);
    }
}
