package com.shopprr.clothing_backend.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.shopprr.clothing_backend.dto.ApiResponse;
import com.shopprr.clothing_backend.dto.ProductListResponse;
import com.shopprr.clothing_backend.model.Product;
import com.shopprr.clothing_backend.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping("/list")
    public ResponseEntity<ProductListResponse> getAllProducts() {
        try {
            List<Product> products = productService.getAllProducts();
            return ResponseEntity.ok(new ProductListResponse(true, "Products fetched successfully", products));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ProductListResponse(false, "Error fetching products: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getProductById(@PathVariable String id) {
        try {
            return productService.getProductById(id)
                    .map(product -> ResponseEntity.ok(new ApiResponse(true, "Product found", product)))
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(new ApiResponse(false, "Product not found")));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error fetching product: " + e.getMessage()));
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ProductListResponse> getProductsByCategory(@PathVariable String category) {
        try {
            List<Product> products = productService.getProductsByCategory(category);
            return ResponseEntity.ok(new ProductListResponse(true, "Products fetched successfully", products));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ProductListResponse(false, "Error fetching products: " + e.getMessage()));
        }
    }

    @GetMapping("/popular")
    public ResponseEntity<ProductListResponse> getPopularProducts() {
        try {
            List<Product> products = productService.getPopularProducts();
            return ResponseEntity.ok(new ProductListResponse(true, "Popular products fetched successfully", products));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ProductListResponse(false, "Error fetching popular products: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createProduct(@RequestBody Product product) {
        try {
            Product createdProduct = productService.createProduct(product);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Product created successfully", createdProduct));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error creating product: " + e.getMessage()));
        }
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addProduct(
            @RequestParam("productData") String productDataJson,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {
        try {
            // Parse productData JSON to Product object
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            Product product = mapper.readValue(productDataJson, Product.class);
            
            // Convert images to Base64 and store in MongoDB
            if (images != null && !images.isEmpty()) {
                List<String> imageBase64List = new ArrayList<>();
                for (MultipartFile image : images) {
                    try {
                        byte[] bytes = image.getBytes();
                        String base64 = java.util.Base64.getEncoder().encodeToString(bytes);
                        String contentType = image.getContentType();
                        if (contentType == null || contentType.isEmpty()) {
                            contentType = "image/jpeg"; // default to jpeg
                        }
                        String dataUrl = "data:" + contentType + ";base64," + base64;
                        imageBase64List.add(dataUrl);
                    } catch (IOException e) {
                        System.err.println("Error processing image: " + e.getMessage());
                    }
                }
                product.setImage(imageBase64List);
            }
            
            Product createdProduct = productService.createProduct(product);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Product added successfully", createdProduct));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error adding product: " + e.getMessage()));
        }
    }

    @PostMapping("/remove")
    public ResponseEntity<ApiResponse> removeProduct(@RequestBody java.util.Map<String, String> payload) {
        try {
            String id = payload.get("id");
            productService.deleteProduct(id);
            return ResponseEntity.ok(new ApiResponse(true, "Product removed successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error removing product: " + e.getMessage()));
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<ApiResponse> deleteProduct(@RequestBody java.util.Map<String, String> payload) {
        try {
            String productId = payload.get("productId");
            if (productId == null || productId.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Product ID is required"));
            }
            productService.deleteProduct(productId);
            return ResponseEntity.ok(new ApiResponse(true, "Product deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error deleting product: " + e.getMessage()));
        }
    }

    @PostMapping("/update")
    public ResponseEntity<ApiResponse> updateProductPost(@RequestBody java.util.Map<String, Object> payload) {
        try {
            System.out.println("=== UPDATE REQUEST RECEIVED ===");
            System.out.println("Payload: " + payload);
            
            String productId = (String) payload.get("productId");
            System.out.println("Product ID: " + productId);
            
            if (productId == null || productId.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Product ID is required"));
            }
            
            // Remove productId from payload before converting to Product
            payload.remove("productId");
            
            // Convert payload to Product object
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            String productJson = mapper.writeValueAsString(payload);
            System.out.println("Product JSON: " + productJson);
            
            Product product = mapper.readValue(productJson, Product.class);
            System.out.println("Parsed Product: " + product);
            
            Product updatedProduct = productService.updateProduct(productId, product);
            System.out.println("Updated Product: " + updatedProduct);
            
            return ResponseEntity.ok(new ApiResponse(true, "Product updated successfully", updatedProduct));
        } catch (Exception e) {
            System.err.println("=== UPDATE ERROR ===");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error updating product: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateProduct(@PathVariable String id, @RequestBody Product product) {
        try {
            Product updatedProduct = productService.updateProduct(id, product);
            return ResponseEntity.ok(new ApiResponse(true, "Product updated successfully", updatedProduct));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error updating product: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteProduct(@PathVariable String id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(new ApiResponse(true, "Product deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error deleting product: " + e.getMessage()));
        }
    }

    @PostMapping("/apply-discount")
    public ResponseEntity<ApiResponse> applyDiscount(@RequestBody java.util.Map<String, Object> payload) {
        try {
            @SuppressWarnings("unchecked")
            List<String> productIds = (List<String>) payload.get("productIds");
            Double discountPercent = ((Number) payload.get("discountPercent")).doubleValue();
            String startDate = (String) payload.get("startDate");
            String endDate = (String) payload.get("endDate");
            
            if (productIds == null || productIds.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Product IDs are required"));
            }
            
            if (discountPercent == null || discountPercent <= 0 || discountPercent > 100) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Discount percent must be between 1 and 100"));
            }
            
            java.time.LocalDateTime discountStartDate = java.time.LocalDateTime.parse(startDate + "T00:00:00");
            java.time.LocalDateTime discountEndDate = java.time.LocalDateTime.parse(endDate + "T23:59:59");
            
            for (String productId : productIds) {
                Product product = productService.getProductById(productId).orElse(null);
                if (product != null) {
                    product.setHasDiscount(true);
                    product.setDiscountPercent(discountPercent);
                    product.setDiscountStartDate(discountStartDate);
                    product.setDiscountEndDate(discountEndDate);
                    
                    // Calculate offer price based on discount
                    Double originalPrice = product.getPrice();
                    Double discountAmount = originalPrice * (discountPercent / 100);
                    Double offerPrice = originalPrice - discountAmount;
                    product.setOfferPrice(offerPrice);
                    
                    product.setUpdatedAt(java.time.LocalDateTime.now());
                    productService.updateProduct(productId, product);
                }
            }
            
            return ResponseEntity.ok(new ApiResponse(true, "Discount applied successfully to " + productIds.size() + " products"));
        } catch (Exception e) {
            System.err.println("Apply discount error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error applying discount: " + e.getMessage()));
        }
    }

    @PostMapping("/remove-discount")
    public ResponseEntity<ApiResponse> removeDiscount(@RequestBody java.util.Map<String, Object> payload) {
        try {
            @SuppressWarnings("unchecked")
            List<String> productIds = (List<String>) payload.get("productIds");
            
            if (productIds == null || productIds.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Product IDs are required"));
            }
            
            for (String productId : productIds) {
                Product product = productService.getProductById(productId).orElse(null);
                if (product != null) {
                    product.setHasDiscount(false);
                    product.setDiscountPercent(0.0);
                    product.setDiscountStartDate(null);
                    product.setDiscountEndDate(null);
                    product.setOfferPrice(product.getPrice()); // Reset offer price to original price
                    product.setUpdatedAt(java.time.LocalDateTime.now());
                    productService.updateProduct(productId, product);
                }
            }
            
            return ResponseEntity.ok(new ApiResponse(true, "Discount removed successfully from " + productIds.size() + " products"));
        } catch (Exception e) {
            System.err.println("Remove discount error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error removing discount: " + e.getMessage()));
        }
    }
}
