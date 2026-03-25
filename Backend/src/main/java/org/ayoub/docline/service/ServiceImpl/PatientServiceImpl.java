package org.ayoub.docline.service.ServiceImpl;

import lombok.RequiredArgsConstructor;
import org.ayoub.docline.model.dto.AppointmentRequestDto;
import org.ayoub.docline.model.dto.AppointmentResponseDto;
import org.ayoub.docline.model.dto.DoctorListingDto;
import org.ayoub.docline.model.dto.PatientProfileDto;
import org.ayoub.docline.model.dto.PatientProfileUpdateDto;
import org.ayoub.docline.model.dto.TimeSlotDto;
import org.ayoub.docline.model.entity.*;
import org.ayoub.docline.model.enums.AppointmentStatus;
import org.ayoub.docline.model.enums.Role;
import org.ayoub.docline.model.enums.UserStatus;
import org.ayoub.docline.repository.AppointmentRepository;
import org.ayoub.docline.repository.DoctorRepository;
import org.ayoub.docline.repository.PatientRepository;
import org.ayoub.docline.repository.UnavailabilityRepository;
import org.ayoub.docline.service.PatientService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final DoctorRepository doctorRepository;
    private final UnavailabilityRepository unavailabilityRepository;
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final org.ayoub.docline.repository.CityRepository cityRepository;

    @Override
    public DoctorListingDto getDoctorById(Integer doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));
        return mapToDto(doctor);
    }

    @Override
    public List<Unavailability> getDoctorUnavailability(Integer doctorId) {
        return unavailabilityRepository.findByDoctorId(doctorId);
    }

    @Override
    public List<DoctorListingDto> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .filter(d -> d.getRole() == Role.ROLE_DOCTOR && d.getIsActivated() && d.getStatus() == UserStatus.ACTIVE)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<DoctorListingDto> getAllDoctorsPaginated(Integer cityId, Integer specialityId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return doctorRepository.findAllByFilters(cityId, specialityId, pageable)
                .map(this::mapToDto);
    }

    @Override
    public List<DoctorListingDto> searchDoctors(Integer cityId, Integer specialityId, String name) {
        return doctorRepository.findAll().stream()
                .filter(d -> d.getRole() == Role.ROLE_DOCTOR && d.getIsActivated())
                .filter(d -> cityId == null || (d.getCity() != null && d.getCity().getId().equals(cityId)))
                .filter(d -> specialityId == null || (d.getSpeciality() != null && d.getSpeciality().getId().equals(specialityId)))
                .filter(d -> name == null || d.getFullName().toLowerCase().contains(name.toLowerCase()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimeSlotDto> getAvailableSlots(Integer doctorId, LocalDate date) {
        List<TimeSlotDto> slots = new ArrayList<>();

        // 1. Basic Business Rule: Mon-Fri, 09:00 - 12:00
        if (date.getDayOfWeek() == DayOfWeek.SATURDAY || date.getDayOfWeek() == DayOfWeek.SUNDAY) {
            return slots; // Empty list for weekends
        }

        LocalTime startTime = LocalTime.of(9, 0);
        LocalTime endTime = LocalTime.of(12, 0);

        // 2. Check Unavailability (Holidays/Sick) using optimized query
        List<Unavailability> unavailabilities = unavailabilityRepository.findByDoctorIdAndDate(doctorId, date);
        if (!unavailabilities.isEmpty()) {
            return slots; // Empty list if doctor is on holiday/sick leave for this date
        }

        // 3. Get Existing Appointments
        LocalDateTime dayStart = date.atStartOfDay();
        LocalDateTime dayEnd = date.atTime(LocalTime.MAX);

        List<Appointment> bookedAppointments = appointmentRepository.findByDoctorIdAndDateTimeBetween(doctorId, dayStart, dayEnd)
                .stream()
                .filter(a -> a.getStatus() != AppointmentStatus.CANCELLED)
                .collect(Collectors.toList());

        LocalTime current = startTime;
        while (current.isBefore(endTime)) {
            LocalDateTime slotStart = LocalDateTime.of(date, current);
            LocalTime next = current.plusMinutes(30);
            LocalDateTime slotEnd = LocalDateTime.of(date, next);

            boolean isBooked = bookedAppointments.stream()
                    .anyMatch(a -> a.getDateTime().equals(slotStart));

            slots.add(new TimeSlotDto(slotStart, slotEnd, !isBooked));

            current = next;
        }

        return slots;
    }

    @Override
    @Transactional
    public AppointmentResponseDto bookAppointment(AppointmentRequestDto requestDto, String patientEmail) {
        Patient patient = patientRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));

        Doctor doctor = doctorRepository.findById(requestDto.getDoctorId())
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        boolean isSlotTaken = appointmentRepository.existsByDoctorIdAndDateTimeAndStatusNot(
                doctor.getId(), requestDto.getDateTime(), AppointmentStatus.CANCELLED);

        if (isSlotTaken) {
            throw new IllegalStateException("Slot already taken");
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .dateTime(requestDto.getDateTime())
                .reason(requestDto.getReason())
                .status(AppointmentStatus.PENDING)
                .build();

        Appointment saved = appointmentRepository.save(appointment);
        return mapToAppointmentDto(saved);
    }

    @Override
    public PatientProfileDto getPatientProfile(String email) {
        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));

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
                .pastIllnesses(patient.getPastIllnesses())
                .surgeries(patient.getSurgeries())
                .allergies(patient.getAllergies())
                .chronic(patient.getChronic())
                .build();
    }

    @Override
    @Transactional
    public PatientProfileDto updatePatientProfile(String email, PatientProfileUpdateDto updateDto) {
        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));

        if (updateDto.getName() != null) patient.setName(updateDto.getName());
        if (updateDto.getLastName() != null) patient.setLastName(updateDto.getLastName());
        if (updateDto.getPhone() != null) patient.setPhone(updateDto.getPhone());
        if (updateDto.getBirthdate() != null) patient.setBirthdate(updateDto.getBirthdate());
        
        if (updateDto.getGender() != null) {
            try {
                patient.setGender(org.ayoub.docline.model.enums.Gender.valueOf(updateDto.getGender()));
            } catch (IllegalArgumentException e) {
            }
        }

        if (updateDto.getCin() != null) patient.setCin(updateDto.getCin());
        if (updateDto.getAddress() != null) patient.setAddress(updateDto.getAddress());

        if (updateDto.getCityId() != null) {
            City city = cityRepository.findById(updateDto.getCityId())
                    .orElseThrow(() -> new IllegalArgumentException("City not found"));
            patient.setCity(city);
        }

        if (updateDto.getInsuranceProvider() != null) patient.setInsuranceProvider(updateDto.getInsuranceProvider());
        if (updateDto.getInsuranceNumber() != null) patient.setInsuranceNumber(updateDto.getInsuranceNumber());
        if (updateDto.getHasInsurance() != null) patient.setHasInsurance(updateDto.getHasInsurance());


        Patient savedPatient = patientRepository.save(patient);
        return getPatientProfile(savedPatient.getEmail());
    }

    @Override
    public List<AppointmentResponseDto> getPatientAppointments(String email) {
        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));

        return appointmentRepository.findByPatientId(patient.getId()).stream()
                .map(this::mapToAppointmentDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cancelAppointment(Integer appointmentId, String patientEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

        if (!appointment.getPatient().getEmail().equals(patientEmail)) {
            throw new SecurityException("Not authorized to cancel this appointment");
        }

        if (appointment.getDateTime().isBefore(LocalDateTime.now())) {
             throw new IllegalStateException("Cannot cancel past appointments");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }

    @Override
    @Transactional
    public AppointmentResponseDto rescheduleAppointment(Integer appointmentId, AppointmentRequestDto rescheduleDto, String patientEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

        if (!appointment.getPatient().getEmail().equals(patientEmail)) {
            throw new SecurityException("Not authorized to reschedule this appointment");
        }

        if (appointment.getStatus() == AppointmentStatus.COMPLETED || appointment.getStatus() == AppointmentStatus.CANCELLED) {
             throw new IllegalStateException("Cannot reschedule a completed or cancelled appointment");
        }

        LocalDateTime newDateTime = rescheduleDto.getDateTime();

        if (!newDateTime.equals(appointment.getDateTime())) {
             if (newDateTime.isBefore(LocalDateTime.now())) {
                 throw new IllegalArgumentException("Cannot reschedule to the past");
             }

             List<Unavailability> unavailabilities = unavailabilityRepository.findByDoctorIdAndDate(
                     appointment.getDoctor().getId(), newDateTime.toLocalDate());
             if (!unavailabilities.isEmpty()) {
                 throw new IllegalStateException("Doctor is unavailable on the selected date");
             }

             boolean isSlotTaken = appointmentRepository.existsByDoctorIdAndDateTimeAndStatusNot(
                     appointment.getDoctor().getId(), newDateTime, AppointmentStatus.CANCELLED);

             if (isSlotTaken) {
                 throw new IllegalStateException("Selected time slot is already booked");
             }

             appointment.setDateTime(newDateTime);
        }

        appointment.setReason(rescheduleDto.getReason());
        appointment.setStatus(AppointmentStatus.PENDING);

        Appointment saved = appointmentRepository.save(appointment);
        return mapToAppointmentDto(saved);
    }

    private AppointmentResponseDto mapToAppointmentDto(Appointment appointment) {
        return AppointmentResponseDto.builder()
                .id(appointment.getId())
                .dateTime(appointment.getDateTime())
                .status(appointment.getStatus())
                .reason(appointment.getReason())
                .doctorId(appointment.getDoctor().getId())
                .doctorName(appointment.getDoctor().getFullName())
                .doctorSpeciality(appointment.getDoctor().getSpeciality() != null ? appointment.getDoctor().getSpeciality().getSpecialiteName() : null)
                .patientName(appointment.getPatient().getFullName())
                .patientBloodType(appointment.getPatient().getBloodType() != null ? appointment.getPatient().getBloodType().name() : null)
                .patientPastIllnesses(appointment.getPatient().getPastIllnesses())
                .patientSurgeries(appointment.getPatient().getSurgeries())
                .patientAllergies(appointment.getPatient().getAllergies())
                .patientChronic(appointment.getPatient().getChronic())
                .doctorNote(appointment.getDoctorNote())
                .medicalReportDate(appointment.getMedicalReportDate())
                .build();
    }

    private DoctorListingDto mapToDto(Doctor doctor) {
        return DoctorListingDto.builder()
                .id(doctor.getId())
                .name(doctor.getName())
                .lastName(doctor.getLastName())
                .profilePic(doctor.getProfilePic())
                .speciality(doctor.getSpeciality() != null ? doctor.getSpeciality().getSpecialiteName() : null)
                .city(doctor.getCity() != null ? doctor.getCity().getCityName() : null)
                .fees(doctor.getFees())
                .build();
    }
}
