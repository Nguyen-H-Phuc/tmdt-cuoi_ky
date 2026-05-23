package com.nhom5.backend.controller;

import com.nhom5.backend.dto.RevenueByCategory;
import com.nhom5.backend.dto.RevenueByPeriod;
import com.nhom5.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/store/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class StoreReportController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/revenue-period")
    public ResponseEntity<List<RevenueByPeriod>> getRevenuePeriod(
            @RequestParam Integer sellerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);
        
        List<RevenueByPeriod> data = orderRepository.getRevenueByPeriod(sellerId, start, end);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/revenue-category")
    public ResponseEntity<List<RevenueByCategory>> getRevenueCategory(
            @RequestParam Integer sellerId,
            @RequestParam int year,
            @RequestParam int month) {
        
        List<RevenueByCategory> data = orderRepository.getRevenueByCategoryInMonth(sellerId, year, month);
        return ResponseEntity.ok(data);
    }
}
