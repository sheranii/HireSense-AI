package com.sherani.hiresense.controller;

import com.sherani.hiresense.entity.User;
import com.sherani.hiresense.repository.UserRepository;
import com.sherani.hiresense.security.JwtService;
import com.sherani.hiresense.service.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public ResumeController(FileStorageService fileStorageService,
                            UserRepository userRepository,
                            JwtService jwtService) {
        this.fileStorageService = fileStorageService;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String authHeader) {

        String email = extractEmail(authHeader);
        String filePath = fileStorageService.storeFile(file, email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setResumePath(filePath);
        userRepository.save(user);

        return ResponseEntity.ok("Resume uploaded successfully");
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadResume(
            @RequestHeader("Authorization") String authHeader) {

        String email = extractEmail(authHeader);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getResumePath() == null || user.getResumePath().isBlank()) {
            throw new RuntimeException("No resume uploaded for this user");
        }

        Resource resource = fileStorageService.loadFile(user.getResumePath());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    private String extractEmail(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7);
        return jwtService.extractEmail(token);
    }
}
