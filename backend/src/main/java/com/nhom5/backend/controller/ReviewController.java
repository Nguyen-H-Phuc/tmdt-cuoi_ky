package com.nhom5.backend.controller;

import com.nhom5.backend.dto.ReviewDTO;
import com.nhom5.backend.dto.UserDTO;
import com.nhom5.backend.entity.Product;
import com.nhom5.backend.entity.Review;
import com.nhom5.backend.entity.User;
import com.nhom5.backend.entity.Order;
import com.nhom5.backend.repository.ProductRepository;
import com.nhom5.backend.repository.ReviewRepository;
import com.nhom5.backend.repository.UserRepository;
import com.nhom5.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    private ReviewDTO convertToReviewDTO(Review review) {
        if (review == null) return null;
        ReviewDTO dto = new ReviewDTO();
        dto.setReviewId(review.getReviewId());
        dto.setContent(review.getComment());
        dto.setRating(review.getRating());
        dto.setCreatedAt(review.getCreatedAt());
        
        User user = review.getReviewer();
        if (user != null) {
            UserDTO userDTO = new UserDTO();
            userDTO.setUserId(user.getUserId());
            userDTO.setFullName(user.getFullName());
            userDTO.setAvatar(user.getAvatar());
            dto.setUser(userDTO);
        }
        return dto;
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDTO>> getProductReviews(@PathVariable Integer productId) {
        List<Review> reviews = reviewRepository.findByProduct_ProductId(productId);
        List<ReviewDTO> dtos = reviews.stream()
                .map(this::convertToReviewDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/eligibility")
    public ResponseEntity<?> checkReviewEligibility(@RequestParam Integer productId, @RequestParam Integer userId) {
        List<Order> orders = orderRepository.findCompletedOrdersByBuyerAndProduct(userId, productId);
        if (orders == null || orders.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                "eligible", false,
                "message", "Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua sản phẩm này thành công."
            ));
        }

        boolean withinSevenDays = false;
        LocalDateTime deadline = null;
        for (Order order : orders) {
            LocalDateTime baseDate = order.getStatusDate() != null ? order.getStatusDate() : order.getOrderDate();
            if (baseDate != null && baseDate.plusDays(7).isAfter(LocalDateTime.now())) {
                withinSevenDays = true;
                LocalDateTime orderDeadline = baseDate.plusDays(7);
                if (deadline == null || orderDeadline.isAfter(deadline)) {
                    deadline = orderDeadline;
                }
            }
        }

        if (!withinSevenDays) {
            return ResponseEntity.ok(Map.of(
                "eligible", false,
                "message", "Thời hạn đánh giá sản phẩm (7 ngày sau khi đơn hàng thành công) đã hết."
            ));
        }

        Optional<Review> existingReviewOpt = reviewRepository.findByProduct_ProductIdAndReviewer_UserId(productId, userId);
        if (existingReviewOpt.isPresent()) {
            Review review = existingReviewOpt.get();
            int editCount = review.getEditCount() != null ? review.getEditCount() : 0;
            if (editCount >= 2) {
                return ResponseEntity.ok(Map.of(
                    "eligible", false,
                    "message", "Bạn đã chỉnh sửa đánh giá này tối đa 2 lần. Không thể chỉnh sửa thêm.",
                    "review", convertToReviewDTO(review),
                    "editCount", editCount,
                    "remainingEdits", 0,
                    "deadline", deadline
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                    "eligible", true,
                    "message", "Bạn có thể cập nhật đánh giá của mình.",
                    "review", convertToReviewDTO(review),
                    "editCount", editCount,
                    "remainingEdits", 2 - editCount,
                    "deadline", deadline
                ));
            }
        }

        return ResponseEntity.ok(Map.of(
            "eligible", true,
            "message", "Bạn có thể viết đánh giá mới.",
            "editCount", 0,
            "remainingEdits", 2,
            "deadline", deadline
        ));
    }

    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody Map<String, Object> request) {
        Integer userId = (Integer) request.get("userId");
        Integer productId = (Integer) request.get("productId");
        String content = (String) request.get("content");
        
        if (userId == null || productId == null || content == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "userId, productId và content là bắt buộc."));
        }

        // Verify eligibility again at backend
        List<Order> orders = orderRepository.findCompletedOrdersByBuyerAndProduct(userId, productId);
        if (orders == null || orders.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua sản phẩm này thành công."));
        }

        boolean withinSevenDays = false;
        for (Order order : orders) {
            LocalDateTime baseDate = order.getStatusDate() != null ? order.getStatusDate() : order.getOrderDate();
            if (baseDate != null && baseDate.plusDays(7).isAfter(LocalDateTime.now())) {
                withinSevenDays = true;
                break;
            }
        }

        if (!withinSevenDays) {
            return ResponseEntity.badRequest().body(Map.of("message", "Thời hạn đánh giá sản phẩm (7 ngày sau khi đơn hàng thành công) đã hết."));
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng."));
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm."));
        
        Optional<Review> existingReviewOpt = reviewRepository.findByProduct_ProductIdAndReviewer_UserId(productId, userId);
        Review review;
        
        if (existingReviewOpt.isPresent()) {
            review = existingReviewOpt.get();
            int editCount = review.getEditCount() != null ? review.getEditCount() : 0;
            if (editCount >= 2) {
                return ResponseEntity.badRequest().body(Map.of("message", "Bạn đã chỉnh sửa đánh giá này tối đa 2 lần. Không thể chỉnh sửa thêm."));
            }
            review.setEditCount(editCount + 1);
            review.setComment(content);
            review.setCreatedAt(LocalDateTime.now()); // Cập nhật thời gian chỉnh sửa
        } else {
            review = new Review();
            review.setReviewer(user);
            review.setProduct(product);
            review.setComment(content);
            review.setEditCount(0);
            review.setCreatedAt(LocalDateTime.now());
        }
        
        Integer rating = 5;
        if (request.get("rating") != null) {
            try {
                rating = Integer.parseInt(request.get("rating").toString());
            } catch (NumberFormatException e) {
                // Keep default 5
            }
        }
        review.setRating(rating);
        
        reviewRepository.save(review);
        
        return ResponseEntity.ok(Map.of("message", "Đã lưu đánh giá thành công."));
    }
}
