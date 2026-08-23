package com.sherani.hiresense.service;

import com.sherani.hiresense.dto.JobRequestDto;
import com.sherani.hiresense.dto.JobResponseDto;
import com.sherani.hiresense.entity.Job;
import com.sherani.hiresense.entity.User;
import com.sherani.hiresense.repository.JobRepository;
import com.sherani.hiresense.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobService(JobRepository jobRepository, UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    public JobResponseDto createJob(JobRequestDto request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .jobType(request.getJobType())
                .salary(request.getSalary())
                .company(request.getCompany())
                .postedBy(user)
                .build();

        Job savedJob = jobRepository.save(job);
        return mapToResponse(savedJob);
    }

    public List<JobResponseDto> getAllJobs() {
        return jobRepository.findByActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<JobResponseDto> searchJobs(String keyword) {
        return jobRepository.findByTitleContainingIgnoreCaseAndActiveTrue(keyword)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public JobResponseDto getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
        return mapToResponse(job);
    }

    public JobResponseDto updateJob(Long id, JobRequestDto request, String email) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
        if (job.getPostedBy() == null || !job.getPostedBy().getEmail().equals(email)) {
            throw new RuntimeException("Not authorized to update this job");
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setSalary(request.getSalary());
        job.setCompany(request.getCompany());

        Job updatedJob = jobRepository.save(job);
        return mapToResponse(updatedJob);
    }

    public void deleteJob(Long id, String email) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
        if (job.getPostedBy() == null || !job.getPostedBy().getEmail().equals(email)) {
            throw new RuntimeException("Not authorized to delete this job");
        }
        job.setActive(false);
        jobRepository.save(job);
    }

    private JobResponseDto mapToResponse(Job job) {
        return JobResponseDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation())
                .jobType(job.getJobType())
                .salary(job.getSalary())
                .company(job.getCompany())
                .postedByEmail(job.getPostedBy() != null ? job.getPostedBy().getEmail() : null)
                .createdAt(job.getCreatedAt())
                .active(job.isActive())
                .build();
    }
}
