package com.nhom5.backend.service;

import com.nhom5.backend.dto.ProductCreateRequest;
import com.nhom5.backend.dto.ProductDTO;
import com.nhom5.backend.dto.ProductUpdateRequest;
import com.nhom5.backend.dto.UserDTO;
import com.nhom5.backend.entity.Category;
import com.nhom5.backend.entity.Product;
import com.nhom5.backend.entity.ProductImage;
import com.nhom5.backend.entity.User;
import com.nhom5.backend.repository.CategoryRepository;
import com.nhom5.backend.repository.ProductImageRepository;
import com.nhom5.backend.repository.ProductRepository;
import com.nhom5.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Transactional
    public ProductDTO getProductById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        // Tăng view count
        product.setViewCount(product.getViewCount() + 1);
        productRepository.save(product);

        return convertToDTO(product);
    }

    @Transactional
    public ProductDTO createProduct(ProductCreateRequest request) {
        User seller = userRepository.findById(request.getSellerId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin người bán"));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));

        Product product = new Product();
        product.setSeller(seller);
        product.setCategory(category);
        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setStatus("available");
        product.setApprovalStatus("pending");
        product.setIsDeleted(false);
        product.setIsHidden(false);
        product.setCreatedAt(LocalDateTime.now());

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            product.setImageUrl(request.getImages().get(0));
        }

        Product savedProduct = productRepository.save(product);

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            List<ProductImage> productImages = new ArrayList<>();
            for (int i = 0; i < request.getImages().size(); i++) {
                ProductImage img = new ProductImage();
                img.setProduct(savedProduct);
                img.setImageUrl(request.getImages().get(i));
                img.setIsMain(i == 0);
                productImages.add(img);
            }
            productImageRepository.saveAll(productImages);
            savedProduct.setImages(productImages);
        }

        return convertToDTO(savedProduct);
    }

    @Transactional
    public ProductDTO updateProduct(Integer productId, ProductUpdateRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));

        product.setCategory(category);
        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        // Khi sửa bài đăng thì chuyển trạng thái duyệt về 'pending' để admin duyệt lại
        product.setApprovalStatus("pending");

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            product.setImageUrl(request.getImages().get(0));
        } else {
            product.setImageUrl(null);
        }

        // Xóa ảnh cũ liên quan đến product
        productImageRepository.deleteAll(product.getImages());
        product.getImages().clear();

        // Lưu ảnh mới
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            List<ProductImage> productImages = new ArrayList<>();
            for (int i = 0; i < request.getImages().size(); i++) {
                ProductImage img = new ProductImage();
                img.setProduct(product);
                img.setImageUrl(request.getImages().get(i));
                img.setIsMain(i == 0);
                productImages.add(img);
            }
            productImageRepository.saveAll(productImages);
            product.setImages(productImages);
        }

        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    @Transactional
    public void softDeleteProduct(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
        product.setIsDeleted(true);
        productRepository.save(product);
    }

    @Transactional
    public ProductDTO updateProductStatus(Integer productId, String status) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
        product.setStatus(status);
        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    @Transactional
    public ProductDTO updateProductHidden(Integer productId, Boolean hidden) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
        product.setIsHidden(hidden);
        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getFilteredProducts(String location, Integer categoryId, Double priceMin, Double priceMax, String status, String sortBy) {
        Sort sort = Sort.unsorted();
        if (sortBy != null) {
            switch (sortBy) {
                case "newest":
                    sort = Sort.by(Sort.Direction.DESC, "createdAt");
                    break;
                case "priceAsc":
                    sort = Sort.by(Sort.Direction.ASC, "price");
                    break;
                case "priceDesc":
                    sort = Sort.by(Sort.Direction.DESC, "price");
                    break;
                case "mostViewed":
                    sort = Sort.by(Sort.Direction.DESC, "viewCount");
                    break;
                case "relevance":
                default:
                    sort = Sort.by(Sort.Direction.DESC, "productId");
                    break;
            }
        } else {
            sort = Sort.by(Sort.Direction.DESC, "productId");
        }

        List<Product> products = productRepository.filterProducts(location, categoryId, priceMin, priceMax, status, sort);
        return products.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getAllProductsForAdmin() {
        List<Product> products = productRepository.findByIsDeletedFalseOrderByCreatedAtDesc();
        return products.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductDTO updateApprovalStatus(Integer productId, String approvalStatus) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
        product.setApprovalStatus(approvalStatus);
        
        // Nếu đã phê duyệt, đảm bảo trạng thái bán là available
        if ("approved".equals(approvalStatus)) {
            product.setStatus("available");
        }
        
        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    public ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setProductId(product.getProductId());
        dto.setTitle(product.getTitle());
        dto.setPrice(product.getPrice());
        dto.setDescription(product.getDescription());
        if (product.getCategory() != null) {
            dto.setCategory(product.getCategory().getCategoryName());
            dto.setCategoryId(product.getCategory().getCategoryId());
        }
        dto.setStatus(product.getStatus());
        dto.setApprovalStatus(product.getApprovalStatus());
        dto.setQuantity(product.getQuantity());
        dto.setIsDeleted(product.getIsDeleted());
        dto.setIsHidden(product.getIsHidden());
        dto.setViewCount(product.getViewCount());
        
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
            dto.setImages(List.of(product.getImageUrl()));
        }

        return dto;
    }
}
