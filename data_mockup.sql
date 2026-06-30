-- 1. Thêm người dùng (User)
INSERT INTO users (user_id, full_name, email, phone, address, university, avatar, role, is_active) VALUES 
(1, 'Nguyen Hoàng Phúc', 'phuc15363@gmail.com', '0346102270', '98/1B Ấp 54, Xã Xuân Thới Sơn, Tp Hồ Chí Minh', 'Đại học Nông Lâm Tp HCM', 'https://placehold.co/100x100/333333/FFFFFF?text=XM', 'admin', 1),
(2, 'Mai Lâm Nhật', 'nhat@example.com', '0987654321', 'Tp Hồ Chí Minh', 'Đại học Nông Lâm Tp HCM', 'https://placehold.co/100x100/FFCC00/000000?text=N', 'admin', 1),
(3, 'Nguyễn Bảo Nguyên', 'nguyen@example.com', '0912345678', 'Tp Hồ Chí Minh', 'Đại học Nông Lâm Tp HCM', 'https://placehold.co/100x100/ADD8E6/FFFFFF?text=CH', 'admin', 1),
(4, 'Nguyễn Huỳnh Giao', 'giao@example.com', '0998877665', 'Tp Hồ Chí Minh', 'Đại học Nông Lâm Tp HCM', 'https://placehold.co/100x100/FFCC00/000000?text=N', 'admin', 1),
(5, 'Hoàng Thắng Minh','student1@nlu.edu.vn','0908160944','Thủ Đức', 'Đại học Nông Lâm Tp HCM',NULL,'member',1),
(6, 'Vũ Linh Nga','student2@nlu.edu.vn','0904533029','Thủ Đức', 'Đại học Nông Lâm Tp HCM',NULL,'member',1),
(7, 'Vũ Long Sơn','student3@nlu.edu.vn','0903792668','Thủ Đức', 'Đại học Nông Lâm Tp HCM',NULL,'member',1),
(8, 'Vũ Quỳnh Châu','student4@nlu.edu.vn','0903710156','Thủ Đức', 'Đại học Nông Lâm Tp HCM',NULL,'member',1),
(9, 'Phan Yến Dũng','student5@nlu.edu.vn','0905377692','Thủ Đức', 'Đại học Nông Lâm Tp HCM',NULL,'member',1),
(10, 'Phạm Hương Hùng','student6@nlu.edu.vn','0904026011','Thủ Đức', 'Đại học Nông Lâm Tp HCM',NULL,'member',1),
(11, 'Lê Giang Anh','student7@nlu.edu.vn','0905329057','Thủ Đức', 'Đại học Tôn Đức Thắng',NULL,'member',1),
(12, 'Phan Quân Hậu','student8@nlu.edu.vn','0901759805','Thủ Đức', 'Đại học Tôn Đức Thắng',NULL,'member',1),
(13, 'Lê Quỳnh Quân','student9@nlu.edu.vn','0901959628','Thủ Đức', 'Đại học Tôn Đức Thắng',NULL,'member',1),
(14, 'Nguyễn Quỳnh Hải','student10@nlu.edu.vn','0909608364','Thủ Đức', 'Đại học Tôn Đức Thắng',NULL,'member',1),
(15, 'Lê Hậu Nam','student11@nlu.edu.vn','0906939235','Quận 12', 'Đại học Kinh tế - Luật',NULL,'member',1),
(16, 'Nguyễn Dương Ngọc','student12@nlu.edu.vn','0901880187','Quận 12', 'Đại học Kinh tế - Luật',NULL,'member',1),
(17, 'Phạm Mai Tuấn','student13@nlu.edu.vn','0902826256','Quận 12',"Đại học Giao Thông Vận Tải",NULL,'member',1),
(18, 'Phan Phúc Tuấn','student14@nlu.edu.vn','0907110806','Quận 12',"Đại học Giao Thông Vận Tải",NULL,'member',1),
(19, 'Đặng Hải Khánh','student15@nlu.edu.vn','0900079792','Quận 12',"Đại học Giao Thông Vận Tải",NULL,'member',1),
(20, 'Trần Ngọc Linh','student16@nlu.edu.vn','0901393783','Quận 12',"Đại học Công Nghiệp",NULL,'member',1),
(21, 'Phan Thi Dương','student17@nlu.edu.vn','0901604747','Quận 12',"Đại học Công Nghiệp",NULL,'member',1),
(22, 'Huỳnh Thảo Long','student18@nlu.edu.vn','0907531826','Quận 12',"Đại học Công Nghiệp",NULL,'member',1),
(23, 'Hoàng Phúc Hậu','student19@nlu.edu.vn','0903431974','Quận 12',"Đại học Công Nghệp",NULL,'member',1),
(24, 'Nguyễn Hùng Dũng','student20@nlu.edu.vn','0907089455','Quận 12',"Đại học Công Nghệp",NULL,'member',1),
(25, 'Lê Hải Hải','student21@nlu.edu.vn','0903693449','Quận 12',"Đại học Hutech",NULL,'member',1),
(26, 'Lê Hùng Long','student22@nlu.edu.vn','0902607386','Quận 12',"Đại học Hutech",NULL,'member',1),
(27, 'Trần Thắng Phúc','student23@nlu.edu.vn','0905164165','Quận 12',"Đại học Hutech",NULL,'member',1),
(28, 'Đặng Thắng Hương','student24@nlu.edu.vn','0900110473','Gò Vấp',"Đại học Hutech",NULL,'member',1),
(29, 'Lê Hương Phong','student25@nlu.edu.vn','0909594965','Gò Vấp',"Đại học Hutech",NULL,'member',1),
(30, 'Trần Thu Thảo','student26@nlu.edu.vn','0902124757','Gò Vấp',"Đại học Văn Lang",NULL,'member',1),
(31, 'Đặng Ngọc Giang','student27@nlu.edu.vn','0901599794','Gò Vấp',"Đại học Văn Lang",NULL,'member',1),
(32, 'Phạm Hương Khánh','student28@nlu.edu.vn','0906624065','Gò Vấp',"Đại học Văn Lang",NULL,'member',1),
(33, 'Huỳnh Giang Phong','student29@nlu.edu.vn','0902471163','Gò Vấp',"Đại học Văn Lang",NULL,'member',1),
(34, 'Hoàng Hải Dương','student30@nlu.edu.vn','0901059940','Gò Vấp',"Đại học Văn Lang",NULL,'member',1),
(35, 'Trần Minh Tài','student31@nlu.edu.vn','0903395429','Gò Vấp',"Đại học Văn Lang",NULL,'member',1),
(36, 'Hoàng Ngọc Dũng','student32@nlu.edu.vn','0908777172','Gò Vấp',"Đại học Bách Khoa",NULL,'member',1),
(37, 'Trần Việt Nga','student33@nlu.edu.vn','0905540343','Gò Vấp',"Đại học Bách Khoa",NULL,'member',1),
(38, 'Lê Thắng Châu','student34@nlu.edu.vn','0909386865','Gò Vấp',"Đại học Bách Khoa",NULL,'member',1),
(39, 'Hoàng Thảo Hương','student35@nlu.edu.vn','0900927025','Bình Dương',"Đại học Kinh tế TP.HCM",NULL,'member',1),
(40, 'Phan Trang Nam','student36@nlu.edu.vn','0907633758','Củ Chỉ',"Đại học Kinh tế TP.HCM",NULL,'member',1),
(41, 'Phạm Quân Bình','student37@nlu.edu.vn','0903290322','Tây Ninh',"Đại học Kinh tế TP.HCM",NULL,'member',1),
(42, 'Huỳnh Nam Tuấn','student38@nlu.edu.vn','0900246164','Đồng Nai',"Đại học Kinh tế TP.HCM",NULL,'member',1),
(43, 'Huỳnh Hậu Quỳnh','student39@nlu.edu.vn','0907918437','Đồng Tháp',"Đại học Kiến trúc",NULL,'member',1),
(44, 'Bùi Giang Anh','student40@nlu.edu.vn','0906084758','Huế',"Đại học Kiến trúc",NULL,'member',1),
(45, 'Nguyễn Hương Hương','student41@nlu.edu.vn','0905678757','Hà Nội',"Đại học Kiến trúc",NULL,'member',1),
(46, 'Nguyễn Mai Tú','student42@nlu.edu.vn','0904948635','Đà Lạt',"Đại học Kiến trúc",NULL,'member',1),
(47, 'Phan Thắng Anh','student43@nlu.edu.vn','0907402581','Tiền Giang',"Đại học Kiến trúc",NULL,'member',1),
(48, 'Phan Trang Nam','student44@nlu.edu.vn','0908246051','Vũng Tàu',"Đại học RMIT",NULL,'member',1),
(49, 'Phan Trang Khánh','student45@nlu.edu.vn','0908786563','Đà Lạt',"Đại học RMIT",NULL,'member',1),
(50, 'Hoàng Yến Khánh','student46@nlu.edu.vn','0905861142','Quận 1',"Đại học RMIT",NULL,'member',1),
(51, 'Nguyễn Long Thắng','student47@nlu.edu.vn','0908660290','Quảng Ninh',"Đại học RMIT",NULL,'member',0),
(52, 'Bùi Châu Phong','student48@nlu.edu.vn','0905727310','Long An',"Đại học RMIT",NULL,'member',0),
(53, 'Trần Hùng Phương','student49@nlu.edu.vn','0902983895','Ký túc xá ĐH Nông Lâm',NULL,NULL,'member',0),
(54, 'Phan Phong Tài','student50@nlu.edu.vn','0909564156','Ký túc xá ĐH Nông Lâm',NULL,NULL,'member',0),
(55, 'Phan Dương Thu','student51@nlu.edu.vn','0908810209','Ký túc xá ĐH Nông Lâm',NULL,NULL,'member',0),
(56, 'Đặng Phong Hương','student52@nlu.edu.vn','0907205317','Ký túc xá ĐH Nông Lâm',NULL,NULL,'member',0),
(57, 'Vũ Quân Việt','student53@nlu.edu.vn','0907797122','Ký túc xá ĐH Nông Lâm',NULL,NULL,'member',0),
(58, 'Nguyễn Anh Thi','student54@nlu.edu.vn','0900782339','Ký túc xá ĐH Nông Lâm',NULL,NULL,'member',0);

INSERT INTO local_accounts
(user_id, password_hash, is_email_verified, verification_code, code_expired_at) VALUES
(1, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(2, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(3, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(4, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(5, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(6, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(7, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(8, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(9, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(10, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(11, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(12, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(13, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(14, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(15, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(16, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(17, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(18, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(19, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(20, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(21, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(22, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(23, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(24, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(25, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(26, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(27, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(28, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(29, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(30, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(31, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(32, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(33, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(34, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(35, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(36, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(37, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(38, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(39, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(40, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(41, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(42, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(43, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(44, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(45, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(46, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(47, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(48, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(49, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(50, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(51, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(52, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(53, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(54, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(55, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(56, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(57, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL),
(58, '$2a$10$mRn.QAQT/vL5urT9sSbhCupPVDWDRk2QcLH18AJGnHyzNMmCUzlQ.', 1, NULL, NULL);

-- 2. Thêm danh mục
INSERT INTO categories (category_id, category_name, category_image) VALUES
(1, 'Bất động sản', 'home.png'),
(2, 'Xe cộ', 'vehicle.png'),
(3, 'Thú cưng', 'pet.png'),
(4, 'Đồ gia dụng, nội thất, cây cảnh', 'appliance.png'),
(5, 'Giải trí, Thể thao, Sở thích', 'entertainment.png'),
(6, 'Mẹ và bé', 'mom-and-baby.png'),
(7, 'Dịch vụ, Du lịch', 'tourism.png'),
(8, 'Cho tặng miễn phí', 'gift.png'),
(9, 'Việc làm', 'job.png'),
(10, 'Đồ điện tử', 'electronic.png'),
(11, 'Tủ lạnh, máy lạnh, máy giặt', 'household-electronics.png'),
(12, 'Thời trang, Đồ dùng cá nhân', 'fashion.png'),
(13, 'Đồ ăn, thực phẩm và các loại khác', 'food.png'),
(14, 'Dịch vụ chăm sóc nhà cửa', 'service.png');

-- 3. Thêm sản phẩm
INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, created_at) VALUES
-- DỮ LIỆU MẪU CHO DANH MỤC ĐỒ ĐIỆN TỬ (category_id = 10)
(1, 1, 10, 'Laptop Dell Inspiron 15 N5010 Core i5', 'Laptop cũ dùng ổn định, còn pin dùng 2-3 tiếng, màn hình 15.6 inch, RAM 8GB, HDD 500GB, máy đẹp không lỗi', 4500000, 'dell_inspiron_15_1.jpg', 120, 'available', 'approved', 1, '2026-06-15 10:30:00'),
(2, 1, 10, 'MacBook Pro 2017 13 inch Touch Bar', 'MacBook Pro 2017, Core i5 2.3GHz, RAM 8GB, SSD 256GB, màn hình Retina, Touch Bar, máy zin chưa sửa chữa, rất đẹp', 8500000, 'macbook_pro_2017_1.jpg', 250, 'available', 'approved', 1, '2026-06-18 14:20:00'),
(3, 1, 10, 'iPhone 11 64GB Chính Hãng', 'iPhone 11 64GB, màu trắng, pin 82%, máy nguyên bản, màn hình đẹp, cạnh hơi xước nhẹ, full phụ kiện hộp', 6200000, 'iphone-11_1.jpg', 310, 'available', 'approved', 1, '2026-06-20 09:15:00'),
(4, 2, 10, 'Samsung Galaxy S21 FE 5G 128GB', 'Samsung S21 FE, 128GB, màu tím, pin tốt, máy đẹp 98%, còn bảo hành 3 tháng, full box', 7800000, 'samsung_s21fe_1.jpg', 180, 'available', 'approved', 1, '2026-06-22 16:45:00'),
(5, 2, 10, 'Tai nghe Sony WH-1000XM4', 'Tai nghe Sony chống ồn cao cấp WH-1000XM4, màu đen, hàng xách tay Nhật, pin 30h, còn mới 99%, có hộp', 4200000, 'sony_wh1000xm4_1.webp', 95, 'available', 'approved', 1, '2026-06-25 11:00:00'),
(6, 2, 10, 'AirPods Pro 2 Chính Hãng', 'AirPods Pro 2 Gen, còn bảo hành 6 tháng, đầy đủ hộp, sạc, tình trạng đẹp, chống ồn tốt', 3900000, 'airpods_pro2_1.webp', 220, 'available', 'approved', 1, '2026-06-27 08:30:00'),
(7, 3, 10, 'Màn hình Dell UltraSharp U2415 24 inch', 'Màn hình Dell U2415 24 inch IPS, độ phân giải 1920x1200, màu sắc đẹp, tỉ lệ 16:10, còn dây nguồn và cáp', 2800000, 'dell_u2415_1.jpg', 65, 'available', 'approved', 1, '2026-07-01 13:40:00'),
(8, 3, 10, 'Bàn phím cơ Akko 3087 Rainbow Hotswap', 'Bàn phím cơ Akko 3087 87 phím, switch Jelly Pink, hotswap, RGB, có thay đổi keycap, tình trạng mới 90%', 1200000, 'akko_3087_1.jpg', 78, 'available', 'approved', 1, '2026-07-03 10:00:00'),
(9, 4, 10, 'Chuột Logitech G Pro X Superlight', 'Chuột gaming Logitech G Pro X Superlight, màu trắng, 63g, Hero 25K, mới 95%, có hộp và phụ kiện', 1800000, 'logitech_gprox_1.webp', 140, 'available', 'approved', 1, '2026-06-06 15:20:00'),
(10, 4, 10, 'SSD Samsung 870 EVO 1TB SATA III', 'SSD Samsung 870 EVO 1TB SATA 2.5 inch, dùng chưa 6 tháng, bảo hành 5 năm, còn nguyên hộp', 2100000, 'samsung_870evo_1tb_1.webp', 55, 'available', 'approved', 1, '2026-05-30 09:50:00'),
-- DỮ LIỆU MẪU CHO DANH MỤC TỦ LẠNH, MÁY LẠNH, MÁY GIẶT (category_id = 11)
(11, 1, 11, 'Tủ lạnh Samsung Inverter 253 lít', 'Tủ lạnh Samsung 2 cánh, dung tích 253 lít, công nghệ Inverter tiết kiệm điện, màu bạc, tình trạng đẹp, còn sử dụng tốt', 3800000, 'tu-lanh-samsung-rt25m4032bu-sv-1.jpg', 210, 'available', 'approved', 1, '2026-06-16 08:30:00'),
(12, 1, 11, 'Máy lạnh Daikin 1.5 HP Inverter', 'Máy lạnh Daikin FTKC35, công suất 1.5 HP, inverter tiết kiệm điện, lọc không khí, máy còn mới 90%, có remote', 5500000, 'may-lanh-daikin-ftkc35rvmv-1.png', 185, 'available', 'approved', 1, '2026-06-19 10:15:00'),
(13, 2, 11, 'Máy giặt LG Inverter 8kg', 'Máy giặt LG cửa trên, 8kg, công nghệ Inverter, 6 chuyển động, còn mới, ít sử dụng, có bảo hành 6 tháng', 4200000, 'may-giat-lg-tg2402ntww-1.jpg', 195, 'available', 'approved', 1, '2026-05-21 14:20:00'),
(14, 2, 11, 'Tủ lạnh Panasonic 330 lít', 'Tủ lạnh Panasonic Inverter 330 lít, 2 cánh, ngăn đá trên, màu bạc, chống vi khuẩn, đẹp, còn tốt', 5200000, 'tu-lanh-panasonic-nr-bd418vsvn-1.jpg', 145, 'available', 'approved', 1, '2026-05-23 09:40:00'),
(15, 3, 11, 'Máy lạnh LG 1 HP Inverter', 'Máy lạnh LG 1 HP, inverter, làm lạnh nhanh, lọc bụi, tiết kiệm điện, máy mới 95%, đầy đủ remote', 3800000, 'may-lanh-lg-inverter-1-hp-ifc09m1-1.jpg', 120, 'available', 'approved', 1, '2026-06-25 16:10:00'),
(16, 3, 11, 'Máy giặt Electrolux 9kg', 'Máy giặt Electrolux cửa trước, 9kg, Inverter, sấy 7kg, còn bảo hành 1 năm, máy đẹp ít xước', 6800000, 'electrolux-inverter-9-kg-ewf9025dqwb-1.jpg', 230, 'available', 'approved', 1, '2026-05-27 11:30:00'),
(17, 3, 11, 'Tủ lạnh Toshiba 180 lít', 'Tủ lạnh Toshiba 180 lít, màu bạc, ngăn đá trên, phù hợp gia đình nhỏ, tiết kiệm điện', 2200000, 'tu-lanh-toshiba-gr-b22vu-ukg-1.jpg', 88, 'available', 'approved', 1, '2026-07-01 13:50:00'),
(18, 4, 11, 'Máy lạnh Panasonic 2 HP Inverter', 'Máy lạnh Panasonic 2 HP, inverter, làm lạnh nhanh, lọc không khí, điều khiển wifi, mới 90%', 7200000, 'panasonic-inverter-1-hp-cu-cs-pu9ckh-8d-1.jpg', 165, 'available', 'approved', 1, '2026-07-03 08:00:00'),
(19, 4, 11, 'Máy giặt Samsung Inverter 8kg', 'Máy giặt Samsung cửa trên, 8kg, inverter, công nghệ Eco Bubble, máy ít dùng, đẹp', 3600000, 'samsung-inverter-8kg-ww80t3020ww-sv-1.jpg', 102, 'available', 'approved', 1, '2026-05-06 15:45:00'),
(20, 4, 11, 'Tủ lạnh Hitachi 450 lít Inverter', 'Tủ lạnh Hitachi 450 lít, 2 cánh, inverter, ngăn đá dưới, mặt kính sang trọng, còn rất mới', 8900000, 'tu-lanh-hitachi-inverter-450-lit-r-fg560pgv8x-gbk-1.jpg', 310, 'available', 'approved', 1, '2026-05-07 10:20:00'),
-- DỮ LIỆU MẪU CHO DANH MỤC THÚ CƯNG (category_id = 3)
(21, 1, 3, 'Chó Poodle trắng thuần chủng', 'Chó Poodle lông xù màu trắng, 4 tháng tuổi, đã tiêm phòng đầy đủ, giấy tờ đầy đủ, rất dễ thương và thông minh', 5500000, 'poodle-white-1.jpg', 320, 'available', 'approved', 1, '2026-05-14 09:00:00'),
(22, 1, 3, 'Mèo Anh lông ngắn màu xám', 'Mèo Anh lông ngắn (British Shorthair), 3 tháng tuổi, màu xám tro, mắt vàng, đã tiêm phòng và tẩy giun, rất bụ bẫm', 4200000, 'meo-anh-xam-1.jpg', 280, 'available', 'approved', 1, '2026-05-16 14:30:00'),
(23, 1, 3, 'Chó Husky trắng xám', 'Chó Husky Siberia, 6 tháng tuổi, màu trắng xám, mắt xanh, rất năng động và thông minh, có giấy tờ nguồn gốc', 7800000, 'husky-1.jpg', 450, 'available', 'approved', 1, '2026-05-18 10:15:00'),
(24, 2, 3, 'Cage nuôi mèo cao cấp 3 tầng', 'Lồng nuôi mèo 3 tầng bằng kim loại, có kệ gỗ, cầu trượt, khay vệ sinh, mới 90%, phù hợp nuôi 2-3 mèo', 1200000, 'chuong-meo-3-tang-1.jpg', 95, 'available', 'approved', 1, '2026-05-20 16:40:00'),
(25, 2, 3, 'Thức ăn hạt Royal Canin cho chó trưởng thành', 'Thức ăn hạt Royal Canin dành cho chó trưởng thành (Adult), loại Medium 7.5kg, còn hạn sử dụng đến 12/2025', 850000, 'thuc-an-cho-1.webp', 210, 'available', 'approved', 5, '2026-05-22 08:50:00'),
(26, 2, 3, 'Mèo Ragdoll mắt xanh', 'Mèo Ragdoll, 5 tháng tuổi, lông dài màu trắng kem, mắt xanh, rất hiền lành và dễ thương, đã tiêm phòng', 6200000, 'meo-mat-xanh-1.jpg', 340, 'available', 'approved', 1, '2026-05-24 13:20:00'),
(27, 3, 3, 'Chó Phốc sóc lông vàng', 'Chó Phốc sóc (Pomeranian), 3 tháng tuổi, màu vàng cam, dễ thương, đã tiêm phòng, giấy tờ đầy đủ', 4800000, 'phoc-soc-vang-1.jpg', 190, 'available', 'approved', 1, '2026-05-26 09:30:00'),
(28, 3, 3, 'Cát vệ sinh mèo thơm 10L', 'Cát vệ sinh cho mèo dạng hạt, khử mùi, 10L, đóng gói kín, sử dụng tốt, không bám chân', 180000, 'cat-vs-meo-1.jpg', 150, 'available', 'approved', 20, '2026-05-28 11:10:00'),
(29, 4, 3, 'Chó Golden Retriever lai', 'Chó Golden Retriever lai, 5 tháng tuổi, màu vàng, rất thân thiện và thông minh, đã tiêm phòng, giấy tờ đầy đủ', 3500000, 'golden-lai-1.jpg', 115, 'available', 'approved', 1, '2026-05-02 15:00:00'),
(30, 4, 3, 'Mèo Ba Tư mặt phẳng', 'Mèo Ba Tư mặt phẳng (Exotic), 4 tháng tuổi, màu trắng, mũi tẹt, rất đáng yêu, đã tiêm phòng, có giấy tờ', 5600000, 'meo-ba-tu-1.jpg', 260, 'available', 'approved', 1, '2026-05-04 10:45:00'),
-- DỮ LIỆU MẪU CHO DANH MỤC GIẢI TRÍ, THỂ THAO, SỞ THÍCH (category_id = 5)
(31, 1, 5, 'Xe đạp địa hình Giant 29 inch', 'Xe đạp thể thao Giant, loại địa hình, vành 29 inch, khung nhôm, phanh đĩa, số Shimano, tình trạng đẹp, ít sử dụng', 4200000, 'xe-dap-dia-hinh-1.webp', 195, 'available', 'approved', 1, '2026-05-15 07:30:00'),
(32, 1, 5, 'Bộ guitar acoustic Yamaha F310', 'Đàn guitar acoustic Yamaha F310, đầy đủ phụ kiện (túi đựng, capo, dây đeo, pick), mới 95%, âm thanh hay', 2800000, 'dan-guitar-1.jpg', 165, 'available', 'approved', 1, '2026-05-17 10:20:00'),
(33, 1, 5, 'Bóng rổ Wilson Evolution 7', 'Bóng rổ Wilson Evolution, size 7 (chuẩn NBA), bóng cao su tổng hợp, còn mới 90%, bóng nảy tốt', 850000, 'bong-ro-1.jpg', 132, 'available', 'approved', 2, '2026-05-19 14:10:00'),
(34, 2, 5, 'Máy chơi game Nintendo Switch OLED', 'Nintendo Switch OLED mới 95%, màu trắng, full box, có thêm 2 game (Zelda và Mario Kart), pin tốt', 6200000, 'switch-1.jpg', 380, 'available', 'approved', 1, '2026-05-21 09:45:00'),
(35, 2, 5, 'Vợt cầu lông Yonex Astrox 99', 'Vợt cầu lông Yonex Astrox 99 Pro, màu xanh đen, cước BG80, còn mới 90%, có bao đựng', 2100000, 'vot-cau-long.jpg', 178, 'available', 'approved', 1, '2026-05-23 16:30:00'),
(36, 3, 5, 'Gậy golf Taylormade SIM2 Driver', 'Gậy golf Taylormade SIM2, đánh xa, mặt gậy công nghệ mới, tay cầm Golf Pride, còn rất mới', 4500000, 'gay-golf-1.jpg', 112, 'available', 'approved', 1, '2026-05-25 11:20:00'),
(37, 3, 5, 'Bộ cờ vua gỗ cao cấp', 'Bộ cờ vua bằng gỗ cao cấp, bàn cờ 50x50cm, quân cờ tỉ mỉ, sản phẩm thủ công, rất đẹp', 1200000, 'co-vua-1.webp', 98, 'available', 'approved', 2, '2026-05-27 08:00:00'),
(38, 4, 5, 'Kính bơi Speedo Fastskin', 'Kính bơi Speedo Fastskin Elite, chống mờ, chống UV, chất lượng Olympic, mới 100%', 650000, 'kinh-boi-1.webp', 155, 'available', 'approved', 3, '2026-06-01 13:40:00'),
(39, 4, 5, 'Xe trượt ván cruiser 22 inch', 'Xe trượt ván loại cruiser, kích thước 22x6 inch, bánh PU 60mm, ván gỗ cao cấp, chịu lực tốt', 950000, 'van-truot-1.webp', 72, 'available', 'approved', 2, '2026-06-03 15:50:00'),
(40, 4, 5, 'Bộ loa karaoke gia đình có mic', 'Bộ loa karaoke công suất 500W, 2 loa, 2 mic có dây, kết nối Bluetooth/USB/AUX, chất lượng tốt', 3200000, 'loa-karaoke-1.webp', 220, 'available', 'approved', 1, '2026-06-05 10:15:00'),
-- DỮ LIỆU MẪU CHO DANH MỤC XE CỘ (category_id = 2)
(41, 1, 2, 'Xe máy Honda Vision 2019', 'Xe máy Honda Vision 2019, màu trắng, đã đi 18,000km, xe còn tốt, ít trầy xước, đăng ký chính chủ, bao sang tên', 18500000, 'vision-trang-1.jpg', 420, 'available', 'approved', 1, '2026-05-14 08:00:00'),
(42, 1, 2, 'Xe máy Yamaha Exciter 155 VVA', 'Xe máy Yamaha Exciter 155, 2021, màu đen đỏ, đã đi 12,000km, full phụ kiện, xe đẹp, có giấy tờ', 32000000, 'exciter-1.jpg', 380, 'available', 'approved', 1, '2026-05-16 09:30:00'),
(43, 1, 2, 'Xe đạp điện Yadea Aura', 'Xe đạp điện Yadea Aura, 2023, màu cam, pin 48V 20Ah, đi được 70km/sạc, mới 95%, đầy đủ giấy tờ', 11500000, 'xe-dap-dien-1.jpg', 245, 'available', 'approved', 1, '2026-05-18 14:20:00'),
(44, 2, 2, 'Ô tô Toyota Vios 2018', 'Toyota Vios 2018, số tự động, máy xăng 1.5L, đã đi 45,000km, xe đẹp, nội thất da, điều hòa, camera lùi', 390000000, 'vios-1.jpg', 520, 'available', 'approved', 1, '2026-05-20 10:15:00'),
(45, 2, 2, 'Xe máy Honda SH 150i 2020', 'Honda SH 150i 2020, màu đen, đã đi 8,000km, xe zin, đẹp, không lỗi, giấy tờ đầy đủ, bảo dưỡng hãng', 48000000, 'sh-1.jpg', 560, 'available', 'approved', 1, '2026-05-22 16:40:00'),
(46, 2, 2, 'Xe máy điện VinFast Feliz S', 'Xe máy điện VinFast Feliz S, 2023, màu trắng, pin 3.2kW, đi được 90km/sạc, còn bảo hành 2 năm', 22000000, 'vinfast-1.jpg', 310, 'available', 'approved', 1, '2026-05-24 11:00:00'),
(47, 3, 2, 'Xe đạp địa hình Trek Marlin 5', 'Xe đạp Trek Marlin 5, khung nhôm, vành 27.5 inch, phanh đĩa cơ, số Shimano, mới 90%, ít sử dụng', 6500000, 'trek-1.jpg', 175, 'available', 'approved', 1, '2026-05-26 13:30:00'),
(48, 4, 2, 'Ô tô Hyundai Grand i10 2020', 'Hyundai Grand i10 2020, số tự động, máy 1.2L, đi 35,000km, xe đẹp, đầy đủ tiện nghi, giấy tờ đầy đủ', 320000000, 'hyundai-grand-i10.jpg', 440, 'available', 'approved', 1, '2026-05-28 08:45:00'),
(49, 4, 2, 'Xe máy Suzuki Raider 150', 'Suzuki Raider 150, 2020, màu xanh đen, đã đi 15,000km, xe khỏe, nổ máy êm, ít trầy, giấy tờ đầy đủ', 26000000, 'raider-1.jpg', 195, 'available', 'approved', 1, '2026-06-02 15:20:00'),
(50, 4, 2, 'Phuộc trước PNP Vario/Click 125-150 chân phuộc nhôm CNC', 'Thông số kỹ thuật phuộc trước PNP Vario/Click 125-150:
- Ti phuộc: 26mm
- Lổ cốt bánh: 12mm
- Trọng lượng: 3,4kg
- Có 1 màu duy nhất: Vỏ phuộc màu vàng - chân phuộc màu bạc.
- Lắp được cho xe: Vario 2015-2018', 3500000, 'phuoc-truoc-1.jpg', 670, 'available', 'approved', 1, '2026-06-04 09:10:00'),
-- DỮ LIỆU MẪU CHO DANH MỤC THỜI TRANG, ĐỒ DÙNG CÁ NHÂN (category_id = 12)
(51, 1, 12, 'Áo thun Uniqlo oversized trắng', 'Áo thun Uniqlo oversize màu trắng, size L, chất cotton mềm, mặc 2 lần, còn mới 98%, phù hợp phong cách basic', 150000, 'ao-uniqlo-trang-1.jpg', 320, 'available', 'approved', 1, '2026-05-15 09:20:00'),
(52, 2, 12, 'Quần jean ống suông Zara nam', 'Quần jean Zara ống suông màu xanh đen, size 30, chất vải dày dặn, còn tốt, mặc được vài lần', 220000, 'quan-jean-nam-1.webp', 185, 'available', 'approved', 1, '2026-05-17 14:30:00'),
(53, 3, 12, 'Áo hoodie Basic Oversize đen', 'Áo hoodie oversize màu đen, chất nỉ ấm áp, size L, mới mua 1 tháng, chưa mặc lần nào, vẫn còn tag', 180000, 'hoodie-den-1.jpg', 250, 'available', 'approved', 1, '2026-05-19 10:45:00'),
(54, 3, 12, 'Giày thể thao Nike Air Force 1', 'Giày Nike Air Force 1 trắng, size 42 (US 9), mới 90%, đi vài lần, còn hộp đầy đủ, phối đồ đẹp', 1200000, 'nike-1.jpg', 560, 'available', 'approved', 1, '2026-05-21 16:10:00'),
(55, 4, 12, 'Váy ren trắng phong cách Hàn', 'Váy ren trắng xòe, phong cách Hàn Quốc, size M, phù hợp dạo phố hay đi tiệc, mặc 1 lần, còn mới', 250000, 'vay-ren-trang-1.jpg', 195, 'available', 'approved', 1, '2026-05-23 08:30:00'),
(56, 4, 12, 'Balo laptop Herschel Dawson', 'Balo Herschel Dawson màu xanh đen, chất vải bền, có ngăn chứa laptop 15.6 inch, mới 95%, ít sử dụng', 450000, 'balo-laptop-1.jpg', 340, 'available', 'approved', 1, '2026-05-25 13:15:00'),
(57, 1, 12, 'Áo sơ mi công sở nam trắng', 'Áo sơ mi nam trắng cổ đức, chất cotton co giãn, size M, phù hợp đi làm hay thực tập, mới 90%', 180000, 'ao-so-mi-trang-1.webp', 140, 'available', 'approved', 2, '2026-05-27 11:20:00'),
(58, 2, 12, 'Kính mát Ray-Ban Clubmaster', 'Kính mát Ray-Ban Clubmaster cổ điển, gọng đen viền vàng, tròng đen, phong cách Hàn Quốc, mới 95%', 850000, 'kinh-mat-1.jpg', 270, 'available', 'approved', 1, '2026-06-01 09:40:00'),
(59, 4, 12, 'Bộ vest nữ màu ghi thanh lịch', 'Bộ vest nữ màu ghi, áo blazer + quần ống suông, size S, phong cách công sở, mặc 1 lần, chất vải cao cấp', 350000, 'vest-nu-1.webp', 165, 'available', 'approved', 1, '2026-06-03 15:50:00'),
(60, 3, 12, 'Áo len cổ lọ basic đen', 'Áo len cổ lọ màu đen, chất len mềm mịn, size L, giữ ấm tốt, phù hợp mùa đông, mới 90%', 200000, 'ao-len-1.jpg', 130, 'available', 'approved', 1, '2026-06-05 10:30:00'),
-- DỮ LIỆU MẪU CHO DANH MỤC SÁCH, GIÁO TRÌNH (category_id = 13 - Đồ ăn, thực phẩm và các loại khác)
(61, 2, 13, 'Giáo trình xác suất thống kê', 'Sách mới 95%, không ghi chú, bìa còn đẹp', 15000, 'xstk-1.jpg', 420, 'available', 'approved', 3, '2026-05-14 08:00:00'),
(62, 2, 13, 'Giáo trình Toán cao cấp A1', 'Giáo trình Toán cao cấp A1, sách mới 90%, có đánh dấu vài công thức quan trọng', 15000, 'toan-a1.jpg', 380, 'available', 'approved', 4, '2026-05-16 09:30:00'),
(63, 2, 13, 'Giáo trình pháp luật đại cương', 'Sách mới 95%, không ghi chú, còn nguyên bìa', 10000, 'pldc-1.jpg', 295, 'available', 'approved', 2, '2026-05-18 14:20:00'),
(64, 2, 13, 'Giáo trình Vật lý đại cương 1 - BK', 'Giáo trình Vật lý đại cương 1 dành cho sinh viên ĐH Bách Khoa và ĐH KHTN, sách mới 90%, có vài ghi chú bằng bút chì', 75000, 'vldc-bk-1.jpg', 340, 'available', 'approved', 5, '2026-05-20 10:15:00'),
(65, 2, 13, 'Tiếng Anh chuyên ngành Công nghệ thông tin', 'Giáo trình Tiếng Anh chuyên ngành IT, sách mới 95%, có từ điển chuyên ngành, phù hợp sinh viên CNTT, không ghi chú', 120000, 'ta-cntt.jpg', 225, 'available', 'approved', 2, '2026-05-22 16:40:00'),
(66, 3, 13, 'Giáo trình Tâm lý học đại cương - KHXH', 'Giáo trình Tâm lý học đại cương dành cho sinh viên khối Khoa học Xã hội, sách mới 100% (chưa dùng), bìa đẹp', 80000, 'tlhdc-1.png', 180, 'available', 'approved', 2, '2026-05-24 11:00:00'),
(67, 3, 13, 'Giáo trình Luật Kinh tế - ĐH Luật', 'Giáo trình Luật Kinh tế dành cho sinh viên ĐH Luật, sách mới 90%, không ghi chú, còn nguyên bìa', 95000, 'lkt.webp', 260, 'available', 'approved', 3, '2026-05-26 13:30:00'),
(68, 4, 13, 'Giáo trình Kế toán tài chính - UEH', 'Giáo trình Kế toán tài chính dành cho sinh viên UEH và các trường khối kinh tế, sách mới 90%, có ghi chú ít', 110000, 'kttc.webp', 310, 'available', 'approved', 3, '2026-05-28 08:45:00'),
(69, 4, 13, 'Giáo trình Cơ sở dữ liệu - CNTT', 'Giáo trình Cơ sở dữ liệu dành cho sinh viên CNTT, sách mới 95%, không ghi chú, có bài tập kèm theo', 100000, 'csdl-cntt.jpg', 275, 'available', 'approved', 3, '2026-06-02 15:20:00'),
(70, 4, 13, 'Giáo trình Hóa học đại cương - BK', 'Giáo trình Hóa học đại cương dành cho sinh viên khối kỹ thuật, sách mới 90%, có ghi chú quan trọng bằng bút chì', 70000, 'hdc-1.jpg', 195, 'available', 'approved', 4, '2026-06-04 09:10:00');

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
(5, 'sony_wh1000xm4_1.webp', TRUE),
(5, 'sony_wh1000xm4_2.webp', FALSE),
(5, 'sony_wh1000xm4_3.webp', FALSE),
(5, 'sony_wh1000xm4_4.webp', FALSE);

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

-- ============================================
-- DỮ LIỆU MẪU CHO CUỘC TRÒ CHUYỆN
-- (conversations và messages)

-- ============================================
-- CUỘC TRÒ CHUYỆN 1: Mua laptop Dell Inspiron
-- ============================================
INSERT INTO conversations (user_one, user_two, product_id) VALUES
(2, 1, 1);

INSERT INTO messages (conversation_id, sender_id, message_text, is_read, sent_at) VALUES
(1, 2, 'Chào anh, em muốn hỏi về laptop Dell Inspiron 15 ạ', TRUE, '2025-02-20 10:15:00'),
(1, 1, 'Chào em, laptop còn tốt em nhé. Em cần hỏi gì thêm không?', TRUE, '2025-02-20 10:20:00'),
(1, 2, 'Dạ máy còn pin dùng được bao lâu ạ?', TRUE, '2025-02-20 10:25:00'),
(1, 1, 'Pin dùng được khoảng 2-3 tiếng khi lướt web, xem phim nhé', TRUE, '2025-02-20 10:30:00'),
(1, 2, 'Dạ em cảm ơn, em sẽ suy nghĩ thêm rồi báo lại ạ', TRUE, '2025-02-20 10:35:00'),
(1, 1, 'Ok em, có gì liên hệ lại anh nhé', TRUE, '2025-02-20 10:40:00');


-- ============================================
-- CUỘC TRÒ CHUYỆN 2: Mua iPhone 11
-- Người mua: Lê Văn Cường (user_id=3)
-- Người bán: Trần Thị Bình (user_id=2)
-- Sản phẩm: iPhone 11 64GB (product_id=3)
-- ============================================
INSERT INTO conversations (user_one, user_two, product_id) VALUES
(3, 2, 3);

INSERT INTO messages (conversation_id, sender_id, message_text, is_read, sent_at) VALUES
(2, 3, 'Chị ơi, em muốn mua iPhone 11 ạ, máy còn mới không ạ?', TRUE, '2025-02-22 09:30:00'),
(2, 2, 'Máy còn 98% em nhé, chị dùng được 3 tháng thôi', TRUE, '2025-02-22 09:35:00'),
(2, 3, 'Vậy chị có thể bớt chút được không ạ, em là sinh viên ạ :D', TRUE, '2025-02-22 09:40:00'),
(2, 2, 'Chị giảm còn 6 triệu cho em nhé, bao gồm cả phụ kiện', TRUE, '2025-02-22 09:45:00'),
(2, 3, 'Dạ em chốt nhé, em qua lấy vào chiều mai được không ạ?', TRUE, '2025-02-22 09:50:00'),
(2, 2, 'Ok em, chị gửi địa chỉ cho em nhé', TRUE, '2025-02-22 09:55:00'),
(2, 3, 'Dạ em cảm ơn chị ạ', TRUE, '2025-02-22 10:00:00');


-- ============================================
-- CUỘC TRÒ CHUYỆN 3: Hỏi về MacBook Pro
-- Người mua: Phạm Thị Dung (user_id=4)
-- Người bán: Nguyễn Văn An (user_id=1)
-- Sản phẩm: MacBook Pro 2017 (product_id=2)
-- ============================================
INSERT INTO conversations (user_one, user_two, product_id) VALUES
(4, 1, 2);

INSERT INTO messages (conversation_id, sender_id, message_text, is_read, sent_at) VALUES
(3, 4, 'Anh ơi, MacBook Pro của anh còn không ạ?', TRUE, '2025-02-25 14:00:00'),
(3, 1, 'Còn em nhé, em quan tâm à?', TRUE, '2025-02-25 14:05:00'),
(3, 4, 'Dạ, em muốn hỏi máy còn bảo hành không ạ?', TRUE, '2025-02-25 14:10:00'),
(3, 1, 'Hết bảo hành rồi em, nhưng máy còn rất tốt, chưa sửa chữa lần nào', TRUE, '2025-02-25 14:15:00'),
(3, 4, 'Vậy anh có thể giảm giá chút cho em được không ạ?', TRUE, '2025-02-25 14:20:00'),
(3, 1, 'Anh giảm cho em còn 8.2 triệu nhé', TRUE, '2025-02-25 14:25:00'),
(3, 4, 'Dạ em suy nghĩ rồi trả lời anh sau ạ', TRUE, '2025-02-25 14:30:00');


-- ============================================
-- CUỘC TRÒ CHUYỆN 4: Hỏi về đồ chơi Nintendo Switch
-- Người mua: Hoàng Văn Em (user_id=5)
-- Người bán: Nguyễn Văn An (user_id=1)
-- Sản phẩm: Nintendo Switch OLED (product_id=34)
-- ============================================
INSERT INTO conversations (user_one, user_two, product_id) VALUES
(5, 1, 34);

INSERT INTO messages (conversation_id, sender_id, message_text, is_read, sent_at) VALUES
(4, 5, 'Anh ơi, máy Switch còn không ạ? Em muốn mua cho em trai', TRUE, '2025-03-01 19:00:00'),
(4, 1, 'Còn em nhé, máy còn mới 95%, có kèm 2 game luôn', TRUE, '2025-03-01 19:05:00'),
(4, 5, 'Tuyệt quá anh, giá 6.2 triệu có thương lượng không ạ?', TRUE, '2025-03-01 19:10:00'),
(4, 1, 'Anh để giá đó rồi em, anh bán kèm thêm bao da nữa', TRUE, '2025-03-01 19:15:00'),
(4, 5, 'Dạ em chốt nhé, anh cho em địa chỉ để mai em qua ạ', TRUE, '2025-03-01 19:20:00'),
(4, 1, 'Ok em, anh gửi địa chỉ cho em nhé', FALSE, '2025-03-01 19:25:00');


-- ============================================
-- CUỘC TRÒ CHUYỆN 5: Hỏi về xe đạp Trek
-- Người mua: Trần Thị Bình (user_id=2)
-- Người bán: Hoàng Văn Em (user_id=5)
-- Sản phẩm: Trek Marlin 5 (product_id=47)
-- ============================================
INSERT INTO conversations (user_one, user_two, product_id) VALUES
(2, 5, 47);

INSERT INTO messages (conversation_id, sender_id, message_text, is_read, sent_at) VALUES
(5, 2, 'Em chào anh, xe đạp Trek của anh còn không ạ?', TRUE, '2025-03-03 15:00:00'),
(5, 5, 'Chào em, xe còn em nhé, em có hứng thú không?', TRUE, '2025-03-03 15:05:00'),
(5, 2, 'Dạ, em muốn hỏi xe dùng được bao lâu rồi ạ?', TRUE, '2025-03-03 15:10:00'),
(5, 5, 'Anh dùng được 1 năm, nhưng ít đi, nên xe còn mới 90%', TRUE, '2025-03-03 15:15:00'),
(5, 2, 'Anh có thể bớt xuống 6 triệu cho em được không ạ?', TRUE, '2025-03-03 15:20:00'),
(5, 5, 'Ok em, sang chủ mới anh bán rẻ cho em', TRUE, '2025-03-03 15:25:00');


-- ============================================
-- CUỘC TRÒ CHUYỆN 6: Hỏi về áo hoodie
-- Người mua: Phạm Thị Dung (user_id=4)
-- Người bán: Hoàng Văn Em (user_id=5)
-- Sản phẩm: Áo hoodie Basic Oversize (product_id=53)
-- ============================================
INSERT INTO conversations (user_one, user_two, product_id) VALUES
(4, 5, 53);

INSERT INTO messages (conversation_id, sender_id, message_text, is_read, sent_at) VALUES
(6, 4, 'Hi bạn, áo hoodie đen còn không ạ?', TRUE, '2025-03-05 20:30:00'),
(6, 5, 'Chào bạn, còn nhé, bạn thích áo này à?', TRUE, '2025-03-05 20:35:00'),
(6, 4, 'Ừ mình thấy đẹp quá, size L đúng không bạn?', TRUE, '2025-03-05 20:40:00'),
(6, 5, 'Đúng rồi, áo còn tag luôn đó bạn, mới 100%', TRUE, '2025-03-05 20:45:00'),
(6, 4, 'Mình chốt nhé, bạn ở đâu để mình qua lấy?', FALSE, '2025-03-05 20:50:00');


-- ============================================
-- CUỘC TRÒ CHUYỆN 7: Hỏi về giày Nike Air Force 1
-- Người mua: Lê Văn Cường (user_id=3)
-- Người bán: Nguyễn Văn An (user_id=1)
-- Sản phẩm: Nike Air Force 1 (product_id=54)
-- ============================================
INSERT INTO conversations (user_one, user_two, product_id) VALUES
(3, 1, 54);

INSERT INTO messages (conversation_id, sender_id, message_text, is_read, sent_at) VALUES
(7, 3, 'Anh ơi, giày AF1 size 42 còn không ạ?', TRUE, '2025-03-06 13:00:00'),
(7, 1, 'Còn em nhé, giày đi 2 lần thôi, còn mới lắm', TRUE, '2025-03-06 13:05:00'),
(7, 3, 'Giá 1.2 triệu vậy anh có thể gửi thêm ảnh cho em xem không ạ?', TRUE, '2025-03-06 13:10:00'),
(7, 1, 'Ok em, anh gửi ảnh chi tiết cho em đây', TRUE, '2025-03-06 13:15:00'),
(7, 3, 'Đẹp quá anh, em mua nhé, mai em qua lấy ạ', FALSE, '2025-03-06 13:20:00');


-- ============================================
-- CUỘC TRÒ CHUYỆN 8: Hỏi về giáo trình Kinh tế vi mô
-- Người mua: Phạm Thị Dung (user_id=4)
-- Người bán: Trần Thị Bình (user_id=2)
-- Sản phẩm: Giáo trình Kinh tế vi mô (product_id=61)
-- ============================================
INSERT INTO conversations (user_one, user_two, product_id) VALUES
(4, 2, 61);

INSERT INTO messages (conversation_id, sender_id, message_text, is_read, sent_at) VALUES
(8, 4, 'Chị ơi, giáo trình Kinh tế vi mô của chị có còn sách mới không ạ?', TRUE, '2025-03-08 09:00:00'),
(8, 2, 'Sách còn mới 95% em nhé, không ghi chú gì hết', TRUE, '2025-03-08 09:05:00'),
(8, 4, 'Em muốn mua 2 cuốn cho cả nhóm ạ, chị có thể giảm giá chút không?', TRUE, '2025-03-08 09:10:00'),
(8, 2, 'Chị bán 2 cuốn cho em với giá 160k nhé', TRUE, '2025-03-08 09:15:00'),
(8, 4, 'Dạ em chốt nhé, bao giờ em qua lấy được ạ?', FALSE, '2025-03-08 09:20:00');

INSERT INTO orders (
    order_id, order_code, buyer_id, seller_id, total_price, status, 
    payment_method, receiver_name, receiver_phone, delivery_method, 
    university, dorm_info, shipping_address, notes, order_date, status_date
) VALUES 
-- Kịch bản 1: User 1 làm Người mua (Buyer) - 10 đơn hàng
(1, 'DH000001', 1, 2, 15000.00, 'COMPLETED', 'cod', 'Nguyễn Hoàng Phúc', '0346102270', 'campus', 'Đại học Tp HCM', 'Ký túc xá Khu A', NULL, 'Giao giờ hành chính', '2026-06-01 08:30:00', '2026-06-02 14:00:00'),
(2, 'DH000002', 1, 3, 320000.00, 'COMPLETED', 'vnpay', 'Nguyễn Hoàng Phúc', '0900224466', 'home', NULL, NULL, '123 Đường Điện Biên Phủ, Bình Thạnh', 'Gọi trước khi giao', '2026-06-03 09:15:00', '2026-06-04 16:30:00'),
(3, 'DH000003', 1, 3, 750000.00, 'PENDING', 'cod', 'Nguyễn Hoàng Phúc', '0900224466', 'campus', 'Đại học Tp HCM', 'Ký túc xá Khu B', NULL, 'Đồ dễ vỡ', '2026-06-29 10:00:00', '2026-06-29 10:00:00'),
(4, 'DH000004', 1, 4, 450000.00, 'PENDING_PAYMENT', 'vnpay', 'Nguyễn Hoàng Phúc', '0900224466', 'home', NULL, NULL, '456 Đường Cách Mạng Tháng Tám, Quận 3', NULL, '2026-06-30 11:00:00', '2026-06-30 11:00:00'),
(5, 'DH000005', 1, 2, 120000.00, 'PAID', 'vnpay', 'Nguyễn Hoàng Phúc', '0900224466', 'campus', 'Đại học Tp HCM', 'Nhà khách Đại học', NULL, NULL, '2026-06-28 15:30:00', '2026-06-28 15:35:00'),
(6, 'DH000006', 1, 3, 90000.00, 'CANCELLED', 'cod', 'Nguyễn Hoàng Phúc', '0900224466', 'campus', 'Đại học Tp HCM', 'Ký túc xá Khu A', NULL, 'Hủy do đổi ý', '2026-06-10 14:20:00', '2026-06-10 15:00:00'),
(7, 'DH000007', 1, 4, 520000.00, 'REFUND_REQUESTED', 'vnpay', 'Nguyễn Hoàng Phúc', '0900224466', 'home', NULL, NULL, '789 Đường Nguyễn Thị Minh Khai, Quận 1', 'Sách bị rách trang', '2026-06-25 09:00:00', '2026-06-27 10:30:00'),
(8, 'DH000008', 1, 3, 220000.00, 'REFUNDED', 'vnpay', 'Nguyễn Hoàng Phúc', '0900224466', 'home', NULL, NULL, '101 Đường Võ Văn Ngân, Thủ Đức', 'Hoàn tiền do hết hàng', '2026-06-20 11:15:00', '2026-06-22 09:00:00'),
(9, 'DH000009', 1, 2, 310000.00, 'DISPUTED', 'vnpay', 'Nguyễn Hoàng Phúc', '0900224466', 'campus', 'Đại học Tp HCM', 'Ký túc xá Khu B', NULL, 'Người bán không chịu nhận lại hàng lỗi', '2026-06-24 16:45:00', '2026-06-26 14:20:00'),
(10, 'DH000010', 1, 2, 180000.00, 'COMPLETED', 'cod', 'Nguyễn Hoàng Phúc', '0900224466', 'campus', 'Đại học Tp HCM', 'Ký túc xá Khu A', NULL, NULL, '2026-06-15 13:00:00', '2026-06-16 17:00:00'),
-- Kịch bản 2: User 1 làm Người bán (Seller) - 6 đơn hàng
(11, 'DH000011', 2, 1, 4500000.00, 'COMPLETED', 'cod', 'Mai Lâm Nhật', '0987654321', 'campus', 'Đại học Tp HCM', 'Ký túc xá Khu B', NULL, NULL, '2026-06-05 10:00:00', '2026-06-06 11:00:00'),
(12, 'DH000012', 3, 1, 15080000.00, 'COMPLETED', 'vnpay', 'Nguyễn Bảo Nguyên', '0912345678', 'home', NULL, NULL, '202 Đường Lê Lợi, Quận 1', NULL, '2026-06-07 14:00:00', '2026-06-08 15:30:00'),
(13, 'DH000013', 4, 1, 850000.00, 'PENDING', 'cod', 'Nguyễn Huỳnh Giao', '0998877665', 'campus', 'Đại học Tp HCM', 'Ký túc xá Khu A', NULL, NULL, '2026-06-30 08:00:00', '2026-06-30 08:00:00'),
(14, 'DH000014', 2, 1, 430000.00, 'PAID', 'vnpay', 'Mai Lâm Nhật', '0987654321', 'home', NULL, NULL, '303 Đường Nguyễn Văn Cừ, Quận 5', NULL, '2026-06-29 16:00:00', '2026-06-29 16:05:00'),
(15, 'DH000015', 3, 1, 4200000.00, 'CANCELLED', 'cod', 'Nguyễn Bảo Nguyên', '0912345678', 'campus', 'Đại học Tp HCM', 'Ký túc xá Khu B', NULL, 'Người bán hết hàng', '2026-06-12 09:30:00', '2026-06-12 10:00:00'),
(16, 'DH000016', 4, 1, 5500000.00, 'REFUND_REQUESTED', 'vnpay', 'Nguyễn Huỳnh Giao', '0998877665', 'home', NULL, NULL, '404 Đường Xô Viết Nghệ Tĩnh, Bình Thạnh', 'Hàng không đúng mô tả', '2026-06-26 13:00:00', '2026-06-27 15:00:00'),


-- 2. CHI TIẾT ĐƠN HÀNG (order_details)
INSERT INTO order_details (order_detail_id, order_id, product_id, quantity, unit_price) VALUES 
(1, 1, 61, 10, 15000.00),
(2, 2, 65, 2, 120000.00),
(3, 2, 62, 4, 15000.00),
(4, 3, 56, 1, 450000.00),
(5, 3, 57, 1, 180000.00),
(6, 3, 67, 1, 95000.00),
(7, 4, 55, 1, 250000.00),
(8, 4, 53, 1, 180000.00),
(9, 5, 65, 1, 120000.00),
(10, 6, 60, 1, 90000.00),
(11, 7, 55, 2, 250000.00),
(12, 8, 60, 1, 200000.00),
(13, 9, 61, 2, 15000.00),
(14, 9, 32, 1, 280000.00),
(15, 10, 51, 1, 150000.00),
(16, 10, 62, 2, 15000.00),
(17, 11, 1, 1, 4500000.00),
(18, 12, 61, 1, 8500000.00),
(19, 12, 56, 1, 6200000.00),
(20, 12, 67, 1, 3800000.00),
(21, 13, 33, 1, 850000.00),
(22, 14, 55, 1, 250000.00),
(23, 14, 57, 1, 160000.00),
(24, 15, 31, 1, 4200000.00),
(25, 16, 21, 1, 5500000.00),


-- 3. ĐÁNH GIÁ SẢN PHẨM (reviews)
-- Đánh giá 1: Nhật đánh giá laptop Dell (đơn hàng 1)
INSERT INTO reviews (product_id, reviewer_id, rating, comment, edit_count, created_at) VALUES
(1, 2, 5, 'Laptop chạy rất tốt, đúng như mô tả. Máy còn đẹp, pin dùng được 2.5 tiếng, anh chủ rất nhiệt tình!', 0, '2025-02-23 10:00:00');
-- Đánh giá 2: Nguyễn đánh giá iPhone 11 (đơn hàng 2)
INSERT INTO reviews (product_id, reviewer_id, rating, comment, edit_count, created_at) VALUES
(3, 3, 5, 'iPhone còn mới 98%, chị bán rất thân thiện. Em đã dùng được 1 tuần, máy pin tốt, không lỗi gì. Cảm ơn chị!', 0, '2025-02-27 15:00:00');
-- Đánh giá 3: Nguyễn đánh giá Nike Air Force 1 (đơn hàng 4)
INSERT INTO reviews (product_id, reviewer_id, rating, comment, edit_count, created_at) VALUES
(54, 3, 4, 'Giày đẹp, đúng size, còn khá mới. Anh bán nhiệt tình, chỉ hơi mất thời gian ship hơi lâu. Nói chung ổn!', 0, '2025-03-10 20:00:00');
-- Đánh giá 5: Nhật đánh giá Samsung S21FE (mua từ Nguyễn Hoàng Phúc - user_id=1)
INSERT INTO reviews (product_id, reviewer_id, rating, comment, edit_count, created_at) VALUES
(4, 2, 5, 'Máy đẹp, pin tốt, chạy mượt, anh Phúc đóng gói cẩn thận. Rất hài lòng!', 0, '2025-02-28 14:30:00');
-- Đánh giá 6: Nhật đánh giá áo thun Uniqlo (mua từ Nguyễn - user_id=3)
INSERT INTO reviews (product_id, reviewer_id, rating, comment, edit_count, created_at) VALUES
(51, 2, 4, 'Áo đẹp, chất vải mềm, đúng size. Chỉ hơi bị nhăn khi ship, nói chung ổn', 1, '2025-02-20 18:00:00');
-- Đánh giá 7: Nguyễn đánh giá áo hoodie (mua từ Giao - user_id=4)
INSERT INTO reviews (product_id, reviewer_id, rating, comment, edit_count, created_at) VALUES
(53, 3, 3, 'Áo đẹp nhưng màu hơi khác so với ảnh, chất vải ổn. Người bán nhiệt tình', 0, '2025-03-06 22:00:00');


-- 4. BÁO CÁO VI PHẠM (review_reports)
-- Báo cáo 1: Nhật báo cáo đánh giá của Nguyễn về áo hoodie (đánh giá 3 sao)
INSERT INTO review_reports (review_id, reporter_id, reason, proof_image, proof_video, status, created_at) VALUES
(7, 2, 'Đánh giá không trung thực, sản phẩm đúng như mô tả, người dùng đánh giá thấp vì lý do cá nhân', 'https://placehold.co/600x400/FF0000/FFFFFF?text=Proof+Image', NULL, 'PENDING', '2025-03-07 08:00:00');
-- Báo cáo 2: Nguyễn báo cáo đánh giá của Nhật về áo thun Uniqlo (đánh giá đã chỉnh sửa)
INSERT INTO review_reports (review_id, reporter_id, reason, proof_image, proof_video, status, created_at) VALUES
(6, 3, 'Người đánh giá đã chỉnh sửa bình luận nhưng vẫn giữ nội dung tiêu cực, ảnh hưởng đến uy tín', 'https://placehold.co/600x400/0000FF/FFFFFF?text=Screenshot+1', NULL, 'RESOLVED', '2025-02-21 09:00:00');
-- Báo cáo 3: Giao báo cáo đánh giá của Nguyễn về Nike Air Force 1
INSERT INTO review_reports (review_id, reporter_id, reason, proof_image, proof_video, status, created_at) VALUES
(3, 4, 'Người đánh giá phàn nàn về thời gian ship quá lâu trong khi lỗi do đơn vị vận chuyển, không phải lỗi của người bán', 'https://placehold.co/600x400/00FF00/000000?text=Shipping+Proof', NULL, 'PENDING', '2025-03-11 14:30:00');
-- Báo cáo 4: Nguyễn Hoàng Phúc báo cáo đánh giá của Nhật về Samsung S21FE
INSERT INTO review_reports (review_id, reporter_id, reason, proof_image, proof_video, status, created_at) VALUES
(5, 1, 'Đánh giá có nội dung không phù hợp, sử dụng ngôn ngữ không lịch sự', 'https://placehold.co/600x400/FF00FF/FFFFFF?text=Comment+Screenshot', 'https://placehold.co/640x360/FF00FF/000000?text=Screen+Recording', 'PENDING', '2025-03-01 10:00:00');
-- Báo cáo 5: Nhật báo cáo đánh giá của Nguyễn về iPhone 11
INSERT INTO review_reports (review_id, reporter_id, reason, proof_image, proof_video, status, created_at) VALUES
(2, 2, 'Đánh giá có dấu hiệu spam, người dùng đánh giá quá nhiều sản phẩm trong thời gian ngắn', NULL, NULL, 'REJECTED', '2025-02-28 16:00:00');
-- Báo cáo 6: Giao báo cáo đánh giá của Nguyễn về áo hoodie
INSERT INTO review_reports (review_id, reporter_id, reason, proof_image, proof_video, status, created_at) VALUES
(7, 4, 'Đánh giá 3 sao không có cơ sở, sản phẩm được gửi kèm quà tặng, người mua có thái độ không tốt', 'https://placehold.co/600x400/FFA500/FFFFFF?text=Chat+History', 'https://placehold.co/640x360/FFA500/000000?text=Video+Evidence', 'RESOLVED', '2025-03-08 11:00:00');