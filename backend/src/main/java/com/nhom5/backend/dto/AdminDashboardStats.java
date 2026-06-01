package com.nhom5.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardStats {
    private Double totalRevenue;
    private Long activeProducts;
    private Long pendingProducts;
    private Long totalUsers;
}
