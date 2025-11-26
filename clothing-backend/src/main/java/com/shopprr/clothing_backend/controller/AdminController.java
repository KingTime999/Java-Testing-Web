package com.shopprr.clothing_backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopprr.clothing_backend.dto.ApiResponse;
import com.shopprr.clothing_backend.dto.LoginRequest;
import com.shopprr.clothing_backend.model.User;
import com.shopprr.clothing_backend.service.UserService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final UserService userService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        try {
            // Find user by email
            User user = userService.findByEmail(loginRequest.getEmail()).orElse(null);
            
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Invalid email or password"));
            }

            // Check if user is admin or staff
            if (!user.getRole().equals("admin") && !user.getRole().equals("staff")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ApiResponse(false, "Access denied. Admin or staff role required."));
            }

            // Verify password
            boolean passwordMatches = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
            
            if (!passwordMatches) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Invalid email or password"));
            }

            // Create session cookie
            String cookieHeader = String.format(
                "user_session=%s; Path=/; Max-Age=%d; SameSite=Lax",
                user.getId(),
                24 * 60 * 60 // 24 hours
            );
            response.setHeader("Set-Cookie", cookieHeader);

            // Return admin data
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("email", user.getEmail());
            userData.put("name", user.getName());
            userData.put("role", user.getRole());

            return ResponseEntity.ok(new ApiResponse(true, "Login successful", userData));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Login failed: " + e.getMessage()));
        }
    }

    @GetMapping("/is-auth")
    public ResponseEntity<ApiResponse> isAdminAuthenticated(@CookieValue(value = "user_session", required = false) String userId) {
        try {
            if (userId == null) {
                return ResponseEntity.ok(new ApiResponse(false, "Not authenticated"));
            }
            
            User user = userService.findById(userId).orElse(null);
            if (user == null || !user.getRole().equals("admin")) {
                return ResponseEntity.ok(new ApiResponse(false, "Not authorized as admin"));
            }
            
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("email", user.getEmail());
            userData.put("name", user.getName());
            userData.put("role", user.getRole());
            
            return ResponseEntity.ok(new ApiResponse(true, "Admin authenticated", userData));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error checking admin authentication: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(HttpServletResponse response) {
        try {
            // Clear cookie using standard Cookie API
            jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("user_session", null);
            cookie.setHttpOnly(false);
            cookie.setPath("/");
            cookie.setMaxAge(0);
            response.addCookie(cookie);
            
            // Also clear cookie via header (to match login approach)
            String clearCookieHeader = "user_session=; Path=/; Max-Age=0; SameSite=Lax";
            response.addHeader("Set-Cookie", clearCookieHeader);
            
            return ResponseEntity.ok(new ApiResponse(true, "Logout successful"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error during logout: " + e.getMessage()));
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse> getAllOrders(@CookieValue(value = "user_session", required = false) String userId) {
        try {
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Not authenticated"));
            }
            
            User user = userService.findById(userId).orElse(null);
            if (user == null || (!user.getRole().equals("admin") && !user.getRole().equals("staff"))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ApiResponse(false, "Access denied"));
            }

            // Get all orders from database
            java.util.List<com.shopprr.clothing_backend.model.Order> orders = 
                userService.getAllOrders();
            
            Map<String, Object> response = new HashMap<>();
            response.put("orders", orders);
            
            return ResponseEntity.ok(new ApiResponse(true, "Orders retrieved successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving orders: " + e.getMessage()));
        }
    }
}
