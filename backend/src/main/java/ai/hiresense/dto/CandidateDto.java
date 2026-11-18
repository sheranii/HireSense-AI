package ai.hiresense.dto;

import ai.hiresense.entity.Candidate;
import java.time.LocalDateTime;

public class CandidateDto {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String currentTitle;
    private String location;
    private Integer experienceYears;
    private String skills;
    private String summary;
    private String education;
    private String resumeUrl;
    private Integer aiMatchScore;
    private String aiRecommendation;
    private String matchStrengths;
    private String matchConcerns;
    private String currentStage;
    private LocalDateTime createdAt;

    public CandidateDto() {}

    public static CandidateDto fromEntity(Candidate candidate) {
        CandidateDto dto = new CandidateDto();
        dto.setId(candidate.getId());
        dto.setFullName(candidate.getFullName());
        dto.setEmail(candidate.getEmail());
        dto.setPhone(candidate.getPhone());
        dto.setCurrentTitle(candidate.getCurrentTitle());
        dto.setLocation(candidate.getLocation());
        dto.setExperienceYears(candidate.getExperienceYears());
        dto.setSkills(candidate.getSkills());
        dto.setSummary(candidate.getSummary());
        dto.setEducation(candidate.getEducation());
        dto.setResumeUrl(candidate.getResumeUrl());
        dto.setAiMatchScore(candidate.getAiMatchScore());
        dto.setAiRecommendation(candidate.getAiRecommendation());
        dto.setMatchStrengths(candidate.getMatchStrengths());
        dto.setMatchConcerns(candidate.getMatchConcerns());
        dto.setCurrentStage(candidate.getCurrentStage());
        dto.setCreatedAt(candidate.getCreatedAt());
        return dto;
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

