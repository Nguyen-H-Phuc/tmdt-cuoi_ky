package com.nhom5.backend.repository;

import com.nhom5.backend.entity.SocialAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SocialAccountRepository extends JpaRepository<SocialAccount, Integer> {
    Optional<SocialAccount> findByProviderAndProviderId(SocialAccount.Provider provider, String providerId);
}
