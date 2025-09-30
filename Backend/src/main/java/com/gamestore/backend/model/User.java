package com.gamestore.backend.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "users") // Συνδέει αυτή την κλάση με τον πίνακα "users" της SQL
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    // Constructors, Getters, Setters (το Lombok τα δημιουργεί αυτόματα)

    // --- ΝΕΕΣ ΣΧΕΣΕΙΣ ONE-TO-MANY ---
    // mappedBy = "user": Λέει στο Hibernate ότι η σχέση "ανήκει" στο πεδίο 'user' της αντίστοιχης κλάσης.
    // cascade = CascadeType.ALL: Αν διαγράψω έναν User, διάγραψε αυτόματα και όλα τα CartItems, WishlistItems κτλ. που του ανήκουν.
    // orphanRemoval = true: Αν αφαιρέσω ένα CartItem από τη λίστα ενός User, διάγραψέ το από τη βάση.

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<CartItem> cartItems;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<WishlistItem> wishlistItems;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserLibraryItem> libraryItems;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Transaction> transactions;
}
