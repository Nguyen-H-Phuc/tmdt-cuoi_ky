package com.nhom5.backend.service;

import com.nhom5.backend.dto.CartAddRequest;
import com.nhom5.backend.dto.CartItemDTO;
import com.nhom5.backend.dto.CartUpdateRequest;
import com.nhom5.backend.entity.CartItem;
import com.nhom5.backend.entity.Product;
import com.nhom5.backend.entity.User;
import com.nhom5.backend.repository.CartItemRepository;
import com.nhom5.backend.repository.ProductRepository;
import com.nhom5.backend.repository.UserRepository;
import com.nhom5.backend.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<CartItemDTO> getCartByUserId(Integer userId) {
        return cartItemRepository.findByUser_UserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CartItemDTO addToCart(CartAddRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        Optional<CartItem> existingItem = cartItemRepository.findByUser_UserIdAndProduct_ProductId(
                request.getUserId(), request.getProductId());

        CartItem cartItem;
        if (existingItem.isPresent()) {
            cartItem = existingItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
        } else {
            cartItem = CartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(request.getQuantity())
                    .addedAt(java.time.LocalDateTime.now())
                    .build();
        }

        CartItem saved = cartItemRepository.save(cartItem);
        return convertToDTO(saved);
    }

    @Transactional
    public CartItemDTO updateCartItem(Integer cartItemId, CartUpdateRequest request) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));
        cartItem.setQuantity(request.getQuantity());
        CartItem saved = cartItemRepository.save(cartItem);
        return convertToDTO(saved);
    }

    @Transactional
    public void deleteCartItem(Integer cartItemId) {
        if (!cartItemRepository.existsById(cartItemId)) {
            throw new IllegalArgumentException("Cart item not found");
        }
        cartItemRepository.deleteById(cartItemId);
    }

    @Transactional
    public void clearCart(Integer userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found");
        }
        cartItemRepository.deleteByUser_UserId(userId);
    }

    private CartItemDTO convertToDTO(CartItem item) {
        CartItemDTO dto = new CartItemDTO();
        dto.setCartId(item.getCartId());
        dto.setProductId(item.getProduct().getProductId());
        dto.setTitle(item.getProduct().getTitle());
        dto.setPrice(item.getProduct().getPrice());
        dto.setImageUrl(item.getProduct().getImageUrl());
        dto.setQuantity(item.getQuantity());
        dto.setAddedAt(item.getAddedAt());

        if (item.getProduct().getSeller() != null) {
            User seller = item.getProduct().getSeller();
            UserDTO sellerDTO = new UserDTO();
            sellerDTO.setUserId(seller.getUserId());
            sellerDTO.setFullName(seller.getFullName());
            sellerDTO.setEmail(seller.getEmail());
            sellerDTO.setPhone(seller.getPhone());
            sellerDTO.setAvatar(seller.getAvatar());
            sellerDTO.setIsActive(seller.getIsActive());
            sellerDTO.setCreatedAt(seller.getCreatedAt());
            dto.setSeller(sellerDTO);
        }

        return dto;
    }
}
