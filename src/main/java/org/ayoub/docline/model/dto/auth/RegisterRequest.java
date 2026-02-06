package org.ayoub.docline.model.dto.auth;

import jakarta.validation.constraints.Email;
import java.math.BigDecimal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.ayoub.docline.model.enums.BloodType;
import org.ayoub.docline.model.enums.Gender;
import org.ayoub.docline.model.enums.Role;

import java.time.LocalDate;

@Data
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;

    @Pattern(regexp = "^(\\+212|0)[5-7][0-9]{8}$", message = "Invalid phone number")
    private String phone;

    @NotNull(message = "Role is required")
    private Role role;

    private String profilePic;

    // Doctor-specific fields
    private String medicalLicence;
    private String education;
    private BigDecimal fees = BigDecimal.ZERO;
    private Integer experience = 0;
    private String officeAddress;
    private Integer specialityId;
    private Integer cityId;
    private String bio;
    private String workingHours;
    private String languages;
    private String clinicPhone;

    // Patient-specific fields
    private LocalDate birthdate;
    private Gender gender;
    private BloodType bloodType;
    private String pastIllnesses;
    private String surgeries;
    private String allergies;
    private String chronic;
    private String cin;
    private String address;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String insuranceProvider;
    private String insuranceNumber;
    private Boolean hasInsurance = false;

    // Admin-specific fields
    private String department;
    private String permissions;
}