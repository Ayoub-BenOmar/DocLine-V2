package org.ayoub.docline.controller.admin;

import lombok.RequiredArgsConstructor;
import org.ayoub.docline.model.dto.DoctorListingDto;
import org.ayoub.docline.model.dto.PatientProfileDto;
import org.ayoub.docline.model.dto.CityDto;
import org.ayoub.docline.model.dto.SpecialtyDto;
import org.ayoub.docline.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/patients")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<PatientProfileDto>> getAllPatients() {
        return ResponseEntity.ok(adminService.getAllPatients());
    }

    @GetMapping("/doctors")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<DoctorListingDto>> getAllDoctors() {
        return ResponseEntity.ok(adminService.getAllDoctors());
    }

    @GetMapping("/doctors/pending")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<DoctorListingDto>> getPendingDoctors() {
        return ResponseEntity.ok(adminService.getPendingDoctors());
    }

    @PutMapping("/doctors/{doctorId}/approve")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> approveDoctor(@PathVariable Integer doctorId) {
        adminService.approveDoctor(doctorId);
        return ResponseEntity.ok("Doctor approved successfully");
    }

    @PutMapping("/doctors/{doctorId}/reject")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> rejectDoctor(@PathVariable Integer doctorId) {
        adminService.rejectDoctor(doctorId);
        return ResponseEntity.ok("Doctor rejected successfully");
    }

    @PutMapping("/doctors/{doctorId}/suspend")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> suspendDoctor(@PathVariable Integer doctorId) {
        adminService.suspendDoctor(doctorId);
        return ResponseEntity.ok("Doctor suspension status toggled successfully");
    }

    @PostMapping("/cities")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<CityDto> addCity(@RequestBody CityDto cityDto) {
        return ResponseEntity.ok(adminService.addCity(cityDto));
    }

    @PostMapping("/specialities")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<SpecialtyDto> addSpecialty(@RequestBody SpecialtyDto specialtyDto) {
        return ResponseEntity.ok(adminService.addSpecialty(specialtyDto));
    }
}
