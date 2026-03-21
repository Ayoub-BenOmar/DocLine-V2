package org.ayoub.docline.repository;

import org.ayoub.docline.model.entity.Unavailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface UnavailabilityRepository extends JpaRepository<Unavailability, Integer> {
    List<Unavailability> findByDoctorId(Integer doctorId);

    @Query("SELECT u FROM Unavailability u WHERE u.doctor.id = :doctorId AND u.startDate <= :date AND u.endDate >= :date")
    List<Unavailability> findByDoctorIdAndDate(@Param("doctorId") Integer doctorId, @Param("date") LocalDate date);

    List<Unavailability> findByDoctorIdAndStartDateAfter(Integer doctorId, LocalDate date);
}
