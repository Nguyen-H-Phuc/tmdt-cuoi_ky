package com.nhom5.backend.controller;

import com.nhom5.backend.dto.ProductCreateRequest;
import com.nhom5.backend.dto.ProductDTO;
import com.nhom5.backend.dto.ProductUpdateRequest;
import com.nhom5.backend.entity.Product;
import com.nhom5.backend.repository.ProductRepository;
import com.nhom5.backend.service.CloudinaryService;
import com.nhom5.backend.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private CloudinaryService cloudinaryService;

    // 1. Lấy tất cả sản phẩm công khai (đã duyệt, chưa bị ẩn và chưa bị xóa) có bộ lọc
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts(
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            @RequestParam(value = "priceMin", required = false) Double priceMin,
            @RequestParam(value = "priceMax", required = false) Double priceMax,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "sortBy", required = false) String sortBy) {
        List<ProductDTO> dtos = productService.getFilteredProducts(location, categoryId, priceMin, priceMax, status, sortBy);
        return ResponseEntity.ok(dtos);
    }

    // 2. Chi tiết sản phẩm (Tăng lượt xem)
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Integer id) {
        ProductDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    // 3. Sản phẩm mới nhất (đã duyệt, chưa bị ẩn, chưa bị xóa)
    @GetMapping("/newest")
    public ResponseEntity<List<ProductDTO>> getNewestProducts() {
        List<Product> products = productRepository.findTop10ByApprovalStatusAndIsDeletedFalseAndIsHiddenFalseOrderByCreatedAtDesc("approved");
        List<ProductDTO> dtos = products.stream()
                .map(productService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // 4. Sản phẩm xem nhiều nhất (đã duyệt, chưa bị ẩn, chưa bị xóa)
    @GetMapping("/most-viewed")
    public ResponseEntity<List<ProductDTO>> getMostViewedProducts() {
        List<Product> products = productRepository.findTop10ByApprovalStatusAndIsDeletedFalseAndIsHiddenFalseOrderByViewCountDesc("approved");
        List<ProductDTO> dtos = products.stream()
                .map(productService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // 5. Sản phẩm bán chạy nhất (đã duyệt, chưa bị ẩn, chưa bị xóa)
    @GetMapping("/best-selling")
    public ResponseEntity<List<ProductDTO>> getBestSellingProducts() {
        List<Product> products = productRepository.findTop10BestSelling();
        List<ProductDTO> dtos = products.stream()
                .map(productService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // ==========================================
    // SELLER PRODUCT MANAGEMENT ENDPOINTS
    // ==========================================

    // 6. Lấy bài đăng của người bán (Tất cả trạng thái duyệt, ẩn, chưa bị xóa)
    @GetMapping("/my-products")
    public ResponseEntity<List<ProductDTO>> getMyProducts(@RequestParam("userId") Integer userId) {
        List<Product> products = productRepository.findBySellerUserIdAndIsDeletedFalseOrderByCreatedAtDesc(userId);
        List<ProductDTO> dtos = products.stream()
                .map(productService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // 7. Tạo bài đăng mới (Lưu nháp, trạng thái duyệt ban đầu là 'pending')
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductCreateRequest request) {
        ProductDTO productDTO = productService.createProduct(request);
        return ResponseEntity.ok(productDTO);
    }

    // 8. Chỉnh sửa bài đăng (Trạng thái duyệt sẽ reset về 'pending' để admin duyệt lại)
    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Integer id,
            @Valid @RequestBody ProductUpdateRequest request) {
        ProductDTO productDTO = productService.updateProduct(id, request);
        return ResponseEntity.ok(productDTO);
    }

    // 9. Xóa mềm bài đăng (Soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Integer id) {
        productService.softDeleteProduct(id);
        return ResponseEntity.ok(Map.of("message", "Xóa bài đăng thành công"));
    }

    // 10. Cập nhật trạng thái bài đăng (Bán / Đã bán)
    @PutMapping("/{id}/status")
    public ResponseEntity<ProductDTO> updateProductStatus(
            @PathVariable Integer id,
            @RequestParam("status") String status) {
        ProductDTO productDTO = productService.updateProductStatus(id, status);
        return ResponseEntity.ok(productDTO);
    }

    // 11. Cập nhật trạng thái ẩn/hiện bài đăng
    @PutMapping("/{id}/hidden")
    public ResponseEntity<ProductDTO> updateProductHidden(
            @PathVariable Integer id,
            @RequestParam("hidden") Boolean hidden) {
        ProductDTO productDTO = productService.updateProductHidden(id, hidden);
        return ResponseEntity.ok(productDTO);
    }

    // 12. Endpoint upload hình ảnh sản phẩm lên Cloudinary
    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "File không được trống"));
        }

        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png") && !contentType.equals("image/webp"))) {
            return ResponseEntity.badRequest().body(Map.of("message", "Định dạng file không hợp lệ. Chỉ chấp nhận JPG, PNG, WEBP."));
        }

        try {
            Map<?, ?> uploadResult = cloudinaryService.upload(file);
            String fileUrl = (String) uploadResult.get("secure_url");
            return ResponseEntity.ok(Map.of("imageUrl", fileUrl));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Lỗi trong quá trình upload ảnh: " + e.getMessage()));
        }
    }
}
