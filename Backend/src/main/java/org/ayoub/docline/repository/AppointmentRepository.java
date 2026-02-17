package org.ayoub.docline.repository;

import org.ayoub.docline.model.entity.Appointment;
import org.ayoub.docline.model.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    List<Appointment> findByDoctorId(Integer doctorId);
    List<Appointment> findByPatientId(Integer patientId);
    List<Appointment> findByDoctorIdAndDateTimeBetween(Integer doctorId, LocalDateTime start, LocalDateTime end);
    List<Appointment> findByDoctorIdAndStatus(Integer doctorId, AppointmentStatus status);
}
