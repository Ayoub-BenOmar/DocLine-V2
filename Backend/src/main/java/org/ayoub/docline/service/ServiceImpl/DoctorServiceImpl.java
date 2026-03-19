package org.ayoub.docline.service.ServiceImpl;

import lombok.RequiredArgsConstructor;
import org.ayoub.docline.model.dto.AppointmentResponseDto;
import org.ayoub.docline.model.dto.DoctorProfileDto;
import org.ayoub.docline.model.dto.MedicalReportDto;
import org.ayoub.docline.model.dto.UnavailabilityDto;
import org.ayoub.docline.model.entity.Appointment;
import org.ayoub.docline.model.entity.Doctor;
import org.ayoub.docline.model.entity.Patient;
import org.ayoub.docline.model.entity.Unavailability;
import org.ayoub.docline.model.entity.City;
import org.ayoub.docline.model.enums.AppointmentStatus;
import org.ayoub.docline.repository.AppointmentRepository;
import org.ayoub.docline.repository.CityRepository;
import org.ayoub.docline.repository.DoctorRepository;
import org.ayoub.docline.repository.PatientRepository;
import org.ayoub.docline.repository.UnavailabilityRepository;
import org.ayoub.docline.service.DoctorService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final UnavailabilityRepository unavailabilityRepository;
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final CityRepository cityRepository;

    @Override
    public Unavailability addUnavailability(UnavailabilityDto unavailabilityDto, String doctorEmail) {
        Doctor doctor = doctorRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        Unavailability unavailability = Unavailability.builder()
                .doctor(doctor)
                .startDate(unavailabilityDto.getStartDate())
                .endDate(unavailabilityDto.getEndDate())
                .reason(unavailabilityDto.getReason())
                .build();

        return unavailabilityRepository.save(unavailability);
    }

    @Override
    public List<Unavailability> getMyUnavailabilities(String doctorEmail) {
        Doctor doctor = doctorRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));
        return unavailabilityRepository.findByDoctorId(doctor.getId());
    }

    @Override
    public Doctor updateProfile(DoctorProfileDto profileDto, String doctorEmail) {
        Doctor doctor = doctorRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        if (profileDto.getName() != null) doctor.setName(profileDto.getName());
        if (profileDto.getLastName() != null) doctor.setLastName(profileDto.getLastName());
        if (profileDto.getPhone() != null) doctor.setPhone(profileDto.getPhone());
        if (profileDto.getProfilePic() != null) doctor.setProfilePic(profileDto.getProfilePic());
        if (profileDto.getBio() != null) doctor.setBio(profileDto.getBio());
        if (profileDto.getOfficeAddress() != null) doctor.setOfficeAddress(profileDto.getOfficeAddress());
        if (profileDto.getFees() != null) doctor.setFees(profileDto.getFees());
        if (profileDto.getExperience() != null) doctor.setExperience(profileDto.getExperience());

        if (profileDto.getCityId() != null) {
            City city = cityRepository.findById(profileDto.getCityId())
                    .orElseThrow(() -> new IllegalArgumentException("City not found"));
            doctor.setCity(city);
        }

        return doctorRepository.save(doctor);
    }

    @Override
    public DoctorProfileDto getProfile(String doctorEmail) {
        Doctor doctor = doctorRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        return DoctorProfileDto.builder()
                .name(doctor.getName())
                .lastName(doctor.getLastName())
                .email(doctor.getEmail())
                .phone(doctor.getPhone())
                .profilePic(doctor.getProfilePic())
                .bio(doctor.getBio())
                .fees(doctor.getFees())
                .officeAddress(doctor.getOfficeAddress())
                .build();
    }

    @Override
    public List<AppointmentResponseDto> getMyAppointments(String doctorEmail) {
        Doctor doctor = doctorRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        return appointmentRepository.findByDoctorId(doctor.getId()).stream()
                .map(this::mapToAppointmentDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void completeAppointment(Integer appointmentId, MedicalReportDto reportDto, String doctorEmail) {
        Doctor doctor = doctorRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new IllegalArgumentException("This appointment does not belong to you");
        }

        // Update Appointment Status and Note
        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointment.setDoctorNote(reportDto.getDoctorNote());
        appointment.setMedicalReportDate(LocalDateTime.now());
        appointmentRepository.save(appointment);

        // Update Patient Medical Information
        Patient patient = appointment.getPatient();
        if (reportDto.getBloodType() != null && !reportDto.getBloodType().isEmpty()) {
            try {
                patient.setBloodType(org.ayoub.docline.model.enums.BloodType.valueOf(reportDto.getBloodType()));
            } catch (IllegalArgumentException e) {
                // Ignore invalid
            }
        }
        if (reportDto.getPastIllnesses() != null) patient.setPastIllnesses(reportDto.getPastIllnesses());
        if (reportDto.getSurgeries() != null) patient.setSurgeries(reportDto.getSurgeries());
        if (reportDto.getAllergies() != null) patient.setAllergies(reportDto.getAllergies());
        if (reportDto.getChronic() != null) patient.setChronic(reportDto.getChronic());

        patientRepository.save(patient);
    }

    private AppointmentResponseDto mapToAppointmentDto(Appointment appointment) {
        return AppointmentResponseDto.builder()
                .id(appointment.getId())
                .dateTime(appointment.getDateTime())
                .status(appointment.getStatus())
                .reason(appointment.getReason())
                .doctorName(appointment.getDoctor().getFullName())
                .doctorSpeciality(appointment.getDoctor().getSpeciality() != null ? appointment.getDoctor().getSpeciality().getSpecialiteName() : null)
                .patientId(appointment.getPatient().getId())
                .patientName(appointment.getPatient().getFullName())
                .doctorNote(appointment.getDoctorNote())
                .medicalReportDate(appointment.getMedicalReportDate())
                .build();
    }
}
