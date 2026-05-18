package com.nhom5.backend.controller;

import com.nhom5.backend.dto.ConversationDTO;
import com.nhom5.backend.dto.MessageDTO;
import com.nhom5.backend.dto.ProductDTO;
import com.nhom5.backend.dto.UserDTO;
import com.nhom5.backend.entity.Conversation;
import com.nhom5.backend.entity.Message;
import com.nhom5.backend.entity.Product;
import com.nhom5.backend.entity.User;
import com.nhom5.backend.repository.ConversationRepository;
import com.nhom5.backend.repository.MessageRepository;
import com.nhom5.backend.repository.ProductRepository;
import com.nhom5.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@Transactional
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConversationRepository conversationRepository;
    
    @Autowired
    private ProductRepository productRepository;

    // ----- REST APIs for Chat History -----
    
    @GetMapping("/api/chat/conversations/{userId}")
    public ResponseEntity<List<ConversationDTO>> getUserConversations(@PathVariable Integer userId) {
        List<Conversation> conversations = conversationRepository.findByUserId(userId);
        
        List<ConversationDTO> dtos = conversations.stream().map(c -> {
            ConversationDTO dto = new ConversationDTO();
            dto.setConversationId(c.getConversationId());
            dto.setUserOne(mapToUserDTO(c.getUserOne()));
            dto.setUserTwo(mapToUserDTO(c.getUserTwo()));
            dto.setCreatedAt(c.getCreatedAt());
            dto.setUpdatedAt(c.getUpdatedAt());
            dto.setLastMessageAt(c.getLastMessageAt());
            
            // Map product
            if (c.getProduct() != null) {
                ProductDTO pDto = new ProductDTO();
                pDto.setProductId(c.getProduct().getProductId());
                pDto.setTitle(c.getProduct().getTitle());
                if (c.getProduct().getPrice() != null) {
                    pDto.setPrice(c.getProduct().getPrice().doubleValue());
                }
                if (c.getProduct().getImageUrl() != null) {
                    pDto.setImages(java.util.Collections.singletonList(c.getProduct().getImageUrl()));
                }
                dto.setProduct(pDto);
            }
            
            // Set other user for frontend convenience
            if (c.getUserOne().getUserId().equals(userId)) {
                dto.setOtherUser(mapToUserDTO(c.getUserTwo()));
            } else {
                dto.setOtherUser(mapToUserDTO(c.getUserOne()));
            }
            
            return dto;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/api/chat/messages/{conversationId}")
    public ResponseEntity<List<MessageDTO>> getMessages(@PathVariable Integer conversationId) {
        List<Message> messages = messageRepository.findByConversation_ConversationIdOrderBySentAtAsc(conversationId);
        
        List<MessageDTO> dtos = messages.stream().map(m -> {
            MessageDTO dto = new MessageDTO();
            dto.setMessageId(m.getMessageId());
            dto.setConversationId(m.getConversation().getConversationId());
            dto.setSender(mapToUserDTO(m.getSender()));
            dto.setMessageText(m.getMessageText());
            dto.setIsRead(m.getIsRead());
            dto.setSentAt(m.getSentAt());
            return dto;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }
    
    // Helper mapper
    private UserDTO mapToUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setFullName(user.getFullName());
        dto.setAvatar(user.getAvatar());
        dto.setRole(user.getRole() != null ? user.getRole().name() : null);
        return dto;
    }

    // ----- WEBSOCKET -----

    private Integer parseInteger(Object obj) {
        if (obj == null) return null;
        try {
            // handle cases where JS sends 1.0 (double) or string
            return Double.valueOf(obj.toString()).intValue();
        } catch (Exception e) {
            return null;
        }
    }

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload Map<String, Object> chatMessage) {
        Integer senderId = parseInteger(chatMessage.get("senderId"));
        Integer receiverId = parseInteger(chatMessage.get("receiverId"));
        String content = chatMessage.get("content") != null ? chatMessage.get("content").toString() : null;
        Integer productId = parseInteger(chatMessage.get("productId")); // Support initial product context

        if (senderId != null && receiverId != null && content != null) {
            User sender = userRepository.findById(senderId).orElse(null);
            User receiver = userRepository.findById(receiverId).orElse(null);

            if (sender != null && receiver != null) {
                // Find conversation between two users with specific product or general (null)
                Conversation conversation = conversationRepository.findConversationBetweenUsersAndProduct(senderId, receiverId, productId)
                        .orElseGet(() -> {
                            Conversation newConv = new Conversation();
                            newConv.setUserOne(sender);
                            newConv.setUserTwo(receiver);
                            newConv.setCreatedAt(LocalDateTime.now());
                            if (productId != null) {
                                Product product = productRepository.findById(productId).orElse(null);
                                newConv.setProduct(product);
                            }
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

                // Add useful fields to payload for receivers to render seamlessly
                chatMessage.put("conversationId", conversation.getConversationId());
                chatMessage.put("sentAt", savedMessage.getSentAt().toString());
                
                // Send to receiver
                messagingTemplate.convertAndSendToUser(
                        String.valueOf(receiverId), "/queue/messages", chatMessage
                );
            }
        }
    }
}
