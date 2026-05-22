package com.nhom5.backend.repository;

import com.nhom5.backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByUser_UserId(Integer userId);
    Optional<CartItem> findByUser_UserIdAndProduct_ProductId(Integer userId, Integer productId);
    void deleteByUser_UserId(Integer userId);
}
