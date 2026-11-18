package ai.hiresense.service;

import ai.hiresense.dto.CandidateDto;
import ai.hiresense.entity.Application;
import ai.hiresense.entity.Candidate;
import ai.hiresense.entity.Job;
import ai.hiresense.exception.BadRequestException;
import ai.hiresense.exception.ResourceNotFoundException;
import ai.hiresense.repository.ApplicationRepository;
import ai.hiresense.repository.CandidateRepository;
import ai.hiresense.repository.JobRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AiScreeningService {

    private final JobRepository jobRepository;
    private final CandidateRepository candidateRepository;
    private final ApplicationRepository applicationRepository;
    private final ResumeTextService resumeTextService;

    public AiScreeningService(JobRepository jobRepository,
                              CandidateRepository candidateRepository,
                              ApplicationRepository applicationRepository,
                              ResumeTextService resumeTextService) {
        this.jobRepository = jobRepository;
        this.candidateRepository = candidateRepository;
        this.applicationRepository = applicationRepository;
        this.resumeTextService = resumeTextService;
    }

    public CandidateDto previewResume(MultipartFile file) {
        return resumeTextService.readResume(file);
    }

    public CandidateDto screenUploadedResume(Long jobId, MultipartFile file, CandidateDto supplied) {
        String extracted = resumeTextService.extractPdfText(file);
        CandidateDto parsed = resumeTextService.parse(extracted, file.getOriginalFilename());
        String suppliedSummary = supplied == null ? null : supplied.getSummary();
        if (suppliedSummary != null && suppliedSummary.indexOf('\u0000') < 0 && resumeTextService.isReadable(suppliedSummary)) {
            parsed.setSummary(resumeTextService.sanitize(suppliedSummary));
        } else {
            parsed.setSummary(extracted);
        }
        if (supplied != null) {
            if (hasText(supplied.getFullName())) parsed.setFullName(resumeTextService.sanitize(supplied.getFullName()));
            if (hasText(supplied.getEmail())) parsed.setEmail(resumeTextService.sanitize(supplied.getEmail()));
            if (hasText(supplied.getPhone())) parsed.setPhone(resumeTextService.sanitize(supplied.getPhone()));
            if (hasText(supplied.getCurrentTitle()) && !resumeTextService.isHeading(supplied.getCurrentTitle())) {
                parsed.setCurrentTitle(resumeTextService.sanitize(supplied.getCurrentTitle()));
            }
            if (hasText(supplied.getLocation())) parsed.setLocation(resumeTextService.sanitize(supplied.getLocation()));
            if (supplied.getExperienceYears() != null) parsed.setExperienceYears(supplied.getExperienceYears());
            if (hasText(supplied.getSkills())) parsed.setSkills(resumeTextService.sanitize(supplied.getSkills()));
            if (hasText(supplied.getEducation())) parsed.setEducation(resumeTextService.sanitize(supplied.getEducation()));
        }
        return screenAndRegister(jobId, parsed);
    }

    public CandidateDto screenAndRegister(Long jobId, CandidateDto inputDto) {
        inputDto.setSummary(resumeTextService.requireReadable(inputDto.getSummary()));
        inputDto.setFullName(resumeTextService.sanitize(inputDto.getFullName()));
        inputDto.setEmail(resumeTextService.sanitize(inputDto.getEmail()));
        inputDto.setPhone(resumeTextService.sanitize(inputDto.getPhone()));
        inputDto.setCurrentTitle(resumeTextService.sanitize(inputDto.getCurrentTitle()));
        inputDto.setLocation(resumeTextService.sanitize(inputDto.getLocation()));
        inputDto.setSkills(clip(resumeTextService.sanitize(inputDto.getSkills()), 1000));
        inputDto.setEducation(clip(resumeTextService.sanitize(inputDto.getEducation()), 1500));
        inputDto.setResumeUrl(clip(resumeTextService.sanitize(inputDto.getResumeUrl()), 255));
        if (!hasText(inputDto.getFullName()) || !hasText(inputDto.getEmail())) {
            throw new BadRequestException("A name and email are required. They can be typed in, or present in the resume text.");
        }
        if (resumeTextService.isHeading(inputDto.getCurrentTitle())) {
            inputDto.setCurrentTitle(null);
        }
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job requisition not found with id: " + jobId));

        ScreeningResult result = evaluateMatch(inputDto, job);
        inputDto.setSummary(clip(inputDto.getSummary(), 2000));

        String stage = result.score >= 85 ? "SCREENING" : "APPLIED";
        Candidate candidate = candidateRepository.findByEmail(inputDto.getEmail()).orElse(null);
        if (candidate == null) {
            candidate = new Candidate(
                    inputDto.getFullName(),
                    inputDto.getEmail(),
                    inputDto.getPhone(),
                    inputDto.getCurrentTitle(),
                    inputDto.getLocation(),
                    inputDto.getExperienceYears(),
                    inputDto.getSkills(),
                    inputDto.getSummary(),
                    result.score,
                    result.recommendation,
                    result.strengths,
                    result.concerns,
                    stage
            );
        } else {
            if (inputDto.getFullName() != null) candidate.setFullName(inputDto.getFullName());
            if (inputDto.getPhone() != null) candidate.setPhone(inputDto.getPhone());
            if (inputDto.getCurrentTitle() != null) candidate.setCurrentTitle(inputDto.getCurrentTitle());
            if (inputDto.getLocation() != null) candidate.setLocation(inputDto.getLocation());
            if (inputDto.getExperienceYears() != null) candidate.setExperienceYears(inputDto.getExperienceYears());
            if (inputDto.getSkills() != null) candidate.setSkills(inputDto.getSkills());
            if (inputDto.getSummary() != null) candidate.setSummary(inputDto.getSummary());
            candidate.setAiMatchScore(result.score);
            candidate.setAiRecommendation(result.recommendation);
            candidate.setMatchStrengths(result.strengths);
            candidate.setMatchConcerns(result.concerns);
            candidate.setCurrentStage(stage);
        }
        if (inputDto.getEducation() != null) candidate.setEducation(inputDto.getEducation());
        if (inputDto.getResumeUrl() != null) candidate.setResumeUrl(inputDto.getResumeUrl());

        candidate = candidateRepository.save(candidate);

        if (!applicationRepository.existsByJobIdAndCandidateId(job.getId(), candidate.getId())) {
            applicationRepository.save(new Application(job, candidate, stage, result.score, result.strengths));
            job.setApplicantCount((job.getApplicantCount() != null ? job.getApplicantCount() : 0) + 1);
            jobRepository.save(job);
        } else {
            jobRepository.save(job);
        }

        return CandidateDto.fromEntity(candidate);
    }

    public ScreeningResult evaluateMatch(String candidateSkills, Integer experienceYears, String summary, Job job) {
        CandidateDto dto = new CandidateDto();
        dto.setSkills(candidateSkills);
        dto.setExperienceYears(experienceYears);
        dto.setSummary(summary);
        dto.setEducation(summary);
        return evaluateMatch(dto, job);
    }

    public ScreeningResult evaluateMatch(CandidateDto candidate, Job job) {
        List<String> candidateSkills = splitSkills(candidate.getSkills());
        List<String> requirements = requirementPhrases(job);
        Integer requiredYears = requiredYears(job);

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();
        List<String> versionNotes = new ArrayList<>();
        for (String requirement : requirements) {
            String note = skillMatchNote(requirement, candidateSkills);
            if (note == null) missing.add(requirement);
            else {
                matched.add(requirement);
                if (!note.isBlank()) versionNotes.add(note);
            }
        }
        int skillScore = requirements.isEmpty() ? 0 : (int) Math.round(matched.size() * 100.0 / requirements.size());

        int professionalYears = candidate.getExperienceYears() == null ? 0 : Math.max(0, candidate.getExperienceYears());
        ResumeTextService.ExperienceProfile experience = resumeTextService.experience(
                candidate.getSummary() == null ? "" : candidate.getSummary());
        boolean experienceRequired = requiredYears != null;
        int experienceScore = 0;
        if (experienceRequired) {
            experienceScore = requiredYears == 0 ? 100 : (int) Math.min(100, Math.round(professionalYears * 100.0 / requiredYears));
        }

        boolean educationRequired = educationRequired(job);
        int educationScore = educationRequired ? educationScore(candidate.getEducation(), job) : 0;

        double weighted = 0;
        double weight = 0;
        weighted += 0.70 * skillScore;
        weight += 0.70;
        if (experienceRequired) {
            weighted += 0.30 * experienceScore;
            weight += 0.30;
        }
        if (educationRequired) {
            weighted += 0.15 * educationScore;
            weight += 0.15;
        }
        if (experienceRequired && educationRequired) {
            weighted = 0.60 * skillScore + 0.25 * experienceScore + 0.15 * educationScore;
            weight = 1;
        }
        int finalScore = weight == 0 ? 0 : (int) Math.round(weighted / (experienceRequired && educationRequired ? 1 : weight));
        if (!experienceRequired && !educationRequired) finalScore = skillScore;
        finalScore = Math.max(0, Math.min(100, finalScore));

        String recommendation = finalScore >= 90 ? "HIGH_MATCH" : finalScore >= 75 ? "MODERATE_MATCH" : "LOW_MATCH";

        StringBuilder strengths = new StringBuilder();
        strengths.append("Skills match: ").append(matched.size()).append(" of ").append(requirements.size())
                .append(" (").append(skillScore).append("%).");
        strengths.append("\nMatched: ").append(matched.isEmpty() ? "none" : String.join(", ", matched)).append(".");
        if (!versionNotes.isEmpty()) strengths.append("\n").append(String.join(" ", versionNotes));
        if (experienceRequired) {
            strengths.append("\nExperience match: ").append(professionalYears).append(" of ").append(requiredYears)
                    .append(" years required (").append(experienceScore).append("%).");
        } else {
            strengths.append("\nExperience match: this role does not state a years requirement, so experience is not part of the score.");
        }
        strengths.append("\nProfessional employment: ").append(experience.roles.isEmpty() ? "none found" : String.join("; ", experience.roles)).append(".");
        strengths.append("\nInternships: ").append(experience.internships.isEmpty() ? "none found" : String.join("; ", experience.internships)).append(".");
        if (!experience.projects.isEmpty()) {
            strengths.append("\nProjects are listed separately and are not counted as employment.");
        }
        if (educationRequired) {
            strengths.append("\nEducation match: ").append(educationScore).append("%.");
        } else {
            strengths.append("\nEducation match: no degree requirement is written on this role, so education is not part of the score.");
        }
        strengths.append("\nCandidate education: ").append(hasText(candidate.getEducation()) ? candidate.getEducation() : "not found").append(".");
        strengths.append("\nScore = ");
        if (experienceRequired && educationRequired) {
            strengths.append("round(0.60 × skills + 0.25 × experience + 0.15 × education)");
        } else if (experienceRequired) {
            strengths.append("round(0.70 × skills + 0.30 × experience)");
        } else if (educationRequired) {
            strengths.append("round(0.70 × skills + 0.15 × education), then divided by 0.85 so the missing component is not treated as zero");
        } else {
            strengths.append("skills match only");
        }
        strengths.append(" = ").append(finalScore).append(".");
        strengths.append("\nA low experience score does not reject the candidate.");

        StringBuilder concerns = new StringBuilder();
        concerns.append("Missing requirements: ").append(missing.isEmpty() ? "none" : String.join(", ", missing)).append(".");
        if (experienceRequired && professionalYears < requiredYears) {
            concerns.append("\nProfessional experience is below the stated ").append(requiredYears).append(" years. ");
            if (professionalYears == 0) {
                concerns.append("Zero professional years is recorded as-is. Internships and projects are not converted into employment years.");
            }
        }
        concerns.append("\nThis comparison uses the skills, dates, and education read from the resume. It does not judge interview performance.");

        return new ScreeningResult(finalScore, recommendation, clip(strengths.toString(), 1500), clip(concerns.toString(), 1500));
    }

    private List<String> requirementPhrases(Job job) {
        String source = job.getRequirements() == null ? "" : job.getRequirements();
        List<String> phrases = new ArrayList<>();
        for (String part : source.split("[,;\\n•]")) {
            String phrase = part.replaceAll("^[\\d.+]+\\s*", "").replaceAll("[.]+$", "").trim();
            phrase = phrase.replaceAll("\\s+", " ");
            if (phrase.length() < 2) continue;
            if (phrase.matches("(?i)(and|or|with|the|a|an|of|in|to|for|experience|years?|strong|knowledge|ability|plus)")) continue;
            phrases.add(phrase);
        }
        return phrases;
    }

    private String skillMatchNote(String requirement, List<String> candidateSkills) {
        List<String> reqTokens = tokens(requirement);
        List<String> core = new ArrayList<>();
        List<String> versions = new ArrayList<>();
        for (String token : reqTokens) {
            if (token.matches("\\d+\\+?") || token.matches("v\\d+")) versions.add(token);
            else core.add(token);
        }
        if (core.isEmpty()) return null;
        for (String skill : candidateSkills) {
            List<String> skillTokens = tokens(skill);
            if (skillTokens.containsAll(core)) {
                if (versions.isEmpty() || skillTokens.containsAll(versions)) return "";
                return requirement + " is matched on " + String.join(" ", core) + "; the version " + String.join(" ", versions) + " is not stated.";
            }
        }
        return null;
    }

    private List<String> tokens(String phrase) {
        List<String> tokens = new ArrayList<>();
        for (String token : phrase.toLowerCase(Locale.ROOT).split("[^a-z0-9+#.]+")) {
            if (token.length() > 1 || token.matches("\\d+\\+?")) tokens.add(token);
        }
        return tokens;
    }

    private List<String> splitSkills(String skills) {
        List<String> list = new ArrayList<>();
        if (skills == null) return list;
        for (String part : skills.split("[,;|•]")) {
            String skill = part.trim();
            if (!skill.isEmpty()) list.add(skill);
        }
        return list;
    }

    private Integer requiredYears(Job job) {
        String source = ((job.getExperienceLevel() == null ? "" : job.getExperienceLevel()) + " " + (job.getRequirements() == null ? "" : job.getRequirements()));
        Matcher matcher = Pattern.compile("(\\d{1,2})\\s*\\+?\\s*years?", Pattern.CASE_INSENSITIVE).matcher(source);
        if (matcher.find()) return Integer.parseInt(matcher.group(1));
        if (source.matches("(?i).*(entry[- ]level|junior|graduate|fresher|intern)\\b.*")) return 0;
        return null;
    }

    private boolean educationRequired(Job job) {
        String source = ((job.getRequirements() == null ? "" : job.getRequirements()) + " " + (job.getExperienceLevel() == null ? "" : job.getExperienceLevel())).toLowerCase(Locale.ROOT);
        return source.matches(".*(bachelor|master|degree|b\\.?tech|b\\.?e\\.?|computer science|university).*");
    }

    private int educationScore(String education, Job job) {
        if (education == null || education.isBlank()) return 0;
        String req = ((job.getRequirements() == null ? "" : job.getRequirements()) + " " + (job.getExperienceLevel() == null ? "" : job.getExperienceLevel())).toLowerCase(Locale.ROOT);
        String have = education.toLowerCase(Locale.ROOT);
        int hits = 0;
        int checks = 0;
        for (String term : new String[]{"bachelor", "master", "degree", "computer science", "b.tech", "b.e", "university"}) {
            if (!req.contains(term)) continue;
            checks++;
            if (have.contains(term) || (term.equals("bachelor") && (have.contains("b.e") || have.contains("b.tech") || have.contains("bsc") || have.contains("bachelor")))
                    || (term.equals("computer science") && have.contains("computer science"))) {
                hits++;
            }
        }
        if (checks == 0) return 0;
        return (int) Math.round(hits * 100.0 / checks);
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private String clip(String value, int max) {
        if (value == null || value.length() <= max) return value;
        return value.substring(0, max);
    }

    public static class ScreeningResult {
        public final int score;
        public final String recommendation;
        public final String strengths;
        public final String concerns;

        public ScreeningResult(int score, String recommendation, String strengths, String concerns) {
            this.score = score;
            this.recommendation = recommendation;
            this.strengths = strengths;
            this.concerns = concerns;
        }
    }
}
