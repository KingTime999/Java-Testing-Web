package com.shopprr.clothing_backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.shopprr.clothing_backend.model.User;
import com.shopprr.clothing_backend.repository.OrderRepository;
import com.shopprr.clothing_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User updateUser(String id, User user) {
        user.setId(id);
        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    public String hashPassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    public boolean verifyPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public void updateCartData(String userId, String itemId, String size, Integer quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Map<String, Map<String, Integer>> cartData = user.getCartData();
        if (cartData == null) {
            cartData = new HashMap<>();
        }
        
        Map<String, Integer> itemSizes = cartData.getOrDefault(itemId, new HashMap<>());
        if (quantity != null && quantity > 0) {
            itemSizes.put(size, quantity);
        } else {
            itemSizes.remove(size);
        }
        
        if (itemSizes.isEmpty()) {
            cartData.remove(itemId);
        } else {
            cartData.put(itemId, itemSizes);
        }
        
        user.setCartData(cartData);
        userRepository.save(user);
    }

    public List<com.shopprr.clothing_backend.model.Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
