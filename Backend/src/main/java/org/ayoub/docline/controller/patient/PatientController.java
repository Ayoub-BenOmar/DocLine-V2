package org.ayoub.docline.controller.patient;

import lombok.RequiredArgsConstructor;
import org.ayoub.docline.model.dto.AppointmentRequestDto;
import org.ayoub.docline.model.dto.AppointmentResponseDto;
import org.ayoub.docline.model.dto.DoctorListingDto;
import org.ayoub.docline.model.dto.TimeSlotDto;
import org.ayoub.docline.model.entity.Appointment;
import org.ayoub.docline.service.PatientService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorListingDto>> searchDoctors(
            @RequestParam(required = false) Integer cityId,
            @RequestParam(required = false) Integer specialityId,
            @RequestParam(required = false) String name) {
        return ResponseEntity.ok(patientService.searchDoctors(cityId, specialityId, name));
    }

    @GetMapping("/doctors/{id}/slots")
    public ResponseEntity<List<TimeSlotDto>> getDoctorSlots(
            @PathVariable Integer id,
            @RequestParam String date) {
        return ResponseEntity.ok(patientService.getAvailableSlots(id, java.time.LocalDate.parse(date)));
    }

    @PostMapping("/appointments")
    @PreAuthorize("hasAuthority('ROLE_PATIENT')")
    public ResponseEntity<AppointmentResponseDto> bookAppointment(@RequestBody AppointmentRequestDto requestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();

        return ResponseEntity.ok(patientService.bookAppointment(requestDto, currentPrincipalName));
    }
    @GetMapping("/profile")
    @PreAuthorize("hasAuthority('ROLE_PATIENT')")
    public ResponseEntity<org.ayoub.docline.model.dto.PatientProfileDto> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        return ResponseEntity.ok(patientService.getPatientProfile(currentPrincipalName));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasAuthority('ROLE_PATIENT')")
    public ResponseEntity<org.ayoub.docline.model.dto.PatientProfileDto> updateProfile(@RequestBody org.ayoub.docline.model.dto.PatientProfileUpdateDto updateDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        return ResponseEntity.ok(patientService.updatePatientProfile(currentPrincipalName, updateDto));
    }
}
