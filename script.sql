DROP DATABASE IF EXISTS tmdt_db;
CREATE DATABASE tmdt_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tmdt_db;
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

ALTER TABLE conversations ADD COLUMN last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE categories ADD COLUMN category_image VARCHAR(255) DEFAULT 'default.png';

-- ==============================================
-- THÊM DỮ LIỆU MẪU (DUMMY DATA)
-- ==============================================

-- 1. Thêm danh mục
INSERT INTO categories (category_name, category_image) VALUES
    ('Bất động sản', 'home.png'),
    ('Xe cộ', 'vehicle.png'),
    ('Thú cưng', 'pet.png'),
    ('Đồ gia dụng, nội thất, cây cảnh', 'appliance.png'),
    ('Giải trí, Thể thao, Sở thích', 'entertainment.png'),
    ('Mẹ và bé', 'mom-and-baby.png'),
    ('Dịch vụ, Du lịch', 'tourism.png'),
    ('Cho tặng miễn phí', 'gift.png'),
    ('Việc làm', 'job.png'),
    ('Đồ điện tử', 'electronic.png'),
    ('Tủ lạnh, máy lạnh, máy giặt', 'household-electronics.png'),
    ('Thời trang, Đồ dùng cá nhân', 'fashion.png'),
    ('Đồ ăn, thực phẩm và các loại khác', 'food.png'),
    ('Dịch vụ chăm sóc nhà cửa', 'service.png');

-- 2. Thêm người dùng (User)
INSERT INTO users (user_id, full_name, email, phone, address, avatar, role, is_active) VALUES 
(1, 'Xe Máy Cũ Hải Nguyễn', 'hainguyen@example.com', '0901234567', 'Đà Nẵng', 'https://placehold.co/100x100/333333/FFFFFF?text=XM', 'member', TRUE),
(2, 'Nhơn', 'nhon@example.com', '0987654321', 'Tp Hồ Chí Minh', 'https://placehold.co/100x100/FFCC00/000000?text=N', 'admin', TRUE),
(3, 'Cửa Hàng Xưởng Thành Phát', 'thanhphat@example.com', '0912345678', 'Tp Hồ Chí Minh', 'https://placehold.co/100x100/ADD8E6/FFFFFF?text=CH', 'admin', TRUE),
(4, 'Nội Thất Diễn Phát', 'dienphat@example.com', '0998877665', 'Tp Hồ Chí Minh', 'https://placehold.co/100x100/FFCC00/000000?text=N', 'admin', TRUE);

-- 3. Thêm sản phẩm
INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status) VALUES 
(1, 1, 2, 'Ex xuống áo 2010 vàng đen siêu đẹp nợ xấu đưa 8tr5', '2014 • Tay côn/Moto • Đã sử dụng. Máy êm ru, giấy tờ đầy đủ.', 26800000, 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80', 120, 'available'),
(2, 1, 2, 'Ex xuống áo 2010 xanh trắng spark nợ xấu đưa 10tr', '2014 • Tay côn/Moto • Đã sử dụng. Ngoại hình đẹp, bao thợ test.', 26800000, 'https://images.unsplash.com/photo-1568772585407-9361f9bfce87?auto=format&fit=crop&w=400&q=80', 85, 'available'),
(3, 2, 4, 'Nghỉ bán thanh lý đồ Nam shop', 'Mới • Đồ nam. Chất vải mát, còn nhiều size.', 120000, 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=400&q=80', 45, 'available'),
(4, 3, 5, 'Tủ quần áo nhựa lắp ghép đa năng', 'Mới • Nhựa. Thiết kế thông minh, tiết kiệm diện tích.', 1900000, 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=400&q=80', 200, 'available'),
(5, 4, 5, 'Tủ gỗ mdf thanh lý sale 50%', 'Mới • Gỗ. Gỗ chống ẩm, bền đẹp, thiết kế hiện đại.', 3000000, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80', 310, 'available');

-- 4. Thêm tài khoản admin/test
INSERT INTO tmdt_db.users
(user_id, full_name, email, phone, address, avatar, `role`, is_active, created_at, updated_at)
VALUES(5, 'Nguyen Van Admin', 'a@gmail.com', '0900000000', NULL, NULL, 'member', 1, '2026-04-26 23:31:05.000', '2026-04-26 23:49:23.000');

INSERT INTO tmdt_db.local_accounts
(user_id, password_hash, is_email_verified, verification_code, code_expired_at)
VALUES
(1, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(2, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(3, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(4, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(5, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL);
