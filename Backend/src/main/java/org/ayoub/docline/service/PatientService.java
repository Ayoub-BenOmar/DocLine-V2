package org.ayoub.docline.service;

import org.ayoub.docline.model.dto.AppointmentRequestDto;
import org.ayoub.docline.model.dto.AppointmentResponseDto;
import org.ayoub.docline.model.dto.DoctorListingDto;
import org.ayoub.docline.model.dto.PatientProfileDto;
import org.ayoub.docline.model.dto.PatientProfileUpdateDto;
import org.ayoub.docline.model.dto.TimeSlotDto;
import org.springframework.data.domain.Page;
import java.time.LocalDate;
import java.util.List;

public interface PatientService {
    List<DoctorListingDto> getAllDoctors();
    Page<DoctorListingDto> getAllDoctorsPaginated(Integer cityId, Integer specialityId, int page, int size);
    List<DoctorListingDto> searchDoctors(Integer cityId, Integer specialityId, String name);
    List<TimeSlotDto> getAvailableSlots(Integer doctorId, LocalDate date);

    DoctorListingDto getDoctorById(Integer doctorId);
    List<org.ayoub.docline.model.entity.Unavailability> getDoctorUnavailability(Integer doctorId);

    AppointmentResponseDto bookAppointment(AppointmentRequestDto requestDto, String patientEmail);
    List<AppointmentResponseDto> getPatientAppointments(String email);

    PatientProfileDto getPatientProfile(String email);
    PatientProfileDto updatePatientProfile(String email, PatientProfileUpdateDto updateDto);

    void cancelAppointment(Integer appointmentId, String patientEmail);
    AppointmentResponseDto rescheduleAppointment(Integer appointmentId, AppointmentRequestDto rescheduleDto, String patientEmail);
}
