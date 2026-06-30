package com.nhom5.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProductDTO {
    private Integer productId;
    private String title;
    private Double price;
    private String description;
    private String category;
    private Integer categoryId;
    private String status;
    private String approvalStatus;
    private Integer quantity;
    private Boolean isDeleted;
    private Boolean isHidden;
    private Integer viewCount;
    private String province;
    private String district;
    private String specificAddress;
    private String imageUrl;
    private UserDTO seller;
    private List<String> images;
    private String targetUniversity;
    private Boolean isBoosted;
    private LocalDateTime boostedAt;
    private LocalDateTime boostExpiresAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
