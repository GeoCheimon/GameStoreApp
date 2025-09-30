package com.gamestore.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class TransactionDTO {
    private String gameName;
    private BigDecimal purchasePrice;
    private LocalDateTime transactionDate;
}