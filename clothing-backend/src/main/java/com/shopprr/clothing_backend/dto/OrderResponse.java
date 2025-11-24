package com.shopprr.clothing_backend.dto;

import com.shopprr.clothing_backend.model.Order;
import com.shopprr.clothing_backend.model.Product;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private String _id;  // Use _id to match frontend expectation
    private List<OrderItemResponse> items;
    private Order.Address address;
    private String paymentMethod;
    private Double amount;  // totalAmount
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isPaid = false;
    
    @Data
    public static class OrderItemResponse {
        private ProductInfo product;
        private Integer quantity;
        private String size;
        private Double price;
    }
    
    @Data
    public static class ProductInfo {
        private String _id;
        private String name;
        private List<String> image;  // Array of image URLs
        private Double offerPrice;
        private String category;
    }
    
    // Convert Order entity to OrderResponse DTO
    public static OrderResponse fromOrder(Order order, List<Product> products) {
        OrderResponse response = new OrderResponse();
        response.set_id(order.getId());
        response.setAddress(order.getAddress());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setAmount(order.getTotalAmount());
        response.setStatus(order.getStatus());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        response.setIsPaid(false); // Default to false, can be updated based on payment status
        
        // Convert items with product info
        List<OrderItemResponse> itemResponses = new java.util.ArrayList<>();
        for (Order.OrderItem item : order.getItems()) {
            // Find product by ID
            Product product = products.stream()
                .filter(p -> p.getId().equals(item.getProduct()))
                .findFirst()
                .orElse(null);
                
            if (product != null) {
                OrderItemResponse itemResponse = new OrderItemResponse();
                
                // Create product info
                ProductInfo productInfo = new ProductInfo();
                productInfo.set_id(product.getId());
                productInfo.setName(product.getName());
                productInfo.setImage(product.getImage());
                productInfo.setOfferPrice(product.getOfferPrice());
                productInfo.setCategory(product.getCategory());
                
                itemResponse.setProduct(productInfo);
                itemResponse.setQuantity(item.getQuantity());
                itemResponse.setSize(item.getSize());
                itemResponse.setPrice(item.getPrice());
                
                itemResponses.add(itemResponse);
            }
        }
        
        response.setItems(itemResponses);
        return response;
    }
}
