package com.shopprr.clothing_backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.shopprr.clothing_backend.dto.OrderResponse;
import com.shopprr.clothing_backend.model.Order;
import com.shopprr.clothing_backend.model.Product;
import com.shopprr.clothing_backend.model.User;
import com.shopprr.clothing_backend.repository.OrderRepository;
import com.shopprr.clothing_backend.repository.ProductRepository;
import com.shopprr.clothing_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public Order createOrder(String userId, List<Order.OrderItem> items, Order.Address address, String paymentMethod) {
        // Get user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Calculate total amount
        double totalAmount = 0.0;
        for (Order.OrderItem item : items) {
            Product product = productRepository.findById(item.getProduct())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProduct()));
            item.setPrice(product.getOfferPrice());
            totalAmount += product.getOfferPrice() * item.getQuantity();
        }

        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setItems(items);
        order.setAddress(address);
        order.setPaymentMethod(paymentMethod);
        order.setTotalAmount(totalAmount);
        order.setStatus("pending");
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        return orderRepository.save(order);
    }

    public List<OrderResponse> getUserOrders(String userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        
        // Get all product IDs from all orders
        List<String> productIds = orders.stream()
            .flatMap(order -> order.getItems().stream())
            .map(Order.OrderItem::getProduct)
            .distinct()
            .collect(Collectors.toList());
        
        // Fetch all products at once
        List<Product> products = productRepository.findAllById(productIds);
        
        // Convert to OrderResponse with product info
        return orders.stream()
            .map(order -> OrderResponse.fromOrder(order, products))
            .collect(Collectors.toList());
    }

    public Order getOrderById(String orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Order updateOrder(Order order) {
        return orderRepository.save(order);
    }

    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        
        // Get all product IDs from all orders
        List<String> productIds = orders.stream()
            .flatMap(order -> order.getItems().stream())
            .map(Order.OrderItem::getProduct)
            .distinct()
            .collect(Collectors.toList());
        
        // Fetch all products at once
        List<Product> products = productRepository.findAllById(productIds);
        
        // Convert to OrderResponse with product info
        return orders.stream()
            .map(order -> OrderResponse.fromOrder(order, products))
            .collect(Collectors.toList());
    }

    public void deleteOrder(String orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new RuntimeException("Order not found");
        }
        orderRepository.deleteById(orderId);
    }
}
