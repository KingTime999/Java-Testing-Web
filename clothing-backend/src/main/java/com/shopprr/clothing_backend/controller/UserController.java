package com.shopprr.clothing_backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopprr.clothing_backend.dto.ApiResponse;
import com.shopprr.clothing_backend.dto.LoginRequest;
import com.shopprr.clothing_backend.model.User;
import com.shopprr.clothing_backend.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody User user) {
        try {
            if (userService.existsByEmail(user.getEmail())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse(false, "Email already exists"));
            }
            
            User createdUser = userService.createUser(user);
            Map<String, Object> response = new HashMap<>();
            response.put("id", createdUser.getId());
            response.put("email", createdUser.getEmail());
            response.put("name", createdUser.getName());
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "User registered successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error registering user: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        try {
            System.out.println("=== LOGIN DEBUG ===");
            System.out.println("Email: " + loginRequest.getEmail());
            System.out.println("Password length: " + loginRequest.getPassword().length());
            
            User user = userService.findByEmail(loginRequest.getEmail())
                    .orElse(null);
            
            if (user == null) {
                System.out.println("User not found!");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Invalid email or password"));
            }
            
            System.out.println("User found: " + user.getEmail());
            System.out.println("Stored hash: " + user.getPassword());
            
            boolean passwordMatches = userService.verifyPassword(loginRequest.getPassword(), user.getPassword());
            System.out.println("Password matches: " + passwordMatches);
            
            if (!passwordMatches) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Invalid email or password"));
            }
            
            System.out.println("Setting cookie for user: " + user.getId());
            
            // ✅ SET COOKIE với SameSite=None cho cross-origin (localhost:5173 → localhost:8080)
            Cookie cookie = new Cookie("user_session", user.getId());
            cookie.setMaxAge(7 * 24 * 60 * 60); // 7 ngày
            cookie.setPath("/");
            cookie.setHttpOnly(false);  // false để có thể debug trong browser
            cookie.setSecure(false);    // false vì dùng HTTP localhost
            // SameSite=None cho phép cookie gửi cross-origin (5173 → 8080)
            // Nhưng trong production phải dùng Secure=true với HTTPS
            response.addCookie(cookie);
            
            // THÊM: Set cookie bằng header để đảm bảo SameSite=None
            String cookieHeader = String.format(
                "user_session=%s; Path=/; Max-Age=%d; SameSite=None",
                user.getId(),
                7 * 24 * 60 * 60
            );
            response.addHeader("Set-Cookie", cookieHeader);
            
            System.out.println("✅ Cookie 'user_session' set with SameSite=None for user: " + user.getId());
            
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("email", user.getEmail());
            userData.put("name", user.getName());
            userData.put("role", user.getRole());
            userData.put("cartData", user.getCartData() != null ? user.getCartData() : new HashMap<>());
            
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("user", userData);
            
            return ResponseEntity.ok(new ApiResponse(true, "Login successful", responseData));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error during login: " + e.getMessage()));
        }
    }

    @GetMapping("/is-auth")
    public ResponseEntity<ApiResponse> isAuthenticated(@CookieValue(value = "user_session", required = false) String userId) {
        try {
            if (userId == null) {
                return ResponseEntity.ok(new ApiResponse(false, "Not authenticated"));
            }
            
            User user = userService.findById(userId).orElse(null);
            if (user == null) {
                return ResponseEntity.ok(new ApiResponse(false, "User not found"));
            }
            
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("email", user.getEmail());
            userData.put("name", user.getName());
            userData.put("role", user.getRole());
            userData.put("cartData", user.getCartData());
            
            return ResponseEntity.ok(new ApiResponse(true, "User authenticated", userData));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error checking authentication: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(HttpServletResponse response) {
        try {
            Cookie cookie = new Cookie("user_session", null);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(0);
            response.addCookie(cookie);
            
            return ResponseEntity.ok(new ApiResponse(true, "Logout successful"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error during logout: " + e.getMessage()));
        }
    }

    @GetMapping("/list-all")
    public ResponseEntity<ApiResponse> getAllUsers() {
        try {
            java.util.List<User> users = userService.getAllUsers();
            Map<String, Object> response = new HashMap<>();
            response.put("users", users);
            return ResponseEntity.ok(new ApiResponse(true, "Users retrieved successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving users: " + e.getMessage()));
        }
    }

    @PostMapping("/update")
    public ResponseEntity<ApiResponse> updateCustomer(@RequestBody Map<String, Object> request) {
        try {
            String customerId = (String) request.get("customerId");
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse(false, "customerId is required"));
            }
            
            User existingUser = userService.findById(customerId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Update fields
            if (request.containsKey("name")) existingUser.setName((String) request.get("name"));
            if (request.containsKey("email")) existingUser.setEmail((String) request.get("email"));
            if (request.containsKey("phone")) existingUser.setPhone((String) request.get("phone"));
            if (request.containsKey("address")) existingUser.setAddress((String) request.get("address"));
            if (request.containsKey("gender")) existingUser.setGender((String) request.get("gender"));
            if (request.containsKey("age")) {
                Object ageObj = request.get("age");
                if (ageObj instanceof Integer) {
                    existingUser.setAge((Integer) ageObj);
                } else if (ageObj instanceof String && !((String) ageObj).isEmpty()) {
                    existingUser.setAge(Integer.parseInt((String) ageObj));
                }
            }
            
            // Update password if provided
            if (request.containsKey("password") && request.get("password") != null) {
                String newPassword = (String) request.get("password");
                if (!newPassword.isEmpty()) {
                    existingUser.setPassword(userService.hashPassword(newPassword));
                }
            }
            
            User updatedUser = userService.updateUser(customerId, existingUser);
            
            Map<String, Object> response = new HashMap<>();
            response.put("user", updatedUser);
            
            return ResponseEntity.ok(new ApiResponse(true, "Customer updated successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error updating customer: " + e.getMessage()));
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<ApiResponse> deleteCustomer(@RequestBody Map<String, String> request) {
        try {
            String customerId = request.get("customerId");
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse(false, "customerId is required"));
            }
            
            // Verify user exists before deleting
            userService.findById(customerId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            userService.deleteUser(customerId);
            
            return ResponseEntity.ok(new ApiResponse(true, "Customer deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error deleting customer: " + e.getMessage()));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse> updateUserInfo(@PathVariable String id, @RequestBody User userUpdate) {
        try {
            User existingUser = userService.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Update fields
            if (userUpdate.getName() != null) existingUser.setName(userUpdate.getName());
            if (userUpdate.getEmail() != null) existingUser.setEmail(userUpdate.getEmail());
            if (userUpdate.getPhone() != null) existingUser.setPhone(userUpdate.getPhone());
            if (userUpdate.getAddress() != null) existingUser.setAddress(userUpdate.getAddress());
            if (userUpdate.getGender() != null) existingUser.setGender(userUpdate.getGender());
            if (userUpdate.getDateOfBirth() != null) existingUser.setDateOfBirth(userUpdate.getDateOfBirth());
            
            User updatedUser = userService.updateUser(id, existingUser);
            
            Map<String, Object> response = new HashMap<>();
            response.put("user", updatedUser);
            
            return ResponseEntity.ok(new ApiResponse(true, "User updated successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error updating user: " + e.getMessage()));
        }
    }
}
