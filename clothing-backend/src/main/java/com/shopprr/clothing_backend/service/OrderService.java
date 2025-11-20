package com.shopprr.clothing_backend.service;

import com.shopprr.clothing_backend.model.Order;
import com.shopprr.clothing_backend.model.Product;
import com.shopprr.clothing_backend.model.User;
import com.shopprr.clothing_backend.repository.OrderRepository;
import com.shopprr.clothing_backend.repository.ProductRepository;
import com.shopprr.clothing_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

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

    public List<Order> getUserOrders(String userId) {
        return orderRepository.findByUserId(userId);
    }

    public Order getOrderById(String orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Order updateOrder(Order order) {
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
