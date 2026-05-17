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
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    private User seller;

    @ManyToOne(fetch = FetchType.EAGER)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(precision = 10, scale = 2)
    private BigDecimal price = BigDecimal.ZERO;
    private Double price = 0.0;

    private String imageUrl;

    private Integer viewCount = 0;

    private String status = "available";
    @Enumerated(EnumType.STRING)
    private Status status = Status.available;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        available, sold
    }

    // Add logic for multiple images from another table if needed or just keep mapped relations.
    // The user's script doesn't have favorites or product_images, we'll retain them loosely.
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images;
}
