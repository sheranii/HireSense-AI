package ai.hiresense.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidates")
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;
    private String currentTitle;
    private String location;
    private Integer experienceYears;

    @Column(length = 1000)
    private String skills; // Comma-separated list

    @Column(length = 2000)
    private String summary;

    @Column(length = 1500)
    private String education;

    private String resumeUrl;
    private Integer aiMatchScore; // 0 to 100
    private String aiRecommendation; // HIGH_MATCH, MODERATE_MATCH, LOW_MATCH

    @Column(length = 1500)
    private String matchStrengths;

    @Column(length = 1500)
    private String matchConcerns;

    private String currentStage = "APPLIED"; // APPLIED, SCREENING, TECHNICAL, INTERVIEW, OFFER, REJECTED
    private LocalDateTime createdAt = LocalDateTime.now();

    public Candidate() {}

    public Candidate(String fullName, String email, String phone, String currentTitle, String location, Integer experienceYears, String skills, String summary, Integer aiMatchScore, String aiRecommendation, String matchStrengths, String matchConcerns, String currentStage) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.currentTitle = currentTitle;
        this.location = location;
        this.experienceYears = experienceYears;
        this.skills = skills;
        this.summary = summary;
        this.aiMatchScore = aiMatchScore;
        this.aiRecommendation = aiRecommendation;
        this.matchStrengths = matchStrengths;
        this.matchConcerns = matchConcerns;
        this.currentStage = currentStage;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCurrentTitle() { return currentTitle; }
    public void setCurrentTitle(String currentTitle) { this.currentTitle = currentTitle; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public Integer getAiMatchScore() { return aiMatchScore; }
    public void setAiMatchScore(Integer aiMatchScore) { this.aiMatchScore = aiMatchScore; }

    public String getAiRecommendation() { return aiRecommendation; }
    public void setAiRecommendation(String aiRecommendation) { this.aiRecommendation = aiRecommendation; }

    public String getMatchStrengths() { return matchStrengths; }
    public void setMatchStrengths(String matchStrengths) { this.matchStrengths = matchStrengths; }

    public String getMatchConcerns() { return matchConcerns; }
    public void setMatchConcerns(String matchConcerns) { this.matchConcerns = matchConcerns; }

    public String getCurrentStage() { return currentStage; }
    public void setCurrentStage(String currentStage) { this.currentStage = currentStage; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

