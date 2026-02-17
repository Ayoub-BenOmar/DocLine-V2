package org.ayoub.docline.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PatientProfileUpdateDto {
    private String name;
    private String lastName;
    private String phone;
    private LocalDate birthdate;
    private String gender;
    private String bloodType;
    private String cin;
    private String address;
    private Integer cityId; // To update city
    private String insuranceProvider;
    private String insuranceNumber;
    private Boolean hasInsurance;
    // Medical updates
    private String pastIllnesses;
    private String surgeries;
    private String allergies;
    private String chronic;
}
