package com.gamestore.backend.repository;

import com.gamestore.backend.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GameRepository extends JpaRepository<Game, Long> {
    // Το Spring DATA JPA θα δημιουργήσει αυτόματα τις βασικές μεθόδους CRUD για εμάς
    // Συγκεκριμένα, θα καταλάβει αυτόματα οτι θελω να βρω παιχνιδια με βάση τη κατηγορια
    List<Game> findByCategory(String category);
}
