package org.ayoub.docline.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DoctorProfileDto {
    private String name;
    private String lastName;
    private String email;
    private String phone;
    private String profilePic;
    private Integer cityId;
    private Integer specialityId;
    private java.math.BigDecimal fees;
    private Integer experience;
    private String bio;
    private String officeAddress;
}
