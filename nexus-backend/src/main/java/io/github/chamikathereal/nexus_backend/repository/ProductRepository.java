package io.github.chamikathereal.nexus_backend.repository;

import io.github.chamikathereal.nexus_backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Custom query for the "Summarization" requirement [cite: 16]
    // Returns: Category Name -> Count
    @Query("SELECT p.category as category, COUNT(p) as count FROM Product p GROUP BY p.category")
    List<Map<String, Object>> countProductsByCategory();
}
