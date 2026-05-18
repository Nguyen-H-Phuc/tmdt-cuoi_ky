package com.nhom5.backend.repository;

import com.nhom5.backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Integer> {
    @org.springframework.data.jpa.repository.Query("SELECT m FROM Message m LEFT JOIN FETCH m.sender LEFT JOIN FETCH m.conversation c LEFT JOIN FETCH c.userOne LEFT JOIN FETCH c.userTwo WHERE m.conversation.conversationId = :conversationId ORDER BY m.sentAt ASC")
    List<Message> findByConversation_ConversationIdOrderBySentAtAsc(@org.springframework.data.repository.query.Param("conversationId") Integer conversationId);
}
