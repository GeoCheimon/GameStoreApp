package com.gamestore.backend.controller;

import com.gamestore.backend.dto.GameDTO;
import com.gamestore.backend.service.LibraryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/library")
@SuppressWarnings("unused")
public class LibraryController {

    private final LibraryService libraryService;

    // Χρησιμοποιούμε το LibraryService για να πάρουμε τα παιχνίδια που ανήκουν στη βιβλιοθήκη του χρήστη.
    // Το LibraryService θα έχει τη λογική για να αλληλεπιδράσει με τη βάση δεδομένων
    // και να φέρει τα σωστά παιχνίδια για τον συγκεκριμένο χρήστη.
    // Το UserDetails θα μας δώσει το email του χρήστη που είναι συνδεδεμένος,
    // ώστε να ξέρουμε ποια βιβλιοθήκη να ψάξουμε.
    public LibraryController(LibraryService libraryService) {
        this.libraryService = libraryService;
    }

    // Το ResponseEntity<List<GameDTO>> σημαίνει ότι η απάντηση θα είναι μια λίστα από GameDTO αντικείμενα.
    // Το GameDTO είναι ένα απλό αντικείμενο που περιέχει μόνο τις πληροφορίες που θέλουμε να στείλουμε
    // στον πελάτη για κάθε παιχνίδι στη βιβλιοθήκη.
    @GetMapping
    public ResponseEntity<List<GameDTO>> getLibrary(@AuthenticationPrincipal UserDetails userDetails) {
        List<GameDTO> ownedGames = libraryService.getOwnedGames(userDetails.getUsername());
        return ResponseEntity.ok(ownedGames);
    }
}