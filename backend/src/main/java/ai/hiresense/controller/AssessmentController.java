package ai.hiresense.controller;

import ai.hiresense.dto.AssessmentDto;
import ai.hiresense.service.AssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @GetMapping
    public ResponseEntity<List<AssessmentDto>> getAllAssessments() {
        return ResponseEntity.ok(assessmentService.getAllAssessments());
    }

    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<AssessmentDto>> getAssessmentsByCandidate(@PathVariable Long candidateId) {
        return ResponseEntity.ok(assessmentService.getAssessmentsByCandidate(candidateId));
    }

    @PostMapping("/submit")
    public ResponseEntity<AssessmentDto> submitAssessment(@RequestBody AssessmentDto dto) {
        return ResponseEntity.ok(assessmentService.submitAssessment(
                dto.getCandidateId() != null ? dto.getCandidateId() : 1L,
                dto.getJobTitle(),
                dto.getAssessmentType(),
                dto.getScore(),
                dto.getFeedback()
        ));
    }
}
