package com.gamestore.backend.repository;

import com.gamestore.backend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    // Μέθοδος για να βρίσκουμε όλες τις συναλλαγές ενός χρήστη, ταξινομημένες
    // από την πιο πρόσφατη στην πιο παλιά.
    List<Transaction> findByUser_IdOrderByTransactionDateDesc(Long userId);
}