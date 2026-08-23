package com.sherani.hiresense.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationResponseDto {
    private Long id;
    private String applicantEmail;
    private String applicantName;
    private Long jobId;
    private String jobTitle;
    private String company;
    private String status;
    private String coverLetter;
    private LocalDateTime appliedAt;
}
