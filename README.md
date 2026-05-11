# Dự án thướng Thương mại điện tử - Chợ sinh viên

## 1. Thành viên

- 22130218: Nguyễn Hoàng Phúc
- 22130195: Mai Lâm Nhật
- 22130189: Nguyễn Bảo Nguyên
- 22130064: Nguyễn Huỳnh Giao

## 2. Công nghệ sử dụng
- Backend: Java Spring Boot
- Frontend: React, TailwindCss
- Database: MySQL

## 3. Cách chạy
1. git clone git@github.com:Nguyen-H-Phuc/tmdt-cuoi_ky.git
2. Load script.sql vào xampp 
3. Mở terminal từ mục chứa code:
```bash
cd ./frontend
npm install
npm run dev # Để chạy frontend
```
4. Dán file application-dev.yaml trong thư mục resources (cùng cấp với application.yaml)
5. Đợi Intellij load Maven và chạy file BackendApplication

## Tạo người dùng
INSERT IGNORE INTO users (user_id, email, full_name, is_active) VALUES
(1, 'seller@gmail.com', 'Chủ cửa hàng', 1),
(2, 'buyer2@gmail.com', 'Người mua 2', 1),
(4, 'buyer4@gmail.com', 'Người mua 4', 1),
(5, 'buyer5@gmail.com', 'Người mua 5', 1),
(6, 'buyer6@gmail.com', 'Người mua 6', 1);
## Tạo dữ liệu mẫu để chạy thử biểu đồ
INSERT INTO orders (buyer_id, seller_id, total_price, status, shipping_address, order_date) VALUES
(2, 1, 250000, 'COMPLETED', 'Hà Nội', '2026-04-28 10:00:00'),
(4, 1, 550000, 'COMPLETED', 'TP.HCM', '2026-04-29 14:30:00'),
(2, 1, 120000, 'COMPLETED', 'Hà Nội', '2026-04-30 09:15:00'),
(5, 1, 890000, 'COMPLETED', 'Đà Nẵng', '2026-05-01 16:45:00'),
(6, 1, 340000, 'COMPLETED', 'TP.HCM', '2026-05-02 11:20:00'),
(4, 1, 1500000, 'COMPLETED', 'Hải Phòng', '2026-05-03 19:10:00'),
(2, 1, 450000, 'COMPLETED', 'Hà Nội', '2026-05-04 08:05:00'),
(5, 1, 720000, 'COMPLETED', 'Đà Nẵng', '2026-05-05 13:50:00'),
(6, 1, 2100000, 'COMPLETED', 'Cần Thơ', '2026-05-06 15:30:00');