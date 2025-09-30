package com.gamestore.backend.controller;

import com.gamestore.backend.dto.GameDTO;
import com.gamestore.backend.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@SuppressWarnings("unused")

public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    // Εδω χρειαζεται το gameId για να ξερει ποιο παιχνιδι θα προσθεσει στο wishlist
    // Επίσης, χρησιμοποιούμε το @AuthenticationPrincipal για να πάρουμε τα στοιχεία του
    // τρέχοντος συνδεδεμένου χρήστη από το Spring Security.
    // Το UserDetails περιέχει πληροφορίες όπως το username (email) του χρήστη.
    // Με αυτόν τον τρόπο, δεν χρειάζεται να στέλνει ο πελάτης το email του χρήστη στο σώμα του αιτήματος.
    // Το παίρνουμε αυτόματα από το JWT token που έστειλε ο πελάτης στο header.
    // Το endpoint αυτό προσθέτει ένα παιχνίδι στο wishlist του χρήστη.
    // Το gameId το παίρνουμε από το URL path (π.χ., /api/wishlist/5 για να προσθέσουμε το παιχνίδι με ID 5).
    // Επιστρέφει ένα απλό μήνυμα επιτυχίας αν το παιχνίνι προστέθηκε.
    // Αν το παιχνίδι είναι ήδη στο wishlist, το service θα "πετάξει" ένα σφάλμα.
    // Το ResponseEntity<?> σημαίνει ότι η απάντηση μπορεί να είναι οποιουδήποτε τύπου.
    // Εδώ, επιστρέφουμε απλά ένα μήνυμα String.
    // Το @PostMapping("/{gameId}") σημαίνει ότι το gameId είναι μια μεταβλητή που θα ληφθεί από το URL.
    // Π.χ., αν το URL είναι /api/wishlist/10, τότε το gameId θα είναι 10.
    // Το @PathVariable Long gameId λέει στο Spring να πάρει αυτή τη μεταβλητή από το URL και να την μετατρέψει σε Long.
    // Το @AuthenticationPrincipal UserDetails userDetails λέει στο Spring να μας δώσει τα στοιχεία του
    // τρέχοντος συνδεδεμένου χρήστη.
    // Το userDetails.getUsername() θα μας δώσει το email του χρήστη, που χρησιμοποιούμε για να βρούμε το σωστό
    // wishlist.
    @PostMapping("/{gameId}")
    public ResponseEntity<?> addToWishlist(@PathVariable Long gameId, @AuthenticationPrincipal UserDetails userDetails) {
        wishlistService.addToWishlist(userDetails.getUsername(), gameId);
        return ResponseEntity.ok().body("Game added to wishlist successfully.");
    }

    // Χρησιμοποιούμε το @DeleteMapping, που είναι το σωστό HTTP verb για διαγραφή.
    @DeleteMapping("/{gameId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long gameId, @AuthenticationPrincipal UserDetails userDetails) {
        wishlistService.removeFromWishlist(userDetails.getUsername(), gameId);
        return ResponseEntity.ok().body("Game removed from wishlist successfully.");
    }

    @GetMapping
    public ResponseEntity<List<GameDTO>> getWishlist(@AuthenticationPrincipal UserDetails userDetails) {
        List<GameDTO> wishlist = wishlistService.getWishlist(userDetails.getUsername());
        return ResponseEntity.ok(wishlist);
    }
}