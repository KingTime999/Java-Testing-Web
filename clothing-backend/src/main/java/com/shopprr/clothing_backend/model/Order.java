package com.shopprr.clothing_backend.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    
    @DBRef
    private User user;
    
    private List<OrderItem> items;
    private Address address;
    private String paymentMethod; // "COD" or "Stripe"
    private Double totalAmount;
    private String status; // "pending", "processing", "shipped", "delivered", "cancelled"
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Data
    public static class OrderItem {
        private String product; // Product ID
        private Integer quantity;
        private String size;
        private Double price; // Price at the time of order
    }
    
    @Data
    public static class Address {
        private String firstName;
        private String lastName;
        private String email;
        private String street;
        private String city;
        private String state;
        private String zipcode;
        private String country;
        private String phone;
    }
}
