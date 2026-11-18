package ai.hiresense.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessments")
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @Column(nullable = false)
    private String jobTitle;

    @Column(nullable = false)
    private String assessmentType; // Technical, System Design, Behavioral, Cognitive

    private Integer score;
    private Integer maxScore = 100;

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, IN_PROGRESS, COMPLETED

    @Column(length = 2000)
    private String feedback;

    private LocalDateTime completedAt;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Assessment() {}

    public Assessment(Candidate candidate, String jobTitle, String assessmentType, Integer score, Integer maxScore, String status, String feedback) {
        this.candidate = candidate;
        this.jobTitle = jobTitle;
        this.assessmentType = assessmentType;
        this.score = score;
        this.maxScore = maxScore;
        this.status = status;
        this.feedback = feedback;
        this.createdAt = LocalDateTime.now();
        if ("COMPLETED".equalsIgnoreCase(status)) {
            this.completedAt = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Candidate getCandidate() { return candidate; }
    public void setCandidate(Candidate candidate) { this.candidate = candidate; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

