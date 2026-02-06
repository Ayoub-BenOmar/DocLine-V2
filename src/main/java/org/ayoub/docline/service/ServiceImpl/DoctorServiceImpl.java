package org.ayoub.docline.service.ServiceImpl;

import lombok.RequiredArgsConstructor;
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
}
