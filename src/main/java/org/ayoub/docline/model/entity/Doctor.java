package org.ayoub.docline.model.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.ayoub.docline.model.enums.Role;
import org.ayoub.docline.model.enums.UserStatus;

@Entity
@Table(name = "doctors")
@PrimaryKeyJoinColumn(name = "user_id")
@Data
@EqualsAndHashCode(callSuper = true)
public class Doctor extends User {

    @Column(name = "medical_licence", unique = true, length = 100)
    private String medicalLicence;

    @Column(name = "medical_document", length = 255)
    private String medicalDocument;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "speciality_id")
    private Specialty speciality;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id")
    private City city;

    @Column(name = "office_address", columnDefinition = "TEXT")
    private String officeAddress;

    @Column(name = "education", columnDefinition = "TEXT")
    private String education;

    @Column(name = "fees", precision = 10, scale = 2)
    private BigDecimal fees = BigDecimal.ZERO;

    @Column(name = "experience")
    private Integer experience = 0;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "working_hours", columnDefinition = "TEXT")
    private String workingHours;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    private UserStatus status = UserStatus.PENDING_VERIFICATION;

    public Doctor() {
        this.setRole(Role.ROLE_DOCTOR);
        this.setIsActivated(false); // Doctors need admin approval
    }
}