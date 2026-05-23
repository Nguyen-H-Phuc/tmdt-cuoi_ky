package com.nhom5.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserDTO {
    private Integer userId;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String avatar;
    private String bio;
    private Boolean isActive;
    private LocalDateTime createdAt;
    // can add more fields like active status, years joined, post count later if needed
}
