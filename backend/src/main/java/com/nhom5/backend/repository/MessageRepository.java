package com.nhom5.backend.repository;

import com.nhom5.backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import com.nhom5.backend.entity.Conversation;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Integer> {
    List<Message> findByConversationOrderBySentAtAsc(Conversation conversation);
}
