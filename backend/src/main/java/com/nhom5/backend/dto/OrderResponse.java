package com.nhom5.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class OrderResponse {
    private Integer orderId;
    private String orderCode;
    private UserDTO buyer;
    private UserDTO seller;
    private ProductDTO product;
    private java.util.List<OrderDetailDTO> details;
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
    private LocalDateTime statusDate;
    private String paymentUrl; // VNPAY payment gateway URL
}
