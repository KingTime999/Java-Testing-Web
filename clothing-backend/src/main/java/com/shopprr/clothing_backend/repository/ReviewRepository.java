package com.shopprr.clothing_backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.shopprr.clothing_backend.model.Review;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByProductId(String productId);
    List<Review> findByUserId(String userId);
    List<Review> findByProductIdOrderByCreatedAtDesc(String productId);
}
