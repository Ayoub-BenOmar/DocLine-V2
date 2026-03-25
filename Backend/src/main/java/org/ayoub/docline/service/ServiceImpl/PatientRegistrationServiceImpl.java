package org.ayoub.docline.service.ServiceImpl;

import lombok.RequiredArgsConstructor;
import org.ayoub.docline.model.dto.auth.RegisterRequest;
import org.ayoub.docline.model.entity.City;
import org.ayoub.docline.model.entity.Patient;
import org.ayoub.docline.model.enums.Role;
import org.ayoub.docline.repository.CityRepository;
import org.ayoub.docline.repository.PatientRepository;
import org.ayoub.docline.service.UserRegistrationService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PatientRegistrationServiceImpl implements UserRegistrationService {

    private final PatientRepository patientRepository;
    private final CityRepository cityRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public boolean supports(Role role) {
        return Role.ROLE_PATIENT.equals(role);
    }

    @Override
    @Transactional
    public Patient register(RegisterRequest request) {
        if (request.getCin() != null && patientRepository.existsByCin(request.getCin())) {
            throw new RuntimeException("CIN already registered");
        }

        Patient patient = new Patient();

        setCommonUserFields(patient, request);

        patient.setBirthdate(request.getBirthdate());
        patient.setGender(request.getGender());
        patient.setBloodType(request.getBloodType());
        patient.setPastIllnesses(request.getPastIllnesses());
        patient.setSurgeries(request.getSurgeries());
        patient.setAllergies(request.getAllergies());
        patient.setChronic(request.getChronic());
        patient.setCin(request.getCin());
        patient.setAddress(request.getAddress());
        patient.setInsuranceProvider(request.getInsuranceProvider());
        patient.setInsuranceNumber(request.getInsuranceNumber());
        patient.setHasInsurance(request.getHasInsurance());

        if (request.getCityId() != null) {
            City city = cityRepository.findById(request.getCityId())
                    .orElseThrow(() -> new RuntimeException("City not found"));
            patient.setCity(city);
        }

        patient.setIsActivated(true);

        return patientRepository.save(patient);
    }

    private void setCommonUserFields(Patient patient, RegisterRequest request) {
        patient.setName(request.getName());
        patient.setLastName(request.getLastName());
        patient.setEmail(request.getEmail());
        patient.setPassword(passwordEncoder.encode(request.getPassword()));
        patient.setPhone(request.getPhone());
        patient.setProfilePic(request.getProfilePic());
    }
}