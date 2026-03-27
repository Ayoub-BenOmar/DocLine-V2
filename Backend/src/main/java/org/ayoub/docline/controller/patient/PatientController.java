package org.ayoub.docline.controller.patient;

import lombok.RequiredArgsConstructor;
import org.ayoub.docline.model.dto.*;

import org.ayoub.docline.model.entity.Unavailability;
import org.ayoub.docline.service.PatientService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorListingDto>> searchDoctors(@RequestParam(required = false) Integer cityId,@RequestParam(required = false) Integer specialityId,@RequestParam(required = false) String name) {
        return ResponseEntity.ok(patientService.searchDoctors(cityId, specialityId, name));
    }

    @GetMapping("/doctors/{id}")
    public ResponseEntity<DoctorListingDto> getDoctorById(@PathVariable Integer id) {
        return ResponseEntity.ok(patientService.getDoctorById(id));
    }

    @GetMapping("/doctors/{id}/unavailability")
    public ResponseEntity<List<Unavailability>> getDoctorUnavailability(@PathVariable Integer id) {
        return ResponseEntity.ok(patientService.getDoctorUnavailability(id));
    }

    @GetMapping("/doctors/{id}/slots")
    public ResponseEntity<?> getDoctorSlots(@PathVariable Integer id, @RequestParam String date) {
        try {
            return ResponseEntity.ok(patientService.getAvailableSlots(id, LocalDate.parse(date)));
        } catch (DateTimeParseException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid date format. Use YYYY-MM-DD");
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching slots: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @PostMapping("/appointments")
    @PreAuthorize("hasAuthority('ROLE_PATIENT')")
    public ResponseEntity<AppointmentResponseDto> bookAppointment(@RequestBody AppointmentRequestDto requestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();

        return ResponseEntity.ok(patientService.bookAppointment(requestDto, currentPrincipalName));
    }

    @GetMapping("/appointments")
    @PreAuthorize("hasAuthority('ROLE_PATIENT')")
    public ResponseEntity<List<AppointmentResponseDto>> getAppointments() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        return ResponseEntity.ok(patientService.getPatientAppointments(currentPrincipalName));
    }
    @GetMapping("/profile")
    @PreAuthorize("hasAuthority('ROLE_PATIENT')")
    public ResponseEntity<PatientProfileDto> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        return ResponseEntity.ok(patientService.getPatientProfile(currentPrincipalName));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasAuthority('ROLE_PATIENT')")
    public ResponseEntity<PatientProfileDto> updateProfile(@RequestBody PatientProfileUpdateDto updateDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        return ResponseEntity.ok(patientService.updatePatientProfile(currentPrincipalName, updateDto));
    }

    @PutMapping("/appointments/{id}/cancel")
    @PreAuthorize("hasAuthority('ROLE_PATIENT')")
    public ResponseEntity<String> cancelAppointment(@PathVariable Integer id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        patientService.cancelAppointment(id, currentPrincipalName);
        return ResponseEntity.ok("Appointment cancelled successfully");
    }

    @PutMapping("/appointments/{id}/reschedule")
    @PreAuthorize("hasAuthority('ROLE_PATIENT')")
    public ResponseEntity<AppointmentResponseDto> rescheduleAppointment(@PathVariable Integer id, @RequestBody AppointmentRequestDto rescheduleDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();

        return ResponseEntity.ok(patientService.rescheduleAppointment(id, rescheduleDto, currentPrincipalName));
    }
}
