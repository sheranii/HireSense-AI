package ai.hiresense.service;

import ai.hiresense.dto.JobDto;
import ai.hiresense.entity.Job;
import ai.hiresense.exception.ResourceNotFoundException;
import ai.hiresense.repository.ApplicationRepository;
import ai.hiresense.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public JobService(JobRepository jobRepository, ApplicationRepository applicationRepository) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    public List<JobDto> getAllJobs() {
        return jobRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDtoWithApplicantCount)
                .collect(Collectors.toList());
    }

    public JobDto getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        return toDtoWithApplicantCount(job);
    }

    private JobDto toDtoWithApplicantCount(Job job) {
        JobDto dto = JobDto.fromEntity(job);
        int realCount = (int) applicationRepository.countByJobId(job.getId());
        dto.setApplicantCount(realCount);
        return dto;
    }

    public JobDto createJob(JobDto dto) {
        Job job = new Job(
                dto.getTitle(),
                dto.getDepartment(),
                dto.getLocation(),
                dto.getType() != null ? dto.getType() : "Full-time",
                dto.getStatus() != null ? dto.getStatus() : "OPEN",
                dto.getExperienceLevel(),
                dto.getSalaryRange(),
                dto.getDescription(),
                dto.getRequirements()
        );
        job = jobRepository.save(job);
        return JobDto.fromEntity(job);
    }

    public JobDto updateJob(Long id, JobDto dto) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        if (dto.getTitle() != null) job.setTitle(dto.getTitle());
        if (dto.getDepartment() != null) job.setDepartment(dto.getDepartment());
        if (dto.getLocation() != null) job.setLocation(dto.getLocation());
        if (dto.getType() != null) job.setType(dto.getType());
        if (dto.getStatus() != null) job.setStatus(dto.getStatus());
        if (dto.getExperienceLevel() != null) job.setExperienceLevel(dto.getExperienceLevel());
        if (dto.getSalaryRange() != null) job.setSalaryRange(dto.getSalaryRange());
        if (dto.getDescription() != null) job.setDescription(dto.getDescription());
        if (dto.getRequirements() != null) job.setRequirements(dto.getRequirements());

        job = jobRepository.save(job);
        return JobDto.fromEntity(job);
    }

    public void deleteJob(Long id) {
        if (!jobRepository.existsById(id)) {
            throw new ResourceNotFoundException("Job not found with id: " + id);
        }
        jobRepository.deleteById(id);
    }
}

