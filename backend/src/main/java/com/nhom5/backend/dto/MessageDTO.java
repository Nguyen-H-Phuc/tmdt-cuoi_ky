package com.nhom5.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MessageDTO {
    private Integer messageId;
    private Integer conversationId;
    private UserDTO sender;
    private String messageText;
    private Boolean isRead;
    private LocalDateTime sentAt;
}
