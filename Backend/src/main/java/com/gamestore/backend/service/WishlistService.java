package com.gamestore.backend.service;

import com.gamestore.backend.dto.GameDTO;
import com.gamestore.backend.model.Game;
import com.gamestore.backend.model.User;
import com.gamestore.backend.model.WishlistItem;
import com.gamestore.backend.repository.GameRepository;
import com.gamestore.backend.repository.UserRepository;
import com.gamestore.backend.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    // Χρησιμοποιούμε constructor injection για τα: WishlistRepository, UserRepository, GameRepository, και GameService.
    // Με το constructor injection, οι εξαρτήσεις είναι final και δεν μπορούν να αλλάξουν μετά την αρχικοποίηση.
    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final GameService gameService; // Για να επαναχρησιμοποιήσουμε τη λογική μετατροπής σε DTO

    public WishlistService(WishlistRepository wishlistRepository, UserRepository userRepository, GameRepository gameRepository, GameService gameService) {
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
        this.gameService = gameService;
    }

    public void addToWishlist(String userEmail, Long gameId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        // Έλεγχος για να μην προσθέσουμε το ίδιο παιχνίδι δύο φορές
        if (wishlistRepository.findByUser_IdAndGame_Id(user.getId(), game.getId()).isPresent()) {
            // Προαιρετικά: Επιστρέφουμε ένα μήνυμα αντί να μην κάνουμε τίποτα
            throw new RuntimeException("Game is already in the wishlist.");
        }

        WishlistItem wishlistItem = new WishlistItem();
        wishlistItem.setUser(user);
        wishlistItem.setGame(game);

        wishlistRepository.save(wishlistItem);
    }

    public List<GameDTO> getWishlist(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return wishlistRepository.findByUser_Id(user.getId())
                .stream() // Παίρνουμε τη ροή των WishlistItem
                .map(WishlistItem::getGame) // Παίρνουμε το αντικείμενο Game από κάθε WishlistItem
                .map(gameService::MapToDTO) // Μετατρέπουμε κάθε Game σε GameDTO
                .collect(Collectors.toList()); // Συλλέγουμε τα αποτελέσματα σε μια λίστα
    }

    public void removeFromWishlist(String userEmail, Long gameId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Έλεγχος για να δούμε αν το αντικείμενο υπάρχει πριν προσπαθήσουμε να το διαγράψουμε
        if (wishlistRepository.findByUser_IdAndGame_Id(user.getId(), gameId).isEmpty()) {
            throw new RuntimeException("Game not found in wishlist.");
        }

        // Καλούμε τη νέα μέθοδο του repository για να εκτελέσει τη διαγραφή.
        wishlistRepository.deleteByUser_IdAndGame_Id(user.getId(), gameId);
    }
}