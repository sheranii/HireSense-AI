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
public class JobResponseDto {

    private Long id;
    private String title;
    private String description;
    private String location;
    private String jobType;
    private Double salary;
    private String company;
    private String postedByEmail;
    private LocalDateTime createdAt;
    private boolean active;
}
