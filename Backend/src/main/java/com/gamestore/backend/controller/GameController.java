package com.gamestore.backend.controller;

import com.gamestore.backend.model.Game;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.gamestore.backend.repository.GameRepository;
import java.util.List;

@RestController // Δηλώνει οτι η κλάση είναι ένας controller που χειρίζεται HTTP requests
@RequestMapping ("/api/games") // Ολα τα endpoints σε αυτην την κλάση θα ξεκινούν με /api/games
@CrossOrigin(origins = "http://localhost:5173") // Επιτρέπει requests από το συγκεκριμένο origin: React app
public class GameController {

    @Autowired // Αυτο μπαινει γιατι θα γινει dependency injection που σημαίνει
    //οτι το Spring θα αναλάβει να δημιουργήσει και να διαχειριστεί το αντικείμενο
    //του GameRepository και να το εισάγει (inject) στην κλάση GameController.
    // Το DI σημαινει οτι το GameController δεν χρειάζεται να δημιουργήσει
    // το GameRepository μόνο του, αλλά το λαμβάνει από το Spring container.
    // Εχει να κανει με το mapping των εξαρτήσεων που σημαίνει ότι το GameController
    // εξαρτάται από το GameRepository για να λειτουργήσει σωστά και ετσι το Spring
    // αναλαμβάνει να διαχειριστεί αυτή την εξάρτηση. Πιο συγκεκριμένα, το Spring
    // θα δημιουργήσει ένα instance του GameRepository και θα το εισάγει
    // στο GameController όταν αυτό χρειάζεται.
    private GameRepository gameRepository;

    @GetMapping
    public List<Game> getGames(@RequestParam(required = false) String category) {
        //RequestParam σημαίνει οτι περιμένουμε μια παράμετρο από το URL
        //π.χ /api/games?category=Action ... Το required=false σημαινει οτι η παραμετρος category
        //δεν είναι υποχρεωτικηΑν δεν δοθει κατηγορία, η μεταβλητή category θα είναι null
        if (category != null && !category.isEmpty()) {
            //Αν δοθηκε κατηγορία ως παραμετρος, καλεσε τη μεθοδο findByCategory για να φέρεις τα παιχνίδια αυτής της κατηγορίας
            return gameRepository.findByCategory(category);
        }
        //Αν δεν δοθηκε κατηγορία, φέρε όλα τα παιχνίδια
        return gameRepository.findAll();
    }
}
