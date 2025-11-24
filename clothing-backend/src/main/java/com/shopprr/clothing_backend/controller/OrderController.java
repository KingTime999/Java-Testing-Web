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
import com.shopprr.clothing_backend.dto.OrderResponse;
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

    @PostMapping("/stripe")
    public ResponseEntity<ApiResponse> placeOrderStripe(
            @RequestBody Map<String, Object> payload,
            HttpServletRequest request) {
        try {
            // Get user from session cookie
            String userId = getUserIdFromCookie(request);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Please login to place order"));
            }

            // For now, return error message as Stripe is not fully implemented
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                    .body(new ApiResponse(false, "Stripe payment is not available yet. Please use Cash on Delivery."));
            
            // TODO: Implement Stripe payment integration
            // 1. Create Stripe checkout session
            // 2. Return checkout URL to frontend
            // 3. Handle webhook for payment confirmation
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error processing Stripe payment: " + e.getMessage()));
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

            List<OrderResponse> orders = orderService.getUserOrders(userId);
            
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

            List<OrderResponse> orders = orderService.getAllOrders();
            
            Map<String, Object> response = new HashMap<>();
            response.put("orders", orders);

            return ResponseEntity.ok(new ApiResponse(true, "Orders retrieved successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving orders: " + e.getMessage()));
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<ApiResponse> deleteOrder(
            @RequestBody Map<String, String> payload,
            HttpServletRequest request) {
        try {
            String userId = getUserIdFromCookie(request);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Please login"));
            }

            String orderId = payload.get("orderId");
            if (orderId == null || orderId.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Order ID is required"));
            }

            orderService.deleteOrder(orderId);
            return ResponseEntity.ok(new ApiResponse(true, "Order deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error deleting order: " + e.getMessage()));
        }
    }

    @PostMapping("/update")
    public ResponseEntity<ApiResponse> updateOrderDetails(
            @RequestBody Map<String, Object> payload,
            HttpServletRequest request) {
        try {
            String userId = getUserIdFromCookie(request);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Please login"));
            }

            String orderId = (String) payload.get("orderId");
            if (orderId == null || orderId.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Order ID is required"));
            }

            Order order = orderService.getOrderById(orderId);
            
            // Update address if provided
            if (payload.containsKey("address")) {
                @SuppressWarnings("unchecked")
                Map<String, String> addressMap = (Map<String, String>) payload.get("address");
                Order.Address address = new Order.Address();
                address.setFirstName(addressMap.get("firstName"));
                address.setLastName(addressMap.get("lastName"));
                address.setEmail(addressMap.get("email"));
                address.setStreet(addressMap.get("street"));
                address.setCity(addressMap.get("city"));
                address.setState(addressMap.get("state"));
                address.setZipcode(addressMap.get("zipcode"));
                address.setCountry(addressMap.get("country"));
                address.setPhone(addressMap.get("phone"));
                order.setAddress(address);
            }
            
            // Update status if provided
            if (payload.containsKey("status")) {
                order.setStatus((String) payload.get("status"));
            }
            
            order.setUpdatedAt(java.time.LocalDateTime.now());
            orderService.updateOrder(order);

            return ResponseEntity.ok(new ApiResponse(true, "Order updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error updating order: " + e.getMessage()));
        }
    }
}
