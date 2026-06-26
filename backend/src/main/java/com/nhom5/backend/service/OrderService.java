package com.nhom5.backend.service;

import com.nhom5.backend.config.VNPayConfig;
import com.nhom5.backend.dto.OrderRequest;
import com.nhom5.backend.dto.OrderResponse;
import com.nhom5.backend.dto.ProductDTO;
import com.nhom5.backend.dto.UserDTO;
import com.nhom5.backend.dto.OrderItemRequest;
import com.nhom5.backend.dto.OrderDetailDTO;
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
        List<OrderItemRequest> items = request.getItems();
        if (items == null || items.isEmpty()) {
            if (request.getProductId() == null) {
                throw new IllegalArgumentException("Mã sản phẩm không được trống.");
            }
            OrderItemRequest singleItem = new OrderItemRequest();
            singleItem.setProductId(request.getProductId());
            singleItem.setQuantity(1);
            items = Collections.singletonList(singleItem);
        }

        User buyer = userRepository.findById(request.getBuyerId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin người mua."));

        // Group products by seller
        Map<User, List<OrderItemRequest>> sellerGroups = new HashMap<>();
        Map<Integer, Product> productMap = new HashMap<>();

        for (OrderItemRequest item : items) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm với ID: " + item.getProductId()));

            if (!"available".equals(product.getStatus())) {
                throw new IllegalArgumentException("Sản phẩm '" + product.getTitle() + "' không còn khả dụng để mua.");
            }

            User seller = product.getSeller();
            if (seller == null) {
                throw new IllegalArgumentException("Không tìm thấy thông tin người bán cho sản phẩm '" + product.getTitle() + "'.");
            }

            if (buyer.getUserId().equals(seller.getUserId())) {
                throw new IllegalArgumentException("Bạn không thể mua sản phẩm của chính mình ('" + product.getTitle() + "').");
            }

            productMap.put(product.getProductId(), product);

            User existingSellerKey = null;
            for (User key : sellerGroups.keySet()) {
                if (key.getUserId().equals(seller.getUserId())) {
                    existingSellerKey = key;
                    break;
                }
            }
            if (existingSellerKey == null) {
                sellerGroups.put(seller, new ArrayList<>(Collections.singletonList(item)));
            } else {
                sellerGroups.get(existingSellerKey).add(item);
            }
        }

        List<Order> createdOrders = new ArrayList<>();
        List<OrderDetailDTO> allOrderDetailDTOs = new ArrayList<>();
        double grandTotalPrice = 0.0;
        String paymentMethod = request.getPaymentMethod();
        String initialStatus = "vnpay".equalsIgnoreCase(paymentMethod) ? "PENDING_PAYMENT" : "PENDING";

        double shippingFee = "home".equalsIgnoreCase(request.getDeliveryMethod()) ? 20000.0 : 0.0;
        double voucherDiscount = 10000.0;

        int sellerIndex = 0;
        for (Map.Entry<User, List<OrderItemRequest>> entry : sellerGroups.entrySet()) {
            User seller = entry.getKey();
            List<OrderItemRequest> groupItems = entry.getValue();

            double subtotal = 0.0;
            for (OrderItemRequest item : groupItems) {
                Product p = productMap.get(item.getProductId());
                subtotal += p.getPrice() * item.getQuantity();
            }

            double orderShipping = (sellerIndex == 0) ? shippingFee : 0.0;
            double orderVoucher = (sellerIndex == 0) ? voucherDiscount : 0.0;
            double orderTotal = subtotal + orderShipping - orderVoucher;
            if (orderTotal < 0) {
                orderTotal = 0.0;
            }

            String orderCode;
            do {
                orderCode = "DH" + (100000 + new Random().nextInt(900000));
            } while (orderRepository.findByOrderCode(orderCode).isPresent());

            Order order = Order.builder()
                    .orderCode(orderCode)
                    .buyer(buyer)
                    .seller(seller)
                    .totalPrice(orderTotal)
                    .status(initialStatus)
                    .paymentMethod(paymentMethod)
                    .receiverName(request.getFullName())
                    .receiverPhone(request.getPhone())
                    .deliveryMethod(request.getDeliveryMethod())
                    .university(request.getUniversity())
                    .dormInfo(request.getDormInfo())
                    .specificAddress(request.getSpecificAddress())
                    .notes(request.getNotes())
                    .orderDate(LocalDateTime.now())
                    .build();

            if ("cod".equalsIgnoreCase(paymentMethod)) {
                for (OrderItemRequest item : groupItems) {
                    Product p = productMap.get(item.getProductId());
                    p.setStatus("sold");
                    productRepository.save(p);
                }
            }

            Order savedOrder = orderRepository.save(order);
            createdOrders.add(savedOrder);
            grandTotalPrice += orderTotal;

            for (OrderItemRequest item : groupItems) {
                Product p = productMap.get(item.getProductId());
                OrderDetail orderDetail = OrderDetail.builder()
                        .order(savedOrder)
                        .product(p)
                        .quantity(item.getQuantity())
                        .unitPrice(p.getPrice())
                        .build();
                orderDetailRepository.save(orderDetail);

                OrderDetailDTO detailDTO = new OrderDetailDTO();
                detailDTO.setOrderDetailId(orderDetail.getOrderDetailId());
                detailDTO.setProduct(productService.convertToDTO(p));
                detailDTO.setQuantity(item.getQuantity());
                detailDTO.setUnitPrice(p.getPrice());
                allOrderDetailDTOs.add(detailDTO);
            }

            sellerIndex++;
        }

        OrderResponse response = new OrderResponse();
        Order firstOrder = createdOrders.get(0);
        response.setOrderId(firstOrder.getOrderId());

        StringBuilder combinedCode = new StringBuilder();
        for (int i = 0; i < createdOrders.size(); i++) {
            combinedCode.append(createdOrders.get(i).getOrderCode());
            if (i < createdOrders.size() - 1) {
                combinedCode.append("_");
            }
        }
        response.setOrderCode(combinedCode.toString());
        response.setBuyer(convertToUserDTO(firstOrder.getBuyer()));
        response.setSeller(convertToUserDTO(firstOrder.getSeller()));

        if (!allOrderDetailDTOs.isEmpty()) {
            response.setProduct(allOrderDetailDTOs.get(0).getProduct());
        }

        response.setDetails(allOrderDetailDTOs);
        response.setTotalPrice(grandTotalPrice);
        response.setStatus(firstOrder.getStatus());
        response.setPaymentMethod(firstOrder.getPaymentMethod());
        response.setReceiverName(firstOrder.getReceiverName());
        response.setReceiverPhone(firstOrder.getReceiverPhone());
        response.setDeliveryMethod(firstOrder.getDeliveryMethod());
        response.setUniversity(firstOrder.getUniversity());
        response.setDormInfo(firstOrder.getDormInfo());
        response.setSpecificAddress(firstOrder.getSpecificAddress());
        response.setNotes(firstOrder.getNotes());
        response.setOrderDate(firstOrder.getOrderDate());

        if ("vnpay".equalsIgnoreCase(paymentMethod)) {
            String paymentUrl = generateCombinedVNPayUrl(combinedCode.toString(), grandTotalPrice, httpRequest);
            response.setPaymentUrl(paymentUrl);
        }

        return response;
    }

    @Transactional
    public OrderResponse getOrderByCode(String orderCode) {
        if (orderCode.contains("_")) {
            String[] codes = orderCode.split("_");
            OrderResponse combinedResponse = null;
            List<OrderDetailDTO> combinedDetails = new ArrayList<>();
            double combinedTotalPrice = 0.0;

            for (String code : codes) {
                Order order = orderRepository.findByOrderCode(code)
                        .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng: " + code));
                OrderResponse resp = convertToResponse(order);
                if (combinedResponse == null) {
                    combinedResponse = resp;
                }
                if (resp.getDetails() != null) {
                    combinedDetails.addAll(resp.getDetails());
                }
                combinedTotalPrice += resp.getTotalPrice();
            }
            if (combinedResponse != null) {
                combinedResponse.setOrderCode(orderCode);
                combinedResponse.setDetails(combinedDetails);
                combinedResponse.setTotalPrice(combinedTotalPrice);
                if (!combinedDetails.isEmpty()) {
                    combinedResponse.setProduct(combinedDetails.get(0).getProduct());
                }
            }
            return combinedResponse;
        } else {
            Order order = orderRepository.findByOrderCode(orderCode)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng."));
            return convertToResponse(order);
        }
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
        String vnp_TxnRef = params.get("vnp_TxnRef"); // Order Code (can be combined like DH111111_DH222222)
        String vnp_ResponseCode = params.get("vnp_ResponseCode");

        // Verify Signature
        boolean isSignatureValid = verifyVNPaySignature(params, vnp_SecureHash);

        String[] orderCodes = vnp_TxnRef.split("_");
        
        // Find first order to determine product redirect page
        Order firstOrder = orderRepository.findByOrderCode(orderCodes[0])
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng tương ứng với mã giao dịch VNPay."));

        List<OrderDetail> firstDetails = orderDetailRepository.findByOrder_OrderId(firstOrder.getOrderId());
        Integer productId = (firstDetails != null && !firstDetails.isEmpty()) 
                ? firstDetails.get(0).getProduct().getProductId() 
                : 1;

        if (isSignatureValid && "00".equals(vnp_ResponseCode)) {
            // Payment success: Set status to PAID and mark products as sold
            for (String code : orderCodes) {
                Order order = orderRepository.findByOrderCode(code).orElse(null);
                if (order != null) {
                    order.setStatus("PAID");
                    order.setStatusDate(LocalDateTime.now());
                    orderRepository.save(order);

                    List<OrderDetail> details = orderDetailRepository.findByOrder_OrderId(order.getOrderId());
                    if (details != null) {
                        for (OrderDetail detail : details) {
                            Product product = detail.getProduct();
                            product.setStatus("sold");
                            productRepository.save(product);
                        }
                    }
                }
            }

            if (orderCodes.length > 1) {
                return "http://localhost:5173/checkout/cart?status=success&orderCode=" + vnp_TxnRef;
            } else {
                return "http://localhost:5173/checkout/" + productId + "?status=success&orderCode=" + vnp_TxnRef;
            }
        } else {
            // Payment failed or cancelled: Set status to CANCELLED
            for (String code : orderCodes) {
                Order order = orderRepository.findByOrderCode(code).orElse(null);
                if (order != null) {
                    order.setStatus("CANCELLED");
                    order.setStatusDate(LocalDateTime.now());
                    orderRepository.save(order);
                }
            }

            if (orderCodes.length > 1) {
                return "http://localhost:5173/checkout/cart?status=fail&orderCode=" + vnp_TxnRef;
            } else {
                return "http://localhost:5173/checkout/" + productId + "?status=fail&orderCode=" + vnp_TxnRef;
            }
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

    private String generateCombinedVNPayUrl(String combinedCode, double totalPrice, HttpServletRequest request) {
        String vnp_Version = vnPayConfig.getVersion();
        String vnp_Command = vnPayConfig.getCommand();
        String vnp_TxnRef = combinedCode;
        String vnp_OrderInfo = "Thanh toan don hang " + vnp_TxnRef;
        String vnp_OrderType = "other";
        String vnp_TmnCode = vnPayConfig.getTmnCode();

        long amount = (long) (totalPrice * 100);

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
        List<OrderDetailDTO> detailDTOs = new ArrayList<>();
        if (details != null && !details.isEmpty()) {
            response.setProduct(productService.convertToDTO(details.get(0).getProduct()));
            for (OrderDetail detail : details) {
                OrderDetailDTO detailDTO = new OrderDetailDTO();
                detailDTO.setOrderDetailId(detail.getOrderDetailId());
                detailDTO.setProduct(productService.convertToDTO(detail.getProduct()));
                detailDTO.setQuantity(detail.getQuantity());
                detailDTO.setUnitPrice(detail.getUnitPrice());
                detailDTOs.add(detailDTO);
            }
        }
        response.setDetails(detailDTOs);

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
    public OrderResponse confirmReceipt(Integer orderId, Integer userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng."));

        if (!order.getBuyer().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Bạn không có quyền xác nhận đơn hàng này.");
        }

        if (!"PAID".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalArgumentException("Chỉ đơn hàng đã thanh toán trực tuyến mới cần xác nhận nhận hàng.");
        }

        order.setStatus("COMPLETED");
        order.setStatusDate(LocalDateTime.now());
        Order savedOrder = orderRepository.save(order);

        return convertToResponse(savedOrder);
    }

    @Transactional
    public OrderResponse requestRefund(Integer orderId, Integer userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng."));

        if (!order.getBuyer().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Bạn không có quyền yêu cầu hoàn tiền cho đơn hàng này.");
        }

        if (!"PAID".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalArgumentException("Chỉ đơn hàng đã thanh toán trực tuyến (sàn giữ tiền) mới có thể yêu cầu hoàn tiền.");
        }

        order.setStatus("REFUND_REQUESTED");
        order.setStatusDate(LocalDateTime.now());
        Order savedOrder = orderRepository.save(order);

        return convertToResponse(savedOrder);
    }

    @Transactional
    public OrderResponse sellerHandleRefund(Integer orderId, Integer sellerId, String action) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng."));

        if (!order.getSeller().getUserId().equals(sellerId)) {
            throw new IllegalArgumentException("Bạn không có quyền xử lý yêu cầu hoàn tiền cho đơn hàng này.");
        }

        if (!"REFUND_REQUESTED".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalArgumentException("Đơn hàng không ở trạng thái yêu cầu hoàn tiền.");
        }

        if ("approve".equalsIgnoreCase(action)) {
            order.setStatus("REFUNDED");
            order.setStatusDate(LocalDateTime.now());

            List<OrderDetail> details = orderDetailRepository.findByOrder_OrderId(order.getOrderId());
            if (details != null) {
                for (OrderDetail detail : details) {
                    Product product = detail.getProduct();
                    product.setStatus("available");
                    productRepository.save(product);
                }
            }
        } else if ("reject".equalsIgnoreCase(action)) {
            order.setStatus("DISPUTED");
            order.setStatusDate(LocalDateTime.now());
        } else {
            throw new IllegalArgumentException("Hành động không hợp lệ: " + action);
        }

        Order savedOrder = orderRepository.save(order);
        return convertToResponse(savedOrder);
    }

    @Transactional
    public OrderResponse adminHandleRefund(Integer orderId, String action) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng."));

        if (!"REFUND_REQUESTED".equalsIgnoreCase(order.getStatus()) && !"DISPUTED".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalArgumentException("Chỉ đơn hàng đang yêu cầu hoàn tiền hoặc có tranh chấp mới cần Admin xử lý.");
        }

        if ("approve".equalsIgnoreCase(action)) {
            order.setStatus("REFUNDED");
            order.setStatusDate(LocalDateTime.now());

            List<OrderDetail> details = orderDetailRepository.findByOrder_OrderId(order.getOrderId());
            if (details != null) {
                for (OrderDetail detail : details) {
                    Product product = detail.getProduct();
                    product.setStatus("available");
                    productRepository.save(product);
                }
            }
        } else if ("complete".equalsIgnoreCase(action)) {
            order.setStatus("COMPLETED");
            order.setStatusDate(LocalDateTime.now());
        } else {
            throw new IllegalArgumentException("Hành động không hợp lệ: " + action);
        }

        Order savedOrder = orderRepository.save(order);
        return convertToResponse(savedOrder);
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

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrdersForAdmin() {
        List<Order> orders = orderRepository.findAllByOrderByOrderDateDesc();
        List<OrderResponse> responses = new ArrayList<>();
        for (Order order : orders) {
            responses.add(convertToResponse(order));
        }
        return responses;
    }

    @Transactional
    public OrderResponse forceCancelOrder(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng."));

        if ("CANCELLED".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalArgumentException("Đơn hàng này đã được hủy trước đó.");
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
