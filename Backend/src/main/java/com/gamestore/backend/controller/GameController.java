package com.gamestore.backend.controller;

import com.gamestore.backend.model.Game;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.gamestore.backend.repository.GameRepository;
import com.gamestore.backend.service.GameService;

import java.util.List;

@RestController // Δηλώνει οτι η κλάση είναι ένας controller που χειρίζεται HTTP requests
@RequestMapping ("/api/games") // Ολα τα endpoints σε αυτην την κλάση θα ξεκινούν με /api/games
@CrossOrigin(origins = "http://localhost:5173") // Επιτρέπει requests από το συγκεκριμένο origin: React app
public class GameController {


    @Autowired // Αυτο μπαινει γιατι θα γινει dependency injection που σημαίνει
    // οτι το Spring θα αναλάβει να δημιουργήσει και να διαχειριστεί το αντικείμενο
    // του GameService και να το εισάγει (inject) στην κλάση GameController.
    // Το DI σημαινει οτι το GameController δεν χρειάζεται να δημιουργήσει
    // το GameService μόνο του, αλλά το λαμβάνει από το Spring container.
    // Εχει να κανει με το mapping των εξαρτήσεων που σημαίνει ότι το GameController
    // εξαρτάται από το GameService για να λειτουργήσει σωστά και ετσι το Spring
    // αναλαμβάνει να διαχειριστεί αυτή την εξάρτηση. Πιο συγκεκριμένα, το Spring
    // θα δημιουργήσει ένα instance του GameService και θα το εισάγει
    // στο GameController όταν αυτό χρειάζεται.

    private GameService gameService;
    @GetMapping
    public List<Game> getGames(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double maxPrice, // NEW: Δέξου την παράμετρο maxPrice
            @RequestParam(required = false) Boolean free,     // NEW: Δέξου την παράμετρο free
            @RequestParam(required = false) Boolean discounted // NEW: Δέξου την παράμετρο discounted
    ) {
        // Προώθησε τις παραμέτρους (ακόμα κι αν είναι null) στο Service
        return gameService.getFilteredGames(category, maxPrice, free, discounted);
    }
}
