package com.gamestore.backend.service;

import com.gamestore.backend.model.CartItem;
import com.gamestore.backend.model.Transaction;
import com.gamestore.backend.model.User;
import com.gamestore.backend.model.UserLibraryItem;
import com.gamestore.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.gamestore.backend.dto.TransactionDTO;
import com.gamestore.backend.model.Game;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.math.BigDecimal;

@Service
public class TransactionService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final UserLibraryRepository userLibraryRepository;
    private final WishlistRepository wishlistRepository;
    private final TransactionRepository transactionRepository;

    public TransactionService(UserRepository userRepository, CartRepository cartRepository, UserLibraryRepository userLibraryRepository,
                              WishlistRepository wishlistRepository, TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.userLibraryRepository = userLibraryRepository;
        this.wishlistRepository = wishlistRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public void moveWishlistItemToCart(String userEmail, Long gameId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Game game = wishlistRepository.findByUser_IdAndGame_Id(user.getId(), gameId)
                .orElseThrow(() -> new RuntimeException("Game not found in wishlist"))
                .getGame();

        // Έλεγχος αν το παιχνίδι είναι ήδη στο καλάθι
        if (cartRepository.findByUser_IdAndGame_Id(user.getId(), gameId).isEmpty()) {
            CartItem cartItem = new CartItem();
            cartItem.setUser(user);
            cartItem.setGame(game);
            cartRepository.save(cartItem);
        }

        // Αφαίρεση του αντικειμένου από το wishlist
        wishlistRepository.deleteByUser_IdAndGame_Id(user.getId(), gameId);
    }

    @Transactional // Εξασφαλίζει ότι όλες οι ενέργειες θα γίνουν επιτυχώς, αλλιώς καμία.
    public void checkout(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> cartItems = cartRepository.findByUser_Id(user.getId());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty.");
        }

        // Μεταφέρουμε κάθε αντικείμενο από το καλάθι στη βιβλιοθήκη
        for (CartItem cartItem : cartItems) {
            Long gameId = cartItem.getGame().getId();
            // Έλεγχος αν ο χρήστης κατέχει ήδη το παιχνίδι
            if (!userLibraryRepository.existsByUser_IdAndGame_Id(user.getId(), gameId)) {
                // Προσθέτουμε το παιχνίδι στη βιβλιοθήκη ΜΟΝΟ αν δεν το έχει ήδη.
                UserLibraryItem libraryItem = new UserLibraryItem();
                libraryItem.setUser(user);
                libraryItem.setGame(cartItem.getGame());
                libraryItem.setPurchaseDate(LocalDateTime.now());
                userLibraryRepository.save(libraryItem);
            }

            // Καταγραφή της συναλλαγής
            Transaction transaction = new Transaction();
            transaction.setUser(user);
            transaction.setGame(cartItem.getGame());
            transaction.setPurchasePrice(BigDecimal.valueOf(cartItem.getGame().getPrice()));
            transaction.setTransactionDate(LocalDateTime.now());
            transactionRepository.save(transaction);

        }

        // Αδειάζουμε το καλάθι του χρήστη
        cartRepository.deleteByUser_Id(user.getId());
    }

    // Ανάκτηση ιστορικού συναλλαγών ---
    public List<TransactionDTO> getTransactionHistory(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return transactionRepository.findByUser_IdOrderByTransactionDateDesc(user.getId())
                .stream()
                .map(this::mapToTransactionDTO)
                .collect(Collectors.toList());
    }

    private TransactionDTO mapToTransactionDTO(Transaction transaction) {
        TransactionDTO dto = new TransactionDTO();
        dto.setGameName(transaction.getGame().getName());
        dto.setPurchasePrice(transaction.getPurchasePrice());
        dto.setTransactionDate(transaction.getTransactionDate());
        return dto;
    }
}