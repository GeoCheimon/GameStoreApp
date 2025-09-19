package com.gamestore.backend.dto;

import lombok.Getter;
import lombok.Setter;

// Ένα απλό "Plain Old Java Object" (POJO) για τη μεταφορά δεδομένων.
// Δεν έχει λογική βάσης δεδομένων (@Entity, @Id, etc.).
@Getter
@Setter
public class GameDTO {
    private Long id;
    private String name;
    private String category;
    private double price;
    private Double originalPrice;
    private String imageUrl;
}