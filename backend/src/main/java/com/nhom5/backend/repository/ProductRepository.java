package com.nhom5.backend.repository;

import com.nhom5.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Sort;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Query("SELECT p FROM Product p WHERE p.approvalStatus = 'approved' AND p.isDeleted = false AND p.isHidden = false " +
           "AND (:location IS NULL OR :location = 'Toàn quốc' OR LOWER(p.seller.address) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "AND (:categoryId IS NULL OR p.category.categoryId = :categoryId) " +
           "AND (:priceMin IS NULL OR p.price >= :priceMin) " +
           "AND (:priceMax IS NULL OR p.price <= :priceMax) " +
           "AND (:status IS NULL OR :status = '' OR p.status = :status)")
    List<Product> filterProducts(
            @Param("location") String location,
            @Param("categoryId") Integer categoryId,
            @Param("priceMin") Double priceMin,
            @Param("priceMax") Double priceMax,
            @Param("status") String status,
            Sort sort
    );
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

    List<Product> findBySeller_UserIdAndApprovalStatusAndIsDeletedFalseAndIsHiddenFalseOrderByCreatedAtDesc(Integer userId, String approvalStatus);

    // 5. Lấy tất cả bài đăng chưa xóa cho admin
    List<Product> findByIsDeletedFalseOrderByCreatedAtDesc();

    long countByStatusAndApprovalStatusAndIsDeletedFalseAndIsHiddenFalse(String status, String approvalStatus);

    long countByApprovalStatusAndIsDeletedFalse(String approvalStatus);

    @Modifying
    @Query("UPDATE Product p SET p.viewCount = p.viewCount + 1 WHERE p.productId = :id")
    void incrementViewCount(@Param("id") Integer id);
}
