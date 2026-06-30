package com.nhom5.backend.repository;

import com.nhom5.backend.entity.BoostTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BoostTransactionRepository extends JpaRepository<BoostTransaction, String> {
    
    List<BoostTransaction> findAllByOrderByCreatedAtDesc();

    List<BoostTransaction> findByUserUserIdOrderByCreatedAtDesc(Integer userId);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM BoostTransaction t WHERE t.status = 'SUCCESS'")
    Double calculateTotalBoostRevenue();
}
