package com.shopprr.clothing_backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopprr.clothing_backend.dto.ApiResponse;
import com.shopprr.clothing_backend.model.Order;
import com.shopprr.clothing_backend.repository.UserRepository;
import com.shopprr.clothing_backend.service.OrderService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final UserRepository userRepository;

    @Data
    public static class OrderRequest {
        private List<Order.OrderItem> items;
        private Order.Address address;
    }

    @PostMapping("/cod")
    public ResponseEntity<ApiResponse> placeOrderCOD(
            @RequestBody OrderRequest orderRequest,
            HttpServletRequest request) {
        try {
            // Get user from session cookie
            String userId = getUserIdFromCookie(request);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Please login to place order"));
            }

            // Create order
            Order order = orderService.createOrder(
                    userId,
                    orderRequest.getItems(),
                    orderRequest.getAddress(),
                    "COD"
            );

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.getId());
            response.put("status", order.getStatus());

            return ResponseEntity.ok(new ApiResponse(true, "Order placed successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error placing order: " + e.getMessage()));
        }
    }

    @PostMapping("/userorders")
    public ResponseEntity<ApiResponse> getUserOrders(HttpServletRequest request) {
        try {
            // Get user from session cookie
            String userId = getUserIdFromCookie(request);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Please login to view orders"));
            }

            List<Order> orders = orderService.getUserOrders(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("orders", orders);

            return ResponseEntity.ok(new ApiResponse(true, "Orders retrieved successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving orders: " + e.getMessage()));
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

    @PostMapping("/status")
    public ResponseEntity<ApiResponse> updateOrderStatus(
            @RequestBody Map<String, String> payload,
            HttpServletRequest request) {
        try {
            String userId = getUserIdFromCookie(request);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Please login"));
            }

            String orderId = payload.get("orderId");
            String status = payload.get("status");

            Order order = orderService.getOrderById(orderId);
            order.setStatus(status);
            order.setUpdatedAt(java.time.LocalDateTime.now());
            
            orderService.updateOrder(order);

            return ResponseEntity.ok(new ApiResponse(true, "Order status updated"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error updating order: " + e.getMessage()));
        }
    }

    @PostMapping("/list")
    public ResponseEntity<ApiResponse> getAllOrders(HttpServletRequest request) {
        try {
            String userId = getUserIdFromCookie(request);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Please login"));
            }

            List<Order> orders = orderService.getAllOrders();
            
            Map<String, Object> response = new HashMap<>();
            response.put("orders", orders);

            return ResponseEntity.ok(new ApiResponse(true, "Orders retrieved successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving orders: " + e.getMessage()));
        }
    }
}
