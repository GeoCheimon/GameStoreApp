package com.gamestore.backend.repository;

import com.gamestore.backend.model.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {

    // Μέθοδος για να βρίσκουμε όλες τις εγγραφές wishlist για έναν συγκεκριμένο χρήστη.
    List<WishlistItem> findByUser_Id(Long userId);

    // Μέθοδος για να ελέγχουμε αν ένα συγκεκριμένο παιχνίδι υπάρχει ήδη
    // στο wishlist ενός συγκεκριμένου χρήστη, για να αποφύγουμε διπλότυπα.
    Optional<WishlistItem> findByUser_IdAndGame_Id(Long userId, Long gameId);

    // Μέθοδος για να διαγράφει μια εγγραφή με βάση το ID του χρήστη και το ID του παιχνιδιού.
    // Το @Transactional είναι απαραίτητο για τις ενέργειες τροποποίησης (όπως το delete).
    @Transactional
    void deleteByUser_IdAndGame_Id(Long userId, Long gameId);
}