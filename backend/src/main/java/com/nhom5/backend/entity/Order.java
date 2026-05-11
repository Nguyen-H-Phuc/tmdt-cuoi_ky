package com.nhom5.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    // Liên kết với người mua (buyer_id)
    @ManyToOne
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    // Liên kết với người bán (seller_id)
    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @Column(name = "total_price")
    private Double totalPrice;

    @Column(name = "status")
    private String status; // VD: PENDING, COMPLETED, CANCELLED

    @Column(name = "shipping_address")
    private String shippingAddress;

    @Column(name = "order_date")
    private LocalDateTime orderDate;
}