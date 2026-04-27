package com.nhom5.backend.repository;

import com.nhom5.backend.entity.LocalAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocalAccountRepository extends JpaRepository<LocalAccount, Integer> {
}
