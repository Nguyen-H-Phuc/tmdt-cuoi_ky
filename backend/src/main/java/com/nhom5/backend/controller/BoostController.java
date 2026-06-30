package com.nhom5.backend.controller;

import com.nhom5.backend.entity.BoostTransaction;
import com.nhom5.backend.service.BoostService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/boosts")
@CrossOrigin(origins = "*")
public class BoostController {

    @Autowired
    private BoostService boostService;

    @GetMapping("/payment-url")
    public ResponseEntity<Map<String, String>> getBoostPaymentUrl(
            @RequestParam("productId") Integer productId,
            @RequestParam("packageName") String packageName,
            HttpServletRequest request) {
        String paymentUrl = boostService.createBoostPaymentUrl(productId, packageName, request);
        Map<String, String> response = new HashMap<>();
        response.put("paymentUrl", paymentUrl);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<Map<String, Object>>> getTransactions() {
        List<BoostTransaction> txs = boostService.getAllBoostTransactions();
        List<Map<String, Object>> response = txs.stream().map(tx -> {
            Map<String, Object> map = new HashMap<>();
            map.put("transactionId", tx.getTransactionId());
            map.put("sellerName", tx.getUser() != null ? tx.getUser().getFullName() : "N/A");
            map.put("productTitle", tx.getProduct() != null ? tx.getProduct().getTitle() : "N/A");
            map.put("packageName", tx.getPackageName());
            map.put("amount", tx.getAmount());
            map.put("paymentMethod", tx.getPaymentMethod());
            map.put("status", tx.getStatus());
            map.put("createdAt", tx.getCreatedAt());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Map<String, Object>>> getUserTransactions(@RequestParam("userId") Integer userId) {
        List<BoostTransaction> txs = boostService.getBoostTransactionsByUser(userId);
        List<Map<String, Object>> response = txs.stream().map(tx -> {
            Map<String, Object> map = new HashMap<>();
            map.put("transactionId", tx.getTransactionId());
            map.put("productTitle", tx.getProduct() != null ? tx.getProduct().getTitle() : "N/A");
            map.put("packageName", tx.getPackageName());
            map.put("amount", tx.getAmount());
            map.put("paymentMethod", tx.getPaymentMethod());
            map.put("status", tx.getStatus());
            map.put("createdAt", tx.getCreatedAt());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}
