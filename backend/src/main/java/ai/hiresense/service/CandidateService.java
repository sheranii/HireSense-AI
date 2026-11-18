package ai.hiresense.service;

import ai.hiresense.dto.CandidateDto;
import ai.hiresense.entity.Candidate;
import ai.hiresense.exception.ResourceNotFoundException;
import ai.hiresense.repository.CandidateRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CandidateService {

    private final CandidateRepository candidateRepository;

    public CandidateService(CandidateRepository candidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    public List<CandidateDto> getAllCandidates() {
        return candidateRepository.findAllByOrderByAiMatchScoreDesc()
                .stream()
                .map(CandidateDto::fromEntity)
                .collect(Collectors.toList());
    }

    public CandidateDto getCandidateById(Long id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with id: " + id));
        return CandidateDto.fromEntity(candidate);
    }

    public CandidateDto createCandidate(CandidateDto dto) {
        Candidate candidate = new Candidate(
                dto.getFullName(),
                dto.getEmail(),
                dto.getPhone(),
                dto.getCurrentTitle(),
                dto.getLocation(),
                dto.getExperienceYears(),
                dto.getSkills(),
                dto.getSummary(),
                dto.getAiMatchScore(),
                dto.getAiRecommendation(),
                dto.getMatchStrengths(),
                dto.getMatchConcerns(),
                dto.getCurrentStage() != null ? dto.getCurrentStage() : "APPLIED"
        );
        candidate.setEducation(dto.getEducation());
        candidate.setResumeUrl(dto.getResumeUrl());
        candidate = candidateRepository.save(candidate);
        return CandidateDto.fromEntity(candidate);
    }

    public CandidateDto updateCandidate(Long id, CandidateDto dto) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with id: " + id));
        if (dto.getFullName() != null) candidate.setFullName(dto.getFullName());
        if (dto.getPhone() != null) candidate.setPhone(dto.getPhone());
        if (dto.getCurrentTitle() != null) candidate.setCurrentTitle(dto.getCurrentTitle());
        if (dto.getLocation() != null) candidate.setLocation(dto.getLocation());
        if (dto.getExperienceYears() != null) candidate.setExperienceYears(dto.getExperienceYears());
        if (dto.getSkills() != null) candidate.setSkills(dto.getSkills());
        if (dto.getSummary() != null) candidate.setSummary(dto.getSummary());
        if (dto.getEducation() != null) candidate.setEducation(dto.getEducation());
        if (dto.getResumeUrl() != null) candidate.setResumeUrl(dto.getResumeUrl());
        candidate = candidateRepository.save(candidate);
        return CandidateDto.fromEntity(candidate);
    }

    public CandidateDto getByEmail(String email) {
        Candidate candidate = candidateRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No candidate profile for this account yet."));
        return CandidateDto.fromEntity(candidate);
    }

    public CandidateDto updateStage(Long id, String stage) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with id: " + id));
        candidate.setCurrentStage(stage);
        candidate = candidateRepository.save(candidate);
        return CandidateDto.fromEntity(candidate);
    }
}

