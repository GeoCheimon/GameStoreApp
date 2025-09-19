package com.gamestore.backend.service;

import com.gamestore.backend.dto.GameDTO;
import com.gamestore.backend.dto.SearchSuggestionDTO;
import com.gamestore.backend.model.Game;
import com.gamestore.backend.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GameService {

    @Autowired // Αυτο μπαινει γιατι θα γινει dependency injection που σημαίνει
    //οτι το Spring θα αναλάβει να δημιουργήσει και να διαχειριστεί το αντικείμενο
    //του GameRepository και να το εισάγει (inject) στην κλάση GameController.
    // Δηλαδή ζητά απο το Spring να του δώσει αυτόματα ένα instance του GameRepository
    // όταν δημιουργηθεί το GameService.
    private GameRepository gameRepository;

    // The method now returns a List of GameDTOs instead of Game entities.
    public List<GameDTO> getFilteredGames(String category, Double maxPrice, Boolean free, Boolean discounted, String name) {
        // Χρησιμοποιούμε τη μέθοδο findAll που δέχεται Specification
        // Step 1: Fetch the Game entities from the database using specifications
        List<Game> gamesFromDb = gameRepository.findAll((Specification<Game>) (root, query, criteriaBuilder) -> {
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
            // --- NEW: Add the filter for the game name if it exists ---
            if (name != null && !name.isEmpty()) {
                // This creates a 'LIKE' query, e.g., WHERE LOWER(name) LIKE '%witcher%'
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
            }

            // Επιστρέφουμε όλες τις συνθήκες συνδεδεμένες με AND
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        });
        // Step 2: Convert the list of Game entities into a list of GameDTOs.
        return gamesFromDb.stream() // Create a stream from the list of Game entities. stream() is used to process
                // collections of objects in a functional style. It allows us to perform operations like map, filter, and collect.
                // functional style means we can focus on what we want to achieve (e.g., transforming data). In sipmpler terms,
                // it allows us to write cleaner and more readable code by expressing the logic of data processing
                // without getting bogged down in the details of how to iterate over collections. bogged down synomym: overwhelmed
                // by the details of how to iterate over collections.
                // In this case, we want to convert each Game entity into a GameDTO.
                .map(this::convertToDto) // For each 'game' entity/model, call the conversion method.
                .collect(Collectors.toList()); // Collect the results into a new list.
    }
    // A private helper method to convert a Game entity to a GameDTO. ---
    // This isolates the mapping logic in one place.
    private GameDTO convertToDto(Game game) {
        GameDTO dto = new GameDTO();
        dto.setId(game.getId());
        dto.setName(game.getName());
        dto.setCategory(game.getCategory());
        dto.setPrice(game.getPrice());
        dto.setOriginalPrice(game.getOriginalPrice());
        dto.setImageUrl(game.getImageUrl());
        return dto;
    }

    // Method to fetch and process search suggestions ---
    public SearchSuggestionDTO searchGamesAndCategories(String query) {
        // Don't search for empty or very short strings to avoid unnecessary database load.
        if (query == null || query.trim().length() < 2) {
            return new SearchSuggestionDTO(Collections.emptyList(), Collections.emptyList());
        }

        // Step 1: Call the repository to get the raw Game entities.
        List<Game> matchingGames = gameRepository.findByNameContainingIgnoreCase(query);

        // Step 2: Transform the full Game entities into lightweight GameSuggestion DTOs.
        List<SearchSuggestionDTO.GameSuggestion> gameSuggestions = matchingGames.stream()
                .map(game -> new SearchSuggestionDTO.GameSuggestion(game.getId(), game.getName()))
                .collect(Collectors.toList());

        // Step 3: Call the repository to get the matching category strings.
        List<String> matchingCategories = gameRepository.findDistinctCategoriesStartingWith(query);

        // Step 4: Combine the two lists into the final DTO and return it.
        return new SearchSuggestionDTO(gameSuggestions, matchingCategories);
    }
}
