package com.nhom5.backend.repository;

import com.nhom5.backend.dto.DailyRevenue;
import com.nhom5.backend.dto.RevenueByCategory;
import com.nhom5.backend.dto.RevenueByPeriod;
import com.nhom5.backend.entity.Order;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    Optional<Order> findByOrderCode(String orderCode);

    List<Order> findByBuyer_UserIdOrderByOrderDateDesc(Integer buyerId);

    List<Order> findBySeller_UserIdOrderByOrderDateDesc(Integer sellerId);

    List<Order> findAllByOrderByOrderDateDesc();

    @Query(value = "SELECT DATE(order_date) as date, SUM(total_price) as revenue " +
            "FROM orders " +
            "WHERE seller_id = :sellerId AND status = 'COMPLETED' " +
            "GROUP BY DATE(order_date) " +
            "ORDER BY date ASC", nativeQuery = true)
    List<DailyRevenue> getDailyRevenueBySeller(@Param("sellerId") Long sellerId);

    @Query("SELECT o FROM Order o JOIN OrderDetail od ON o.orderId = od.order.orderId " +
           "WHERE o.buyer.userId = :userId AND od.product.productId = :productId AND o.status = 'COMPLETED'")
    List<Order> findCompletedOrdersByBuyerAndProduct(@Param("userId") Integer userId, @Param("productId") Integer productId);

    @Query(value = "SELECT DATE(o.status_date) as date, SUM(o.total_price) as revenue " +
            "FROM orders o " +
            "WHERE o.seller_id = :sellerId " +
            "  AND o.status = 'COMPLETED' " +
            "  AND o.status_date BETWEEN :startDate AND :endDate " +
            "GROUP BY DATE(o.status_date) " +
            "ORDER BY date ASC", nativeQuery = true)
    List<RevenueByPeriod> getRevenueByPeriod(
            @Param("sellerId") Integer sellerId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query(value = "SELECT c.category_name as categoryName, SUM(od.quantity * od.unit_price) as revenue " +
            "FROM orders o " +
            "JOIN order_details od ON o.order_id = od.order_id " +
            "JOIN products p ON od.product_id = p.product_id " +
            "JOIN categories c ON p.category_id = c.category_id " +
            "WHERE o.seller_id = :sellerId " +
            "  AND o.status = 'COMPLETED' " +
            "  AND (:year = 0 OR YEAR(o.status_date) = :year) " +
            "  AND (:month = 0 OR MONTH(o.status_date) = :month) " +
            "GROUP BY c.category_id, c.category_name " +
            "ORDER BY revenue DESC", nativeQuery = true)
    List<RevenueByCategory> getRevenueByCategoryInMonth(
            @Param("sellerId") Integer sellerId,
            @Param("year") int year,
            @Param("month") int month
    );
}