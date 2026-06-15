package com.gamestore.backend.controller;

import com.gamestore.backend.dto.UserDTO;
import com.gamestore.backend.dto.ChangePasswordRequestDTO;
import com.gamestore.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
//@CrossOrigin(origins = "http://localhost:5173")

@SuppressWarnings("unused")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /*Endpoint που επιστρέφει τα στοιχεία του τρέχοντος συνδεδεμένου χρήστη.
      @param authentication Το αντικείμενο Authentication που παρέχεται αυτόματα από το Spring Security
      και περιέχει τα στοιχεία του χρήστη (π.χ. το email του).
      @return Ένα ResponseEntity με το UserDTO του χρήστη.
     */
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
        // Το Spring Security, αφού επαληθεύσει το JWT token, μας δίνει πρόσβαση
        // στο αντικείμενο 'Authentication'. Το όνομα του χρήστη (που είναι το email μας)
        // βρίσκεται μέσα σε αυτό.
        String userEmail = authentication.getName();

        // Καλούμε το service για να πάρουμε τα πλήρη στοιχεία του χρήστη ως DTO.
        UserDTO userDTO = userService.getUserByEmail(userEmail);

        // Επιστρέφουμε τα δεδομένα με status 200 OK.
        return ResponseEntity.ok(userDTO);
    }

    // endpoint για αλλαγή κωδικού
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ChangePasswordRequestDTO request
    ) {
        try {
            userService.changePassword(userDetails.getUsername(), request);
            return ResponseEntity.ok().body("Password changed successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
