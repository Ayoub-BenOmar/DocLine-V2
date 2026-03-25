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
public class PatientProfileDto {
    private Integer id;
    private String name;
    private String lastName;
    private String email;
    private String phone;
    private String profilePic;
    private LocalDate birthdate;
    private String gender; // Using String to simplify frontend handling, or could be Enum
    private String bloodType;
    private String cin;
    private String address;
    private String city;
    private String insuranceProvider;
    private String insuranceNumber;
    private Boolean hasInsurance;
    private String status;
    // Medical history
    private String pastIllnesses;
    private String surgeries;
    private String allergies;
    private String chronic;
}
