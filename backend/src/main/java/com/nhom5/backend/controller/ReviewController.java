package com.nhom5.backend.controller;

import com.nhom5.backend.dto.ReviewDTO;
import com.nhom5.backend.dto.UserDTO;
import com.nhom5.backend.dto.ReviewReportDTO;
import com.nhom5.backend.entity.Product;
import com.nhom5.backend.entity.Review;
import com.nhom5.backend.entity.User;
import com.nhom5.backend.entity.Order;
import com.nhom5.backend.entity.ReviewReport;
import com.nhom5.backend.repository.ProductRepository;
import com.nhom5.backend.repository.ReviewRepository;
import com.nhom5.backend.repository.UserRepository;
import com.nhom5.backend.repository.OrderRepository;
import com.nhom5.backend.repository.ReviewReportRepository;
import com.nhom5.backend.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ReviewReportRepository reviewReportRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    private ReviewDTO convertToReviewDTO(Review review) {
        if (review == null) return null;
        ReviewDTO dto = new ReviewDTO();
        dto.setReviewId(review.getReviewId());
        dto.setContent(review.getComment());
        dto.setRating(review.getRating());
        dto.setCreatedAt(review.getCreatedAt());
        
        User user = review.getReviewer();
        if (user != null) {
            UserDTO userDTO = new UserDTO();
            userDTO.setUserId(user.getUserId());
            userDTO.setFullName(user.getFullName());
            userDTO.setAvatar(user.getAvatar());
            dto.setUser(userDTO);
        }
        
        Product product = review.getProduct();
        if (product != null) {
            dto.setProductId(product.getProductId());
            dto.setProductTitle(product.getTitle());
        }
        
        if (review.getReviewReport() != null) {
            dto.setReportStatus(review.getReviewReport().getStatus());
            dto.setReportReason(review.getReviewReport().getReason());
            dto.setProofImage(review.getReviewReport().getProofImage());
            dto.setProofVideo(review.getReviewReport().getProofVideo());
        }
        
        return dto;
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDTO>> getProductReviews(@PathVariable Integer productId) {
        List<Review> reviews = reviewRepository.findByProduct_ProductId(productId);
        List<ReviewDTO> dtos = reviews.stream()
                .map(this::convertToReviewDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/eligibility")
    public ResponseEntity<?> checkReviewEligibility(@RequestParam Integer productId, @RequestParam Integer userId) {
        List<Order> orders = orderRepository.findCompletedOrdersByBuyerAndProduct(userId, productId);
        if (orders == null || orders.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                "eligible", false,
                "message", "Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua sản phẩm này thành công."
            ));
        }

        boolean withinSevenDays = false;
        LocalDateTime deadline = null;
        for (Order order : orders) {
            LocalDateTime baseDate = order.getStatusDate() != null ? order.getStatusDate() : order.getOrderDate();
            if (baseDate != null && baseDate.plusDays(7).isAfter(LocalDateTime.now())) {
                withinSevenDays = true;
                LocalDateTime orderDeadline = baseDate.plusDays(7);
                if (deadline == null || orderDeadline.isAfter(deadline)) {
                    deadline = orderDeadline;
                }
            }
        }

        if (!withinSevenDays) {
            return ResponseEntity.ok(Map.of(
                "eligible", false,
                "message", "Thời hạn đánh giá sản phẩm (7 ngày sau khi đơn hàng thành công) đã hết."
            ));
        }

        Optional<Review> existingReviewOpt = reviewRepository.findByProduct_ProductIdAndReviewer_UserId(productId, userId);
        if (existingReviewOpt.isPresent()) {
            Review review = existingReviewOpt.get();
            int editCount = review.getEditCount() != null ? review.getEditCount() : 0;
            if (editCount >= 2) {
                return ResponseEntity.ok(Map.of(
                    "eligible", false,
                    "message", "Bạn đã chỉnh sửa đánh giá này tối đa 2 lần. Không thể chỉnh sửa thêm.",
                    "review", convertToReviewDTO(review),
                    "editCount", editCount,
                    "remainingEdits", 0,
                    "deadline", deadline
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                    "eligible", true,
                    "message", "Bạn có thể cập nhật đánh giá của mình.",
                    "review", convertToReviewDTO(review),
                    "editCount", editCount,
                    "remainingEdits", 2 - editCount,
                    "deadline", deadline
                ));
            }
        }

        return ResponseEntity.ok(Map.of(
            "eligible", true,
            "message", "Bạn có thể viết đánh giá mới.",
            "editCount", 0,
            "remainingEdits", 2,
            "deadline", deadline
        ));
    }

    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody Map<String, Object> request) {
        Integer userId = (Integer) request.get("userId");
        Integer productId = (Integer) request.get("productId");
        String content = (String) request.get("content");
        
        if (userId == null || productId == null || content == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "userId, productId và content là bắt buộc."));
        }

        // Verify eligibility again at backend
        List<Order> orders = orderRepository.findCompletedOrdersByBuyerAndProduct(userId, productId);
        if (orders == null || orders.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua sản phẩm này thành công."));
        }

        boolean withinSevenDays = false;
        for (Order order : orders) {
            LocalDateTime baseDate = order.getStatusDate() != null ? order.getStatusDate() : order.getOrderDate();
            if (baseDate != null && baseDate.plusDays(7).isAfter(LocalDateTime.now())) {
                withinSevenDays = true;
                break;
            }
        }

        if (!withinSevenDays) {
            return ResponseEntity.badRequest().body(Map.of("message", "Thời hạn đánh giá sản phẩm (7 ngày sau khi đơn hàng thành công) đã hết."));
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng."));
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm."));
        
        Optional<Review> existingReviewOpt = reviewRepository.findByProduct_ProductIdAndReviewer_UserId(productId, userId);
        Review review;
        
        if (existingReviewOpt.isPresent()) {
            review = existingReviewOpt.get();
            int editCount = review.getEditCount() != null ? review.getEditCount() : 0;
            if (editCount >= 2) {
                return ResponseEntity.badRequest().body(Map.of("message", "Bạn đã chỉnh sửa đánh giá này tối đa 2 lần. Không thể chỉnh sửa thêm."));
            }
            review.setEditCount(editCount + 1);
            review.setComment(content);
            review.setCreatedAt(LocalDateTime.now()); // Cập nhật thời gian chỉnh sửa
        } else {
            review = new Review();
            review.setReviewer(user);
            review.setProduct(product);
            review.setComment(content);
            review.setEditCount(0);
            review.setCreatedAt(LocalDateTime.now());
        }
        
        Integer rating = 5;
        if (request.get("rating") != null) {
            try {
                rating = Integer.parseInt(request.get("rating").toString());
            } catch (NumberFormatException e) {
                // Keep default 5
            }
        }
        review.setRating(rating);
        
        reviewRepository.save(review);
        
        return ResponseEntity.ok(Map.of("message", "Đã lưu đánh giá thành công."));
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<ReviewDTO>> getSellerReviews(@PathVariable Integer sellerId) {
        List<Review> reviews = reviewRepository.findByProduct_Seller_UserIdOrderByCreatedAtDesc(sellerId);
        List<ReviewDTO> dtos = reviews.stream()
                .map(this::convertToReviewDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/upload-proof")
    public ResponseEntity<?> uploadProof(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "File không được trống"));
        }

        String contentType = file.getContentType();
        if (contentType == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Định dạng file không hợp lệ."));
        }

        boolean isImage = contentType.startsWith("image/");
        boolean isVideo = contentType.startsWith("video/");
        if (!isImage && !isVideo) {
            return ResponseEntity.badRequest().body(Map.of("message", "Chỉ chấp nhận file hình ảnh hoặc video làm bằng chứng."));
        }

        try {
            Map<?, ?> uploadResult = cloudinaryService.uploadProof(file);
            String fileUrl = (String) uploadResult.get("secure_url");
            return ResponseEntity.ok(Map.of(
                "fileUrl", fileUrl,
                "fileType", isImage ? "image" : "video"
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Lỗi upload lên Cloudinary: " + e.getMessage()));
        }
    }

    @PostMapping("/{reviewId}/report")
    public ResponseEntity<?> reportReview(@PathVariable Integer reviewId, @RequestBody Map<String, Object> request) {
        String reason = (String) request.get("reason");
        Integer reporterId = (Integer) request.get("reporterId");
        String proofImage = (String) request.get("proofImage");
        String proofVideo = (String) request.get("proofVideo");

        if (reason == null || reason.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Lý do báo cáo không được để trống."));
        }
        if (reporterId == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "reporterId là bắt buộc."));
        }

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đánh giá."));

        Product product = review.getProduct();
        if (product == null || product.getSeller() == null || !product.getSeller().getUserId().equals(reporterId)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Chỉ người bán của sản phẩm mới có quyền báo cáo đánh giá này."));
        }

        Optional<ReviewReport> existingReport = reviewReportRepository.findByReview_ReviewId(reviewId);
        ReviewReport report;
        if (existingReport.isPresent()) {
            report = existingReport.get();
            report.setReason(reason);
            report.setProofImage(proofImage);
            report.setProofVideo(proofVideo);
            report.setStatus("PENDING");
            report.setCreatedAt(LocalDateTime.now());
        } else {
            report = new ReviewReport();
            report.setReview(review);
            report.setReporter(product.getSeller());
            report.setReason(reason);
            report.setProofImage(proofImage);
            report.setProofVideo(proofVideo);
            report.setStatus("PENDING");
            report.setCreatedAt(LocalDateTime.now());
        }

        reviewReportRepository.save(report);
        return ResponseEntity.ok(Map.of("message", "Đã gửi báo cáo đánh giá thành công. Đang chờ quản trị viên xử lý."));
    }

    @GetMapping("/reports")
    public ResponseEntity<List<ReviewReportDTO>> getAllReports() {
        List<ReviewReport> reports = reviewReportRepository.findAll();
        List<ReviewReportDTO> dtos = reports.stream().map(report -> {
            ReviewReportDTO dto = new ReviewReportDTO();
            dto.setReportId(report.getReportId());
            dto.setReviewId(report.getReview().getReviewId());
            dto.setReviewComment(report.getReview().getComment());
            dto.setReviewRating(report.getReview().getRating());
            dto.setReviewerName(report.getReview().getReviewer().getFullName());
            dto.setReporterName(report.getReporter().getFullName());
            dto.setReason(report.getReason());
            dto.setStatus(report.getStatus());
            dto.setCreatedAt(report.getCreatedAt());
            dto.setProofImage(report.getProofImage());
            dto.setProofVideo(report.getProofVideo());
            if (report.getReview().getProduct() != null) {
                dto.setProductId(report.getReview().getProduct().getProductId());
                dto.setProductTitle(report.getReview().getProduct().getTitle());
            }
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/reports/{reportId}/approve")
    public ResponseEntity<?> approveReport(@PathVariable Integer reportId) {
        ReviewReport report = reviewReportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy báo cáo."));

        Review review = report.getReview();
        reviewRepository.delete(review);

        return ResponseEntity.ok(Map.of("message", "Đã phê duyệt báo cáo và xóa đánh giá vi phạm thành công."));
    }

    @PostMapping("/reports/{reportId}/reject")
    public ResponseEntity<?> rejectReport(@PathVariable Integer reportId) {
        ReviewReport report = reviewReportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy báo cáo."));

        report.setStatus("REJECTED");
        reviewReportRepository.save(report);

        return ResponseEntity.ok(Map.of("message", "Đã từ chối báo cáo và giữ lại đánh giá."));
    }
}
