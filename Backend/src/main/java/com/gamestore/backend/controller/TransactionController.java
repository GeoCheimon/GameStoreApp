package com.gamestore.backend.controller;

import com.gamestore.backend.dto.TransactionDTO;
import com.gamestore.backend.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@SuppressWarnings("unused")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public ResponseEntity<List<TransactionDTO>> getTransactionHistory(@AuthenticationPrincipal UserDetails userDetails) {
        List<TransactionDTO> history = transactionService.getTransactionHistory(userDetails.getUsername());
        return ResponseEntity.ok(history);
    }
}