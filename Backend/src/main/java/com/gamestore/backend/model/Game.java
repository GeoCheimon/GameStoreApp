package com.gamestore.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

// By placing @Getter at the class level, Lombok automatically creates a getter for every field.
// This makes the code cleaner.
@Getter
@Setter
@Entity
@Table (name = "games")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private double price;

    // This now correctly maps to the 'original_price' column in your database.
    @Column(name = "original_price")
    private Double originalPrice;

    @Column(name = "image_url", length = 1024)
    private String imageUrl;

    @Column(columnDefinition = "TEXT") // Για μεγάλες περιγραφές
    private String description;

    private String developer;
    private String publisher;
    private LocalDate releaseDate;
    private Integer discountPercentage;

    // ΣΧΕΣΕΙΣ ONE-TO-MANY ΜΕ CASCADE
    // Αν ένα παιχνίδι διαγραφεί, πρέπει να διαγραφούν και όλες οι σχετικές εγγραφές.

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<CartItem> cartItems;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<WishlistItem> wishlistItems;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserLibraryItem> libraryItems;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Transaction> transactions;
}
