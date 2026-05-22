package com.nhom5.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    private Integer productId;
    private Integer buyerId;
    private String fullName;
    private String phone;
    private String deliveryMethod; // campus, home
    private String university;
    private String dormInfo;
    private String specificAddress;
    private String notes;
    private String paymentMethod; // vnpay, cod
}
