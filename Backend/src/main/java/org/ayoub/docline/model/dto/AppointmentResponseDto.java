package org.ayoub.docline.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ayoub.docline.model.enums.AppointmentStatus;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentResponseDto {
    private Integer id;
    private LocalDateTime dateTime;
    private AppointmentStatus status;
    private String reason;
    
    // Doctor details (for patient view)
    private String doctorName;
    private String doctorSpeciality;
    
    // Patient details (for doctor view)
    private String patientName;
}
