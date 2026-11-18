package ai.hiresense.dto;

import ai.hiresense.entity.Assessment;
import java.time.LocalDateTime;

public class AssessmentDto {
    private Long id;
    private Long candidateId;
    private String candidateName;
    private String jobTitle;
    private String assessmentType;
    private Integer score;
    private Integer maxScore;
    private String status;
    private String feedback;
    private LocalDateTime completedAt;

    public AssessmentDto() {}

    public static AssessmentDto fromEntity(Assessment assessment) {
        AssessmentDto dto = new AssessmentDto();
        dto.setId(assessment.getId());
        if (assessment.getCandidate() != null) {
            dto.setCandidateId(assessment.getCandidate().getId());
            dto.setCandidateName(assessment.getCandidate().getFullName());
        }
        dto.setJobTitle(assessment.getJobTitle());
        dto.setAssessmentType(assessment.getAssessmentType());
        dto.setScore(assessment.getScore());
        dto.setMaxScore(assessment.getMaxScore());
        dto.setStatus(assessment.getStatus());
        dto.setFeedback(assessment.getFeedback());
        dto.setCompletedAt(assessment.getCompletedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCandidateId() { return candidateId; }
    public void setCandidateId(Long candidateId) { this.candidateId = candidateId; }

    public String getCandidateName() { return candidateName; }
    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getAssessmentType() { return assessmentType; }
    public void setAssessmentType(String assessmentType) { this.assessmentType = assessmentType; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Integer getMaxScore() { return maxScore; }
    public void setMaxScore(Integer maxScore) { this.maxScore = maxScore; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}

