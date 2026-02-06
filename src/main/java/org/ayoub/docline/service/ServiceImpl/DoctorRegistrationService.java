package org.ayoub.docline.service.ServiceImpl;

import lombok.RequiredArgsConstructor;
import org.ayoub.docline.model.dto.auth.RegisterRequest;
import org.ayoub.docline.model.entity.City;
import org.ayoub.docline.model.entity.Doctor;
import org.ayoub.docline.model.entity.Specialty;
import org.ayoub.docline.model.enums.Role;
import org.ayoub.docline.repository.CityRepository;
import org.ayoub.docline.repository.DoctorRepository;
import org.ayoub.docline.repository.SpecialtyRepository;
import org.ayoub.docline.service.UserRegistrationService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DoctorRegistrationService implements UserRegistrationService {

    private final DoctorRepository doctorRepository;
    private final SpecialtyRepository specialtyRepository;
    private final CityRepository cityRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public boolean supports(Role role) {
        return Role.ROLE_DOCTOR.equals(role);
    }

    @Override
    @Transactional
    public Doctor register(RegisterRequest request) {
        if (request.getMedicalLicence() == null || request.getMedicalLicence().isEmpty()) {
            throw new RuntimeException("Medical licence is required for doctors");
        }

        if (doctorRepository.existsByMedicalLicence(request.getMedicalLicence())) {
            throw new RuntimeException("Medical licence already registered");
        }

        Doctor doctor = new Doctor();

        setCommonUserFields(doctor, request);

        doctor.setMedicalLicence(request.getMedicalLicence());
        doctor.setEducation(request.getEducation());
        doctor.setFees(request.getFees());
        doctor.setExperience(request.getExperience());
        doctor.setOfficeAddress(request.getOfficeAddress());
        doctor.setBio(request.getBio());
        doctor.setWorkingHours(request.getWorkingHours());

        if (request.getSpecialityId() != null) {
            Specialty specialty = specialtyRepository.findById(request.getSpecialityId())
                    .orElseThrow(() -> new RuntimeException("Specialty not found"));
            doctor.setSpeciality(specialty);
        }

        if (request.getCityId() != null) {
            City city = cityRepository.findById(request.getCityId())
                    .orElseThrow(() -> new RuntimeException("City not found"));
            doctor.setCity(city);
        }

        doctor.setIsActivated(false);

        return doctorRepository.save(doctor);
    }

    private void setCommonUserFields(Doctor doctor, RegisterRequest request) {
        doctor.setName(request.getName());
        doctor.setLastName(request.getLastName());
        doctor.setEmail(request.getEmail());
        doctor.setPassword(passwordEncoder.encode(request.getPassword()));
        doctor.setPhone(request.getPhone());
        doctor.setProfilePic(request.getProfilePic());
    }
}