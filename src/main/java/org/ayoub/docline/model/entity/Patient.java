package org.ayoub.docline.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.ayoub.docline.model.enums.BloodType;
import org.ayoub.docline.model.enums.Gender;
import org.ayoub.docline.model.enums.Role;

import java.time.LocalDate;

@Entity
@Table(name = "patients")
@PrimaryKeyJoinColumn(name = "user_id")
@Data
@EqualsAndHashCode(callSuper = true)
public class Patient extends User {

    @Column(name = "birthdate")
    private LocalDate birthdate;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", length = 10)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_type", length = 20)
    private BloodType bloodType;

    @Column(name = "past_illnesses", columnDefinition = "TEXT")
    private String pastIllnesses;

    @Column(name = "surgeries", columnDefinition = "TEXT")
    private String surgeries;

    @Column(name = "allergies", columnDefinition = "TEXT")
    private String allergies;

    @Column(name = "chronic", columnDefinition = "TEXT")
    private String chronic;

    @Column(name = "cin", unique = true, length = 20)
    private String cin;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city")
    private City city;

    @Column(name = "insurance_provider", length = 100)
    private String insuranceProvider;

    @Column(name = "insurance_number", length = 50)
    private String insuranceNumber;

    @Column(name = "has_insurance")
    private Boolean hasInsurance = false;

    public Patient() {
        this.setRole(Role.ROLE_PATIENT);
    }
}