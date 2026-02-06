package org.ayoub.docline.repository;

import org.ayoub.docline.model.entity.Availability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Integer> {
    List<Availability> findByDoctorId(Integer doctorId);
    List<Availability> findByDoctorIdAndDayOfWeek(Integer doctorId, DayOfWeek dayOfWeek);
}
