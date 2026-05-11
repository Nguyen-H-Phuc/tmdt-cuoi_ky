package com.nhom5.backend.controller;

import com.nhom5.backend.entity.Product;
import com.nhom5.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Integer id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/newest")
    public ResponseEntity<List<Product>> getNewestProducts() {
        return ResponseEntity.ok(productRepository.findTop10ByOrderByCreatedAtDesc());
    }

    @GetMapping("/most-viewed")
    public ResponseEntity<List<Product>> getMostViewedProducts() {
        return ResponseEntity.ok(productRepository.findTop10ByOrderByViewCountDesc());
    }

    @GetMapping("/best-selling")
    public ResponseEntity<List<Product>> getBestSellingProducts() {
        return ResponseEntity.ok(productRepository.findTop10BestSelling());
    }
}
