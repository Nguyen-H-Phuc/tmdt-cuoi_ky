package com.nhom5.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class OrderResponse {
    private Long orderId;
    private String orderCode;
    private UserDTO buyer;
    private UserDTO seller;
    private ProductDTO product;
    private Double totalPrice;
    private String status;
    private String paymentMethod;
    private String receiverName;
    private String receiverPhone;
    private String deliveryMethod;
    private String university;
    private String dormInfo;
    private String specificAddress;
    private String notes;
    private LocalDateTime orderDate;
    private String paymentUrl; // VNPAY payment gateway URL
}
