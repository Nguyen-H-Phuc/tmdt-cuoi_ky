package com.nhom5.backend.repository;

import com.nhom5.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    // Lấy tất cả sản phẩm đã duyệt và chưa bị ẩn/xóa
    List<Product> findByApprovalStatusAndIsDeletedFalseAndIsHiddenFalse(String approvalStatus);

    // 1. Sản phẩm mới nhất (Sắp xếp theo ngày tạo giảm dần, lấy 10 cái, chưa bị ẩn)
    List<Product> findTop10ByApprovalStatusAndIsDeletedFalseAndIsHiddenFalseOrderByCreatedAtDesc(String approvalStatus);

    // 2. Sản phẩm xem nhiều nhất (Sắp xếp theo view_count giảm dần, lấy 10 cái, chưa bị ẩn)
    List<Product> findTop10ByApprovalStatusAndIsDeletedFalseAndIsHiddenFalseOrderByViewCountDesc(String approvalStatus);

    // 3. Sản phẩm bán chạy (Join với order_details tính tổng số lượng mua, chưa bị ẩn)
    @Query(value = "SELECT p.* FROM products p " +
            "LEFT JOIN order_details od ON p.product_id = od.product_id " +
            "WHERE p.approval_status = 'approved' AND p.is_deleted = FALSE AND p.is_hidden = FALSE " +
            "GROUP BY p.product_id " +
            "ORDER BY SUM(COALESCE(od.quantity, 0)) DESC " +
            "LIMIT 10", nativeQuery = true)
    List<Product> findTop10BestSelling();

    // 4. Lấy tất cả bài đăng chưa xóa của một người bán
    List<Product> findBySellerUserIdAndIsDeletedFalseOrderByCreatedAtDesc(Integer userId);

    @Modifying
    @Query("UPDATE Product p SET p.viewCount = p.viewCount + 1 WHERE p.productId = :id")
    void incrementViewCount(@Param("id") Integer id);
}
