package org.ayoub.docline.controller.public_data;

import lombok.RequiredArgsConstructor;
import org.ayoub.docline.model.dto.CityDto;
import org.ayoub.docline.model.dto.DoctorListingDto;
import org.ayoub.docline.model.dto.SpecialtyDto;
import org.ayoub.docline.repository.CityRepository;
import org.ayoub.docline.repository.SpecialtyRepository;
import org.ayoub.docline.service.PatientService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicDataController {

    private final CityRepository cityRepository;
    private final SpecialtyRepository specialtyRepository;
    private final PatientService patientService;

    @GetMapping("/doctors")
    public ResponseEntity<Page<DoctorListingDto>> getAllDoctors(@RequestParam(required = false) Integer cityId, @RequestParam(required = false) Integer specialityId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(patientService.getAllDoctorsPaginated(cityId, specialityId, page, size));
    }

    @GetMapping("/cities")
    public ResponseEntity<List<CityDto>> getAllCities() {
        return ResponseEntity.ok(cityRepository.findAll().stream()
                .map(city -> CityDto.builder()
                        .id(city.getId())
                        .cityName(city.getCityName())
                        .build())
                .collect(Collectors.toList()));
    }

    @GetMapping("/specialities")
    public ResponseEntity<List<SpecialtyDto>> getAllSpecialities() {
        return ResponseEntity.ok(specialtyRepository.findAll().stream()
                .map(specialty -> SpecialtyDto.builder()
                        .id(specialty.getId())
                        .specialiteName(specialty.getSpecialiteName())
                        .build())
                .collect(Collectors.toList()));
    }
}
