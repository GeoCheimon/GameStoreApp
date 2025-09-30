package com.gamestore.backend.repository;

import com.gamestore.backend.model.UserLibraryItem;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserLibraryRepository extends JpaRepository<UserLibraryItem, Long> {
    // Μέθοδος για να βρίσκουμε όλα τα παιχνίδια στη βιβλιοθήκη ενός χρήστη
    List<UserLibraryItem> findByUser_Id(Long userId);

    // Ελέγχει την ύπαρξη εγγραφής με βάση το user ID και το game ID.
    // Επιστρέφει true αν ο χρήστης κατέχει ήδη το παιχνίδι, αλλιώς false.
    boolean existsByUser_IdAndGame_Id(Long userId, Long gameId);

    @Transactional
    void deleteByUser_IdAndGame_Id(Long userId, Long gameId);
}