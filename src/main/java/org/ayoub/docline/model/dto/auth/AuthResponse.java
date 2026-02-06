package org.ayoub.docline.model.dto.auth;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String role;
    private String name;
    private String lastName;
    private Integer userId;
    private String message;
}
