package org.ayoub.docline.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "unavailability")
public class Unavailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Doctor doctor;

    private LocalDate startDate;
    private LocalDate endDate;

    private String reason; // e.g., "Holiday", "Sick"
}
