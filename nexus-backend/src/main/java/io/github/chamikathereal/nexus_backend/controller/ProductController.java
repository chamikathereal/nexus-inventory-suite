package io.github.chamikathereal.nexus_backend.controller;

import io.github.chamikathereal.nexus_backend.entity.Product;
import io.github.chamikathereal.nexus_backend.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000") // Allow Next.js to access this
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllProducts() {
        // We wrap the product with its calculated priority
        List<Map<String, Object>> response = service.getAllProducts().stream().map(product -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", product.getId());
            map.put("name", product.getName());
            map.put("category", product.getCategory());
            map.put("price", product.getPrice());
            map.put("quantity", product.getQuantity());
            map.put("status", product.getStatus());
            // Injecting the calculated priority
            map.put("priority", service.calculatePriority(product));
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return service.saveProduct(product);
    }

    @GetMapping("/stats")
    public List<Map<String, Object>> getStats() {
        return service.getCategoryStats();
    }
}
