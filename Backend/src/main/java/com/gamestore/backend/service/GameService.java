package com.gamestore.backend.service;

import com.gamestore.backend.model.Game;
import com.gamestore.backend.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class GameService {

    @Autowired // Αυτο μπαινει γιατι θα γινει dependency injection που σημαίνει
    //οτι το Spring θα αναλάβει να δημιουργήσει και να διαχειριστεί το αντικείμενο
    //του GameRepository και να το εισάγει (inject) στην κλάση GameController.
    // Δηλαδή ζητά απο το Spring να του δώσει αυτόματα ένα instance του GameRepository
    // όταν δημιουργηθεί το GameService.
    private GameRepository gameRepository;

    public List<Game> getFilteredGames(String category, Double maxPrice, Boolean free, Boolean discounted) {
        // Χρησιμοποιούμε τη μέθοδο findAll που δέχεται Specification
        return gameRepository.findAll((Specification<Game>) (root, query, criteriaBuilder) -> {
            // Δημιουργούμε μια κενή λίστα για τις συνθήκες (predicates)
            List<Predicate> predicates = new ArrayList<>();

            // Αν υπάρχει φίλτρο κατηγορίας, προσθέτουμε τη συνθήκη
            if (category != null && !category.isEmpty()) {
                // Split the comma-separated string from the URL (e.g., "RPG,Strategy") into a List of strings.
                List<String> categories = Arrays.asList(category.split(","));
                // Add a condition that checks if the game's category is IN the provided list.
                // This generates an SQL "WHERE category IN ('RPG', 'Strategy')" clause.
                predicates.add(root.get("category").in(categories));
            }
            // Αν υπάρχει φίλτρο μέγιστης τιμής, προσθέτουμε τη συνθήκη
            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            // Αν το φίλτρο "free" είναι true, προσθέτουμε τη συνθήκη
            if (free != null && free) {
                predicates.add(criteriaBuilder.equal(root.get("price"), 0));
            }
            // Αν το φίλτρο "discounted" είναι true, προσθέτουμε τη συνθήκη
            if (discounted != null && discounted) {
                // Ένα παιχνίδι είναι σε έκπτωση αν το originalPrice δεν είναι null
                predicates.add(criteriaBuilder.isNotNull(root.get("originalPrice")));
            }

            // Επιστρέφουμε όλες τις συνθήκες συνδεδεμένες με AND
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        });
    }
}
