package com.gamestore.backend.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Data Transfer Object (DTO) για τη μεταφορά των δεδομένων του χρήστη.
 * Χρησιμοποιείται για να στέλνουμε στο frontend μόνο τις πληροφορίες
 * που είναι ασφαλές να εκτεθούν, αποκρύπτοντας ευαίσθητα δεδομένα
 * όπως το κρυπτογραφημένο password.
 */
@Getter
@Setter
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    // Σημείωση: Το πεδίο 'password' παραλείπεται σκόπιμα.
}
