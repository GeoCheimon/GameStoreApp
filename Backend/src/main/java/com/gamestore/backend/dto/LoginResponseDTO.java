package com.gamestore.backend.dto;

import lombok.Getter;

@Getter
public class LoginResponseDTO {
    private final String jwtToken;

    public LoginResponseDTO(String jwtToken) {
        this.jwtToken = jwtToken;
    }
}