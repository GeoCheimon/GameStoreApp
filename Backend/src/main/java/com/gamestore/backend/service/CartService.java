package com.gamestore.backend.service;

import com.gamestore.backend.dto.GameDTO;
import com.gamestore.backend.model.CartItem;
import com.gamestore.backend.model.Game;
import com.gamestore.backend.model.User;
import com.gamestore.backend.repository.CartRepository;
import com.gamestore.backend.repository.GameRepository;
import com.gamestore.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final GameService gameService;

    public CartService(CartRepository cartRepository, UserRepository userRepository, GameRepository gameRepository, GameService gameService) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
        this.gameService = gameService;
    }

    public void addToCart(String userEmail, Long gameId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        if (cartRepository.findByUser_IdAndGame_Id(user.getId(), game.getId()).isPresent()) {
            throw new RuntimeException("Game is already in the cart.");
        }

        CartItem cartItem = new CartItem();
        cartItem.setUser(user);
        cartItem.setGame(game);

        cartRepository.save(cartItem);
    }

    public List<GameDTO> getCart(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartRepository.findByUser_Id(user.getId())
                .stream()
                .map(CartItem::getGame)
                .map(gameService::MapToDTO)
                .collect(Collectors.toList());
    }

    public void removeFromCart(String userEmail, Long gameId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Καλούμε απευθείας τη μέθοδο διαγραφής του repository
        // (Θα τη δημιουργήσουμε στο επόμενο βήμα)
        cartRepository.deleteByUser_IdAndGame_Id(user.getId(), gameId);
    }
}