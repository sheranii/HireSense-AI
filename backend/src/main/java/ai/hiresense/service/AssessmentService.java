package ai.hiresense.service;

import ai.hiresense.dto.AssessmentDto;
import ai.hiresense.entity.Assessment;
import ai.hiresense.entity.Candidate;
import ai.hiresense.exception.ResourceNotFoundException;
import ai.hiresense.repository.AssessmentRepository;
import ai.hiresense.repository.CandidateRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final CandidateRepository candidateRepository;

    public AssessmentService(AssessmentRepository assessmentRepository, CandidateRepository candidateRepository) {
        this.assessmentRepository = assessmentRepository;
        this.candidateRepository = candidateRepository;
    }

    public List<AssessmentDto> getAllAssessments() {
        return assessmentRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(AssessmentDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<AssessmentDto> getAssessmentsByCandidate(Long candidateId) {
        return assessmentRepository.findByCandidateId(candidateId)
                .stream()
                .map(AssessmentDto::fromEntity)
                .collect(Collectors.toList());
    }

    public AssessmentDto submitAssessment(Long candidateId, String jobTitle, String assessmentType, Integer score, String feedback) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElse(null);

        Assessment assessment = new Assessment(
                candidate,
                jobTitle != null ? jobTitle : "Open role",
                assessmentType != null ? assessmentType : "Written assessment",
                score != null ? score : 0,
                100,
                "COMPLETED",
                feedback != null ? feedback : "Submitted from the assessment form."
        );

        assessment = assessmentRepository.save(assessment);
        return AssessmentDto.fromEntity(assessment);
    }
}
