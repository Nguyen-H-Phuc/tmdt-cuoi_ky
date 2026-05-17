package com.nhom5.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewDTO {
    private Integer reviewId;
    private String content;
    private Integer rating;
    private LocalDateTime createdAt;
    private UserDTO user;
}
