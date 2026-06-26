package com.nhom5.backend.dto;

import lombok.Data;

@Data
public class OrderDetailDTO {
    private Integer orderDetailId;
    private ProductDTO product;
    private Integer quantity;
    private Double unitPrice;
}
