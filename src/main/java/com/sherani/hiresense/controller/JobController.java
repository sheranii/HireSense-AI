package com.sherani.hiresense.controller;

import com.sherani.hiresense.dto.JobRequestDto;
import com.sherani.hiresense.dto.JobResponseDto;
import com.sherani.hiresense.security.JwtService;
import com.sherani.hiresense.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;
    private final JwtService jwtService;

    public JobController(JobService jobService, JwtService jwtService) {
        this.jobService = jobService;
        this.jwtService = jwtService;
    }

    // POST /api/jobs — requires auth
    @PostMapping
    public ResponseEntity<JobResponseDto> createJob(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody JobRequestDto request) {

        String token = authHeader.substring(7); // Strip "Bearer "
        String email = jwtService.extractEmail(token);
        JobResponseDto response = jobService.createJob(request, email);
        return ResponseEntity.ok(response);
    }

    // GET /api/jobs — public
    @GetMapping
    public ResponseEntity<List<JobResponseDto>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    // GET /api/jobs/search?keyword=... — public
    @GetMapping("/search")
    public ResponseEntity<List<JobResponseDto>> searchJobs(@RequestParam String keyword) {
        return ResponseEntity.ok(jobService.searchJobs(keyword));
    }

    // GET /api/jobs/{id} — public
    @GetMapping("/{id}")
    public ResponseEntity<JobResponseDto> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }
}
