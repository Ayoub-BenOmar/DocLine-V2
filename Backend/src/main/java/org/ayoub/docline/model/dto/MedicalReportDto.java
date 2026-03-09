package org.ayoub.docline.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MedicalReportDto {
    private String bloodType;
    private String pastIllnesses;
    private String surgeries;
    private String allergies;
    private String chronic;
    private String doctorNote;
}

