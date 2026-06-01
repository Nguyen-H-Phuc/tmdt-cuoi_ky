package com.nhom5.backend.controller;

import com.nhom5.backend.dto.OrderRequest;
import com.nhom5.backend.dto.OrderResponse;
import com.nhom5.backend.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest request, HttpServletRequest httpRequest) {
        try {
            OrderResponse response = orderService.createOrder(request, httpRequest);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Đã xảy ra lỗi hệ thống: " + e.getMessage()));
        }
    }

    @GetMapping("/code/{orderCode}")
    public ResponseEntity<?> getOrderByCode(@PathVariable String orderCode) {
        try {
            OrderResponse response = orderService.getOrderByCode(orderCode);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/vnpay-callback")
    public void vnpayCallback(@RequestParam Map<String, String> params, HttpServletResponse response) throws IOException {
        String redirectUrl = orderService.processVNPayCallback(params);
        response.sendRedirect(redirectUrl);
    }

    @GetMapping("/buyer")
    public ResponseEntity<?> getOrdersByBuyer(@RequestParam Integer buyerId) {
        try {
            return ResponseEntity.ok(orderService.getOrdersByBuyer(buyerId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Integer orderId, @RequestParam Integer userId) {
        try {
            OrderResponse response = orderService.cancelOrder(orderId, userId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/seller")
    public ResponseEntity<?> getOrdersBySeller(@RequestParam Integer sellerId) {
        try {
            return ResponseEntity.ok(orderService.getOrdersBySeller(sellerId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{orderId}/accept")
    public ResponseEntity<?> acceptOrder(@PathVariable Integer orderId, @RequestParam Integer sellerId) {
        try {
            OrderResponse response = orderService.acceptOrder(orderId, sellerId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{orderId}/reject")
    public ResponseEntity<?> rejectOrder(@PathVariable Integer orderId, @RequestParam Integer sellerId) {
        try {
            OrderResponse response = orderService.rejectOrder(orderId, sellerId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", e.getMessage()));
        }
    }

    // 9. Admin lấy tất cả đơn hàng
    @GetMapping("/admin")
    public ResponseEntity<?> getAllOrdersForAdmin() {
        try {
            return ResponseEntity.ok(orderService.getAllOrdersForAdmin());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", e.getMessage()));
        }
    }

    // 10. Admin hủy cưỡng chế đơn hàng
    @PutMapping("/{orderId}/force-cancel")
    public ResponseEntity<?> forceCancelOrder(@PathVariable Integer orderId) {
        try {
            OrderResponse response = orderService.forceCancelOrder(orderId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", e.getMessage()));
        }
    }
}
