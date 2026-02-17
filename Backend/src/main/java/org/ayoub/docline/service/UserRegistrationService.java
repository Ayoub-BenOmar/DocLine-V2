package org.ayoub.docline.service;

import org.ayoub.docline.model.dto.auth.RegisterRequest;
import org.ayoub.docline.model.entity.User;
import org.ayoub.docline.model.enums.Role;

public interface UserRegistrationService {
    boolean supports(Role role);
    User register(RegisterRequest request);
}
