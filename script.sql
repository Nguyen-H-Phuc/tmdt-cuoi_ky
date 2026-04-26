CREATE DATABASE tmdt_db;

CREATE TABLE users (
   user_id INT PRIMARY KEY AUTO_INCREMENT,
   full_name VARCHAR(100) NOT NULL,
   email VARCHAR(100) UNIQUE NOT NULL, -- Email là định danh duy nhất để gộp các phương thức
   phone VARCHAR(15) NULL,
   address TEXT NULL,
   avatar VARCHAR(255) NULL,
   role ENUM('admin', 'member') DEFAULT 'member',
   is_active BOOLEAN DEFAULT FALSE, -- Mặc định false cho đến khi verify email
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE social_accounts (
    social_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    provider ENUM('google', 'facebook') NOT NULL,
    provider_id VARCHAR(255) NOT NULL, -- ID định danh từ phía GG/FB
    email VARCHAR(100), -- Email từ phía social trả về
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE(provider, provider_id)
);

CREATE TABLE local_accounts (
    user_id INT PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    is_email_verified BOOLEAN DEFAULT FALSE,
    verification_code VARCHAR(6) NULL, -- Dùng cho OTP
    code_expired_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE password_resets (
    reset_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
);

CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL
);

CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT, -- Người đăng tin (chủ gian hàng)
    category_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) DEFAULT 0, -- Giá (có thể để 0 nếu là tặng đồ)
    image_url VARCHAR(255),
    view_count INT DEFAULT 0, -- Phục vụ chức năng "Xem nhiều nhất"
    status ENUM('available', 'sold') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE cart_items (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT, -- Người chủ giỏ hàng
    product_id INT,
    quantity INT DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    buyer_id INT NOT NULL,
    seller_id INT NOT NULL, -- Giữ lại seller_id nếu quy định mỗi đơn chỉ mua từ 1 người bán
    total_price DECIMAL(10, 2) DEFAULT 0,
    status ENUM('pending', 'confirmed', 'shipped', 'completed', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT, -- Lưu địa chỉ lúc đặt hàng (đề phòng user đổi địa chỉ sau này)
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(user_id),
    FOREIGN KEY (seller_id) REFERENCES users(user_id)
);

CREATE TABLE order_details (
   order_detail_id INT PRIMARY KEY AUTO_INCREMENT,
   order_id INT NOT NULL,
   product_id INT NOT NULL,
   quantity INT DEFAULT 1,
   unit_price DECIMAL(10, 2) NOT NULL, -- Lưu giá tại thời điểm mua (vì sau này người bán có thể đổi giá sản phẩm)
   FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
   FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL, -- Thay vì order_id để dễ hiển thị ở trang sản phẩm
    reviewer_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (reviewer_id) REFERENCES users(user_id)
);

CREATE TABLE traffic_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL, -- Nếu họ đã đăng nhập thì lưu ID, khách vãng lai để NULL
    ip_address VARCHAR(45), -- Lưu địa chỉ IP để phân biệt các máy khác nhau
    device_info TEXT, -- Lưu họ dùng điện thoại hay máy tính
    access_date DATE DEFAULT (CURRENT_DATE), -- Ngày truy cập
    accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Giờ cụ thể
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE conversations (
    conversation_id INT PRIMARY KEY AUTO_INCREMENT,
    user_one INT NOT NULL, -- Người bắt đầu nhắn tin
    user_two INT NOT NULL, -- Người nhận
    product_id INT NULL,   -- (Tùy chọn) Nhắn tin về món đồ cụ thể nào
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_one) REFERENCES users(user_id),
    FOREIGN KEY (user_two) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    conversation_id INT NOT NULL,
    sender_id INT NOT NULL, -- ID của người gửi tin nhắn này
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE, -- Để hiển thị thông báo "đã xem" hoặc số tin nhắn chưa đọc
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(user_id)
);

-- Thêm index cho bảng Messages để load nhanh hơn
ALTER TABLE messages ADD INDEX (sent_at);

-- Thêm trường để quản lý danh sách chat tốt hơn
ALTER TABLE conversations ADD COLUMN last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;