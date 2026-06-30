package com.nhom5.backend.service;

import com.nhom5.backend.config.VNPayConfig;
import com.nhom5.backend.entity.BoostTransaction;
import com.nhom5.backend.entity.Product;
import com.nhom5.backend.repository.BoostTransactionRepository;
import com.nhom5.backend.repository.ProductRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class BoostService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BoostTransactionRepository boostTransactionRepository;

    @Autowired
    private VNPayConfig vnPayConfig;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Transactional
    public String createBoostPaymentUrl(Integer productId, String packageName, HttpServletRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại"));

        double price;
        switch (packageName) {
            case "Cơ Bản":
                price = 5000.0;
                break;
            case "Tiêu Chuẩn":
                price = 15000.0;
                break;
            case "Premium":
                price = 30000.0;
                break;
            default:
                throw new IllegalArgumentException("Gói dịch vụ không hợp lệ");
        }

        // Tạo mã giao dịch duy nhất
        String transactionId = "BST_" + System.currentTimeMillis() + "_" + productId;

        BoostTransaction transaction = BoostTransaction.builder()
                .transactionId(transactionId)
                .user(product.getSeller())
                .product(product)
                .packageName(packageName)
                .amount(BigDecimal.valueOf(price))
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .paymentMethod("VNPay")
                .build();

        boostTransactionRepository.save(transaction);

        // Sinh URL VNPay
        return generateBoostVNPayUrl(transactionId, price, request);
    }

    private String generateBoostVNPayUrl(String txnRef, double price, HttpServletRequest request) {
        String vnp_Version = vnPayConfig.getVersion();
        String vnp_Command = vnPayConfig.getCommand();
        String vnp_OrderInfo = "Thanh toan day tin dang " + txnRef;
        String vnp_OrderType = "other";
        String vnp_TmnCode = vnPayConfig.getTmnCode();

        long amount = (long) (price * 100);

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", txnRef);
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.put("vnp_OrderType", vnp_OrderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        vnp_Params.put("vnp_IpAddr", vnPayConfig.getIpAddress(request));

        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        vnp_Params.put("vnp_CreateDate", now.format(formatter));

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        boolean first = true;
        for (String fieldName : fieldNames) {
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                if (!first) {
                    hashData.append('&');
                    query.append('&');
                }
                hashData.append(urlEncode(fieldName));
                hashData.append('=');
                hashData.append(urlEncode(fieldValue));
                
                query.append(urlEncode(fieldName));
                query.append('=');
                query.append(urlEncode(fieldValue));
                
                first = false;
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = vnPayConfig.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash.toUpperCase();
        return vnPayConfig.getPayUrl() + "?" + queryUrl;
    }

    private String urlEncode(String value) {
        try {
            return java.net.URLEncoder.encode(value, java.nio.charset.StandardCharsets.UTF_8.toString());
        } catch (Exception e) {
            return "";
        }
    }

    @Transactional
    public String processBoostCallback(Map<String, String> params) {
        String vnp_SecureHash = params.get("vnp_SecureHash");
        String vnp_TxnRef = params.get("vnp_TxnRef");
        String vnp_ResponseCode = params.get("vnp_ResponseCode");

        // Verify signature
        boolean isSignatureValid = verifyVNPaySignature(params, vnp_SecureHash);
        if (!isSignatureValid) {
            return frontendUrl + "/seller?status=boost_fail&error=invalid_signature";
        }

        String[] parts = vnp_TxnRef.split("_");
        Integer productId = Integer.parseInt(parts[2]);

        BoostTransaction transaction = boostTransactionRepository.findById(vnp_TxnRef).orElse(null);
        if (transaction == null) {
            return frontendUrl + "/seller?status=boost_fail&error=transaction_not_found";
        }

        if ("00".equals(vnp_ResponseCode)) {
            // Thanh toán thành công
            transaction.setStatus("SUCCESS");
            boostTransactionRepository.save(transaction);

            // Kích hoạt boost cho sản phẩm
            Product product = transaction.getProduct();
            product.setIsBoosted(true);
            product.setBoostedAt(LocalDateTime.now());

            int days = 3;
            switch (transaction.getPackageName()) {
                case "Cơ Bản":
                    days = 3;
                    break;
                case "Tiêu Chuẩn":
                    days = 7;
                    break;
                case "Premium":
                    days = 14;
                    break;
            }
            product.setBoostExpiresAt(LocalDateTime.now().plusDays(days));
            productRepository.save(product);

            return frontendUrl + "/seller?status=boost_success&productId=" + productId;
        } else {
            // Thanh toán thất bại
            transaction.setStatus("FAILED");
            boostTransactionRepository.save(transaction);
            return frontendUrl + "/seller?status=boost_fail&productId=" + productId;
        }
    }

    private boolean verifyVNPaySignature(Map<String, String> params, String secureHash) {
        Map<String, String> fields = new HashMap<>();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            if (value != null && value.length() > 0 && !key.equals("vnp_SecureHash") && !key.equals("vnp_SecureHashType")) {
                fields.put(key, value);
            }
        }
        
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder sb = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = fields.get(fieldName);
            sb.append(fieldName);
            sb.append("=");
            try {
                sb.append(java.net.URLEncoder.encode(fieldValue, java.nio.charset.StandardCharsets.US_ASCII.toString()));
            } catch (Exception e) {
                // ignore
            }
            if (itr.hasNext()) {
                sb.append("&");
            }
        }
        String calculatedHash = vnPayConfig.hmacSHA512(vnPayConfig.getHashSecret(), sb.toString());
        return calculatedHash.equalsIgnoreCase(secureHash);
    }

    // Cron job chạy mỗi giờ để kiểm tra và hết hạn bài boost
    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void deactivateExpiredBoosts() {
        List<Product> activeBoostedProducts = productRepository.findByApprovalStatusAndIsDeletedFalseAndIsHiddenFalse("approved");
        LocalDateTime now = LocalDateTime.now();
        for (Product product : activeBoostedProducts) {
            if (Boolean.TRUE.equals(product.getIsBoosted()) && product.getBoostExpiresAt() != null && product.getBoostExpiresAt().isBefore(now)) {
                product.setIsBoosted(false);
                productRepository.save(product);
            }
        }
    }

    // API lấy tất cả giao dịch cho admin
    public List<BoostTransaction> getAllBoostTransactions() {
        return boostTransactionRepository.findAllByOrderByCreatedAtDesc();
    }

    // Lấy giao dịch theo userId của người bán
    public List<BoostTransaction> getBoostTransactionsByUser(Integer userId) {
        return boostTransactionRepository.findByUserUserIdOrderByCreatedAtDesc(userId);
    }

    // Cron job chạy mỗi 5 phút để chuyển trạng thái các giao dịch PENDING quá 15 phút thành FAILED
    @Scheduled(cron = "0 */5 * * * *")
    @Transactional
    public void cleanupExpiredPendingTransactions() {
        List<BoostTransaction> pendingTransactions = boostTransactionRepository.findAll();
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(15);
        for (BoostTransaction tx : pendingTransactions) {
            if ("PENDING".equals(tx.getStatus()) && tx.getCreatedAt().isBefore(threshold)) {
                tx.setStatus("FAILED");
                boostTransactionRepository.save(tx);
            }
        }
    }
}
