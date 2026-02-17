package org.ayoub.docline.service;

import org.ayoub.docline.model.dto.AppointmentRequestDto;
import org.ayoub.docline.model.dto.AppointmentResponseDto;
import org.ayoub.docline.model.dto.DoctorListingDto;
import org.ayoub.docline.model.dto.PatientProfileDto;
import org.ayoub.docline.model.dto.PatientProfileUpdateDto;
import org.ayoub.docline.model.dto.TimeSlotDto;
import java.time.LocalDate;
import java.util.List;

public interface PatientService {
    List<DoctorListingDto> getAllDoctors();
    List<DoctorListingDto> searchDoctors(Integer cityId, Integer specialityId, String name);
    List<TimeSlotDto> getAvailableSlots(Integer doctorId, LocalDate date);
    AppointmentResponseDto bookAppointment(AppointmentRequestDto requestDto, String patientEmail);
    
    // Profile Management
    PatientProfileDto getPatientProfile(String email);
    PatientProfileDto updatePatientProfile(String email, PatientProfileUpdateDto updateDto);
}
