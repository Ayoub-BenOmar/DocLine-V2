package org.ayoub.docline.service.ServiceImpl;

import lombok.RequiredArgsConstructor;
import org.ayoub.docline.model.dto.DoctorListingDto;
import org.ayoub.docline.model.dto.PatientProfileDto;
import org.ayoub.docline.model.entity.Doctor;
import org.ayoub.docline.model.entity.Patient;
import org.ayoub.docline.model.entity.User;
import org.ayoub.docline.model.enums.Role;
import org.ayoub.docline.model.enums.UserStatus;
import org.ayoub.docline.repository.DoctorRepository;
import org.ayoub.docline.repository.UserRepository;
import org.ayoub.docline.service.AdminService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    @Override
    public List<PatientProfileDto> getAllPatients() {
        return userRepository.findAllByRole(Role.ROLE_PATIENT).stream()
                .filter(user -> user instanceof Patient)
                .map(user -> mapToPatientDto((Patient) user))
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
                // Basic info is enough for the list, can add more if needed
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
}
