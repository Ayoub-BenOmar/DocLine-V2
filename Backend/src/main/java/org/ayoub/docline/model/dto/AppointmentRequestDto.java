package org.ayoub.docline.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentRequestDto {
    private Integer doctorId;
    private LocalDateTime dateTime;
    private String reason;
}
