package com.nhom5.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "boost_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoostTransaction {
    @Id
    private String transactionId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private String packageName;

    @Column(nullable = false)
    private BigDecimal amount;

    private String paymentMethod = "VNPay";

    private String status = "PENDING";

    private LocalDateTime createdAt = LocalDateTime.now();
}
