package com.nhom5.backend.repository;

import com.nhom5.backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Integer> {
    List<Message> findByConversation_ConversationIdOrderBySentAtAsc(Integer conversationId);
}
