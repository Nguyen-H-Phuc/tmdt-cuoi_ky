package com.nhom5.backend.controller;

import com.nhom5.backend.dto.AdminDashboardStats;
import com.nhom5.backend.dto.DailyRevenue;
import com.nhom5.backend.repository.OrderRepository;
import com.nhom5.backend.repository.ProductRepository;
import com.nhom5.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow access from anywhere for easy deployment
public class StatisticController {
    
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @GetMapping("/revenue")
    public ResponseEntity<List<DailyRevenue>> getRevenueChart(@RequestParam Long sellerId) {
        List<DailyRevenue> chartData = orderRepository.getDailyRevenueBySeller(sellerId);
        return ResponseEntity.ok(chartData);
    }

    @GetMapping("/admin")
    public ResponseEntity<AdminDashboardStats> getAdminDashboardStats() {
        Double totalRevenue = orderRepository.getTotalRevenue();
        long activeProducts = productRepository.countByStatusAndApprovalStatusAndIsDeletedFalseAndIsHiddenFalse("available", "approved");
        long pendingProducts = productRepository.countByApprovalStatusAndIsDeletedFalse("pending");
        long totalUsers = userRepository.count();

        AdminDashboardStats stats = new AdminDashboardStats(totalRevenue, activeProducts, pendingProducts, totalUsers);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/admin/revenue")
    public ResponseEntity<List<DailyRevenue>> getAdminRevenueChart() {
        List<DailyRevenue> chartData = orderRepository.getOverallDailyRevenue();
        return ResponseEntity.ok(chartData);
    }
}