package com.sherani.hiresense.controller;

import com.sherani.hiresense.dto.ApplicationRequestDto;
import com.sherani.hiresense.dto.ApplicationResponseDto;
import com.sherani.hiresense.security.JwtService;
import com.sherani.hiresense.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final JwtService jwtService;

    public ApplicationController(ApplicationService applicationService, JwtService jwtService) {
        this.applicationService = applicationService;
        this.jwtService = jwtService;
    }

    private String extractEmail(String authHeader) {
        return jwtService.extractEmail(authHeader.substring(7));
    }

    @PostMapping("/apply/{jobId}")
    public ResponseEntity<ApplicationResponseDto> applyToJob(
            @PathVariable Long jobId,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody(required = false) ApplicationRequestDto request) {
        String email = extractEmail(authHeader);
        return ResponseEntity.ok(applicationService.applyToJob(jobId, email, request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ApplicationResponseDto>> getMyApplications(
            @RequestHeader("Authorization") String authHeader) {
        String email = extractEmail(authHeader);
        return ResponseEntity.ok(applicationService.getMyApplications(email));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationResponseDto>> getJobApplications(
            @PathVariable Long jobId,
            @RequestHeader("Authorization") String authHeader) {
        String email = extractEmail(authHeader);
        return ResponseEntity.ok(applicationService.getJobApplications(jobId, email));
    }
}
