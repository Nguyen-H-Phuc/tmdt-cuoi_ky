package com.nhom5.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User seller;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Double price = 0.0;

    private String imageUrl;

    private Integer viewCount = 0;

    private String status = "available";

    private String approvalStatus = "pending";

    private Integer quantity = 1;

    private Boolean isDeleted = false;

    private Boolean isHidden = false;

    private String targetUniversity;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        available, sold
    }

    // Add logic for multiple images from another table if needed or just keep mapped relations.
    // The user's script doesn't have favorites or product_images, we'll retain them loosely.
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images;
}
