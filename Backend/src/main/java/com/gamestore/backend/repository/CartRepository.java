package com.gamestore.backend.repository;

import com.gamestore.backend.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<CartItem, Long> {

    // Μέθοδος για να βρίσκουμε όλα τα αντικείμενα στο καλάθι ενός χρήστη
    List<CartItem> findByUser_Id(Long userId);

    // Μέθοδος για να ελέγχουμε αν ένα παιχνίδι υπάρχει ήδη στο καλάθι
    Optional<CartItem> findByUser_IdAndGame_Id(Long userId, Long gameId);

    // Μέθοδος για να αδειάζουμε το καλάθι ενός χρήστη
    @Transactional
    void deleteByUser_Id(Long userId);

    // Μέθοδος για να διαγράφει μια εγγραφή με βάση το user ID και το game ID.
    @Transactional
    void deleteByUser_IdAndGame_Id(Long userId, Long gameId);
}