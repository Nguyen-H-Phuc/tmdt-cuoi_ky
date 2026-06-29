package com.nhom5.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CartItemDTO {
    private Integer cartId;
    private Integer productId;
    private String title;
    private Double price;
    private String imageUrl;
    private Integer quantity;
    private Integer productQuantity;
    private LocalDateTime addedAt;
    private UserDTO seller;
}
