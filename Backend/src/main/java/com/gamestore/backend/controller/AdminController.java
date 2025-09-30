package com.gamestore.backend.controller;

import com.gamestore.backend.model.Game;
import com.gamestore.backend.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.gamestore.backend.dto.UserManagementDTO;
@RestController
@RequestMapping("/api/admin")
// Προσθέτουμε την annotation για να αγνοήσει το IDE τα warnings.
// Δηλαδή λέμε στο IDE: "Ξέρω ότι νομίζεις πως αυτή η κλάση και οι μέθοδοί της είναι αχρησιμοποίητες,
// αλλά χρησιμοποιούνται από το Spring Framework."
@SuppressWarnings("unused")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Endpoints για Διαχείριση των Χρηστών

    // Endpoint για να φέρει όλους τους χρήστες
    // Αλλαξαμε το ResponseEntity<List<User>> σε ResponseEntity<List<UserManagementDTO>>
    // για να μην επιστρέφουμε ευαίσθητες πληροφορίες όπως ο κωδικός
    // και να περιορίσουμε τα δεδομένα που στέλνουμε στον πελάτη
    // μόνο σε αυτά που είναι απαραίτητα για τη διαχείριση των χρηστών.
    // Δημιουργήσαμε το UserManagementDTO για αυτόν ακριβώς τον σκοπό.
    // Το UserManagementDTO περιέχει μόνο τα πεδία που θέλουμε να εκθέσουμε
    // στον πελάτη για τη διαχείριση των χρηστών.
    // Έτσι, αποφεύγουμε να στέλνουμε ευαίσθητες πληροφορίες όπως ο κωδικός.
    // Αυτό είναι σημαντικό για την ασφάλεια και την προστασία των δεδομένων των χρηστών.
    // Επίσης, μειώνει τον όγκο των δεδομένων που στέλνουμε στον πελάτη,
    // κάνοντας την εφαρμογή πιο αποδο
    @GetMapping("/users")
    public ResponseEntity<List<UserManagementDTO>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // Endpoint για διαγραφή χρήστη
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok().body("User deleted successfully.");
    }

    // Endpoint για διαγραφή παιχνιδιού από τη βιβλιοθήκη συγκεκριμένου χρήστη
    @DeleteMapping("/users/{userId}/library/{gameId}")
    public ResponseEntity<?> deleteGameFromUserLibrary(@PathVariable Long userId, @PathVariable Long gameId) {
        adminService.deleteGameFromUserLibrary(userId, gameId);
        return ResponseEntity.ok().body("Game removed from user's library successfully.");
    }

    // Endpoints για Διαχείριση των Παιχνιδιών

    // Endpoint για να προσθέσει ένα νέο παιχνίδι
    @PostMapping("/games")
    public ResponseEntity<Game> addGame(@RequestBody Game game) {
        return ResponseEntity.ok(adminService.addGame(game));
    }

    // Endpoint για να ενημερώσει ένα υπάρχον παιχνίδι
    @PutMapping("/games/{gameId}")
    public ResponseEntity<Game> updateGame(@PathVariable Long gameId, @RequestBody Game game) {
        Game updatedGame = adminService.updateGame(gameId, game);
        return ResponseEntity.ok(updatedGame);
    }

    // Endpoint για να διαγράψει ένα παιχνίδι οριστικά
    @DeleteMapping("/games/{gameId}")
    public ResponseEntity<?> deleteGame(@PathVariable Long gameId) {
        adminService.deleteGame(gameId);
        return ResponseEntity.ok().body("Game deleted successfully.");
    }
}