package com.gamestore.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @Column(name = "purchase_price", nullable = false)
    private BigDecimal purchasePrice; // Αποθηκεύουμε την τιμή κατά τη στιγμή της αγοράς

    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;
}