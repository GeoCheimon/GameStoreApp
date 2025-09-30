package com.gamestore.backend.dto;

import lombok.Getter;
import lombok.Setter;

// Αυτό το DTO θα χρησιμοποιηθεί για να στείλουμε μια ασφαλή λίστα χρηστών στον admin.
@Getter
@Setter
public class UserManagementDTO {
    private Long id;
    private String username;
    private String email;
    private String role;
    // ΣΗΜΑΝΤΙΚΟ: Δεν περιλαμβάνουμε το password.
}