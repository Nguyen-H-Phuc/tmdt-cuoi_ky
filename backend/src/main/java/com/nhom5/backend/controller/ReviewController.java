package com.nhom5.backend.controller;

import com.nhom5.backend.dto.ReviewDTO;
import com.nhom5.backend.dto.UserDTO;
import com.nhom5.backend.entity.Product;
import com.nhom5.backend.entity.Review;
import com.nhom5.backend.entity.User;
import com.nhom5.backend.repository.ProductRepository;
import com.nhom5.backend.repository.ReviewRepository;
import com.nhom5.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
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

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDTO>> getProductReviews(@PathVariable Integer productId) {
        List<Review> reviews = reviewRepository.findByProduct_ProductId(productId);
        List<ReviewDTO> dtos = reviews.stream().map(review -> {
            ReviewDTO dto = new ReviewDTO();
            dto.setReviewId(review.getReviewId());
            dto.setContent(review.getComment());
            dto.setRating(review.getRating());
            dto.setCreatedAt(review.getCreatedAt());
            
            User user = review.getReviewer();
            UserDTO userDTO = new UserDTO();
            userDTO.setUserId(user.getUserId());
            userDTO.setFullName(user.getFullName());
            userDTO.setAvatar(user.getAvatar());
            dto.setUser(userDTO);
            
            return dto;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody Map<String, Object> request) {
        Integer userId = (Integer) request.get("userId"); // In real app, get from JWT token
        Integer productId = (Integer) request.get("productId");
        String content = (String) request.get("content");
        
        if (userId == null || productId == null || content == null) {
            return ResponseEntity.badRequest().body("userId, productId and content are required");
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
        
        Review review = new Review();
        review.setReviewer(user);
        review.setProduct(product);
        review.setComment(content);
        
        Integer rating = 5;
        if (request.get("rating") != null) {
            try {
                rating = Integer.parseInt(request.get("rating").toString());
            } catch (NumberFormatException e) {
                // Keep default 5
            }
        }
        review.setRating(rating);
        review.setCreatedAt(LocalDateTime.now());
        
        reviewRepository.save(review);
        
        return ResponseEntity.ok(Map.of("message", "Review added successfully"));
    }
}
