DROP DATABASE IF EXISTS tmdt_db;
CREATE DATABASE tmdt_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tmdt_db;
SET foreign_key_checks = 0;
CREATE TABLE users (
   user_id INT PRIMARY KEY AUTO_INCREMENT,
   full_name VARCHAR(100) NOT NULL,
   email VARCHAR(100) UNIQUE NOT NULL, -- Email là định danh duy nhất để gộp các phương thức
   phone VARCHAR(15) NULL,
   address TEXT NULL,
   university VARCHAR(255) NULL,
   avatar VARCHAR(255) NULL,
   bio TEXT NULL,
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
    category_name VARCHAR(100) NOT NULL,
    category_image VARCHAR(255) DEFAULT 'default.png'
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
    approval_status VARCHAR(20) DEFAULT 'pending',
    quantity INT DEFAULT 1,
    is_deleted BOOLEAN DEFAULT FALSE,
    is_hidden BOOLEAN DEFAULT FALSE,
    target_university VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE product_images (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
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
    order_code VARCHAR(50) UNIQUE NOT NULL,
    buyer_id INT NOT NULL,
    seller_id INT NOT NULL,
    total_price DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    receiver_name VARCHAR(100),
    receiver_phone VARCHAR(20),
    delivery_method VARCHAR(50),
    university VARCHAR(255),
    dorm_info VARCHAR(255),
    shipping_address VARCHAR(255),
    notes TEXT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_date TIMESTAMP NULL,
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
    edit_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (reviewer_id) REFERENCES users(user_id)
);

CREATE TABLE review_reports (
    report_id INT PRIMARY KEY AUTO_INCREMENT,
    review_id INT NOT NULL,
    reporter_id INT NOT NULL,
    reason TEXT NOT NULL,
    proof_image VARCHAR(255) NULL,
    proof_video VARCHAR(255) NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES reviews(review_id) ON DELETE CASCADE,
    FOREIGN KEY (reporter_id) REFERENCES users(user_id) ON DELETE CASCADE
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
    last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    FOREIGN KEY (sender_id) REFERENCES users(user_id),
    INDEX (sent_at)
);




CREATE TABLE favorites (
    favorite_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

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
-- INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status) VALUES 
-- (1, 1, 2, 'Ex xuống áo 2010 vàng đen siêu đẹp nợ xấu đưa 8tr5', '2014 • Tay côn/Moto • Đã sử dụng. Máy êm ru, giấy tờ đầy đủ.', 26800000, 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80', 120, 'available'),
-- (2, 1, 2, 'Ex xuống áo 2010 xanh trắng spark nợ xấu đưa 10tr', '2014 • Tay côn/Moto • Đã sử dụng. Ngoại hình đẹp, bao thợ test.', 26800000, 'https://images.unsplash.com/photo-1568772585407-9361f9bfce87?auto=format&fit=crop&w=400&q=80', 85, 'available'),
-- (3, 2, 4, 'Nghỉ bán thanh lý đồ Nam shop', 'Mới • Đồ nam. Chất vải mát, còn nhiều size.', 120000, 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=400&q=80', 45, 'available'),
-- (4, 3, 5, 'Tủ quần áo nhựa lắp ghép đa năng', 'Mới • Nhựa. Thiết kế thông minh, tiết kiệm diện tích.', 1900000, 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=400&q=80', 200, 'available'),
-- (5, 4, 5, 'Tủ gỗ mdf thanh lý sale 50%', 'Mới • Gỗ. Gỗ chống ẩm, bền đẹp, thiết kế hiện đại.', 3000000, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80', 310, 'available');

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

-- DỮ LIỆU MẪU CHO DANH MỤC ĐỒ ĐIỆN TỬ
-- (category_id = 10)
-- Chèn sản phẩm
INSERT INTO products (user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, created_at) VALUES
(1, 10, 'Laptop Dell Inspiron 15 N5010 Core i5', 'Laptop cũ dùng ổn định, còn pin dùng 2-3 tiếng, màn hình 15.6 inch, RAM 8GB, HDD 500GB, máy đẹp không lỗi', 4500000, 'dell_inspiron_15_1.jpg', 120, 'available', 'approved', 1, '2025-02-15 10:30:00'),
(1, 10, 'MacBook Pro 2017 13 inch Touch Bar', 'MacBook Pro 2017, Core i5 2.3GHz, RAM 8GB, SSD 256GB, màn hình Retina, Touch Bar, máy zin chưa sửa chữa, rất đẹp', 8500000, 'macbook_pro_2017_1.jpg', 250, 'available', 'approved', 1, '2025-02-18 14:20:00'),
(2, 10, 'iPhone 11 64GB Chính Hãng', 'iPhone 11 64GB, màu trắng, pin 82%, máy nguyên bản, màn hình đẹp, cạnh hơi xước nhẹ, full phụ kiện hộp', 6200000, 'iphone-11_1.jpg', 310, 'available', 'approved', 1, '2025-02-20 09:15:00'),
(2, 10, 'Samsung Galaxy S21 FE 5G 128GB', 'Samsung S21 FE, 128GB, màu tím, pin tốt, máy đẹp 98%, còn bảo hành 3 tháng, full box', 7800000, 'samsung_s21fe_1.jpg', 180, 'available', 'approved', 1, '2025-02-22 16:45:00'),
(3, 10, 'Tai nghe Sony WH-1000XM4', 'Tai nghe Sony chống ồn cao cấp WH-1000XM4, màu đen, hàng xách tay Nhật, pin 30h, còn mới 99%, có hộp', 4200000, 'sony_wh1000xm4_1.jpg', 95, 'available', 'approved', 1, '2025-02-25 11:00:00'),
(3, 10, 'AirPods Pro 2 Chính Hãng', 'AirPods Pro 2 Gen, còn bảo hành 6 tháng, đầy đủ hộp, sạc, tình trạng đẹp, chống ồn tốt', 3900000, 'airpods_pro2_1.webp', 220, 'available', 'approved', 1, '2025-02-27 08:30:00'),
(4, 10, 'Màn hình Dell UltraSharp U2415 24 inch', 'Màn hình Dell U2415 24 inch IPS, độ phân giải 1920x1200, màu sắc đẹp, tỉ lệ 16:10, còn dây nguồn và cáp', 2800000, 'dell_u2415_1.jpg', 65, 'available', 'approved', 1, '2025-03-01 13:40:00'),
(4, 10, 'Bàn phím cơ Akko 3087 Rainbow Hotswap', 'Bàn phím cơ Akko 3087 87 phím, switch Jelly Pink, hotswap, RGB, có thay đổi keycap, tình trạng mới 90%', 1200000, 'akko_3087_1.jpg', 78, 'available', 'approved', 1, '2025-03-03 10:00:00'),
(5, 10, 'Chuột Logitech G Pro X Superlight', 'Chuột gaming Logitech G Pro X Superlight, màu trắng, 63g, Hero 25K, mới 95%, có hộp và phụ kiện', 1800000, 'logitech_gprox_1.webp', 140, 'available', 'approved', 1, '2025-03-05 15:20:00'),
(5, 10, 'SSD Samsung 870 EVO 1TB SATA III', 'SSD Samsung 870 EVO 1TB SATA 2.5 inch, dùng chưa 6 tháng, bảo hành 5 năm, còn nguyên hộp', 2100000, 'samsung_870evo_1tb_1.webp', 55, 'available', 'approved', 1, '2025-03-07 09:50:00');


-- CHÈN HÌNH ẢNH CHO SẢN PHẨM
-- Sản phẩm 1: Laptop Dell Inspiron 15 (product_id = 1)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(1, 'dell_inspiron_15_1.jpg', TRUE),
(1, 'dell_inspiron_15_2.jpg', FALSE),
(1, 'dell_inspiron_15_3.jpg', FALSE);

-- Sản phẩm 2: MacBook Pro 2017 (product_id = 2)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(2, 'macbook_pro_2017_1.jpg', TRUE),
(2, 'macbook_pro_2017_2.jpg', FALSE),
(2, 'macbook_pro_2017_3.jpg', FALSE);

-- Sản phẩm 3: iPhone 11 64GB (product_id = 3)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(3, 'iphone-11_1.jpg', TRUE),
(3, 'iphone-11_2.jpg', FALSE);

-- Sản phẩm 4: Samsung Galaxy S21 FE (product_id = 4)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(4, 'samsung_s21fe_1.jpg', TRUE),
(4, 'samsung_s21fe_2.jpg', FALSE),
(4, 'samsung_s21fe_3.jpg', FALSE);

-- Sản phẩm 5: Tai nghe Sony WH-1000XM4 (product_id = 5)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(5, 'sony_wh1000xm4_1.jpg', TRUE),
(5, 'sony_wh1000xm4_2.jpg', FALSE),
(5, 'sony_wh1000xm4_3.jpg', FALSE),
(5, 'sony_wh100xm4_4.jpg', FALSE);

-- Sản phẩm 6: AirPods Pro 2 (product_id = 6)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(6, 'airpods_pro2_1.webp', TRUE),
(6, 'airpods_pro2_2.webp', FALSE),
(6, 'airpods_pro2_3.webp', FALSE);

-- Sản phẩm 7: Màn hình Dell U2415 (product_id = 7)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(7, 'dell_u2415_1.jpg', TRUE),
(7, 'dell_u2415_2.jpg', FALSE),
(7, 'dell_u2415_3.jpg', FALSE);

-- Sản phẩm 8: Bàn phím Akko 3087 (product_id = 8)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(8, 'akko_3087_1.jpg', TRUE),
(8, 'akko_3087_2.jpg', FALSE),
(8, 'akko_3087_3.jpg', FALSE);

-- Sản phẩm 9: Chuột Logitech G Pro X (product_id = 9)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(9, 'logitech_gprox_1.webp', TRUE),
(9, 'logitech_gprox_2.webp', FALSE),
(9, 'logitech_gprox_3.webp', FALSE),
(9, 'logitech_gprox_4.webp', FALSE);

-- Sản phẩm 10: SSD Samsung 870 EVO 1TB (product_id = 10)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(10, 'samsung_870evo_1tb_1.webp', TRUE),
(10, 'samsung_870evo_1tb_2.webp', FALSE),
(10, 'samsung_870evo_1tb_3.webp', FALSE),
(10, 'samsung_870evo_1tb_4.webp', FALSE);

-- DỮ LIỆU MẪU CHO DANH MỤC TỦ LẠNH, MÁY LẠNH, MÁY GIẶT
-- (category_id = 11)
-- Chèn sản phẩm
INSERT INTO products (user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, created_at) VALUES
(1, 11, 'Tủ lạnh Samsung Inverter 253 lít', 'Tủ lạnh Samsung 2 cánh, dung tích 253 lít, công nghệ Inverter tiết kiệm điện, màu bạc, tình trạng đẹp, còn sử dụng tốt', 3800000, 'tu-lanh-samsung-rt25m4032bu-sv-1.jpg', 210, 'available', 'approved', 1, '2025-02-16 08:30:00'),
(2, 11, 'Máy lạnh Daikin 1.5 HP Inverter', 'Máy lạnh Daikin FTKC35, công suất 1.5 HP, inverter tiết kiệm điện, lọc không khí, máy còn mới 90%, có remote', 5500000, 'may-lanh-daikin-ftkc35rvmv-1.png', 185, 'available', 'approved', 1, '2025-02-19 10:15:00'),
(2, 11, 'Máy giặt LG Inverter 8kg', 'Máy giặt LG cửa trên, 8kg, công nghệ Inverter, 6 chuyển động, còn mới, ít sử dụng, có bảo hành 6 tháng', 4200000, 'may-giat-lg-tg2402ntww-1.jpg', 195, 'available', 'approved', 1, '2025-02-21 14:20:00'),
(3, 11, 'Tủ lạnh Panasonic 330 lít', 'Tủ lạnh Panasonic Inverter 330 lít, 2 cánh, ngăn đá trên, màu bạc, chống vi khuẩn, đẹp, còn tốt', 5200000, 'tu-lanh-panasonic-nr-bd418vsvn-1.jpg', 145, 'available', 'approved', 1, '2025-02-23 09:40:00'),
(3, 11, 'Máy lạnh LG 1 HP Inverter', 'Máy lạnh LG 1 HP, inverter, làm lạnh nhanh, lọc bụi, tiết kiệm điện, máy mới 95%, đầy đủ remote', 3800000, 'may-lanh-lg-inverter-1-hp-ifc09m1-1.jpg', 120, 'available', 'approved', 1, '2025-02-25 16:10:00'),
(4, 11, 'Máy giặt Electrolux 9kg', 'Máy giặt Electrolux cửa trước, 9kg, Inverter, sấy 7kg, còn bảo hành 1 năm, máy đẹp ít xước', 6800000, 'electrolux-inverter-9-kg-ewf9025dqwb-1.jpg', 230, 'available', 'approved', 1, '2025-02-27 11:30:00'),
(4, 11, 'Tủ lạnh Toshiba 180 lít', 'Tủ lạnh Toshiba 180 lít, màu bạc, ngăn đá trên, phù hợp gia đình nhỏ, tiết kiệm điện', 2200000, 'tu-lanh-toshiba-gr-b22vu-ukg-1.jpg', 88, 'available', 'approved', 1, '2025-03-01 13:50:00'),
(5, 11, 'Máy lạnh Panasonic 2 HP Inverter', 'Máy lạnh Panasonic 2 HP, inverter, làm lạnh nhanh, lọc không khí, điều khiển wifi, mới 90%', 7200000, 'panasonic-inverter-1-hp-cu-cs-pu9ckh-8d-1.jpg', 165, 'available', 'approved', 1, '2025-03-03 08:00:00'),
(5, 11, 'Máy giặt Samsung Inverter 8kg', 'Máy giặt Samsung cửa trên, 8kg, inverter, công nghệ Eco Bubble, máy ít dùng, đẹp', 3600000, 'samsung-inverter-8kg-ww80t3020ww-sv-1.jpg', 102, 'available', 'approved', 1, '2025-03-05 15:45:00'),
(1, 11, 'Tủ lạnh Hitachi 450 lít Inverter', 'Tủ lạnh Hitachi 450 lít, 2 cánh, inverter, ngăn đá dưới, mặt kính sang trọng, còn rất mới', 8900000, 'tu-lanh-hitachi-inverter-450-lit-r-fg560pgv8x-gbk-1.jpg', 310, 'available', 'approved', 1, '2025-03-07 10:20:00');

-- CHÈN HÌNH ẢNH CHO SẢN PHẨM
-- Sản phẩm 1: Tủ lạnh Samsung 253 lít (product_id = 11)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(11, 'tu-lanh-samsung-rt25m4032bu-sv-1.jpg', TRUE),
(11, 'tu-lanh-samsung-rt25m4032bu-sv-2.jpg', FALSE),
(11, 'tu-lanh-samsung-rt25m4032bu-sv-3.jpg', FALSE);

-- Sản phẩm 2: Máy lạnh Daikin 1.5 HP (product_id = 12)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(12, 'may-lanh-daikin-ftkc35rvmv-1.png', TRUE),
(12, 'may-lanh-daikin-ftkc35rvmv-2.png', FALSE);

-- Sản phẩm 3: Máy giặt LG 8kg (product_id = 13)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(13, 'may-giat-lg-tg2402ntww-1.jpg', TRUE),
(13, 'may-giat-lg-tg2402ntww-2.webp', FALSE),
(13, 'may-giat-lg-tg2402ntww-3.jpg', FALSE);

-- Sản phẩm 4: Tủ lạnh Panasonic 330 lít (product_id = 14)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(14, 'tu-lanh-panasonic-nr-bd418vsvn-1.jpg', TRUE),
(14, 'tu-lanh-panasonic-nr-bd418vsvn-2.jpg', FALSE),
(14, 'tu-lanh-panasonic-nr-bd418vsvn-3.jpg', FALSE),
(14, 'tu-lanh-panasonic-nr-bd418vsvn-4.jpg', FALSE);

-- Sản phẩm 5: Máy lạnh LG 1 HP (product_id = 15)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(15, 'may-lanh-lg-inverter-1-hp-ifc09m1-1.jpg', TRUE),
(15, 'may-lanh-lg-inverter-1-hp-ifc09m1-2.jpg', FALSE),
(15, 'may-lanh-lg-inverter-1-hp-ifc09m1-3.jpg', FALSE);

-- Sản phẩm 6: Máy giặt Electrolux 9kg (product_id = 16)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(16, 'electrolux-inverter-9-kg-ewf9025dqwb-1.jpg', TRUE),
(16, 'electrolux-inverter-9-kg-ewf9025dqwb-2.jpg', FALSE),
(16, 'electrolux-inverter-9-kg-ewf9025dqwb-3.jpg', FALSE);

-- Sản phẩm 7: Tủ lạnh Toshiba 180 lít (product_id = 17)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(17, 'tu-lanh-toshiba-gr-b22vu-ukg-1.jpg', TRUE),
(17, 'tu-lanh-toshiba-gr-b22vu-ukg-2.jpg', FALSE),
(17, 'tu-lanh-toshiba-gr-b22vu-ukg-3.jpg', FALSE);

-- Sản phẩm 8: Máy lạnh Panasonic 2 HP (product_id = 18)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(18, 'panasonic-inverter-1-hp-cu-cs-pu9ckh-8d-1.jpg', TRUE),
(18, 'panasonic-inverter-1-hp-cu-cs-pu9ckh-8d-2.jpg', FALSE),
(18, 'panasonic-inverter-1-hp-cu-cs-pu9ckh-8d-3.jpg', FALSE);

-- Sản phẩm 9: Máy giặt Samsung 8kg (product_id = 19)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(19, 'samsung-inverter-8kg-ww80t3020ww-sv-1.jpg', TRUE),
(19, 'samsung-inverter-8kg-ww80t3020ww-sv-2.jpg', FALSE),
(19, 'samsung-inverter-8kg-ww80t3020ww-sv-3.jpg', FALSE);

-- Sản phẩm 10: Tủ lạnh Hitachi 450 lít (product_id = 20)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(20, 'tu-lanh-hitachi-inverter-450-lit-r-fg560pgv8x-gbk-1.jpg', TRUE),
(20, 'tu-lanh-hitachi-inverter-450-lit-r-fg560pgv8x-gbk-2.jpg', FALSE),
(20, 'tu-lanh-hitachi-inverter-450-lit-r-fg560pgv8x-gbk-3.jpg', FALSE);

-- DỮ LIỆU MẪU CHO DANH MỤC THÚ CƯNG
-- (category_id = 3)
-- Chèn sản phẩm
INSERT INTO products (user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, created_at) VALUES
(2, 3, 'Chó Poodle trắng thuần chủng', 'Chó Poodle lông xù màu trắng, 4 tháng tuổi, đã tiêm phòng đầy đủ, giấy tờ đầy đủ, rất dễ thương và thông minh', 5500000, 'poodle-white-1.jpg', 320, 'available', 'approved', 1, '2025-02-14 09:00:00'),
(3, 3, 'Mèo Anh lông ngắn màu xám', 'Mèo Anh lông ngắn (British Shorthair), 3 tháng tuổi, màu xám tro, mắt vàng, đã tiêm phòng và tẩy giun, rất bụ bẫm', 4200000, 'meo-anh-xam-1.jpg', 280, 'available', 'approved', 1, '2025-02-16 14:30:00'),
(4, 3, 'Chó Husky trắng xám', 'Chó Husky Siberia, 6 tháng tuổi, màu trắng xám, mắt xanh, rất năng động và thông minh, có giấy tờ nguồn gốc', 7800000, 'husky-1.jpg', 450, 'available', 'approved', 1, '2025-02-18 10:15:00'),
(5, 3, 'Cage nuôi mèo cao cấp 3 tầng', 'Lồng nuôi mèo 3 tầng bằng kim loại, có kệ gỗ, cầu trượt, khay vệ sinh, mới 90%, phù hợp nuôi 2-3 mèo', 1200000, 'chuong-meo-3-tang-1.jpg', 95, 'available', 'approved', 1, '2025-02-20 16:40:00'),
(1, 3, 'Thức ăn hạt Royal Canin cho chó trưởng thành', 'Thức ăn hạt Royal Canin dành cho chó trưởng thành (Adult), loại Medium 7.5kg, còn hạn sử dụng đến 12/2025', 850000, 'thuc-an-cho-1.webp', 210, 'available', 'approved', 5, '2025-02-22 08:50:00'),
(2, 3, 'Mèo Ragdoll mắt xanh', 'Mèo Ragdoll, 5 tháng tuổi, lông dài màu trắng kem, mắt xanh, rất hiền lành và dễ thương, đã tiêm phòng', 6200000, 'meo-mat-xanh-1.jpg', 340, 'available', 'approved', 1, '2025-02-24 13:20:00'),
(3, 3, 'Chó Phốc sóc lông vàng', 'Chó Phốc sóc (Pomeranian), 3 tháng tuổi, màu vàng cam, dễ thương, đã tiêm phòng, giấy tờ đầy đủ', 4800000, 'phoc-soc-vang-1.jpg', 190, 'available', 'approved', 1, '2025-02-26 09:30:00'),
(4, 3, 'Cát vệ sinh mèo thơm 10L', 'Cát vệ sinh cho mèo dạng hạt, khử mùi, 10L, đóng gói kín, sử dụng tốt, không bám chân', 180000, 'cat-vs-meo-1.jpg', 150, 'available', 'approved', 20, '2025-02-28 11:10:00'),
(5, 3, 'Chó Golden Retriever lai', 'Chó Golden Retriever lai, 5 tháng tuổi, màu vàng, rất thân thiện và thông minh, đã tiêm phòng, giấy tờ đầy đủ', 3500000, 'golden-lai-1.jpg', 115, 'available', 'approved', 1, '2025-03-02 15:00:00'),
(1, 3, 'Mèo Ba Tư mặt phẳng', 'Mèo Ba Tư mặt phẳng (Exotic), 4 tháng tuổi, màu trắng, mũi tẹt, rất đáng yêu, đã tiêm phòng, có giấy tờ', 5600000, 'meo-ba-tu-1.jpg', 260, 'available', 'approved', 1, '2025-03-04 10:45:00');

-- CHÈN HÌNH ẢNH CHO SẢN PHẨM
-- Sản phẩm 1: Chó Poodle trắng (product_id = 21)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(21, 'poodle-white-1.jpg', TRUE),
(21, 'poodle-white-2.jpg', FALSE),
(21, 'poodle-white-3.jpg', FALSE);

-- Sản phẩm 2: Mèo Anh lông ngắn (product_id = 22)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(22, 'meo-anh-xam-1.jpg', TRUE),
(22, 'meo-anh-xam-2.jpg', FALSE);

-- Sản phẩm 3: Chó Husky trắng xám (product_id = 23)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(23, 'husky-1.jpg', TRUE),
(23, 'husky-2.jpg', FALSE),
(23, 'husky-3.jpg', FALSE);

-- Sản phẩm 4: Cage nuôi mèo 3 tầng (product_id = 24)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(24, 'chuong-meo-3-tang-1.jpg', TRUE),
(24, 'chuong-meo-3-tang-2.jpg', FALSE);

-- Sản phẩm 5: Thức ăn Royal Canin (product_id = 25)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(25, 'thuc-an-cho-1.webp', TRUE);

-- Sản phẩm 6: Mèo Ragdoll mắt xanh (product_id = 26)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(26, 'meo-mat-xanh-1.jpg', TRUE),
(26, 'meo-mat-xanh-2.jpg', FALSE),
(26, 'meo-mat-xanh-3.jpg', FALSE);

-- Sản phẩm 7: Chó Phốc sóc lông vàng (product_id = 27)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(27, 'phoc-soc-vang-1.jpg', TRUE),
(27, 'phoc-soc-vang-2.jpg', FALSE);

-- Sản phẩm 8: Cát vệ sinh mèo 10L (product_id = 28)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(28, 'cat-vs-meo-1.jpg', TRUE);

-- Sản phẩm 9: Chó Golden Retriever lai (product_id = 29)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(29, 'golden-lai-1.jpg', TRUE),
(29, 'golden-lai-2.jpg', FALSE);

-- Sản phẩm 10: Mèo Ba Tư mặt phẳng (product_id = 30)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(30, 'meo-ba-tu-1.jpg', TRUE),
(30, 'meo-ba-tu-2.jpg', FALSE);

-- DỮ LIỆU MẪU CHO DANH MỤC GIẢI TRÍ, THỂ THAO, SỞ THÍCH
-- (category_id = 5)
-- Chèn sản phẩm
INSERT INTO products (user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, created_at) VALUES
(3, 5, 'Xe đạp địa hình Giant 29 inch', 'Xe đạp thể thao Giant, loại địa hình, vành 29 inch, khung nhôm, phanh đĩa, số Shimano, tình trạng đẹp, ít sử dụng', 4200000, 'xe-dap-dia-hinh-1.webp', 195, 'available', 'approved', 1, '2025-02-15 07:30:00'),
(4, 5, 'Bộ guitar acoustic Yamaha F310', 'Đàn guitar acoustic Yamaha F310, đầy đủ phụ kiện (túi đựng, capo, dây đeo, pick), mới 95%, âm thanh hay', 2800000, 'dan-guitar-1.jpg', 165, 'available', 'approved', 1, '2025-02-17 10:20:00'),
(5, 5, 'Bóng rổ Wilson Evolution 7', 'Bóng rổ Wilson Evolution, size 7 (chuẩn NBA), bóng cao su tổng hợp, còn mới 90%, bóng nảy tốt', 850000, 'bong-ro-1.jpg', 132, 'available', 'approved', 2, '2025-02-19 14:10:00'),
(1, 5, 'Máy chơi game Nintendo Switch OLED', 'Nintendo Switch OLED mới 95%, màu trắng, full box, có thêm 2 game (Zelda và Mario Kart), pin tốt', 6200000, 'switch-1.jpg', 380, 'available', 'approved', 1, '2025-02-21 09:45:00'),
(2, 5, 'Vợt cầu lông Yonex Astrox 99', 'Vợt cầu lông Yonex Astrox 99 Pro, màu xanh đen, cước BG80, còn mới 90%, có bao đựng', 2100000, 'vot-cau-long.jpg', 178, 'available', 'approved', 1, '2025-02-23 16:30:00'),
(3, 5, 'Gậy golf Taylormade SIM2 Driver', 'Gậy golf Taylormade SIM2, đánh xa, mặt gậy công nghệ mới, tay cầm Golf Pride, còn rất mới', 4500000, 'gay-golf-1.jpg', 112, 'available', 'approved', 1, '2025-02-25 11:20:00'),
(4, 5, 'Bộ cờ vua gỗ cao cấp', 'Bộ cờ vua bằng gỗ cao cấp, bàn cờ 50x50cm, quân cờ tỉ mỉ, sản phẩm thủ công, rất đẹp', 1200000, 'co-vua-1.webp', 98, 'available', 'approved', 2, '2025-02-27 08:00:00'),
(5, 5, 'Kính bơi Speedo Fastskin', 'Kính bơi Speedo Fastskin Elite, chống mờ, chống UV, chất lượng Olympic, mới 100%', 650000, 'kinh-boi-1.webp', 155, 'available', 'approved', 3, '2025-03-01 13:40:00'),
(1, 5, 'Xe trượt ván cruiser 22 inch', 'Xe trượt ván loại cruiser, kích thước 22x6 inch, bánh PU 60mm, ván gỗ cao cấp, chịu lực tốt', 950000, 'van-truot-1.webp', 72, 'available', 'approved', 2, '2025-03-03 15:50:00'),
(2, 5, 'Bộ loa karaoke gia đình có mic', 'Bộ loa karaoke công suất 500W, 2 loa, 2 mic có dây, kết nối Bluetooth/USB/AUX, chất lượng tốt', 3200000, 'loa-karaoke-1.webp', 220, 'available', 'approved', 1, '2025-03-05 10:15:00');

-- CHÈN HÌNH ẢNH CHO SẢN PHẨM
-- Sản phẩm 1: Xe đạp Giant 29 inch (product_id = 31)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(31, 'xe-dap-dia-hinh-1.webp', TRUE);

-- Sản phẩm 2: Guitar Yamaha F310 (product_id = 32)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(32, 'dan-guitar-1.jpg', TRUE),
(32, 'dan-guitar-2.jpg', FALSE);

-- Sản phẩm 3: Bóng rổ Wilson Evolution (product_id = 33)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(33, 'bong-ro-1.jpg', TRUE);

-- Sản phẩm 4: Nintendo Switch OLED (product_id = 34)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(34, 'switch-1.jpg', TRUE);

-- Sản phẩm 5: Vợt cầu lông Yonex Astrox (product_id = 35)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(35, 'vot-cau-long.jpg', TRUE);

-- Sản phẩm 6: Gậy golf Taylormade SIM2 (product_id = 36)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(36, 'gay-golf-1.jpg', TRUE);

-- Sản phẩm 7: Bộ cờ vua gỗ cao cấp (product_id = 37)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(37, 'co-vua-1.webp', TRUE),
(37, 'co-vua-2.webp', FALSE);

-- Sản phẩm 8: Kính bơi Speedo Fastskin (product_id = 38)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(38, 'kinh-boi-1.webp', TRUE);

-- Sản phẩm 9: Xe trượt ván cruiser (product_id = 39)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(39, 'van-truot-1.webp', TRUE);

-- Sản phẩm 10: Bộ loa karaoke (product_id = 40)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(40, 'loa-karaoke-1.webp', TRUE);

-- DỮ LIỆU MẪU CHO DANH MỤC XE CỘ
-- (category_id = 2)
-- Chèn sản phẩm
INSERT INTO products (user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, created_at) VALUES
(2, 2, 'Xe máy Honda Vision 2019', 'Xe máy Honda Vision 2019, màu trắng, đã đi 18,000km, xe còn tốt, ít trầy xước, đăng ký chính chủ, bao sang tên', 18500000, 'vision-trang-1.jpg', 420, 'available', 'approved', 1, '2025-02-14 08:00:00'),
(3, 2, 'Xe máy Yamaha Exciter 155 VVA', 'Xe máy Yamaha Exciter 155, 2021, màu đen đỏ, đã đi 12,000km, full phụ kiện, xe đẹp, có giấy tờ', 32000000, 'exciter-1.jpg', 380, 'available', 'approved', 1, '2025-02-16 09:30:00'),
(4, 2, 'Xe đạp điện Yadea Aura', 'Xe đạp điện Yadea Aura, 2023, màu cam, pin 48V 20Ah, đi được 70km/sạc, mới 95%, đầy đủ giấy tờ', 11500000, 'xe-dap-dien-1.jpg', 245, 'available', 'approved', 1, '2025-02-18 14:20:00'),
(5, 2, 'Ô tô Toyota Vios 2018', 'Toyota Vios 2018, số tự động, máy xăng 1.5L, đã đi 45,000km, xe đẹp, nội thất da, điều hòa, camera lùi', 390000000, 'vios-1.jpg', 520, 'available', 'approved', 1, '2025-02-20 10:15:00'),
(1, 2, 'Xe máy Honda SH 150i 2020', 'Honda SH 150i 2020, màu đen, đã đi 8,000km, xe zin, đẹp, không lỗi, giấy tờ đầy đủ, bảo dưỡng hãng', 48000000, 'sh-1.jpg', 560, 'available', 'approved', 1, '2025-02-22 16:40:00'),
(2, 2, 'Xe máy điện VinFast Feliz S', 'Xe máy điện VinFast Feliz S, 2023, màu trắng, pin 3.2kW, đi được 90km/sạc, còn bảo hành 2 năm', 22000000, 'vinfast-1.jpg', 310, 'available', 'approved', 1, '2025-02-24 11:00:00'),
(3, 2, 'Xe đạp địa hình Trek Marlin 5', 'Xe đạp Trek Marlin 5, khung nhôm, vành 27.5 inch, phanh đĩa cơ, số Shimano, mới 90%, ít sử dụng', 6500000, 'trek-1.jpg', 175, 'available', 'approved', 1, '2025-02-26 13:30:00'),
(4, 2, 'Ô tô Hyundai Grand i10 2020', 'Hyundai Grand i10 2020, số tự động, máy 1.2L, đi 35,000km, xe đẹp, đầy đủ tiện nghi, giấy tờ đầy đủ', 320000000, 'hyundai-grand-i10.jpg', 440, 'available', 'approved', 1, '2025-02-28 08:45:00'),
(5, 2, 'Xe máy Suzuki Raider 150', 'Suzuki Raider 150, 2020, màu xanh đen, đã đi 15,000km, xe khỏe, nổ máy êm, ít trầy, giấy tờ đầy đủ', 26000000, 'raider-1.jpg', 195, 'available', 'approved', 1, '2025-03-02 15:20:00'),
(1, 2, 'Phuộc trước PNP Vario/Click 125-150 chân phuộc nhôm CNC', 'Thông số kỹ thuật phuộc trước PNP Vario/Click 125-150:
- Ti phuộc: 26mm
- Lổ cốt bánh: 12mm
- Trọng lượng: 3,4kg
- Có 1 màu duy nhất: Vỏ phuộc màu vàng - chân phuộc màu bạc.
- Lắp được cho xe: Vario 2015-2018', 3500000, 'phuoc-truoc-1.jpg', 670, 'available', 'approved', 1, '2025-03-04 09:10:00');

-- CHÈN HÌNH ẢNH CHO SẢN PHẨM
-- Sản phẩm 1: Honda Vision 2019 (product_id = 41)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(41, 'vision-trang-1.jpg', TRUE);

-- Sản phẩm 2: Yamaha Exciter 155 (product_id = 42)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(42, 'exciter-1.jpg', TRUE);

-- Sản phẩm 3: Xe đạp điện Yadea Aura (product_id = 43)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(43, 'xe-dap-dien-1.jpg', TRUE);

-- Sản phẩm 4: Toyota Vios 2018 (product_id = 44)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(44, 'vios-1.jpg', TRUE);

-- Sản phẩm 5: Honda SH 150i 2020 (product_id = 45)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(45, 'sh-1.jpg', TRUE);

-- Sản phẩm 6: VinFast Feliz S (product_id = 46)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(46, 'vinfast-1.jpg', TRUE);

-- Sản phẩm 7: Trek Marlin 5 (product_id = 47)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(47, 'trek-1.jpg', TRUE);

-- Sản phẩm 8: Hyundai Grand i10 2020 (product_id = 48)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(48, 'hyundai-grand-i10.jpg', TRUE);

-- Sản phẩm 9: Suzuki Raider 150 (product_id = 49)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(49, 'raider-1.jpg', TRUE);

-- Sản phẩm 10: Kawasaki Z250 (product_id = 50)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(50, 'phuoc-truoc-1.jpg', TRUE);

-- DỮ LIỆU MẪU CHO DANH MỤC THỜI TRANG, ĐỒ DÙNG CÁ NHÂN
-- (category_id = 12)
-- Chèn sản phẩm
INSERT INTO products (user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, created_at) VALUES
(3, 12, 'Áo thun Uniqlo oversized trắng', 'Áo thun Uniqlo oversize màu trắng, size L, chất cotton mềm, mặc 2 lần, còn mới 98%, phù hợp phong cách basic', 150000, 'ao-uniqlo-trang-1.jpg', 320, 'available', 'approved', 1, '2025-02-15 09:20:00'),
(4, 12, 'Quần jean ống suông Zara nam', 'Quần jean Zara ống suông màu xanh đen, size 30, chất vải dày dặn, còn tốt, mặc được vài lần', 220000, 'quan-jean-nam-1.webp', 185, 'available', 'approved', 1, '2025-02-17 14:30:00'),
(5, 12, 'Áo hoodie Basic Oversize đen', 'Áo hoodie oversize màu đen, chất nỉ ấm áp, size L, mới mua 1 tháng, chưa mặc lần nào, vẫn còn tag', 180000, 'hoodie-den-1.jpg', 250, 'available', 'approved', 1, '2025-02-19 10:45:00'),
(1, 12, 'Giày thể thao Nike Air Force 1', 'Giày Nike Air Force 1 trắng, size 42 (US 9), mới 90%, đi vài lần, còn hộp đầy đủ, phối đồ đẹp', 1200000, 'nike-1.jpg', 560, 'available', 'approved', 1, '2025-02-21 16:10:00'),
(2, 12, 'Váy ren trắng phong cách Hàn', 'Váy ren trắng xòe, phong cách Hàn Quốc, size M, phù hợp dạo phố hay đi tiệc, mặc 1 lần, còn mới', 250000, 'vay-ren-trang-1.jpg', 195, 'available', 'approved', 1, '2025-02-23 08:30:00'),
(3, 12, 'Balo laptop Herschel Dawson', 'Balo Herschel Dawson màu xanh đen, chất vải bền, có ngăn chứa laptop 15.6 inch, mới 95%, ít sử dụng', 450000, 'balo-laptop-1.jpg', 340, 'available', 'approved', 1, '2025-02-25 13:15:00'),
(4, 12, 'Áo sơ mi công sở nam trắng', 'Áo sơ mi nam trắng cổ đức, chất cotton co giãn, size M, phù hợp đi làm hay thực tập, mới 90%', 180000, 'ao-so-mi-trang-1.webp', 140, 'available', 'approved', 2, '2025-02-27 11:20:00'),
(5, 12, 'Kính mát Ray-Ban Clubmaster', 'Kính mát Ray-Ban Clubmaster cổ điển, gọng đen viền vàng, tròng đen, phong cách Hàn Quốc, mới 95%', 850000, 'kinh-mat-1.jpg', 270, 'available', 'approved', 1, '2025-03-01 09:40:00'),
(1, 12, 'Bộ vest nữ màu ghi thanh lịch', 'Bộ vest nữ màu ghi, áo blazer + quần ống suông, size S, phong cách công sở, mặc 1 lần, chất vải cao cấp', 350000, 'vest-nu-1.webp', 165, 'available', 'approved', 1, '2025-03-03 15:50:00'),
(2, 12, 'Áo len cổ lọ basic đen', 'Áo len cổ lọ màu đen, chất len mềm mịn, size L, giữ ấm tốt, phù hợp mùa đông, mới 90%', 200000, 'ao-len-1.jpg', 130, 'available', 'approved', 1, '2025-03-05 10:30:00');

-- CHÈN HÌNH ẢNH CHO SẢN PHẨM
-- Sản phẩm 1: Áo thun Uniqlo oversized (product_id = 51)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(51, 'ao-uniqlo-trang-1.jpg', TRUE),
(51, 'ao-uniqlo-trang-2.jpg', FALSE);

-- Sản phẩm 2: Quần jean Zara (product_id = 52)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(52, 'quan-jean-nam-1.webp', TRUE),
(52, 'quan-jean-nam-2.webp', FALSE);

-- Sản phẩm 3: Áo hoodie Basic (product_id = 53)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(53, 'hoodie-den-1.jpg', TRUE),
(53, 'hoodie-den-2.jpg', FALSE);

-- Sản phẩm 4: Giày Nike Air Force 1 (product_id = 54)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(54, 'nike-1.jpg', TRUE);

-- Sản phẩm 5: Váy ren trắng (product_id = 55)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(55, 'vay-ren-trang-1.jpg', TRUE);

-- Sản phẩm 6: Balo Herschel Dawson (product_id = 56)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(56, 'balo-laptop-1.jpg', TRUE);

-- Sản phẩm 7: Áo sơ mi công sở (product_id = 57)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(57, 'ao-so-mi-trang-1.webp', TRUE);

-- Sản phẩm 8: Kính Ray-Ban Clubmaster (product_id = 58)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(58, 'kinh-mat-1.jpg', TRUE);

-- Sản phẩm 9: Bộ vest nữ (product_id = 59)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(59, 'vest-nu-1.webp', TRUE);

-- Sản phẩm 10: Áo len cổ lọ (product_id = 60)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(60, 'ao-len-1.jpg', TRUE);

-- DỮ LIỆU MẪU CHO DANH MỤC SÁCH, GIÁO TRÌNH
-- (category_id = 13 - Đồ ăn, thực phẩm và các loại khác)
-- Chèn sản phẩm
INSERT INTO products (user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, created_at) VALUES
(2, 13, 'Giáo trình xác suất thống kê', 'Sách mới 95%, không ghi chú, bìa còn đẹp', 15000, 'xstk-1.jpg', 420, 'available', 'approved', 3, '2025-02-14 08:00:00'),
(3, 13, 'Giáo trình Toán cao cấp A1', 'Giáo trình Toán cao cấp A1, sách mới 90%, có đánh dấu vài công thức quan trọng', 15000, 'toan-a1.jpg', 380, 'available', 'approved', 4, '2025-02-16 09:30:00'),
(4, 13, 'Giáo trình pháp luật đại cương', 'Sách mới 95%, không ghi chú, còn nguyên bìa', 10000, 'pldc-1.jpg', 295, 'available', 'approved', 2, '2025-02-18 14:20:00'),
(5, 13, 'Giáo trình Vật lý đại cương 1 - BK', 'Giáo trình Vật lý đại cương 1 dành cho sinh viên ĐH Bách Khoa và ĐH KHTN, sách mới 90%, có vài ghi chú bằng bút chì', 75000, 'vldc-bk-1.jpg', 340, 'available', 'approved', 5, '2025-02-20 10:15:00'),
(1, 13, 'Tiếng Anh chuyên ngành Công nghệ thông tin', 'Giáo trình Tiếng Anh chuyên ngành IT, sách mới 95%, có từ điển chuyên ngành, phù hợp sinh viên CNTT, không ghi chú', 120000, 'ta-cntt.jpg', 225, 'available', 'approved', 2, '2025-02-22 16:40:00'),
(2, 13, 'Giáo trình Tâm lý học đại cương - KHXH', 'Giáo trình Tâm lý học đại cương dành cho sinh viên khối Khoa học Xã hội, sách mới 100% (chưa dùng), bìa đẹp', 80000, 'tlhdc-1.png', 180, 'available', 'approved', 2, '2025-02-24 11:00:00'),
(3, 13, 'Giáo trình Luật Kinh tế - ĐH Luật', 'Giáo trình Luật Kinh tế dành cho sinh viên ĐH Luật, sách mới 90%, không ghi chú, còn nguyên bìa', 95000, 'lkt.webp', 260, 'available', 'approved', 3, '2025-02-26 13:30:00'),
(4, 13, 'Giáo trình Kế toán tài chính - UEH', 'Giáo trình Kế toán tài chính dành cho sinh viên UEH và các trường khối kinh tế, sách mới 90%, có ghi chú ít', 110000, 'kttc.webp', 310, 'available', 'approved', 3, '2025-02-28 08:45:00'),
(5, 13, 'Giáo trình Cơ sở dữ liệu - CNTT', 'Giáo trình Cơ sở dữ liệu dành cho sinh viên CNTT, sách mới 95%, không ghi chú, có bài tập kèm theo', 100000, 'csdl-cntt.jpg', 275, 'available', 'approved', 3, '2025-03-02 15:20:00'),
(1, 13, 'Giáo trình Hóa học đại cương - BK', 'Giáo trình Hóa học đại cương dành cho sinh viên khối kỹ thuật, sách mới 90%, có ghi chú quan trọng bằng bút chì', 70000, 'hdc-1.jpg', 195, 'available', 'approved', 4, '2025-03-04 09:10:00');

-- CHÈN HÌNH ẢNH CHO SẢN PHẨM
-- Sản phẩm 1: Kinh tế vi mô (product_id = 61)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(61, 'xstk-1.jpg', TRUE);

-- Sản phẩm 2: Toán cao cấp A1 (product_id = 62)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(62, 'toan-a1.jpg', TRUE);

-- Sản phẩm 3: Marketing căn bản (product_id = 63)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(63, 'pldc-1.jpg', TRUE);

-- Sản phẩm 4: Vật lý đại cương 1 (product_id = 64)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(64, 'vldc-bk-1.jpg', TRUE);

-- Sản phẩm 5: Tiếng Anh chuyên ngành CNTT (product_id = 65)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(65, 'ta-cntt.jpg', TRUE);

-- Sản phẩm 6: Tâm lý học đại cương (product_id = 66)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(66, 'tlhdc-1.png', TRUE);

-- Sản phẩm 7: Luật Kinh tế (product_id = 67)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(67, 'lkt.webp', TRUE);

-- Sản phẩm 8: Kế toán tài chính (product_id = 68)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(68, 'kttc.webp', TRUE);

-- Sản phẩm 9: Cơ sở dữ liệu (product_id = 69)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(69, 'csdl-cntt.jpg', TRUE);

-- Sản phẩm 10: Hóa học đại cương (product_id = 70)
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(70, 'hdc-1.jpg', TRUE);
