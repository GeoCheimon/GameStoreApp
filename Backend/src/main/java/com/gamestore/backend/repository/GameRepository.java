package com.gamestore.backend.repository;

import com.gamestore.backend.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GameRepository extends JpaRepository<Game, Long>, JpaSpecificationExecutor<Game> {
    // Spring Data JPA will automatically create the basic CRUD methods for us.
    // Specifically, it will automatically understand that I want to find games based on category.
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


    // Method to find games whose name contains the query string (case-insensitive) ---
    // The 'ContainingIgnoreCase' keyword tells Spring Data JPA to automatically generate
    // a query similar to: SELECT * FROM games WHERE LOWER(name) LIKE LOWER('%query%')
    List<Game> findByNameContainingIgnoreCase(String name);
    //The findByNameContainingIgnoreCase is a ready-made method provided by Spring Data JPA.
    // We don't need to implement it ourselves, Spring Data JPA does it automatically for us based on the method name.

    // Method to find unique category names that start with the query string (case-insensitive) ---
    // We use a custom @Query here because the logic is more specific.
    // 'DISTINCT g.category' ensures we don't get duplicate category names.
    // 'LOWER(g.category) LIKE LOWER(CONCAT(:query, '%'))' finds categories that start with the query.
    @Query("SELECT DISTINCT g.category FROM Game g WHERE LOWER(g.category) LIKE LOWER(CONCAT(:query, '%'))")
    List<String> findDistinctCategoriesStartingWith(@Param("query") String query);
}
