package io.github.chamikathereal.nexus_backend.service;

import io.github.chamikathereal.nexus_backend.entity.Product;
import io.github.chamikathereal.nexus_backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    public Product saveProduct(Product product) {
        // Auto-update status based on quantity (Business Logic)
        if (product.getQuantity() == 0) {
            // Keep DISCONTINUED if explicitly set, otherwise OUT_OF_STOCK
            if (product.getStatus() != io.github.chamikathereal.nexus_backend.enums.ProductStatus.DISCONTINUED) {
                product.setStatus(io.github.chamikathereal.nexus_backend.enums.ProductStatus.OUT_OF_STOCK);
            }
        } else if (product.getQuantity() < 10) {
            product.setStatus(io.github.chamikathereal.nexus_backend.enums.ProductStatus.LOW_STOCK);
        }
        return repository.save(product);
    }

    // THE PRIORITY LOGIC [cite: 14]
    // We don't store this in DB, we calculate it on the fly.
    public String calculatePriority(Product product) {
        if (product.getStatus() == io.github.chamikathereal.nexus_backend.enums.ProductStatus.DISCONTINUED) {
            return "NONE";
        }
        if (product.getQuantity() == 0) return "CRITICAL";
        if (product.getQuantity() < 10) return "HIGH";
        if (product.getQuantity() < 50) return "MEDIUM";
        return "LOW";
    }

    public List<Map<String, Object>> getCategoryStats() {
        return repository.countProductsByCategory();
    }
}