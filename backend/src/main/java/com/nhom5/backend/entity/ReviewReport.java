package com.nhom5.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "review_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Integer reportId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(name = "proof_image")
    private String proofImage;

    @Column(name = "proof_video")
    private String proofVideo;

    @Column(length = 50)
    private String status = "PENDING"; // PENDING, RESOLVED, REJECTED

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
