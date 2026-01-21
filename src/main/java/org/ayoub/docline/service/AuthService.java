package org.ayoub.docline.service;

import org.ayoub.docline.model.dto.auth.AuthRequest;
import org.ayoub.docline.model.dto.auth.AuthResponse;
import org.ayoub.docline.model.dto.auth.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse authenticate(AuthRequest request);
}
