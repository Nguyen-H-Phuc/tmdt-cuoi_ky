package com.nhom5.backend.controller;

import com.nhom5.backend.dto.DailyRevenue;
import com.nhom5.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor

// Cho phép frontend ở cổng 5173 hoặc 3000 gọi API không bị chặn
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class StatisticController {
    private final OrderRepository orderRepository;
    @GetMapping("/revenue")
    public ResponseEntity<List<DailyRevenue>> getRevenueChart(@RequestParam Long sellerId) {
        List<DailyRevenue> chartData = orderRepository.getDailyRevenueBySeller(sellerId);
        return ResponseEntity.ok(chartData);

    }

}