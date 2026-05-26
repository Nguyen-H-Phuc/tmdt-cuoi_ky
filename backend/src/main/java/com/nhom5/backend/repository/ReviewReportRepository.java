package com.nhom5.backend.repository;

import com.nhom5.backend.entity.ReviewReport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ReviewReportRepository extends JpaRepository<ReviewReport, Integer> {
    Optional<ReviewReport> findByReview_ReviewId(Integer reviewId);
    boolean existsByReview_ReviewId(Integer reviewId);
}
