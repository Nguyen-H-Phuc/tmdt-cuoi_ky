package com.nhom5.backend.service;

import com.nhom5.backend.config.VNPayConfig;
import com.nhom5.backend.dto.OrderRequest;
import com.nhom5.backend.dto.OrderResponse;
import com.nhom5.backend.dto.ProductDTO;
import com.nhom5.backend.dto.UserDTO;
import com.nhom5.backend.entity.Order;
import com.nhom5.backend.entity.OrderDetail;
import com.nhom5.backend.entity.Product;
import com.nhom5.backend.entity.User;
import com.nhom5.backend.repository.OrderDetailRepository;
import com.nhom5.backend.repository.OrderRepository;
import com.nhom5.backend.repository.ProductRepository;
import com.nhom5.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private VNPayConfig vnPayConfig;

    @Transactional
    public OrderResponse createOrder(OrderRequest request, HttpServletRequest httpRequest) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm."));

        if (!"available".equals(product.getStatus())) {
            throw new IllegalArgumentException("Sản phẩm này không còn khả dụng để mua.");
        }

        User buyer = userRepository.findById(request.getBuyerId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin người mua."));

        User seller = product.getSeller();
        if (seller == null) {
            throw new IllegalArgumentException("Không tìm thấy thông tin người bán.");
        }

        if (buyer.getUserId().equals(seller.getUserId())) {
            throw new IllegalArgumentException("Bạn không thể mua sản phẩm của chính mình.");
        }

        // Calculate Pricing
        // Shipping fee: 20,000 VND for home delivery, 0 for campus pickup
        double shippingFee = "home".equalsIgnoreCase(request.getDeliveryMethod()) ? 20000.0 : 0.0;
        // Default voucher discount for student exchange app is 10,000 VND
        double voucherDiscount = 10000.0;
        double totalPrice = product.getPrice() + shippingFee - voucherDiscount;
        if (totalPrice < 0) {
            totalPrice = 0.0;
        }

        // Generate custom order code (e.g. DH123456)
        String orderCode;
        do {
            orderCode = "DH" + (100000 + new Random().nextInt(900000));
        } while (orderRepository.findByOrderCode(orderCode).isPresent());

        // Initial status
        String status = "vnpay".equalsIgnoreCase(request.getPaymentMethod()) ? "PENDING_PAYMENT" : "PENDING";

        Order order = Order.builder()
                .orderCode(orderCode)
                .buyer(buyer)
                .seller(seller)
                .totalPrice(totalPrice)
                .status(status)
                .paymentMethod(request.getPaymentMethod())
                .receiverName(request.getFullName())
                .receiverPhone(request.getPhone())
                .deliveryMethod(request.getDeliveryMethod())
                .university(request.getUniversity())
                .dormInfo(request.getDormInfo())
                .specificAddress(request.getSpecificAddress())
                .notes(request.getNotes())
                .orderDate(LocalDateTime.now())
                .build();

        // If COD: mark product as sold immediately
        if ("cod".equalsIgnoreCase(request.getPaymentMethod())) {
            product.setStatus("sold");
            productRepository.save(product);
        }

        Order savedOrder = orderRepository.save(order);

        // Save order details
        OrderDetail orderDetail = OrderDetail.builder()
                .order(savedOrder)
                .product(product)
                .quantity(1)
                .unitPrice(product.getPrice())
                .build();
        orderDetailRepository.save(orderDetail);

        OrderResponse response = convertToResponse(savedOrder);

        // Generate VNPAY payment url if paymentMethod is vnpay
        if ("vnpay".equalsIgnoreCase(request.getPaymentMethod())) {
            String paymentUrl = generateVNPayUrl(savedOrder, httpRequest);
            response.setPaymentUrl(paymentUrl);
        }

        return response;
    }

    @Transactional
    public OrderResponse getOrderByCode(String orderCode) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng."));
        return convertToResponse(order);
    }

    @Transactional
    public List<OrderResponse> getOrdersByBuyer(Integer buyerId) {
        List<Order> orders = orderRepository.findByBuyer_UserIdOrderByOrderDateDesc(buyerId);
        List<OrderResponse> responses = new ArrayList<>();
        for (Order order : orders) {
            responses.add(convertToResponse(order));
        }
        return responses;
    }

    @Transactional
    public OrderResponse cancelOrder(Integer orderId, Integer userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng."));

        if (!order.getBuyer().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Bạn không có quyền hủy đơn hàng này.");
        }

        if (!"PENDING".equalsIgnoreCase(order.getStatus()) && !"PENDING_PAYMENT".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalArgumentException("Đơn hàng này không thể hủy vì đã ở trạng thái: " + order.getStatus());
        }

        order.setStatus("CANCELLED");
        order.setStatusDate(LocalDateTime.now());
        Order savedOrder = orderRepository.save(order);

        List<OrderDetail> details = orderDetailRepository.findByOrder_OrderId(order.getOrderId());
        if (details != null && !details.isEmpty()) {
            Product product = details.get(0).getProduct();
            product.setStatus("available");
            productRepository.save(product);
        }

        return convertToResponse(savedOrder);
    }

    @Transactional
    public String processVNPayCallback(Map<String, String> params) {
        String vnp_SecureHash = params.get("vnp_SecureHash");
        String vnp_TxnRef = params.get("vnp_TxnRef"); // Order Code
        String vnp_ResponseCode = params.get("vnp_ResponseCode");

        // Verify Signature
        boolean isSignatureValid = verifyVNPaySignature(params, vnp_SecureHash);

        Order order = orderRepository.findByOrderCode(vnp_TxnRef)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng tương ứng với mã giao dịch VNPay."));

        List<OrderDetail> details = orderDetailRepository.findByOrder_OrderId(order.getOrderId());
        if (details == null || details.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy chi tiết sản phẩm cho đơn hàng này.");
        }
        Product product = details.get(0).getProduct();
        Integer productId = product.getProductId();

        if (isSignatureValid && "00".equals(vnp_ResponseCode)) {
            // Payment success
            order.setStatus("COMPLETED");
            order.setStatusDate(LocalDateTime.now());
            orderRepository.save(order);

            // Mark product as sold
            product.setStatus("sold");
            productRepository.save(product);

            // Redirect back to frontend success result
            return "http://localhost:5173/checkout/" + productId + "?status=success&orderCode=" + vnp_TxnRef;
        } else {
            // Payment failed or cancelled
            order.setStatus("CANCELLED");
            order.setStatusDate(LocalDateTime.now());
            orderRepository.save(order);

            return "http://localhost:5173/checkout/" + productId + "?status=fail&orderCode=" + vnp_TxnRef;
        }
    }

    private String urlEncode(String value) {
        try {
            return java.net.URLEncoder.encode(value, java.nio.charset.StandardCharsets.UTF_8.toString());
        } catch (Exception e) {
            return "";
        }
    }

    private boolean verifyVNPaySignature(Map<String, String> params, String secureHash) {
        Map<String, String> fields = new HashMap<>(params);
        fields.remove("vnp_SecureHashType");
        fields.remove("vnp_SecureHash");

        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = fields.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(urlEncode(fieldValue));
                if (itr.hasNext()) {
                    hashData.append('&');
                }
            }
        }
        String calculatedHash = vnPayConfig.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
        return calculatedHash.equalsIgnoreCase(secureHash);
    }

    private String generateVNPayUrl(Order order, HttpServletRequest request) {
        String vnp_Version = vnPayConfig.getVersion();
        String vnp_Command = vnPayConfig.getCommand();
        String vnp_TxnRef = order.getOrderCode();
        String vnp_OrderInfo = "Thanh toan don hang " + vnp_TxnRef;
        String vnp_OrderType = "other";
        String vnp_TmnCode = vnPayConfig.getTmnCode();

        long amount = (long) (order.getTotalPrice() * 100);

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
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

    private OrderResponse convertToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getOrderId());
        response.setOrderCode(order.getOrderCode());
        response.setTotalPrice(order.getTotalPrice());
        response.setStatus(order.getStatus());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setReceiverName(order.getReceiverName());
        response.setReceiverPhone(order.getReceiverPhone());
        response.setDeliveryMethod(order.getDeliveryMethod());
        response.setUniversity(order.getUniversity());
        response.setDormInfo(order.getDormInfo());
        response.setSpecificAddress(order.getSpecificAddress());
        response.setNotes(order.getNotes());
        response.setOrderDate(order.getOrderDate());
        response.setStatusDate(order.getStatusDate());

        if (order.getBuyer() != null) {
            response.setBuyer(convertToUserDTO(order.getBuyer()));
        }
        if (order.getSeller() != null) {
            response.setSeller(convertToUserDTO(order.getSeller()));
        }
        List<OrderDetail> details = orderDetailRepository.findByOrder_OrderId(order.getOrderId());
        if (details != null && !details.isEmpty()) {
            response.setProduct(productService.convertToDTO(details.get(0).getProduct()));
        }

        return response;
    }

    private UserDTO convertToUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setAvatar(user.getAvatar());
        dto.setIsActive(user.getIsActive());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    @Transactional
    public List<OrderResponse> getOrdersBySeller(Integer sellerId) {
        List<Order> orders = orderRepository.findBySeller_UserIdOrderByOrderDateDesc(sellerId);
        List<OrderResponse> responses = new ArrayList<>();
        for (Order order : orders) {
            responses.add(convertToResponse(order));
        }
        return responses;
    }

    @Transactional
    public OrderResponse acceptOrder(Integer orderId, Integer sellerId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng."));

        if (!order.getSeller().getUserId().equals(sellerId)) {
            throw new IllegalArgumentException("Bạn không có quyền xác nhận đơn hàng này.");
        }

        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalArgumentException("Chỉ đơn hàng ở trạng thái Chờ xác nhận mới có thể duyệt.");
        }

        order.setStatus("COMPLETED");
        order.setStatusDate(LocalDateTime.now());
        Order savedOrder = orderRepository.save(order);

        return convertToResponse(savedOrder);
    }

    @Transactional
    public OrderResponse rejectOrder(Integer orderId, Integer sellerId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng."));

        if (!order.getSeller().getUserId().equals(sellerId)) {
            throw new IllegalArgumentException("Bạn không có quyền từ chối đơn hàng này.");
        }

        if (!"PENDING".equalsIgnoreCase(order.getStatus()) && !"PENDING_PAYMENT".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalArgumentException("Chỉ đơn hàng ở trạng thái Chờ xác nhận hoặc Chờ thanh toán mới có thể từ chối.");
        }

        order.setStatus("CANCELLED");
        order.setStatusDate(LocalDateTime.now());
        Order savedOrder = orderRepository.save(order);

        List<OrderDetail> details = orderDetailRepository.findByOrder_OrderId(order.getOrderId());
        if (details != null && !details.isEmpty()) {
            Product product = details.get(0).getProduct();
            product.setStatus("available");
            productRepository.save(product);
        }

        return convertToResponse(savedOrder);
    }
}
