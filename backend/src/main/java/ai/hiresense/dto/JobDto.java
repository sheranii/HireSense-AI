package ai.hiresense.dto;

import ai.hiresense.entity.Job;
import java.time.LocalDateTime;

public class JobDto {
    private Long id;
    private String title;
    private String department;
    private String location;
    private String type;
    private String status;
    private String experienceLevel;
    private String salaryRange;
    private String description;
    private String requirements;
    private Integer applicantCount;
    private LocalDateTime createdAt;

    public JobDto() {}

    public static JobDto fromEntity(Job job) {
        JobDto dto = new JobDto();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDepartment(job.getDepartment());
        dto.setLocation(job.getLocation());
        dto.setType(job.getType());
        dto.setStatus(job.getStatus());
        dto.setExperienceLevel(job.getExperienceLevel());
        dto.setSalaryRange(job.getSalaryRange());
        dto.setDescription(job.getDescription());
        dto.setRequirements(job.getRequirements());
        dto.setApplicantCount(job.getApplicantCount());
        dto.setCreatedAt(job.getCreatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }

    public String getSalaryRange() { return salaryRange; }
    public void setSalaryRange(String salaryRange) { this.salaryRange = salaryRange; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRequirements() { return requirements; }
    public void setRequirements(String requirements) { this.requirements = requirements; }

    public Integer getApplicantCount() { return applicantCount; }
    public void setApplicantCount(Integer applicantCount) { this.applicantCount = applicantCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

