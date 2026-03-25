package org.ayoub.docline.service.ServiceImpl;

import lombok.RequiredArgsConstructor;
import org.ayoub.docline.model.dto.CityDto;
import org.ayoub.docline.model.dto.DoctorListingDto;
import org.ayoub.docline.model.dto.PatientProfileDto;
import org.ayoub.docline.model.dto.SpecialtyDto;
import org.ayoub.docline.model.dto.CityStatisticDto;
import org.ayoub.docline.model.dto.SpecialtyStatisticDto;
import org.ayoub.docline.model.entity.City;
import org.ayoub.docline.model.entity.Doctor;
import org.ayoub.docline.model.entity.Patient;
import org.ayoub.docline.model.entity.Specialty;
import org.ayoub.docline.model.enums.UserStatus;
import org.ayoub.docline.repository.CityRepository;
import org.ayoub.docline.repository.DoctorRepository;
import org.ayoub.docline.repository.PatientRepository;
import org.ayoub.docline.repository.SpecialtyRepository;


import org.ayoub.docline.service.AdminService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final CityRepository cityRepository;
    private final SpecialtyRepository specialtyRepository;


    @Override
    public List<PatientProfileDto> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(this::mapToPatientDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DoctorListingDto> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::mapToDoctorDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DoctorListingDto> getPendingDoctors() {
        return doctorRepository.findByStatus(UserStatus.PENDING_VERIFICATION).stream()
                .map(this::mapToDoctorDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void approveDoctor(Integer doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setStatus(UserStatus.ACTIVE);
        doctor.setIsActivated(true);
        doctorRepository.save(doctor);
    }

    @Override
    @Transactional
    public void rejectDoctor(Integer doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setStatus(UserStatus.REJECTED);
        doctor.setIsActivated(false);
        doctorRepository.save(doctor);
    }

    @Override
    @Transactional
    public void suspendDoctor(Integer doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (doctor.getStatus() == UserStatus.SUSPENDED) {
            doctor.setStatus(UserStatus.ACTIVE);
            doctor.setIsSuspended(false);
            doctor.setIsActivated(true);
        } else {
            doctor.setStatus(UserStatus.SUSPENDED);
            doctor.setIsSuspended(true);
            doctor.setIsActivated(false);
        }
        doctorRepository.save(doctor);
    }

    @Override
    @Transactional
    public void suspendPatient(Integer patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        if (Boolean.TRUE.equals(patient.getIsSuspended())) {
            patient.setIsSuspended(false);
            patient.setIsActivated(true);
        } else {
            patient.setIsSuspended(true);
            patient.setIsActivated(false);
        }
        patientRepository.save(patient);
    }

    @Override
    @Transactional
    public CityDto addCity(CityDto cityDto) {
        if (cityDto.getCityName() == null || cityDto.getCityName().trim().isEmpty()) {
            throw new IllegalArgumentException("City name cannot be empty");
        }

        City city = new City();
        city.setCityName(cityDto.getCityName());
        City savedCity = cityRepository.save(city);

        return CityDto.builder()
                .id(savedCity.getId())
                .cityName(savedCity.getCityName())
                .build();
    }

    @Override
    @Transactional
    public SpecialtyDto addSpecialty(SpecialtyDto specialtyDto) {
        if (specialtyDto.getSpecialiteName() == null || specialtyDto.getSpecialiteName().trim().isEmpty()) {
            throw new IllegalArgumentException("Specialty name cannot be empty");
        }

        Specialty specialty = new Specialty();
        specialty.setSpecialiteName(specialtyDto.getSpecialiteName());
        Specialty savedSpecialty = specialtyRepository.save(specialty);

        return SpecialtyDto.builder()
                .id(savedSpecialty.getId())
                .specialiteName(savedSpecialty.getSpecialiteName())
                .build();
    }

    @Override
    public List<CityDto> getAllCities() {
        return cityRepository.findAll().stream()
                .map(city -> CityDto.builder()
                        .id(city.getId())
                        .cityName(city.getCityName())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<SpecialtyDto> getAllSpecialties() {
        return specialtyRepository.findAll().stream()
                .map(specialty -> SpecialtyDto.builder()
                        .id(specialty.getId())
                        .specialiteName(specialty.getSpecialiteName())
                        .build())
                .collect(Collectors.toList());
    }    @Override
    @Transactional
    public void updateCity(Integer id, CityDto cityDto) {
        City city = cityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("City not found"));

        if (cityDto.getCityName() != null && !cityDto.getCityName().trim().isEmpty()) {
            city.setCityName(cityDto.getCityName());
            cityRepository.save(city);
        }
    }

    @Override
    @Transactional
    public void deleteCity(Integer id) {
        if (!cityRepository.existsById(id)) {
            throw new IllegalArgumentException("City not found");
        }
        // Assuming cascade delete is handled or not required for simple deletion logic
        // If doctors/patients depend on it, we might need more logic or handle constraints
        cityRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void updateSpecialty(Integer id, SpecialtyDto specialtyDto) {
        Specialty specialty = specialtyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Specialty not found"));

        if (specialtyDto.getSpecialiteName() != null && !specialtyDto.getSpecialiteName().trim().isEmpty()) {
            specialty.setSpecialiteName(specialtyDto.getSpecialiteName());
            specialtyRepository.save(specialty);
        }
    }

    @Override
    @Transactional
    public void deleteSpecialty(Integer id) {
        if (!specialtyRepository.existsById(id)) {
            throw new IllegalArgumentException("Specialty not found");
        }
        specialtyRepository.deleteById(id);
    }

    private PatientProfileDto mapToPatientDto(Patient patient) {
        return PatientProfileDto.builder()
                .id(patient.getId())
                .name(patient.getName())
                .lastName(patient.getLastName())
                .email(patient.getEmail())
                .phone(patient.getPhone())
                .profilePic(patient.getProfilePic())
                .birthdate(patient.getBirthdate())
                .gender(patient.getGender() != null ? patient.getGender().name() : null)
                .bloodType(patient.getBloodType() != null ? patient.getBloodType().name() : null)
                .cin(patient.getCin())
                .address(patient.getAddress())
                .city(patient.getCity() != null ? patient.getCity().getCityName() : null)
                .insuranceProvider(patient.getInsuranceProvider())
                .insuranceNumber(patient.getInsuranceNumber())
                .hasInsurance(patient.getHasInsurance())
                .status(Boolean.TRUE.equals(patient.getIsSuspended()) ? "SUSPENDED" : "ACTIVE")
                .build();
    }

    private DoctorListingDto mapToDoctorDto(Doctor doctor) {
        return DoctorListingDto.builder()
                .id(doctor.getId())
                .name(doctor.getName())
                .lastName(doctor.getLastName())
                .email(doctor.getEmail())
                .status(doctor.getStatus().name())
                .medicalLicence(doctor.getMedicalLicence())
                .medicalDocument(doctor.getMedicalDocument())
                .profilePic(doctor.getProfilePic())
                .speciality(doctor.getSpeciality() != null ? doctor.getSpeciality().getSpecialiteName() : null)
                .city(doctor.getCity() != null ? doctor.getCity().getCityName() : null)
                .fees(doctor.getFees())
                .build();
    }

    @Override
    public List<CityStatisticDto> getCityStatistics() {
        return cityRepository.findAll().stream()
                .map(city -> CityStatisticDto.builder()
                        .cityName(city.getCityName())
                        .doctorCount(city.getDoctors() != null ? city.getDoctors().size() : 0)
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<SpecialtyStatisticDto> getSpecialtyStatistics() {
        return specialtyRepository.findAll().stream()
                .map(specialty -> SpecialtyStatisticDto.builder()
                        .specialiteName(specialty.getSpecialiteName())
                        .doctorCount(specialty.getDoctors() != null ? specialty.getDoctors().size() : 0)
                        .build())
                .collect(Collectors.toList());
    }


}
