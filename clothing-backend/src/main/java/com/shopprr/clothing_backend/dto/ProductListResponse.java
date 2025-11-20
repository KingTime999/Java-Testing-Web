package com.shopprr.clothing_backend.dto;

import java.util.List;

import com.shopprr.clothing_backend.model.Product;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductListResponse {
    private boolean success;
    private String message;
    private List<Product> products;

    public ProductListResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.products = null;
    }
}
