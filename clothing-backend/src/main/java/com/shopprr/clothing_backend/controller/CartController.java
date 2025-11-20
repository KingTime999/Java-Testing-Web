package com.shopprr.clothing_backend.controller;

import com.shopprr.clothing_backend.dto.ApiResponse;
import com.shopprr.clothing_backend.dto.CartRequest;
import com.shopprr.clothing_backend.model.User;
import com.shopprr.clothing_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final UserService userService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addToCart(
            @RequestBody CartRequest cartRequest,
            @CookieValue(value = "user_session", required = false) String userId) {
        try {
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Please login to add items to cart"));
            }

            userService.updateCartData(userId, cartRequest.getItemId(), cartRequest.getSize(), 
                    cartRequest.getQuantity() != null ? cartRequest.getQuantity() : 1);
            
            return ResponseEntity.ok(new ApiResponse(true, "Item added to cart successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error adding to cart: " + e.getMessage()));
        }
    }

    @PostMapping("/update")
    public ResponseEntity<ApiResponse> updateCart(
            @RequestBody CartRequest cartRequest,
            @CookieValue(value = "user_session", required = false) String userId) {
        try {
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Please login to update cart"));
            }

            userService.updateCartData(userId, cartRequest.getItemId(), cartRequest.getSize(), 
                    cartRequest.getQuantity());
            
            return ResponseEntity.ok(new ApiResponse(true, "Cart updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error updating cart: " + e.getMessage()));
        }
    }

    @GetMapping("/get")
    public ResponseEntity<ApiResponse> getCart(@CookieValue(value = "user_session", required = false) String userId) {
        try {
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Please login to view cart"));
            }

            User user = userService.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            return ResponseEntity.ok(new ApiResponse(true, "Cart fetched successfully", user.getCartData()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error fetching cart: " + e.getMessage()));
        }
    }
}
