package org.ayoub.docline.service.ServiceImpl;

import lombok.RequiredArgsConstructor;
import org.ayoub.docline.model.dto.auth.RegisterRequest;
import org.ayoub.docline.model.entity.User;
import org.ayoub.docline.model.enums.Role;
import org.ayoub.docline.repository.UserRepository;
import org.ayoub.docline.service.UserRegistrationService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminRegistrationService implements UserRegistrationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public boolean supports(Role role) {
        return Role.ROLE_ADMIN.equals(role);
    }

    @Override
    @Transactional
    public User register(RegisterRequest request) {
        User admin = new User();

        admin.setName(request.getName());
        admin.setLastName(request.getLastName());
        admin.setEmail(request.getEmail());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setPhone(request.getPhone());
        admin.setRole(Role.ROLE_ADMIN);

        return userRepository.save(admin);
    }
}
