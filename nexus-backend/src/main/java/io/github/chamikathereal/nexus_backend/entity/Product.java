package io.github.chamikathereal.nexus_backend.entity;

import io.github.chamikathereal.nexus_backend.enums.ProductStatus;
import jakarta.persistence.*;
import lombok.Data; // Using Lombok for cleaner code

@Entity
@Data
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category; // e.g., Electronics, Accessories

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer quantity;

    @Enumerated(EnumType.STRING) // Stores "IN_STOCK" as text in DB
    @Column(nullable = false)
    private ProductStatus status;

    // This field is calculated, not stored, or updated via logic?
    // The PDF asks for a function to calculate it. We can make it a transient field
    // or compute it in the DTO. Let's compute it in the Service to keep DB clean.
}
