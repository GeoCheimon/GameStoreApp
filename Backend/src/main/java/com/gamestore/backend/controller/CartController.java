package com.gamestore.backend.controller;

import com.gamestore.backend.dto.GameDTO;
import com.gamestore.backend.service.CartService;
import com.gamestore.backend.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")

@SuppressWarnings("unused")
public class CartController {

    // Προσθηκη των services που θα χρειαστούμε
    private final CartService cartService;
    private final TransactionService transactionService;

    public CartController(CartService cartService, TransactionService transactionService) {
        this.cartService = cartService;
        this.transactionService = transactionService;
    }

    @PostMapping("/{gameId}")
    public ResponseEntity<?> addToCart(@PathVariable Long gameId, @AuthenticationPrincipal UserDetails userDetails) {
        cartService.addToCart(userDetails.getUsername(), gameId);
        return ResponseEntity.ok().body("Game added to cart successfully.");
    }

    @GetMapping
    public ResponseEntity<List<GameDTO>> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        List<GameDTO> cartItems = cartService.getCart(userDetails.getUsername());
        return ResponseEntity.ok(cartItems);
    }

    // Endpoint ειδικά για την προσθήκη στο καλάθι από το wishlist
    @PostMapping("/from-wishlist/{gameId}")
    public ResponseEntity<?> addFromWishlist(@PathVariable Long gameId, @AuthenticationPrincipal UserDetails userDetails) {
        transactionService.moveWishlistItemToCart(userDetails.getUsername(), gameId);
        return ResponseEntity.ok().body("Moved from wishlist to cart.");
    }

    // Endpoint για την αφαίρεση παιχνιδιού από το καλάθι
    @DeleteMapping("/{gameId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long gameId, @AuthenticationPrincipal UserDetails userDetails) {
        cartService.removeFromCart(userDetails.getUsername(), gameId);
        return ResponseEntity.ok().body("Game removed from cart successfully.");
    }

    // Endpoint για την αγορά των παιχνιδιών στο καλάθι
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@AuthenticationPrincipal UserDetails userDetails) {
        transactionService.checkout(userDetails.getUsername());
        return ResponseEntity.ok().body("Transaction completed successfully!");
    }
}