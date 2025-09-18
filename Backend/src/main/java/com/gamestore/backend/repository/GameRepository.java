package com.gamestore.backend.repository;

import com.gamestore.backend.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface GameRepository extends JpaRepository<Game, Long>, JpaSpecificationExecutor<Game> {
    // Το Spring DATA JPA θα δημιουργήσει αυτόματα τις βασικές μεθόδους CRUD για εμάς
    // Συγκεκριμένα, θα καταλάβει αυτόματα οτι θελω να βρω παιχνιδια με βάση τη κατηγορια
    List<Game> findByCategory(String category);

    //To JpaSpecificationExecutor<Game> προσθέτει υποστήριξη για δυναμικές ερωτήσεις (queries)
    // με βάση προδιαγραφές (specifications), επιτρέποντάς μας να δημιουργούμε σύνθετες
    // και ευέλικτες ερωτήσεις χωρίς να χρειάζεται να γράφουμε SQL ή JPQL χειροκίνητα.
    // Ενα παραδειγμα για να κατανοήσω τι σημασία του είναι: Αν θέλουμε να φιλτράρουμε παιχνίδια
    // με βάση πολλαπλά κριτήρια (π.χ. κατηγορία, μέγιστη τιμή, δωρεάν, εκπτώσεις) και αυτά
    // τα κριτήρια μπορεί να αλλάζουν δυναμικά ανάλογα με τις ανάγκες του χρήστη,
    // το JpaSpecificationExecutor μας επιτρέπει να δημιουργούμε αυτές τις ερωτήσεις εύκολα
    // και να τις εκτελούμε χωρίς να χρειάζεται να γράφουμε πολύπλοκο κώδικα.
    // Γραφει μονο του κωδικα; Ναι, μεσα απο το service θα γραψω τον κωδικα που θελω να εκτελεστει
    // και το JpaSpecificationExecutor θα τον μεταφρασει σε SQL και θα τον εκτελεσει.
    // Υπαρχει η δυνατότητα να φτιαξω SQL queries στο mySQL; Ναι, μπορεις να φτιαξεις SQL queries στο mySQL
    // και να τα εκτελεσεις απευθειας στη βαση δεδομενων σου, αλλα το JpaSpecificationExecutor
    // μας διευκολύνει να δημιουργούμε δυναμικές ερωτήσεις μέσα από τον κώδικα της εφαρμογής μας.
    // Αν κανω mySQL queries θα ήταν:
    // SELECT * FROM games WHERE category = 'Action' AND price <= 20.0 AND orignal_price IS NOT NULL;
}
