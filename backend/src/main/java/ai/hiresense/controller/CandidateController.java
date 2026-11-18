package ai.hiresense.controller;

import ai.hiresense.dto.CandidateDto;
import ai.hiresense.service.AiScreeningService;
import ai.hiresense.service.CandidateService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    private final CandidateService candidateService;
    private final AiScreeningService aiScreeningService;

    public CandidateController(CandidateService candidateService, AiScreeningService aiScreeningService) {
        this.candidateService = candidateService;
        this.aiScreeningService = aiScreeningService;
    }

    @GetMapping
    public ResponseEntity<List<CandidateDto>> getAllCandidates() {
        return ResponseEntity.ok(candidateService.getAllCandidates());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CandidateDto> getCandidateById(@PathVariable Long id) {
        return ResponseEntity.ok(candidateService.getCandidateById(id));
    }

    @GetMapping("/lookup")
    public ResponseEntity<CandidateDto> getByEmail(@RequestParam String email) {
        return ResponseEntity.ok(candidateService.getByEmail(email));
    }

    @PostMapping
    public ResponseEntity<CandidateDto> createCandidate(@RequestBody CandidateDto candidateDto) {
        return ResponseEntity.ok(candidateService.createCandidate(candidateDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CandidateDto> updateCandidate(@PathVariable Long id, @RequestBody CandidateDto candidateDto) {
        return ResponseEntity.ok(candidateService.updateCandidate(id, candidateDto));
    }

    @PostMapping("/screen-resume")
    public ResponseEntity<CandidateDto> screenResume(@RequestParam(defaultValue = "1") Long jobId,
                                                    @RequestBody CandidateDto candidateDto) {
        return ResponseEntity.ok(aiScreeningService.screenAndRegister(jobId, candidateDto));
    }

    @PostMapping(value = "/extract-resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CandidateDto> extractResume(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(aiScreeningService.previewResume(file));
    }

    @PostMapping(value = "/screen-resume/file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CandidateDto> screenResumeFile(@RequestParam Long jobId,
                                                        @RequestParam("file") MultipartFile file,
                                                        @RequestParam(required = false) String fullName,
                                                        @RequestParam(required = false) String email,
                                                        @RequestParam(required = false) String phone,
                                                        @RequestParam(required = false) String currentTitle,
                                                        @RequestParam(required = false) String location,
                                                        @RequestParam(required = false) Integer experienceYears,
                                                        @RequestParam(required = false) String skills,
                                                        @RequestParam(required = false) String education,
                                                        @RequestParam(required = false) String summary) {
        CandidateDto supplied = new CandidateDto();
        supplied.setFullName(fullName);
        supplied.setEmail(email);
        supplied.setPhone(phone);
        supplied.setCurrentTitle(currentTitle);
        supplied.setLocation(location);
        supplied.setExperienceYears(experienceYears);
        supplied.setSkills(skills);
        supplied.setEducation(education);
        supplied.setSummary(summary);
        return ResponseEntity.ok(aiScreeningService.screenUploadedResume(jobId, file, supplied));
    }

    @PatchMapping("/{id}/stage")
    public ResponseEntity<CandidateDto> updateStage(@PathVariable Long id, @RequestParam String stage) {
        return ResponseEntity.ok(candidateService.updateStage(id, stage));
    }
}
