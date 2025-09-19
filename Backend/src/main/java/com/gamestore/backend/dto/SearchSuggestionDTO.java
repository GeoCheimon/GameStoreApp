package com.gamestore.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor // It generates a constructor with 1 parameter for each field in your class.
// Αυτό το DTO θα χρησιμοποιηθεί για να στείλουμε προτάσεις αναζήτησης (search suggestions)
// από το backend στο frontend.
// Θα περιέχει δύο λίστες: μία για τα παιχνίδια και μία για τις κατηγορίες.
// Για τα παιχνίδια, θα στείλουμε μόνο το ID και το όνομα (για να μην στέλνουμε περιττά δεδομένα).
// Για τις κατηγορίες, θα στείλουμε απλά μια λίστα με τα ονόματα των κατηγοριών.
public class SearchSuggestionDTO {
    // Για τα παιχνίδια, χρειαζόμαστε το ID (για το key στο React) και το όνομα.
    // Οπότε, θα φτιάξουμε μια εσωτερική, στατική κλάση DTO μόνο για αυτό.
    private List<GameSuggestion> games;
    private List<String> categories;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class GameSuggestion {
        private Long id;
        private String name;
    }
}