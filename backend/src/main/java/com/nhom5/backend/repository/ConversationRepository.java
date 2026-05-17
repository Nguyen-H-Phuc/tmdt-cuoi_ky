package com.nhom5.backend.repository;

import com.nhom5.backend.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Integer> {
    @Query("SELECT c FROM Conversation c WHERE (c.userOne.userId = :u1 AND c.userTwo.userId = :u2) OR (c.userOne.userId = :u2 AND c.userTwo.userId = :u1)")
    Optional<Conversation> findConversationBetweenUsers(@Param("u1") Integer u1, @Param("u2") Integer u2);
}
