
package ai.hiresense.service;

import ai.hiresense.dto.ApplicationDto;
import ai.hiresense.dto.CandidateDto;
import ai.hiresense.entity.Application;
import ai.hiresense.entity.Candidate;
import ai.hiresense.entity.Job;
import ai.hiresense.exception.BadRequestException;
import ai.hiresense.exception.ResourceNotFoundException;
import ai.hiresense.security.CurrentUser;
import ai.hiresense.repository.ApplicationRepository;
import ai.hiresense.repository.CandidateRepository;
import ai.hiresense.repository.JobRepository;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final CandidateRepository candidateRepository;
    private final AiScreeningService aiScreeningService;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            JobRepository jobRepository,
            CandidateRepository candidateRepository,
            AiScreeningService aiScreeningService) {

        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.candidateRepository = candidateRepository;
        this.aiScreeningService = aiScreeningService;
    }

    // Get applications belonging to a candidate
    @Transactional(readOnly = true)
    public List<ApplicationDto> getApplicationsForEmail(String email) {

        return applicationRepository
                .findByCandidate_EmailIgnoreCaseOrderByAppliedAtDesc(email)
                .stream()
                .map(ApplicationDto::fromEntity)
                .collect(Collectors.toList());
    }

    // Submit a new job application
    @Transactional
    public ApplicationDto submitApplication(Long jobId, CandidateDto input) {

        if (input == null
                || input.getFullName() == null
                || input.getFullName().isBlank()
                || input.getEmail() == null
                || input.getEmail().isBlank()) {

            throw new BadRequestException("Name and email are required to apply.");
        }

        String email = input.getEmail().trim().toLowerCase();
        String fullName = input.getFullName().trim();

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Job not found with id: " + jobId));

        if (job.getStatus() != null
                && !"OPEN".equalsIgnoreCase(job.getStatus())) {

            throw new BadRequestException(
                    "This role is not accepting applications.");
        }

        // Candidate ownership validation
        if (CurrentUser.isCandidate()) {

            String actor = CurrentUser.email();

            if (actor == null || !actor.equalsIgnoreCase(email)) {
                throw new AccessDeniedException(
                        "Apply with the email on your own account.");
            }
        }

        // Find existing candidate
        Candidate candidate = candidateRepository.findByEmail(email).orElse(null);

        // Prevent duplicate application before modifying candidate data
        if (candidate != null
                && applicationRepository.existsByJobIdAndCandidateId(
                        job.getId(), candidate.getId())) {

            throw new BadRequestException(
                    "An application for this role already exists.");
        }

        // Evaluate resume/profile against job requirements
        AiScreeningService.ScreeningResult result =
                aiScreeningService.evaluateMatch(
                        input.getSkills(),
                        input.getExperienceYears(),
                        input.getSummary(),
                        job
                );

        if (candidate == null) {

            candidate = new Candidate(
                    fullName,
                    email,
                    input.getPhone(),
                    input.getCurrentTitle(),
                    input.getLocation(),
                    input.getExperienceYears(),
                    input.getSkills(),
                    input.getSummary(),
                    result.score,
                    result.recommendation,
                    result.strengths,
                    result.concerns,
                    "APPLIED"
            );

        } else {

            candidate.setFullName(fullName);

            if (input.getPhone() != null)
                candidate.setPhone(input.getPhone());

            if (input.getCurrentTitle() != null)
                candidate.setCurrentTitle(input.getCurrentTitle());

            if (input.getLocation() != null)
                candidate.setLocation(input.getLocation());

            if (input.getExperienceYears() != null)
                candidate.setExperienceYears(input.getExperienceYears());

            if (input.getSkills() != null)
                candidate.setSkills(input.getSkills());

            if (input.getSummary() != null)
                candidate.setSummary(input.getSummary());

            candidate.setAiMatchScore(result.score);
            candidate.setAiRecommendation(result.recommendation);
            candidate.setMatchStrengths(result.strengths);
            candidate.setMatchConcerns(result.concerns);

            if (candidate.getCurrentStage() == null)
                candidate.setCurrentStage("APPLIED");
        }

        if (input.getEducation() != null)
            candidate.setEducation(input.getEducation());

        if (input.getResumeUrl() != null)
            candidate.setResumeUrl(input.getResumeUrl());

        candidate = candidateRepository.save(candidate);

        // Create application record
        Application application = new Application(
                job,
                candidate,
                "APPLIED",
                result.score,
                history(null, "Application submitted.")
        );

        application = applicationRepository.save(application);

        // Update applicant count
        int currentCount = job.getApplicantCount() != null
                ? job.getApplicantCount()
                : 0;

        job.setApplicantCount(currentCount + 1);
        jobRepository.save(job);

        return ApplicationDto.fromEntity(application);
    }

    @Transactional(readOnly = true)
    public List<ApplicationDto> visibleApplications(String requestedEmail) {

        if (CurrentUser.isCandidate()) {

            String actor = CurrentUser.email();

            if (actor == null) {
                throw new AccessDeniedException(
                        "Sign in to view applications.");
            }

            return getApplicationsForEmail(actor);
        }

        if (requestedEmail != null && !requestedEmail.isBlank()) {
            return getApplicationsForEmail(requestedEmail.trim());
        }

        return getAllApplications();
    }

    // Get all applications for recruiter/admin
    @Transactional(readOnly = true)
    public List<ApplicationDto> getAllApplications() {

        return applicationRepository.findAllByOrderByAppliedAtDesc()
                .stream()
                .map(ApplicationDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationDto withdraw(Long id) {

        if (!CurrentUser.isCandidate()) {
            throw new AccessDeniedException(
                    "Only the candidate who applied can withdraw an application.");
        }

        Application app = applicationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id: " + id));

        String actor = CurrentUser.email();

        if (app.getCandidate() == null
                || actor == null
                || !actor.equalsIgnoreCase(
                        app.getCandidate().getEmail())) {

            throw new AccessDeniedException(
                    "You can withdraw only your own application.");
        }

        if ("WITHDRAWN".equalsIgnoreCase(app.getStage())) {
            throw new BadRequestException(
                    "This application is already withdrawn.");
        }

        app.setStage("WITHDRAWN");

        app.setNotes(
                history(app.getNotes(),
                        "Candidate withdrew the application.")
        );

        app.setUpdatedBy(actor);

        app = applicationRepository.save(app);

        return ApplicationDto.fromEntity(app);
    }

    @Transactional
    public ApplicationDto updateStage(
            Long id,
            String stage,
            String notes) {

        if (CurrentUser.isCandidate()) {
            throw new AccessDeniedException(
                    "Candidates cannot move an application through the hiring pipeline.");
        }

        if (stage == null || stage.isBlank()) {
            throw new BadRequestException(
                    "Application stage is required.");
        }

        Application app = applicationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id: " + id));

        String newStage = stage.trim();
        String previous = app.getStage();

        if ("WITHDRAWN".equalsIgnoreCase(previous)) {
            throw new BadRequestException(
                    "A withdrawn application cannot be moved through the pipeline.");
        }

        app.setStage(newStage);

        String detail = "Stage changed from "
                + previous + " to " + newStage + ".";

        if (notes != null
                && !notes.isBlank()
                && !notes.equals(app.getNotes())) {

            detail += " Note: " + notes.trim();
        }

        app.setNotes(history(app.getNotes(), detail));
        app.setUpdatedBy(CurrentUser.email());

        app = applicationRepository.save(app);

        if (app.getCandidate() != null
                && !"WITHDRAWN".equalsIgnoreCase(newStage)) {

            app.getCandidate().setCurrentStage(newStage);
            candidateRepository.save(app.getCandidate());
        }

        return ApplicationDto.fromEntity(app);
    }

    private String history(String existing, String event) {

        String line = LocalDateTime.now().format(
                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")
        ) + " — " + event;

        String next = (existing == null || existing.isBlank())
                ? line
                : existing + "\n" + line;

        if (next.length() <= 2000) {
            return next;
        }

        return next.substring(next.length() - 2000);
    }
}
