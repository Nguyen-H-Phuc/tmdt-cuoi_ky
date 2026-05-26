package com.nhom5.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ConversationDTO {
    private Integer conversationId;
    private UserDTO userOne;
    private UserDTO userTwo;
    private ProductDTO product;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastMessageAt;
    
    // Thuộc tính phụ trợ để UI frontend dễ hiển thị hơn
    private UserDTO otherUser; 
}
