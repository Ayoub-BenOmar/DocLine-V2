package org.ayoub.docline.service.ServiceImpl;

import lombok.RequiredArgsConstructor;
import org.ayoub.docline.config.security.JwtService;
import org.ayoub.docline.model.dto.auth.AuthRequest;
import org.ayoub.docline.model.dto.auth.AuthResponse;
import org.ayoub.docline.model.dto.auth.RegisterRequest;
import org.ayoub.docline.model.entity.User;
import org.ayoub.docline.repository.UserRepository;
import org.ayoub.docline.service.AuthService;
import org.ayoub.docline.service.UserRegistrationService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final List<UserRegistrationService> registrationServices;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    @Override
    public AuthResponse register(RegisterRequest request) {
        UserRegistrationService registrationService = registrationServices.stream()
                .filter(service -> service.supports(request.getRole()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid role"));

        User user = registrationService.register(request);
        String token = jwtService.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole().name())
                .name(user.getName())
                .lastName(user.getLastName())
                .userId(user.getId())
                .message("User registered successfully")
                .build();
    }

    @Override
    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        String token = jwtService.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole().name())
                .name(user.getName())
                .lastName(user.getLastName())
                .userId(user.getId())
                .isActivated(user.getIsActivated())
                .message("User authenticated successfully")
                .build();
    }
}
