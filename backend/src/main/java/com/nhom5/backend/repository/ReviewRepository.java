package com.nhom5.backend.repository;

import com.nhom5.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByProduct_ProductId(Integer productId);
}
