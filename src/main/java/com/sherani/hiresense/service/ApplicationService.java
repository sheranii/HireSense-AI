package com.sherani.hiresense.service;

import com.sherani.hiresense.dto.ApplicationRequestDto;
import com.sherani.hiresense.dto.ApplicationResponseDto;
import com.sherani.hiresense.entity.Application;
import com.sherani.hiresense.entity.Job;
import com.sherani.hiresense.entity.User;
import com.sherani.hiresense.repository.ApplicationRepository;
import com.sherani.hiresense.repository.JobRepository;
import com.sherani.hiresense.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;

    public ApplicationService(ApplicationRepository applicationRepository, UserRepository userRepository, JobRepository jobRepository) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
    }

    public ApplicationResponseDto applyToJob(Long jobId, String email, ApplicationRequestDto request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (applicationRepository.existsByApplicantAndJob(user, job)) {
            throw new RuntimeException("Already applied to this job");
        }

        Application application = Application.builder()
                .applicant(user)
                .job(job)
                .status("PENDING")
                .coverLetter(request != null ? request.getCoverLetter() : null)
                .build();

        Application savedApplication = applicationRepository.save(application);
        return mapToResponse(savedApplication);
    }

    public List<ApplicationResponseDto> getMyApplications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return applicationRepository.findByApplicant(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ApplicationResponseDto> getJobApplications(Long jobId, String email) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return applicationRepository.findByJob(job).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ApplicationResponseDto mapToResponse(Application application) {
        return ApplicationResponseDto.builder()
                .id(application.getId())
                .applicantEmail(application.getApplicant().getEmail())
                .applicantName(application.getApplicant().getName()) // assuming User has getName()
                .jobId(application.getJob().getId())
                .jobTitle(application.getJob().getTitle())
                .company(application.getJob().getCompany())
                .status(application.getStatus())
                .coverLetter(application.getCoverLetter())
                .appliedAt(application.getAppliedAt())
                .build();
    }
}
