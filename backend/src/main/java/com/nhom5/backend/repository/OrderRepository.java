package com.nhom5.backend.repository;

import com.nhom5.backend.dto.DailyRevenue;
import com.nhom5.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderCode(String orderCode);

    @Query(value = "SELECT DATE(order_date) as date, SUM(total_price) as revenue " +
            "FROM orders " +
            "WHERE seller_id = :sellerId AND status = 'COMPLETED' " +
            "GROUP BY DATE(order_date) " +
            "ORDER BY date ASC", nativeQuery = true)
    List<DailyRevenue> getDailyRevenueBySeller(@Param("sellerId") Long sellerId);
}