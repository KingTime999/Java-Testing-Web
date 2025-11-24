package com.shopprr.clothing_backend.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String phone;
    private String address;
    private Integer age;
    private LocalDate dateOfBirth;
    private String gender;
    private Map<String, Map<String, Integer>> cartData = new HashMap<>();
    private String role = "customer"; // customer, staff, admin
    private Boolean emailVerified = false;
    private Boolean isActive = true;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
