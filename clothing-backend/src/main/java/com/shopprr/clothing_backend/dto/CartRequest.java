package com.shopprr.clothing_backend.dto;

import lombok.Data;

@Data
public class CartRequest {
    private String itemId;
    private String size;
    private Integer quantity;
}
