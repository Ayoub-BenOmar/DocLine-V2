package org.ayoub.docline.controller.auth;

import lombok.RequiredArgsConstructor;
import org.ayoub.docline.model.dto.auth.AuthRequest;
import org.ayoub.docline.model.dto.auth.AuthResponse;
import org.ayoub.docline.model.dto.auth.RegisterRequest;
import org.ayoub.docline.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthResponse> authenticate(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok().build();
    }

    @org.springframework.web.bind.annotation.GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        return ResponseEntity.ok(java.util.Map.of(
                "name", authentication.getName(),
                "authorities", authentication.getAuthorities()
        ));
    }
}
