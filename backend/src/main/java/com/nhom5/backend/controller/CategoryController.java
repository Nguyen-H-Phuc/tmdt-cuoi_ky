package com.nhom5.backend.controller;

import com.nhom5.backend.dto.CategoryRequest;
import com.nhom5.backend.entity.Category;
import com.nhom5.backend.repository.CategoryRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin("*")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    // 2. Thêm danh mục mới
    @PostMapping
    public ResponseEntity<?> createCategory(@Valid @RequestBody CategoryRequest request) {
        Category category = new Category();
        category.setCategoryName(request.getCategoryName());
        category.setCategoryImage(request.getCategoryImage() != null ? request.getCategoryImage() : "default.png");
        Category saved = categoryRepository.save(category);
        return ResponseEntity.ok(saved);
    }

    // 3. Sửa danh mục
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(
            @PathVariable Integer id,
            @Valid @RequestBody CategoryRequest request) {
        Optional<Category> categoryOpt = categoryRepository.findById(id);
        if (categoryOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Danh mục không tồn tại"));
        }
        Category category = categoryOpt.get();
        category.setCategoryName(request.getCategoryName());
        if (request.getCategoryImage() != null) {
            category.setCategoryImage(request.getCategoryImage());
        }
        Category updated = categoryRepository.save(category);
        return ResponseEntity.ok(updated);
    }

    // 4. Xóa danh mục
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Integer id) {
        Optional<Category> categoryOpt = categoryRepository.findById(id);
        if (categoryOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Danh mục không tồn tại"));
        }
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Xóa danh mục thành công"));
    }
}
