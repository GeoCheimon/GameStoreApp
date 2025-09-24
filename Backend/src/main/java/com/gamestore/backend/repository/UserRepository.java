package com.gamestore.backend.repository;

import com.gamestore.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Το Spring Data JPA θα δημιουργήσει αυτόματα μια μέθοδο που ψάχνει
    // έναν χρήστη με βάση το email του.
    // Tο Optional είναι ένας container που μπορεί να περιέχει είτε μια τιμή
    // (σε αυτή την περίπτωση έναν χρήστη) είτε να είναι κενό (αν δεν βρεθεί ο χρήστης).
    // Αυτό μας βοηθάει να αποφύγουμε το πρόβλημα του NullPointerException, γιατί αντί να επιστρέφουμε
    // απευθείας null όταν δεν υπάρχει χρήστης με το συγκεκριμένο email, επιστρέφουμε ένα Optional
    // που είναι κενό. Έτσι, ο κώδικας που καλεί αυτή τη μέθοδο πρέπει να ελέγξει αν το Optional
    // περιέχει έναν χρήστη πριν προσπαθήσει να τον χρησιμοποιήσει.
    Optional<User> findByEmail(String email);
}
