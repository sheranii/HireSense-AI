package ai.hiresense.dto;

import ai.hiresense.entity.Application;
import java.time.LocalDateTime;

public class ApplicationDto {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String department;
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private String stage;
    private Integer matchScore;
    private String notes;
    private LocalDateTime appliedAt;

    public ApplicationDto() {}

    public static ApplicationDto fromEntity(Application app) {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(app.getId());
        if (app.getJob() != null) {
            dto.setJobId(app.getJob().getId());
            dto.setJobTitle(app.getJob().getTitle());
            dto.setDepartment(app.getJob().getDepartment());
        }
        if (app.getCandidate() != null) {
            dto.setCandidateId(app.getCandidate().getId());
            dto.setCandidateName(app.getCandidate().getFullName());
            dto.setCandidateEmail(app.getCandidate().getEmail());
        }
        dto.setStage(app.getStage());
        dto.setMatchScore(app.getMatchScore());
        dto.setNotes(app.getNotes());
        dto.setAppliedAt(app.getAppliedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Long getCandidateId() { return candidateId; }
    public void setCandidateId(Long candidateId) { this.candidateId = candidateId; }

    public String getCandidateName() { return candidateName; }
    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }

    public String getCandidateEmail() { return candidateEmail; }
    public void setCandidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public Integer getMatchScore() { return matchScore; }
    public void setMatchScore(Integer matchScore) { this.matchScore = matchScore; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
}

