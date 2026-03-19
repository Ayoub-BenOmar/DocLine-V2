package org.ayoub.docline.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SpecialtyStatisticDto {
    private String specialiteName;
    private Integer doctorCount;
}

