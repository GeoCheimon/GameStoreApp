package com.gamestore.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordRequestDTO {
    private String currentPassword;
    private String newPassword;
    private String confirmPassword;
}