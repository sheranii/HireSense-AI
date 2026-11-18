package ai.hiresense.controller;

import ai.hiresense.dto.ApplicationDto;
import ai.hiresense.dto.CandidateDto;
import ai.hiresense.dto.StageUpdateRequest;
import ai.hiresense.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping
    public ResponseEntity<List<ApplicationDto>> getAllApplications(@RequestParam(required = false) String email) {
        if (email != null && !email.isBlank()) {
            return ResponseEntity.ok(applicationService.getApplicationsForEmail(email));
        }
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @PostMapping
    public ResponseEntity<ApplicationDto> submitApplication(@RequestParam Long jobId, @RequestBody CandidateDto candidate) {
        return ResponseEntity.ok(applicationService.submitApplication(jobId, candidate));
    }

    @PatchMapping("/{id}/stage")
    public ResponseEntity<ApplicationDto> updateStage(@PathVariable Long id, @RequestBody StageUpdateRequest request) {
        return ResponseEntity.ok(applicationService.updateStage(id, request.getStage(), request.getNotes()));
    }
}

