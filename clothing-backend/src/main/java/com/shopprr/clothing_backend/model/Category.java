package com.shopprr.clothing_backend.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "categories")
public class Category {
    @Id
    private String id;
    private String name;
    private String slug; // URL-friendly name: "shirts-polos", "bottoms", etc.
    private String description;
    private String image;
    private Boolean isActive = true;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
