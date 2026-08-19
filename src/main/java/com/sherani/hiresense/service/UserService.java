package com.sherani.hiresense.service;

import com.sherani.hiresense.dto.AuthResponseDto;
import com.sherani.hiresense.dto.LoginRequestDto;
import com.sherani.hiresense.dto.LoginResponseDto;
import com.sherani.hiresense.dto.RegisterRequestDto;
import com.sherani.hiresense.entity.User;
import com.sherani.hiresense.repository.UserRepository;
import com.sherani.hiresense.security.JwtService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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

    public LoginResponseDto loginUser(LoginRequestDto request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return new LoginResponseDto(null, null, "Invalid email or password", false);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new LoginResponseDto(null, null, "Invalid email or password", false);
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return new LoginResponseDto(token, user.getRole().name(), "Login successful", true);
    }
}
