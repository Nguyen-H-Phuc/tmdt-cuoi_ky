package com.nhom5.backend.controller;

import com.nhom5.backend.entity.Product;
import com.nhom5.backend.repository.ProductRepository;
import com.nhom5.backend.dto.ProductDTO;
import com.nhom5.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Integer id) {
        ProductDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
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
