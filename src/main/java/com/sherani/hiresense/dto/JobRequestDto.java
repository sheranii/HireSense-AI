package com.sherani.hiresense.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobRequestDto {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    private String location;

    private String jobType;

    private Double salary;

    @NotBlank
    private String company;
}
