package com.nhom5.backend.repository;

import com.nhom5.backend.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Integer> {
    List<Favorite> findByUser_UserId(Integer userId);
    Optional<Favorite> findByUser_UserIdAndProduct_ProductId(Integer userId, Integer productId);
}
