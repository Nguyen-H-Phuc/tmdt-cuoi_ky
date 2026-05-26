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
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Integer orderId;

    @Column(name = "order_code", unique = true, nullable = false)
    private String orderCode;

    // Liên kết với người mua (buyer_id)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    // Liên kết với người bán (seller_id)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @Column(name = "total_price")
    private Double totalPrice;

    @Column(name = "status")
    private String status; // VD: PENDING, COMPLETED, CANCELLED, PENDING_PAYMENT

    @Column(name = "payment_method")
    private String paymentMethod; // vnpay, cod

    @Column(name = "receiver_name")
    private String receiverName;

    @Column(name = "receiver_phone")
    private String receiverPhone;

    @Column(name = "delivery_method")
    private String deliveryMethod; // campus, home

    @Column(name = "university")
    private String university;

    @Column(name = "dorm_info")
    private String dormInfo;

    @Column(name = "shipping_address")
    private String specificAddress;

    @Column(name = "notes")
    private String notes;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Column(name = "status_date")
    private LocalDateTime statusDate;
}