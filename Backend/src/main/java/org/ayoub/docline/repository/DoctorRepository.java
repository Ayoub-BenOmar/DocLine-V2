package org.ayoub.docline.repository;

import org.ayoub.docline.model.entity.Doctor;
import org.ayoub.docline.model.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
    Optional<Doctor> findByMedicalLicence(String medicalLicence);
    boolean existsByMedicalLicence(String medicalLicence);
    Optional<Doctor> findByEmail(String email);

    List<Doctor> findByStatus(UserStatus status);

    @Query("SELECT d FROM Doctor d WHERE d.speciality.id = :specialityId AND d.status = 'APPROVED'")
    List<Doctor> findBySpecialityId(@Param("specialityId") Integer specialityId);

    @Query("SELECT d FROM Doctor d WHERE d.city.id = :cityId AND d.status = 'APPROVED'")
    List<Doctor> findByCityId(@Param("cityId") Integer cityId);

    @Query("SELECT d FROM Doctor d WHERE d.status = 'APPROVED'")
    List<Doctor> findActiveDoctors();

    @Query("SELECT d FROM Doctor d WHERE " +
           "(:cityId IS NULL OR d.city.id = :cityId) AND " +
           "(:specialityId IS NULL OR d.speciality.id = :specialityId) AND " +
           "d.status = 'APPROVED' AND d.isActivated = true AND d.isSuspended = false")
    Page<Doctor> findAllByFilters(@Param("cityId") Integer cityId,
                                  @Param("specialityId") Integer specialityId,
                                  Pageable pageable);
}