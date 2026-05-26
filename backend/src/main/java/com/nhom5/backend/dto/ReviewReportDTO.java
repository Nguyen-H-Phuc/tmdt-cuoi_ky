package com.nhom5.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewReportDTO {
    private Integer reportId;
    private Integer reviewId;
    private String reviewComment;
    private Integer reviewRating;
    private String reviewerName;
    private String reporterName;
    private String reason;
    private String status;
    private LocalDateTime createdAt;
    private Integer productId;
    private String productTitle;
    private String proofImage;
    private String proofVideo;
}
