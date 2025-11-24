package com.shopprr.clothing_backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopprr.clothing_backend.dto.ApiResponse;
import com.shopprr.clothing_backend.model.Review;
import com.shopprr.clothing_backend.service.ReviewService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @Data
    public static class CreateReviewRequest {
        private String productId;
        private Integer rating;
        private String title;
        private String comment;
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createReview(
            @RequestBody CreateReviewRequest request,
            HttpServletRequest httpRequest) {
        try {
            // Get user ID from cookie
            String userId = getUserIdFromCookie(httpRequest);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Please login to write a review"));
            }

            // Validate request
            if (request.getProductId() == null || request.getProductId().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Product ID is required"));
            }
            if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Rating must be between 1 and 5"));
            }
            if (request.getTitle() == null || request.getTitle().trim().length() < 5) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Title must be at least 5 characters"));
            }
            if (request.getComment() == null || request.getComment().trim().length() < 20) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Comment must be at least 20 characters"));
            }

            Review review = reviewService.createReview(
                    userId,
                    request.getProductId(),
                    request.getRating(),
                    request.getTitle(),
                    request.getComment()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("review", review);

            return ResponseEntity.ok(new ApiResponse(true, "Review submitted successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error creating review: " + e.getMessage()));
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse> getProductReviews(@PathVariable String productId) {
        try {
            if (productId == null || productId.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Product ID is required"));
            }

            List<Review> reviews = reviewService.getProductReviews(productId);

            Map<String, Object> response = new HashMap<>();
            response.put("reviews", reviews);
            response.put("count", reviews.size());

            return ResponseEntity.ok(new ApiResponse(true, "Reviews retrieved successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving reviews: " + e.getMessage()));
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<ApiResponse> deleteReview(
            @RequestBody Map<String, String> payload,
            HttpServletRequest httpRequest) {
        try {
            String userId = getUserIdFromCookie(httpRequest);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Please login"));
            }

            String reviewId = payload.get("reviewId");
            if (reviewId == null || reviewId.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Review ID is required"));
            }

            reviewService.deleteReview(reviewId);
            return ResponseEntity.ok(new ApiResponse(true, "Review deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error deleting review: " + e.getMessage()));
        }
    }

    @GetMapping("/product/{productId}/stats")
    public ResponseEntity<ApiResponse> getProductReviewStats(@PathVariable String productId) {
        try {
            if (productId == null || productId.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Product ID is required"));
            }

            List<Review> reviews = reviewService.getProductReviews(productId);
            
            // Calculate stats
            int totalReviews = reviews.size();
            double averageRating = 0.0;
            Map<Integer, Long> ratingDistribution = new HashMap<>();
            
            if (totalReviews > 0) {
                // Calculate average rating
                int totalRating = reviews.stream()
                    .mapToInt(Review::getRating)
                    .sum();
                averageRating = (double) totalRating / totalReviews;
                
                // Calculate rating distribution
                for (int i = 1; i <= 5; i++) {
                    final int rating = i;
                    long count = reviews.stream()
                        .filter(r -> r.getRating() == rating)
                        .count();
                    ratingDistribution.put(rating, count);
                }
            }

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalReviews", totalReviews);
            stats.put("averageRating", Math.round(averageRating * 10.0) / 10.0);
            stats.put("ratingDistribution", ratingDistribution);

            return ResponseEntity.ok(new ApiResponse(true, "Stats retrieved successfully", stats));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving stats: " + e.getMessage()));
        }
    }

    private String getUserIdFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("user_session".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
