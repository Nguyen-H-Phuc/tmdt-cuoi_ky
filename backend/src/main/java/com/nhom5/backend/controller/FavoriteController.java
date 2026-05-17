package com.nhom5.backend.controller;

import com.nhom5.backend.entity.Favorite;
import com.nhom5.backend.entity.Product;
import com.nhom5.backend.entity.User;
import com.nhom5.backend.repository.FavoriteRepository;
import com.nhom5.backend.repository.ProductRepository;
import com.nhom5.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*")
public class FavoriteController {

    @Autowired
    private FavoriteRepository favoriteRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;

    @PostMapping
    public ResponseEntity<?> toggleFavorite(@RequestBody Map<String, Integer> request) {
        Integer userId = request.get("userId"); // In real app, get from JWT token
        Integer productId = request.get("productId");

        if (userId == null || productId == null) {
            return ResponseEntity.badRequest().body("userId and productId are required");
        }

        Optional<Favorite> existingFav = favoriteRepository.findByUser_UserIdAndProduct_ProductId(userId, productId);
        if (existingFav.isPresent()) {
            favoriteRepository.delete(existingFav.get());
            return ResponseEntity.ok(Map.of("message", "Removed from favorites", "isFavorite", false));
        } else {
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
            
            Favorite favorite = new Favorite();
            favorite.setUser(user);
            favorite.setProduct(product);
            favoriteRepository.save(favorite);
            
            return ResponseEntity.ok(Map.of("message", "Added to favorites", "isFavorite", true));
        }
    }
}
