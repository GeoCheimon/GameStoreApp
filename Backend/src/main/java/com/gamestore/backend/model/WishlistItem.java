package com.gamestore.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "wishlist_items")
public class WishlistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Σχέση Many-to-One: Πολλέs εγγραφές wishlist μπορούν να ανήκουν σε έναν χρήστη.
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Σχέση Many-to-One: Πολλοί χρήστες μπορούν να έχουν το ίδιο παιχνίδι στο wishlist τους.
    @ManyToOne
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;
}