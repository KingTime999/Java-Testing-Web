package com.shopprr.clothing_backend.model;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class ProductDetails {
    private String material;
    private String fit;
    private String care;
    private List<String> features = new ArrayList<>();
    private String weight;
    private String origin;
}
