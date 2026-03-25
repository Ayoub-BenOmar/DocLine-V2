package org.ayoub.docline.service;

import org.ayoub.docline.model.dto.CityDto;
import org.ayoub.docline.model.dto.SpecialtyDto;
import org.ayoub.docline.model.dto.DoctorListingDto;
import org.ayoub.docline.model.dto.PatientProfileDto;
import org.ayoub.docline.model.dto.CityStatisticDto;
import org.ayoub.docline.model.dto.SpecialtyStatisticDto;

import java.util.List;

public interface AdminService {
    List<PatientProfileDto> getAllPatients();
    List<DoctorListingDto> getAllDoctors();
    List<DoctorListingDto> getPendingDoctors();
    void approveDoctor(Integer doctorId);
    void rejectDoctor(Integer doctorId);
    void suspendDoctor(Integer doctorId);
    void suspendPatient(Integer patientId);

    // City & Specialty Management
    CityDto addCity(CityDto cityDto);
    List<CityDto> getAllCities();
    SpecialtyDto addSpecialty(SpecialtyDto specialtyDto);
    List<SpecialtyDto> getAllSpecialties();

    void updateCity(Integer id, CityDto cityDto);
    void deleteCity(Integer id);

    void updateSpecialty(Integer id, SpecialtyDto specialtyDto);
    void deleteSpecialty(Integer id);

    // Statistics
    List<CityStatisticDto> getCityStatistics();
    List<SpecialtyStatisticDto> getSpecialtyStatistics();

}
