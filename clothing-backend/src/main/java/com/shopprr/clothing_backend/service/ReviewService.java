package com.shopprr.clothing_backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.shopprr.clothing_backend.model.Review;
import com.shopprr.clothing_backend.model.User;
import com.shopprr.clothing_backend.repository.ReviewRepository;
import com.shopprr.clothing_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    public Review createReview(String userId, String productId, Integer rating, String title, String comment) {
        // Get user details
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Review review = new Review();
        review.setProductId(productId);
        review.setUserId(userId);
        review.setRating(rating);
        review.setTitle(title);
        review.setComment(comment);
        review.setUserName(user.getName());
        
        // Generate avatar URL based on user name
        String avatarUrl = "https://ui-avatars.com/api/?name=" + 
                          user.getName().replace(" ", "+") + 
                          "&background=3B82F6&color=fff";
        review.setUserAvatar(avatarUrl);
        
        review.setVerified(false);
        review.setCreatedAt(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());

        return reviewRepository.save(review);
    }

    public List<Review> getProductReviews(String productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    public List<Review> getUserReviews(String userId) {
        return reviewRepository.findByUserId(userId);
    }

    public void deleteReview(String reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new RuntimeException("Review not found");
        }
        reviewRepository.deleteById(reviewId);
    }
}
