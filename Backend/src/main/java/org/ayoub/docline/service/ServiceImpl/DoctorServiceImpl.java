package org.ayoub.docline.service.ServiceImpl;

import lombok.RequiredArgsConstructor;
import org.ayoub.docline.model.dto.DoctorProfileDto;
import org.ayoub.docline.model.dto.UnavailabilityDto;
import org.ayoub.docline.model.entity.Doctor;
import org.ayoub.docline.model.entity.Unavailability;
import org.ayoub.docline.repository.DoctorRepository;
import org.ayoub.docline.repository.UnavailabilityRepository;
import org.ayoub.docline.service.DoctorService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final UnavailabilityRepository unavailabilityRepository;

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
        
        return doctorRepository.save(doctor);
    }
}
