package com.gamestore.backend.model;

import jakarta.persistence.*;
import lombok.Getter;

// By placing @Getter at the class level, Lombok automatically creates a getter for every field.
// This makes the code cleaner.
@Getter
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

    @Column(name = "image_url")
    private String imageUrl;

    // Note: Since @Getter is on the class, you don't need individual @Getter annotations here anymore.
    // Lombok handles it all.
}
