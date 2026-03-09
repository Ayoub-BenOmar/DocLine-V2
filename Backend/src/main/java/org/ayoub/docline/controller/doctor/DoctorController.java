package org.ayoub.docline.controller.doctor;

import lombok.RequiredArgsConstructor;
import org.ayoub.docline.model.dto.AppointmentResponseDto;
import org.ayoub.docline.model.dto.DoctorProfileDto;
import org.ayoub.docline.model.dto.MedicalReportDto;
import org.ayoub.docline.model.dto.UnavailabilityDto;
import org.ayoub.docline.model.entity.Doctor;
import org.ayoub.docline.model.entity.Unavailability;
import org.ayoub.docline.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @PostMapping("/unavailability")
    @PreAuthorize("hasAuthority('ROLE_DOCTOR')")
    public ResponseEntity<Unavailability> addUnavailability(@RequestBody UnavailabilityDto unavailabilityDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        
        return ResponseEntity.ok(doctorService.addUnavailability(unavailabilityDto, currentPrincipalName));
    }

    @GetMapping("/unavailability")
    @PreAuthorize("hasAuthority('ROLE_DOCTOR')")
    public ResponseEntity<List<Unavailability>> getMyUnavailabilities() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();

        return ResponseEntity.ok(doctorService.getMyUnavailabilities(currentPrincipalName));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasAuthority('ROLE_DOCTOR')")
    public ResponseEntity<Doctor> updateProfile(@RequestBody DoctorProfileDto profileDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();

        return ResponseEntity.ok(doctorService.updateProfile(profileDto, currentPrincipalName));
    }

    @GetMapping("/profile")
    @PreAuthorize("hasAuthority('ROLE_DOCTOR')")
    public ResponseEntity<DoctorProfileDto> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();

        return ResponseEntity.ok(doctorService.getProfile(currentPrincipalName));
    }

    @GetMapping("/appointments")
    @PreAuthorize("hasAuthority('ROLE_DOCTOR')")
    public ResponseEntity<List<AppointmentResponseDto>> getMyAppointments() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();

        return ResponseEntity.ok(doctorService.getMyAppointments(currentPrincipalName));
    }

    @PostMapping("/appointments/{id}/complete")
    @PreAuthorize("hasAuthority('ROLE_DOCTOR')")
    public ResponseEntity<String> completeAppointment(@PathVariable Integer id, @RequestBody MedicalReportDto reportDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();

        doctorService.completeAppointment(id, reportDto, currentPrincipalName);
        return ResponseEntity.ok("Appointment completed and medical report saved.");
    }
}
