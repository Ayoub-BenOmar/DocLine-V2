package org.ayoub.docline.service;

import org.ayoub.docline.model.dto.DoctorListingDto;
import org.ayoub.docline.model.dto.PatientProfileDto;
import java.util.List;

public interface AdminService {
    List<PatientProfileDto> getAllPatients();
    List<DoctorListingDto> getAllDoctors();
    List<DoctorListingDto> getPendingDoctors();
    void approveDoctor(Integer doctorId);
    void rejectDoctor(Integer doctorId);
    void suspendDoctor(Integer doctorId);
}
