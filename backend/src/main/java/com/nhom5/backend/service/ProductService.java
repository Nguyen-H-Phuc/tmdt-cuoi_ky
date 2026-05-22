package com.nhom5.backend.service;

import com.nhom5.backend.dto.ProductDTO;
import com.nhom5.backend.dto.UserDTO;
import com.nhom5.backend.entity.Product;
import com.nhom5.backend.entity.ProductImage;
import com.nhom5.backend.entity.User;
import com.nhom5.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public ProductDTO getProductById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Increase view count
        product.setViewCount(product.getViewCount() + 1);
        productRepository.save(product);

        return convertToDTO(product);
    }

    public ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setProductId(product.getProductId());
        dto.setTitle(product.getTitle());
        dto.setPrice(product.getPrice());
        dto.setDescription(product.getDescription());
        if (product.getCategory() != null) {
            dto.setCategory(product.getCategory().getCategoryName());
        }
        dto.setStatus(product.getStatus());
        dto.setViewCount(product.getViewCount());
        
        // Removed properties due to schema change, setting to null or empty for DTO compatibility
        dto.setProvince("");
        dto.setDistrict("");
        dto.setSpecificAddress("");
        
        dto.setCreatedAt(product.getCreatedAt());

        if (product.getSeller() != null) {
            User seller = product.getSeller();
            UserDTO userDTO = new UserDTO();
            userDTO.setUserId(seller.getUserId());
            userDTO.setFullName(seller.getFullName());
            userDTO.setEmail(seller.getEmail());
            userDTO.setPhone(seller.getPhone());
            userDTO.setAvatar(seller.getAvatar());
            userDTO.setIsActive(seller.getIsActive());
            userDTO.setCreatedAt(seller.getCreatedAt());
            dto.setSeller(userDTO);
        }

        if (product.getImages() != null && !product.getImages().isEmpty()) {
            List<String> imageUrls = product.getImages().stream()
                    .map(ProductImage::getImageUrl)
                    .collect(Collectors.toList());
            dto.setImages(imageUrls);
        } else if (product.getImageUrl() != null) {
            // fallback to single image url from schema
            dto.setImages(List.of(product.getImageUrl()));
        }

        return dto;
    }
}
