package org.ayoub.docline.repository;

import org.ayoub.docline.model.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Integer> {
    Optional<Patient> findByCin(String cin);
    boolean existsByCin(String cin);
    Optional<Patient> findByEmail(String email);
}