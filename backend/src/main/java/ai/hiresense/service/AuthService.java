package ai.hiresense.service;

import ai.hiresense.dto.AuthResponse;
import ai.hiresense.dto.LoginRequest;
import ai.hiresense.dto.RegisterRequest;
import ai.hiresense.dto.UserDto;
import ai.hiresense.entity.Role;
import ai.hiresense.entity.User;
import ai.hiresense.exception.BadRequestException;
import ai.hiresense.repository.UserRepository;
import ai.hiresense.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        return new AuthResponse(jwt, UserDto.fromEntity(user));
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email is already registered.");
        }

        Role role = Role.ROLE_RECRUITER;
        if (registerRequest.getRole() != null) {
            String r = registerRequest.getRole().toUpperCase().trim();
            if (r.contains("ADMIN")) {
                role = Role.ROLE_ADMIN;
            } else if (r.contains("CANDIDATE")) {
                role = Role.ROLE_CANDIDATE;
            }
        }

        User user = new User(
                registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getPassword()),
                registerRequest.getFullName(),
                role,
                registerRequest.getTitle() != null ? registerRequest.getTitle() : "Recruiter",
                registerRequest.getDepartment() != null ? registerRequest.getDepartment() : "Talent Acquisition"
        );

        user = userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerRequest.getEmail(),
                        registerRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return new AuthResponse(jwt, UserDto.fromEntity(user));
    }

    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));
        return UserDto.fromEntity(user);
    }

    public UserDto updateCurrentUser(String email, UserDto updates) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));
        if (updates.getFullName() != null && !updates.getFullName().isBlank()) {
            user.setFullName(updates.getFullName().trim());
        }
        if (updates.getTitle() != null) user.setTitle(updates.getTitle());
        if (updates.getDepartment() != null) user.setDepartment(updates.getDepartment());
        user = userRepository.save(user);
        return UserDto.fromEntity(user);
    }

    public List<UserDto> listUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }
}

