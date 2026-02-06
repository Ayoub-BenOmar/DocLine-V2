package org.ayoub.docline.repository;

import org.ayoub.docline.model.entity.Unavailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface UnavailabilityRepository extends JpaRepository<Unavailability, Integer> {
    List<Unavailability> findByDoctorId(Integer doctorId);
    List<Unavailability> findByDoctorIdAndStartDateAfter(Integer doctorId, LocalDate date);
}
