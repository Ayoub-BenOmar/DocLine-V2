package org.ayoub.docline.service;

import org.ayoub.docline.model.dto.DoctorProfileDto;
import org.ayoub.docline.model.dto.UnavailabilityDto;
import org.ayoub.docline.model.entity.Doctor;
import org.ayoub.docline.model.entity.Unavailability;

import java.util.List;

public interface DoctorService {
    Unavailability addUnavailability(UnavailabilityDto unavailabilityDto, String doctorEmail);
    List<Unavailability> getMyUnavailabilities(String doctorEmail);
    Doctor updateProfile(DoctorProfileDto profileDto, String doctorEmail);
}
