package org.ayoub.docline.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DoctorListingDto {
    private Integer id;
    private String name;
    private String lastName;
    private String profilePic;
    private String speciality;
    private String city;
    private BigDecimal fees;
}
