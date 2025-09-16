package com.gamestore.backend.model;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Table (name = "games") // Αυτο το εβαλα γιατι το spring boot δημιουργουσε τον πινακα με το ονομα game και οχι games
// που ειναι το ονομα της βασης μου στο MySQL
public class Game {
    // --- Πρόσθεσε Getters για όλα τα πεδία ---
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    @Getter
    private String name;
    @Getter
    private String category;
    @Getter
    private double price;
    @Getter
    @Column(name = "image_url")
    private String imageUrl;

}
