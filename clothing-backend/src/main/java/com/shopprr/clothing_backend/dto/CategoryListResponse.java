package com.shopprr.clothing_backend.dto;

import java.util.List;

import com.shopprr.clothing_backend.model.Category;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryListResponse {
    private boolean success;
    private String message;
    private List<Category> categories;

    public CategoryListResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.categories = null;
    }
}
