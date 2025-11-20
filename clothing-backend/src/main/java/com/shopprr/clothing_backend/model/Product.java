package com.shopprr.clothing_backend.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@Document(collection = "products")
public class Product {
    @Id
    @JsonProperty("_id")
    private String id;
    
    private String name;
    private String description;
    
    @Field("image")
    private List<String> image = new ArrayList<>();
    
    private Double price;
    private Double offerPrice;
    private String category;
    
    @Field("sizes")
    private List<String> sizes = new ArrayList<>();
    
    @Field("colors")
    private List<String> colors = new ArrayList<>();
    
    private ProductDetails details;
    
    private Boolean popular = false;
    private Boolean inStock = true;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
