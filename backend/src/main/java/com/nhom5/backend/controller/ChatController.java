package com.nhom5.backend.controller;

import com.nhom5.backend.entity.Message;
import com.nhom5.backend.entity.User;
import com.nhom5.backend.repository.MessageRepository;
import com.nhom5.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;

@RestController
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.nhom5.backend.repository.ConversationRepository conversationRepository;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload Map<String, Object> chatMessage) {
        Integer senderId = (Integer) chatMessage.get("senderId");
        Integer receiverId = (Integer) chatMessage.get("receiverId");
        String content = (String) chatMessage.get("content");

        if (senderId != null && receiverId != null && content != null) {
            User sender = userRepository.findById(senderId).orElse(null);
            User receiver = userRepository.findById(receiverId).orElse(null);

            if (sender != null && receiver != null) {
                // Find or create conversation
                com.nhom5.backend.entity.Conversation conversation = conversationRepository.findConversationBetweenUsers(senderId, receiverId)
                        .orElseGet(() -> {
                            com.nhom5.backend.entity.Conversation newConv = new com.nhom5.backend.entity.Conversation();
                            newConv.setUserOne(sender);
                            newConv.setUserTwo(receiver);
                            newConv.setCreatedAt(LocalDateTime.now());
                            return conversationRepository.save(newConv);
                        });
                        
                conversation.setLastMessageAt(LocalDateTime.now());
                conversationRepository.save(conversation);

                Message message = new Message();
                message.setConversation(conversation);
                message.setSender(sender);
                message.setMessageText(content);
                message.setSentAt(LocalDateTime.now());
                message.setIsRead(false);

                Message savedMessage = messageRepository.save(message);

                // Send to receiver
                messagingTemplate.convertAndSend(
                        "/queue/messages/" + receiverId, (Object) chatMessage
                );
            }
        }
    }

    @GetMapping("/api/chat/messages/{user1Id}/{user2Id}")
    public ResponseEntity<List<Map<String, Object>>> getMessages(@PathVariable Integer user1Id, @PathVariable Integer user2Id) {
        List<Map<String, Object>> result = new ArrayList<>();
        conversationRepository.findConversationBetweenUsers(user1Id, user2Id).ifPresent(conversation -> {
            List<Message> messages = messageRepository.findByConversationOrderBySentAtAsc(conversation);
            for (Message msg : messages) {
                Map<String, Object> map = new HashMap<>();
                map.put("senderId", msg.getSender().getUserId());
                map.put("content", msg.getMessageText());
                map.put("sentAt", msg.getSentAt());
                result.add(map);
            }
        });
        return ResponseEntity.ok(result);
    }

    @GetMapping("/api/chat/conversations/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getConversations(@PathVariable Integer userId) {
        List<com.nhom5.backend.entity.Conversation> conversations = conversationRepository.findConversationsByUserId(userId);
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (com.nhom5.backend.entity.Conversation conv : conversations) {
            Map<String, Object> map = new HashMap<>();
            map.put("conversationId", conv.getConversationId());
            map.put("lastMessageAt", conv.getLastMessageAt());
            
            // Determine other user
            User otherUser = conv.getUserOne().getUserId().equals(userId) ? conv.getUserTwo() : conv.getUserOne();
            
            Map<String, Object> otherUserMap = new HashMap<>();
            otherUserMap.put("userId", otherUser.getUserId());
            otherUserMap.put("fullName", otherUser.getFullName());
            otherUserMap.put("avatar", otherUser.getAvatar());
            map.put("otherUser", otherUserMap);
            
            // Product info if exists
            if (conv.getProduct() != null) {
                Map<String, Object> productMap = new HashMap<>();
                productMap.put("productId", conv.getProduct().getProductId());
                productMap.put("title", conv.getProduct().getTitle());
                productMap.put("price", conv.getProduct().getPrice());
                map.put("product", productMap);
            }
            
            // Last message snippet
            List<Message> messages = messageRepository.findByConversationOrderBySentAtAsc(conv);
            if (!messages.isEmpty()) {
                Message lastMsg = messages.get(messages.size() - 1);
                map.put("lastMessageSnippet", lastMsg.getMessageText());
            } else {
                map.put("lastMessageSnippet", "");
            }
            
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }
}
