package com.shopprr.clothing_backend.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@Document(collection = "reviews")
public class Review {
    @Id
    @JsonProperty("_id")
    private String id;
    
    private String productId;
    private String userId;
    private Integer rating;
    private String title;
    private String comment;
    private String userName;
    private String userAvatar;
    private Boolean verified = false;
    private LocalDateTime purchaseDate;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
