USE tmdt_db;

-- Thêm dữ liệu mẫu sinh viên hàng loạt cho 14 danh mục, mỗi danh mục 10 sản phẩm

-- === DANH MỤC: Bất động sản ===
INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1000, 1, 1, 'Phòng trọ gần trường Bách Khoa gác lửng', 'Diện tích 20m2, có gác lửng vệ sinh khép kín, an ninh tốt, gần chợ.', 1800000, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80', 85, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1000, 1000, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1001, 2, 1, 'Ký túc xá dịch vụ tiện nghi máy lạnh', 'Giường tầng KTX cao cấp đầy đủ điều hòa, tủ lạnh, bếp nấu ăn chung.', 900000, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80', 45, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1001, 1001, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80', TRUE),
(1002, 1001, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1002, 3, 1, 'Phòng trọ giá rẻ cho sinh viên Sư Phạm', 'Phòng sạch sẽ, lối đi riêng không chung chủ, điện nước giá nhà nước.', 1200000, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80', 22, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1003, 1002, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80', TRUE),
(1004, 1002, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80', FALSE),
(1005, 1002, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1003, 4, 1, 'Căn hộ mini 1 phòng ngủ full nội thất', 'Có máy giặt, điều hòa, tủ lạnh, nệm ga gối, chỉ cần xách vali vào ở.', 3500000, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80', 112, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1006, 1003, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80', TRUE),
(1007, 1003, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80', FALSE),
(1008, 1003, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80', FALSE),
(1009, 1003, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1004, 1, 1, 'Nhà nguyên căn chia phòng ở ghép nhóm bạn', 'Nhà 3 tầng có 3 phòng ngủ rộng rãi, phù hợp nhóm bạn 4-6 người thuê chung.', 6500000, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80', 132, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1010, 1004, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80', TRUE),
(1011, 1004, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80', FALSE),
(1012, 1004, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80', FALSE),
(1013, 1004, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80', FALSE),
(1014, 1004, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1005, 2, 1, 'Phòng trọ khép kín mới xây cực thoáng mát', 'Vị trí mặt tiền hẻm lớn xe ba gác vào được, có ban công phơi đồ.', 2200000, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80', 145, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1015, 1005, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1006, 3, 1, 'Góc phòng ở ghép nam sạch sẽ thân thiện', 'Cần tìm 1 bạn nam ở ghép share phòng trọ rộng, bạn học Bách Khoa.', 700000, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80', 71, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1016, 1006, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80', TRUE),
(1017, 1006, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1007, 4, 1, 'Phòng trọ ban công ngắm hoàng hôn siêu chill', 'Phòng lầu 3 sạch sẽ, có cửa sổ lớn cực thoáng mát đón gió tự nhiên.', 2000000, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80', 25, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1018, 1007, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80', TRUE),
(1019, 1007, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80', FALSE),
(1020, 1007, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1008, 1, 1, 'Căn hộ dịch vụ tiện ích gym hồ bơi free', 'Có đầy đủ tiện ích đi kèm, giờ giấc tự do bằng vân tay bảo mật.', 4000000, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80', 70, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1021, 1008, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80', TRUE),
(1022, 1008, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80', FALSE),
(1023, 1008, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80', FALSE),
(1024, 1008, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1009, 2, 1, 'Gác nhỏ ấm cúng giá cực sinh viên', 'Gần trạm xe buýt, an ninh khu vực đảm bảo, thích hợp bạn ở một mình.', 1000000, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80', 65, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1025, 1009, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80', TRUE),
(1026, 1009, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80', FALSE),
(1027, 1009, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80', FALSE),
(1028, 1009, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80', FALSE),
(1029, 1009, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80', FALSE);

-- === DANH MỤC: Xe cộ ===
INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1010, 1, 2, 'Xe Honda Wave Alpha 2018 màu xanh', 'Xe chạy êm, máy móc nguyên bản chưa sửa chữa, giấy tờ chính chủ.', 11500000, 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80', 55, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1030, 1010, 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1011, 2, 2, 'Bicycle địa hình Asama chính hãng còn mới', 'Khung nhôm siêu nhẹ, phanh đĩa trước sau nhạy, phù hợp đi học hàng ngày.', 1800000, 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80', 76, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1031, 1011, 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80', TRUE),
(1032, 1011, 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1012, 3, 2, 'Xe máy điện VinFast Klara S pin tốt', 'Mới đi được 1 năm, pin còn 90% dung lượng, đầy đủ sạc và giấy tờ.', 19500000, 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80', 16, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1033, 1012, 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80', TRUE),
(1034, 1012, 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80', FALSE),
(1035, 1012, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1013, 4, 2, 'Xe Yamaha Sirius RC 110cc bốc khỏe', 'Ngoại hình hơi cũ theo thời gian nhưng máy cực chất, tiết kiệm xăng.', 8200000, 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80', 89, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1036, 1013, 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80', TRUE),
(1037, 1013, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=600&q=80', FALSE),
(1038, 1013, 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80', FALSE),
(1039, 1013, 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1014, 1, 2, 'Xe đạp Martin 107 huyền thoại cho nữ', 'Xe đạp giỏ sắt nhẹ nhàng, thích hợp các bạn nữ đi lại quanh ký túc xá.', 800000, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=600&q=80', 75, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1040, 1014, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=600&q=80', TRUE),
(1041, 1014, 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80', FALSE),
(1042, 1014, 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80', FALSE),
(1043, 1014, 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80', FALSE),
(1044, 1014, 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1015, 2, 2, 'Xe tay ga Honda Vision 2016 màu đỏ', 'Xe nữ sử dụng giữ gìn, bảo dưỡng thay nhớt định kỳ đầy đủ.', 18500000, 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80', 39, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1045, 1015, 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1016, 3, 2, 'Xe đạp fixed gear sành điệu cá tính', 'Mới ráp đi được vài lần, phụ tùng cao cấp, líp đôi linh hoạt.', 2500000, 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80', 114, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1046, 1016, 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80', TRUE),
(1047, 1016, 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1017, 4, 2, 'Xe máy cúp 50cc không cần bằng lái', 'Thích hợp cho các bạn sinh viên năm nhất chưa có bằng lái xe máy.', 6800000, 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80', 94, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1048, 1017, 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80', TRUE),
(1049, 1017, 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80', FALSE),
(1050, 1017, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1018, 1, 2, 'Bicycle thể thao Touring Giant bền bỉ', 'Dòng xe cao cấp chạy đường phố cực lướt, bộ đề Shimano 21 tốc độ.', 4200000, 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80', 19, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1051, 1018, 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80', TRUE),
(1052, 1018, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=600&q=80', FALSE),
(1053, 1018, 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80', FALSE),
(1054, 1018, 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1019, 2, 2, 'Xe tay ga Suzuki Hayate máy nguyên bản', 'Xe khỏe, cốp rộng chứa được 2 mũ bảo hiểm, giá thanh lý nhanh.', 4500000, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=600&q=80', 43, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1055, 1019, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=600&q=80', TRUE),
(1056, 1019, 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80', FALSE),
(1057, 1019, 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80', FALSE),
(1058, 1019, 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80', FALSE),
(1059, 1019, 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80', FALSE);

-- === DANH MỤC: Thú cưng ===
INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1020, 1, 3, 'Mèo Anh lông ngắn màu xám cực cuộn', 'Bé mèo 3 tháng tuổi, đã tiêm ngừa 1 mũi, ăn hạt khỏe, biết đi vệ sinh đúng chỗ.', 2500000, 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80', 118, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1060, 1020, 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1021, 2, 3, 'Chó Poodle lai Tiny màu nâu đỏ siêu cute', 'Bé đực 2.5 tháng tuổi, nhanh nhẹn, tinh nghịch, quấn người.', 3200000, 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80', 25, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1061, 1021, 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80', TRUE),
(1062, 1021, 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1022, 3, 3, 'Bể cá cảnh mini để bàn học xả stress', 'Full bộ gồm bể kính, lọc thác nước, đèn LED và vài chú cá bảy màu.', 250000, 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80', 34, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1063, 1022, 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80', TRUE),
(1064, 1022, 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80', FALSE),
(1065, 1022, 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1023, 4, 3, 'Chuồng mèo 3 tầng nan sắt sơn tĩnh điện', 'Chuồng rộng rãi thoải mái có bánh xe di chuyển tiện lợi, kèm khay vệ sinh.', 450000, 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80', 12, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1066, 1023, 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80', TRUE),
(1067, 1023, 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80', FALSE),
(1068, 1023, 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80', FALSE),
(1069, 1023, 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1024, 1, 3, 'Mèo tai cụp Scottish mắt tròn xoe', 'Bé cái dễ thương, lông dày mượt, đã được tẩy giun đầy đủ.', 3800000, 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80', 44, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1070, 1024, 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80', TRUE),
(1071, 1024, 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80', FALSE),
(1072, 1024, 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80', FALSE),
(1073, 1024, 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80', FALSE),
(1074, 1024, 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1025, 2, 3, 'Thức ăn hạt cho chó Royal Canin 1kg', 'Hàng chính hãng hạn sử dụng còn xa, mua về cún không hợp vị nên bán lại.', 150000, 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80', 27, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1075, 1025, 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1026, 3, 3, 'Balo phi hành gia vận chuyển chó mèo', 'Mặt nhựa trong suốt thông thoáng khí, thích hợp mang thú cưng đi chơi.', 120000, 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80', 5, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1076, 1026, 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80', TRUE),
(1077, 1026, 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1027, 4, 3, 'Hamster Winter White siêu ú nu', 'Tặng kèm lồng nuôi mini, bình nước, chén ăn và mùn cưa lót chuồng.', 100000, 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80', 36, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1078, 1027, 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80', TRUE),
(1079, 1027, 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80', FALSE),
(1080, 1027, 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1028, 1, 3, 'Nhà cây cào móng cho mèo handmade', 'Thiết kế nhiều tầng bọc dây thừng gai bền bỉ, giúp mèo giải trí cào móng.', 300000, 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80', 37, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1081, 1028, 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80', TRUE),
(1082, 1028, 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80', FALSE),
(1083, 1028, 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80', FALSE),
(1084, 1028, 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1029, 2, 3, 'Pate lon cho mèo Whiskas vị cá ngừ', 'Hộp 400g thanh lý lốc 6 lon do mèo chuyển sang ăn hạt hoàn toàn.', 180000, 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80', 124, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1085, 1029, 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80', TRUE),
(1086, 1029, 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80', FALSE),
(1087, 1029, 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80', FALSE),
(1088, 1029, 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80', FALSE),
(1089, 1029, 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80', FALSE);

-- === DANH MỤC: Đồ gia dụng, nội thất, cây cảnh ===
INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1030, 1, 4, 'Bàn học làm việc gấp gọn gỗ MDF', 'Chân sắt chắc chắn sơn tĩnh điện, mặt bàn chống xước rộng 60x120cm.', 280000, 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80', 135, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1090, 1030, 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1031, 2, 4, 'Ghế xoay văn phòng có đệm lưng lưới', 'Có piston nâng hạ chiều cao linh hoạt, bánh xe di chuyển mượt mà.', 350000, 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80', 35, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1091, 1031, 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80', TRUE),
(1092, 1031, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1032, 3, 4, 'Nồi cơm điện mini Supor 1.2L nhỏ gọn', 'Lòng nồi chống dính, phù hợp nấu ăn cho 1-2 người cực tiện lợi.', 290000, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80', 55, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1093, 1032, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80', TRUE),
(1094, 1032, 'https://images.unsplash.com/photo-1501183007986-d0d080b147f9?auto=format&fit=crop&w=600&q=80', FALSE),
(1095, 1032, 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1033, 4, 4, 'Ấm siêu tốc Inox Lock&Lock 1.8L', 'Đun nước sôi siêu nhanh, tự động ngắt điện khi nước sôi an toàn.', 190000, 'https://images.unsplash.com/photo-1501183007986-d0d080b147f9?auto=format&fit=crop&w=600&q=80', 79, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1096, 1033, 'https://images.unsplash.com/photo-1501183007986-d0d080b147f9?auto=format&fit=crop&w=600&q=80', TRUE),
(1097, 1033, 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80', FALSE),
(1098, 1033, 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80', FALSE),
(1099, 1033, 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1034, 1, 4, 'Cây kim tiền phong thủy văn phòng bàn học', 'Tặng kèm chậu sứ trắng trang nhã, cây lọc không khí tốt mang may mắn.', 80000, 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80', 35, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1100, 1034, 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80', TRUE),
(1101, 1034, 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80', FALSE),
(1102, 1034, 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80', FALSE),
(1103, 1034, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80', FALSE),
(1104, 1034, 'https://images.unsplash.com/photo-1501183007986-d0d080b147f9?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1035, 2, 4, 'Tủ quần áo vải 3 buồng 8 ngăn rộng rãi', 'Khung inox chắc chắn chịu lực tốt, áo vải chống thấm bụi bẩn.', 220000, 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80', 49, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1105, 1035, 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1036, 3, 4, 'Kệ sách gỗ 5 tầng đứng lắp ráp tiện lợi', 'Chất liệu gỗ tự nhiên ép bền đẹp, xếp gọn sách vở tài liệu ngăn nắp.', 150000, 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80', 17, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1106, 1036, 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80', TRUE),
(1107, 1036, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1037, 4, 4, 'Đèn học LED chống cận thị điều chỉnh sáng', 'Có 3 chế độ màu sáng (trắng, ấm, trung tính), điều khiển cảm ứng cực xịn.', 120000, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80', 117, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1108, 1037, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80', TRUE),
(1109, 1037, 'https://images.unsplash.com/photo-1501183007986-d0d080b147f9?auto=format&fit=crop&w=600&q=80', FALSE),
(1110, 1037, 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1038, 1, 4, 'Chảo chống dính Sunhouse sâu lòng 26cm', 'Mới 100% nguyên seal chưa sử dụng, dùng được trên mọi loại bếp.', 140000, 'https://images.unsplash.com/photo-1501183007986-d0d080b147f9?auto=format&fit=crop&w=600&q=80', 18, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1111, 1038, 'https://images.unsplash.com/photo-1501183007986-d0d080b147f9?auto=format&fit=crop&w=600&q=80', TRUE),
(1112, 1038, 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80', FALSE),
(1113, 1038, 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80', FALSE),
(1114, 1038, 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1039, 2, 4, 'Chậu cây lưỡi hổ lọc không khí cực tốt', 'Cây dễ chăm sóc không cần tưới nước nhiều, thích hợp để góc phòng ngủ.', 70000, 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80', 86, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1115, 1039, 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80', TRUE),
(1116, 1039, 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80', FALSE),
(1117, 1039, 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80', FALSE),
(1118, 1039, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80', FALSE),
(1119, 1039, 'https://images.unsplash.com/photo-1501183007986-d0d080b147f9?auto=format&fit=crop&w=600&q=80', FALSE);

-- === DANH MỤC: Giải trí, Thể thao, Sở thích ===
INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1040, 1, 5, 'Đàn Guitar Acoustic gỗ hồng đào tiếng ấm', 'Tặng kèm bao da đựng đàn, phím gảy, bộ dây dự phòng và giáo trình tự học.', 1200000, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80', 57, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1120, 1040, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1041, 2, 5, 'Vợt cầu lông Yonex Carbon nhẹ tay', 'Vợt đã căng sẵn lưới 10kg, độ nảy tốt, thích hợp luyện tập thể thao.', 450000, 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80', 36, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1121, 1041, 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80', TRUE),
(1122, 1041, 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1042, 3, 5, 'Quả bóng đá Size 5 Động Lực chính hãng', 'Chất liệu da PU êm chân, giữ hơi tốt, tặng kèm kim bơm và lưới đựng bóng.', 220000, 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80', 21, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1123, 1042, 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80', TRUE),
(1124, 1042, 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80', FALSE),
(1125, 1042, 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1043, 4, 5, 'Ván trượt Skateboard gỗ phong 8 lớp bền', 'Bánh xe cao su đúc đi êm chịu lực 100kg, thích hợp cho người mới tập.', 380000, 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80', 14, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1126, 1043, 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80', TRUE),
(1127, 1043, 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&w=600&q=80', FALSE),
(1128, 1043, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80', FALSE),
(1129, 1043, 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1044, 1, 5, 'Sách giáo trình tiếng Anh IELTS Cam 15-18', 'Sách mới chưa viết vẽ, bản in đẹp rõ nét kèm mã quét tải file nghe audio.', 160000, 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&w=600&q=80', 77, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1130, 1044, 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&w=600&q=80', TRUE),
(1131, 1044, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80', FALSE),
(1132, 1044, 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80', FALSE),
(1133, 1044, 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80', FALSE),
(1134, 1044, 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1045, 2, 5, 'Tai nghe chụp tai gaming có mic đàm thoại', 'Kết nối cổng USB âm thanh giả lập 7.1, đệm tai êm ái cách âm tốt.', 290000, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80', 113, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1135, 1045, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1046, 3, 5, 'Thảm tập Yoga chống trơn trượt TPE 2 lớp', 'Kích thước chuẩn, thảm dày 6mm bảo vệ xương khớp khi tập luyện.', 180000, 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80', 13, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1136, 1046, 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80', TRUE),
(1137, 1046, 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1047, 4, 5, 'Loa Bluetooth mini không dây Bass cực mạnh', 'Chống nước IPX7, pin trâu phát nhạc liên tục 8 tiếng, nhỏ gọn mang đi chơi.', 350000, 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80', 41, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1138, 1047, 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80', TRUE),
(1139, 1047, 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80', FALSE),
(1140, 1047, 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1048, 1, 5, 'Truyện tranh trọn bộ Doraemon 45 tập', 'Chất lượng giấy đẹp không rách nát, thích hợp cho bạn nào thích sưu tầm.', 400000, 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80', 85, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1141, 1048, 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80', TRUE),
(1142, 1048, 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&w=600&q=80', FALSE),
(1143, 1048, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80', FALSE),
(1144, 1048, 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1049, 2, 5, 'Giày patin trẻ em người lớn có đèn LED bánh', 'Có chốt điều chỉnh size chân dễ dàng, khung hợp kim nhôm cứng cáp.', 550000, 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&w=600&q=80', 50, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1145, 1049, 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&w=600&q=80', TRUE),
(1146, 1049, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80', FALSE),
(1147, 1049, 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80', FALSE),
(1148, 1049, 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80', FALSE),
(1149, 1049, 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80', FALSE);

-- === DANH MỤC: Mẹ và bé ===
INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1050, 1, 6, 'Xe đẩy em bé gấp gọn đi du lịch siêu nhẹ', 'Có mái che nắng điều chỉnh được nhiều tư thế, đai an toàn 5 điểm.', 850000, 'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=600&q=80', 17, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1150, 1050, 'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1051, 2, 6, 'Bộ đồ chơi xếp hình Lego 1000 chi tiết', 'Chất liệu nhựa ABS an toàn giúp bé kích thích tư duy sáng tạo vô hạn.', 240000, 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=600&q=80', 142, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1151, 1051, 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=600&q=80', TRUE),
(1152, 1051, 'https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1052, 3, 6, 'Nôi điện tự động ru bé ngủ êm ái', 'Có nhiều tốc độ đưa nôi điều chỉnh bằng remote, nhạc ru bé ngủ ngon.', 1100000, 'https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=600&q=80', 96, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1153, 1052, 'https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=600&q=80', TRUE),
(1154, 1052, 'https://images.unsplash.com/photo-1544078751-58feb2dcb1f3?auto=format&fit=crop&w=600&q=80', FALSE),
(1155, 1052, 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1053, 4, 6, 'Máy tiệt trùng bình sữa Philips Avent', 'Sử dụng hơi nước tự nhiên diệt khuẩn 99.9%, tiệt trùng nhanh 10 phút.', 750000, 'https://images.unsplash.com/photo-1544078751-58feb2dcb1f3?auto=format&fit=crop&w=600&q=80', 125, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1156, 1053, 'https://images.unsplash.com/photo-1544078751-58feb2dcb1f3?auto=format&fit=crop&w=600&q=80', TRUE),
(1157, 1053, 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80', FALSE),
(1158, 1053, 'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=600&q=80', FALSE),
(1159, 1053, 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1054, 1, 6, 'Set 5 bộ body chip cotton sơ sinh dễ thương', 'Vải cotton mềm mại thấm hút mồ hôi tốt, khuy bấm dưới đũng tiện lợi.', 180000, 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80', 116, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1160, 1054, 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80', TRUE),
(1161, 1054, 'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=600&q=80', FALSE),
(1162, 1054, 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=600&q=80', FALSE),
(1163, 1054, 'https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=600&q=80', FALSE),
(1164, 1054, 'https://images.unsplash.com/photo-1544078751-58feb2dcb1f3?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1055, 2, 6, 'Sữa bột Similac Infant Formula Mỹ 900g', 'Hàng chính hãng mới mua, bé không hợp tác đổi sữa nên thanh lý lại.', 520000, 'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=600&q=80', 62, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1165, 1055, 'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1056, 3, 6, 'Địu em bé 4 tư thế bọc đệm êm chống gù', 'Chất vải lưới thoáng mát, trợ lực tốt giúp bố mẹ không mỏi vai gáy.', 190000, 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=600&q=80', 80, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1166, 1056, 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=600&q=80', TRUE),
(1167, 1056, 'https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1057, 4, 6, 'Bộ đồ chơi gỗ luồn hạt thông minh', 'Sơn gốc nước không độc hại giúp bé nhận biết màu sắc hình khối tốt.', 90000, 'https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=600&q=80', 125, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1168, 1057, 'https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=600&q=80', TRUE),
(1169, 1057, 'https://images.unsplash.com/photo-1544078751-58feb2dcb1f3?auto=format&fit=crop&w=600&q=80', FALSE),
(1170, 1057, 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1058, 1, 6, 'Xe chòi chân thăng bằng 4 bánh cho bé', 'Khung xe chắc chắn, bánh xe bọc cao su êm ái chống trơn trượt.', 220000, 'https://images.unsplash.com/photo-1544078751-58feb2dcb1f3?auto=format&fit=crop&w=600&q=80', 144, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1171, 1058, 'https://images.unsplash.com/photo-1544078751-58feb2dcb1f3?auto=format&fit=crop&w=600&q=80', TRUE),
(1172, 1058, 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80', FALSE),
(1173, 1058, 'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=600&q=80', FALSE),
(1174, 1058, 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1059, 2, 6, 'Thảm xốp ghép hình lót sàn cho bé tập bò', 'Set 10 miếng xốp dày 1cm chống va đập, dễ lau chùi vệ sinh.', 120000, 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80', 80, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1175, 1059, 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80', TRUE),
(1176, 1059, 'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=600&q=80', FALSE),
(1177, 1059, 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=600&q=80', FALSE),
(1178, 1059, 'https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=600&q=80', FALSE),
(1179, 1059, 'https://images.unsplash.com/photo-1544078751-58feb2dcb1f3?auto=format&fit=crop&w=600&q=80', FALSE);

-- === DANH MỤC: Dịch vụ, Du lịch ===
INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1060, 1, 7, 'Balo du lịch bụi chuyên nghiệp 50L', 'Có khung trợ lực chống mỏi lưng, áo mưa bọc balo chống nước đi kèm.', 480000, 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80', 95, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1180, 1060, 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1061, 2, 7, 'Lều cắm trại 4 người tự bung chống nước', 'Vải dù oxford chống tia cực tím tốt, mở lều nhanh chóng trong 3 giây.', 550000, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80', 38, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1181, 1061, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80', TRUE),
(1182, 1061, 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1062, 3, 7, 'Vali du lịch khung nhôm khóa số TSA 24 inch', 'Bánh xe xoay 360 độ êm mượt, chất liệu nhựa polycarbonate chịu lực cực tốt.', 890000, 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=600&q=80', 115, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1183, 1062, 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=600&q=80', TRUE),
(1184, 1062, 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80', FALSE),
(1185, 1062, 'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1063, 4, 7, 'Túi ngủ du lịch dã ngoại giữ ấm tốt', 'Chất liệu lót bông siêu nhẹ ấm áp, thu gọn tiện mang đi cắm trại.', 190000, 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80', 64, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1186, 1063, 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80', TRUE),
(1187, 1063, 'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?auto=format&fit=crop&w=600&q=80', FALSE),
(1188, 1063, 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80', FALSE),
(1189, 1063, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1064, 1, 7, 'Tour leo núi Fansipan 2 ngày 1 đêm trọn gói', 'Nhượng lại suất tour do bận lịch học đột xuất, đã bao gồm ăn uống hướng dẫn.', 1500000, 'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?auto=format&fit=crop&w=600&q=80', 71, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1190, 1064, 'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?auto=format&fit=crop&w=600&q=80', TRUE),
(1191, 1064, 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80', FALSE),
(1192, 1064, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80', FALSE),
(1193, 1064, 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=600&q=80', FALSE),
(1194, 1064, 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1065, 2, 7, 'Gậy leo núi dã ngoại hợp kim nhôm rút gọn', 'Có lò xo giảm chấn tay cầm bọc mút êm ái chống trơn trượt.', 110000, 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80', 55, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1195, 1065, 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1066, 3, 7, 'Voucher phòng khách sạn Sapa view núi cực chill', 'Hạn dùng cuối năm, bao gồm buffet sáng cho 2 người lớn.', 750000, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80', 133, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1196, 1066, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80', TRUE),
(1197, 1066, 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1067, 4, 7, 'Bình nước giữ nhiệt dã ngoại Lock&Lock 1L', 'Chất liệu inox 316 cao cấp giữ nóng lạnh trên 24 tiếng liên tục.', 280000, 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=600&q=80', 53, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1198, 1067, 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=600&q=80', TRUE),
(1199, 1067, 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80', FALSE),
(1200, 1067, 'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1068, 1, 7, 'Túi đựng đồ trang điểm cá nhân du lịch', 'Nhiều ngăn phân loại tiện dụng chống thấm nước bảo vệ đồ đạc.', 65000, 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80', 49, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1201, 1068, 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80', TRUE),
(1202, 1068, 'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?auto=format&fit=crop&w=600&q=80', FALSE),
(1203, 1068, 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80', FALSE),
(1204, 1068, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1069, 2, 7, 'Sạc dự phòng năng lượng mặt trời chống nước', 'Dung lượng 20000mAh tích hợp đèn pin siêu sáng đi rừng dã ngoại.', 340000, 'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?auto=format&fit=crop&w=600&q=80', 90, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1205, 1069, 'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?auto=format&fit=crop&w=600&q=80', TRUE),
(1206, 1069, 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80', FALSE),
(1207, 1069, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80', FALSE),
(1208, 1069, 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=600&q=80', FALSE),
(1209, 1069, 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80', FALSE);

-- === DANH MỤC: Cho tặng miễn phí ===
INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1070, 1, 8, 'Tặng giáo trình Luật đại cương trường BK', 'Sách cũ đã qua sử dụng, có ghi chép bút chì nhưng vẫn dùng học tốt.', 0, 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', 42, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1210, 1070, 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1071, 2, 8, 'Cho tài liệu ôn thi THPT Quốc Gia môn Toán', 'Tổng hợp đề thi thử và công thức giải nhanh môn Toán, tặng bạn nào cần.', 0, 'https://images.unsplash.com/photo-1490535090187-0b44b2d3d3b2?auto=format&fit=crop&w=600&q=80', 130, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1211, 1071, 'https://images.unsplash.com/photo-1490535090187-0b44b2d3d3b2?auto=format&fit=crop&w=600&q=80', TRUE),
(1212, 1071, 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1072, 3, 8, 'Tặng quần áo cũ làm từ thiện hoặc mặc ở nhà', 'Set đồ nam nữ thun quần jean cũ sạch sẽ, tặng hội nhóm gom đồ quyên góp.', 0, 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80', 7, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1213, 1072, 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80', TRUE),
(1214, 1072, 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80', FALSE),
(1215, 1072, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1073, 4, 8, 'Tặng chậu sứ trồng cây mini cũ', 'Nhà thừa vài chậu đất nung chậu sứ nhỏ trồng sen đá, tặng bạn qua lấy.', 0, 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80', 34, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1216, 1073, 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80', TRUE),
(1217, 1073, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80', FALSE),
(1218, 1073, 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', FALSE),
(1219, 1073, 'https://images.unsplash.com/photo-1490535090187-0b44b2d3d3b2?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1074, 1, 8, 'Cho gấu bông cũ còn khá mới sạch sẽ', 'Dọn phòng dư vài bé gấu bông nhỏ xinh muốn tặng bạn nữ yêu thích.', 0, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80', 3, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1220, 1074, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80', TRUE),
(1221, 1074, 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', FALSE),
(1222, 1074, 'https://images.unsplash.com/photo-1490535090187-0b44b2d3d3b2?auto=format&fit=crop&w=600&q=80', FALSE),
(1223, 1074, 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80', FALSE),
(1224, 1074, 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1075, 2, 8, 'Tặng vở viết học sinh 100 trang mới nguyên', 'Được thưởng cuối kỳ dư dùng nên tặng lại các bạn có hoàn cảnh khó khăn.', 0, 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', 127, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1225, 1075, 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1076, 3, 8, 'Tặng bộ tài liệu học lập trình Java Web', 'Gồm tài liệu in và file source code bài tập mẫu, hỗ trợ bạn bắt đầu code.', 0, 'https://images.unsplash.com/photo-1490535090187-0b44b2d3d3b2?auto=format&fit=crop&w=600&q=80', 42, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1226, 1076, 'https://images.unsplash.com/photo-1490535090187-0b44b2d3d3b2?auto=format&fit=crop&w=600&q=80', TRUE),
(1227, 1076, 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1077, 4, 8, 'Cho bát đĩa cốc chén nhựa ăn sinh viên', 'Sắp chuyển phòng trọ xa không mang theo được, tặng lại bạn khóa dưới.', 0, 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80', 113, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1228, 1077, 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80', TRUE),
(1229, 1077, 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80', FALSE),
(1230, 1077, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1078, 1, 8, 'Tặng thẻ giảm giá khóa học tiếng Anh giao tiếp', 'Thẻ voucher giảm 50% học phí trung tâm Anh ngữ lớn, không đi nên tặng.', 0, 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80', 29, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1231, 1078, 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80', TRUE),
(1232, 1078, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80', FALSE),
(1233, 1078, 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', FALSE),
(1234, 1078, 'https://images.unsplash.com/photo-1490535090187-0b44b2d3d3b2?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1079, 2, 8, 'Cho kệ dép nhựa cũ 3 tầng tiện lợi', 'Kệ cũ hơi trầy xước nhưng vẫn đứng chắc chắn đựng giày dép thoải mái.', 0, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80', 1, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1235, 1079, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80', TRUE),
(1236, 1079, 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', FALSE),
(1237, 1079, 'https://images.unsplash.com/photo-1490535090187-0b44b2d3d3b2?auto=format&fit=crop&w=600&q=80', FALSE),
(1238, 1079, 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80', FALSE),
(1239, 1079, 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80', FALSE);

-- === DANH MỤC: Việc làm ===
INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1080, 1, 9, 'Gia sư dạy kèm Toán Lý Hóa cấp 2 tại nhà', 'Sinh viên năm 3 Bách Khoa nhận dạy kèm học sinh lớp 6-9 tiến bộ nhanh.', 150000, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80', 106, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1240, 1080, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1081, 2, 9, 'Viết bài content chuẩn SEO bán thời gian', 'Nhận cộng tác viên viết bài bài đăng web/social chuẩn SEO, lương theo bài.', 80000, 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80', 45, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1241, 1081, 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80', TRUE),
(1242, 1081, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1082, 3, 9, 'Nhận thiết kế Slide PowerPoint thuyết trình xịn', 'Thiết kế slide chuyên nghiệp đẹp mắt theo yêu cầu của sinh viên.', 100000, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80', 6, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1243, 1082, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80', TRUE),
(1244, 1082, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80', FALSE),
(1245, 1082, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1083, 4, 9, 'Tư vấn chỉnh sửa CV chuẩn ATS cho sinh viên', 'Nhận chỉnh sửa thiết kế CV xin việc thu hút nhà tuyển dụng nổi bật.', 120000, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80', 89, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1246, 1083, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80', TRUE),
(1247, 1083, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80', FALSE),
(1248, 1083, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80', FALSE),
(1249, 1083, 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1084, 1, 9, 'Dịch thuật tài liệu Anh Việt chuyên ngành', 'Dịch thuật chính xác các bài báo khoa học, giáo trình, bài luận tiếng Anh.', 70000, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80', 75, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1250, 1084, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80', TRUE),
(1251, 1084, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80', FALSE),
(1252, 1084, 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80', FALSE),
(1253, 1084, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80', FALSE),
(1254, 1084, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1085, 2, 9, 'Nhận lập trình web đồ án môn học Java Node', 'Hỗ trợ hướng dẫn thực hiện đồ án tốt nghiệp, đồ án môn học CNTT.', 500000, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80', 82, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1255, 1085, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1086, 3, 9, 'Tuyển nhân viên phục vụ quán trà sữa tối', 'Quán gần trường tuyển phục vụ ca tối từ 18h-22h, phù hợp làm thêm.', 22000, 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80', 12, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1256, 1086, 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80', TRUE),
(1257, 1086, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1087, 4, 9, 'Nhận nhập liệu tính toán Excel văn phòng', 'Xử lý dữ liệu bảng biểu, tính toán báo cáo nhanh bằng hàm Excel.', 90000, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80', 143, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1258, 1087, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80', TRUE),
(1259, 1087, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80', FALSE),
(1260, 1087, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1088, 1, 9, 'Gia sư luyện thi tiếng Anh đại học từ đầu', 'Ôn luyện lấy lại gốc tiếng Anh, giải đề thi thử ĐH trọng tâm đạt điểm cao.', 180000, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80', 48, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1261, 1088, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80', TRUE),
(1262, 1088, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80', FALSE),
(1263, 1088, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80', FALSE),
(1264, 1088, 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1089, 2, 9, 'Tuyển CTV chụp ảnh mẫu quần áo thời trang', 'Tìm bạn sinh viên đam mê nhiếp ảnh chụp sản phẩm quần áo ngoại cảnh.', 250000, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80', 25, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1265, 1089, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80', TRUE),
(1266, 1089, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80', FALSE),
(1267, 1089, 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80', FALSE),
(1268, 1089, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80', FALSE),
(1269, 1089, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80', FALSE);

-- === DANH MỤC: Đồ điện tử ===
INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1090, 1, 10, 'Laptop Dell Latitude 7490 i5/8G/256G SSD', 'Máy văn phòng mỏng nhẹ chạy mượt mà Word Excel, pin còn dùng tốt 3-4h.', 5200000, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80', 135, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1270, 1090, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1091, 2, 10, 'Điện thoại iPhone X 64GB màu trắng quốc tế', 'Mọi chức năng hoàn hảo FaceID nhạy, pin thay mới 100% dung lượng.', 3400000, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80', 28, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1271, 1091, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80', TRUE),
(1272, 1091, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1092, 3, 10, 'Bàn phím cơ không dây RK61 RK Royal Kludge', 'Kết nối bluetooth tốt, LED RGB nhiều chế độ sáng, gõ êm tai.', 650000, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80', 137, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1273, 1092, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80', TRUE),
(1274, 1092, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80', FALSE),
(1275, 1092, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1093, 4, 10, 'Chuột gaming Logitech G102 có LED RGB', 'Hàng chính hãng chuyên chơi game bắn súng DPI cao nhạy bén.', 220000, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80', 94, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1276, 1093, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80', TRUE),
(1277, 1093, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80', FALSE),
(1278, 1093, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80', FALSE),
(1279, 1093, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1094, 1, 10, 'Smartwatch Xiaomi Redmi Watch 3 Active', 'Màn hình to đẹp, pin trâu 12 ngày, đo nhịp tim cuộc gọi Bluetooth.', 750000, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80', 105, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1280, 1094, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80', TRUE),
(1281, 1094, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80', FALSE),
(1282, 1094, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80', FALSE),
(1283, 1094, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80', FALSE),
(1284, 1094, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1095, 2, 10, 'Máy tính bảng iPad Air 2 16G Wifi mượt', 'Màn hình Retina sắc nét, thích hợp xem phim học zoom lướt web.', 1950000, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80', 64, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1285, 1095, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1096, 3, 10, 'Ổ cứng di động WD Elements 1TB USB 3.0', 'Ổ cứng lưu trữ tài liệu phim ảnh tốc độ cao cực an toàn tiện lợi.', 950000, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80', 0, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1286, 1096, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80', TRUE),
(1287, 1096, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1097, 4, 10, 'Màn hình máy tính Dell 24 inch IPS Full HD', 'Hiển thị sắc nét không lỗi điểm chết, thích hợp làm đồ họa văn phòng.', 1850000, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80', 122, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1288, 1097, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80', TRUE),
(1289, 1097, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80', FALSE),
(1290, 1097, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1098, 1, 10, 'Sạc dự phòng Anker 10000mAh PowerCore', 'Công nghệ sạc nhanh thông minh, kích thước nhỏ gọn đút túi quần được.', 380000, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80', 74, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1291, 1098, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80', TRUE),
(1292, 1098, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80', FALSE),
(1293, 1098, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80', FALSE),
(1294, 1098, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1099, 2, 10, 'Tai nghe chụp tai chống ồn Baseus H1 Pro', 'Chống ồn chủ động ANC cực tốt để tập trung học bài học online.', 580000, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80', 147, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1295, 1099, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80', TRUE),
(1296, 1099, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80', FALSE),
(1297, 1099, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80', FALSE),
(1298, 1099, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80', FALSE),
(1299, 1099, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80', FALSE);

-- === DANH MỤC: Tủ lạnh, máy lạnh, máy giặt ===
INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1100, 1, 11, 'Tủ lạnh mini Aqua 90L tiết kiệm điện', 'Còn chạy tốt đông đá nhanh phù hợp sinh viên để phòng trọ nhỏ.', 1400000, 'https://images.unsplash.com/photo-1571175432247-fe03d27453b5?auto=format&fit=crop&w=600&q=80', 75, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1300, 1100, 'https://images.unsplash.com/photo-1571175432247-fe03d27453b5?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1101, 2, 11, 'Máy lạnh di động mini Casper 1HP tiện lợi', 'Không cần lắp đặt cục nóng chỉ cần cắm điện xả hơi mát lạnh ngay.', 3200000, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80', 27, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1301, 1101, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80', TRUE),
(1302, 1101, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1102, 3, 11, 'Máy giặt mini cửa trên tự động 4kg đồ', 'Thích hợp giặt riêng đồ em bé hoặc giặt tất vớ quần áo mỏng hàng ngày.', 850000, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80', 109, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1303, 1102, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80', TRUE),
(1304, 1102, 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80', FALSE),
(1305, 1102, 'https://images.unsplash.com/photo-1601662528567-526cd06f6582?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1103, 4, 11, 'Quạt điều hòa làm mát bằng hơi nước Sunhouse', 'Kèm 2 viên đá khô hạ nhiệt cực nhanh cho mùa hè phòng trọ nóng nực.', 950000, 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80', 90, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1306, 1103, 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80', TRUE),
(1307, 1103, 'https://images.unsplash.com/photo-1601662528567-526cd06f6582?auto=format&fit=crop&w=600&q=80', FALSE),
(1308, 1103, 'https://images.unsplash.com/photo-1571175432247-fe03d27453b5?auto=format&fit=crop&w=600&q=80', FALSE),
(1309, 1103, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1104, 1, 11, 'Tủ lạnh Toshiba 180L không đóng tuyết', 'Dung tích vừa phải cho gia đình nhỏ hoặc phòng trọ ở ghép 3-4 người.', 2400000, 'https://images.unsplash.com/photo-1601662528567-526cd06f6582?auto=format&fit=crop&w=600&q=80', 89, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1310, 1104, 'https://images.unsplash.com/photo-1601662528567-526cd06f6582?auto=format&fit=crop&w=600&q=80', TRUE),
(1311, 1104, 'https://images.unsplash.com/photo-1571175432247-fe03d27453b5?auto=format&fit=crop&w=600&q=80', FALSE),
(1312, 1104, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80', FALSE),
(1313, 1104, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80', FALSE),
(1314, 1104, 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1105, 2, 11, 'Máy lạnh LG Inverter 1HP tiết kiệm điện 70%', 'Máy đang sử dụng cực mát, ga đầy đủ bao thợ test tháo lắp.', 3800000, 'https://images.unsplash.com/photo-1571175432247-fe03d27453b5?auto=format&fit=crop&w=600&q=80', 31, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1315, 1105, 'https://images.unsplash.com/photo-1571175432247-fe03d27453b5?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1106, 3, 11, 'Máy giặt Panasonic 8.2kg giặt sạch vắt khô', 'Lồng giặt inox bền bỉ, nhiều chương trình giặt tiện dụng cho sinh viên.', 1950000, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80', 64, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1316, 1106, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80', TRUE),
(1317, 1106, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1107, 4, 11, 'Tủ lạnh Sharp 150L tiết kiệm điện J-Tech', 'Máy vận hành êm ái giữ thực phẩm tươi ngon lâu, chưa qua sửa chữa.', 1800000, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80', 35, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1318, 1107, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80', TRUE),
(1319, 1107, 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80', FALSE),
(1320, 1107, 'https://images.unsplash.com/photo-1601662528567-526cd06f6582?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1108, 1, 11, 'Quạt tháp đứng thông minh Xiaomi điều khiển app', 'Thiết kế đẹp hiện đại tạo gió tự nhiên êm ái dịu nhẹ không tiếng ồn.', 800000, 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80', 11, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1321, 1108, 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80', TRUE),
(1322, 1108, 'https://images.unsplash.com/photo-1601662528567-526cd06f6582?auto=format&fit=crop&w=600&q=80', FALSE),
(1323, 1108, 'https://images.unsplash.com/photo-1571175432247-fe03d27453b5?auto=format&fit=crop&w=600&q=80', FALSE),
(1324, 1108, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1109, 2, 11, 'Bình nóng lạnh trực tiếp Ariston an toàn', 'Tích hợp chống giật ELCB cực an toàn, đun nóng nước tức thì.', 1100000, 'https://images.unsplash.com/photo-1601662528567-526cd06f6582?auto=format&fit=crop&w=600&q=80', 2, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1325, 1109, 'https://images.unsplash.com/photo-1601662528567-526cd06f6582?auto=format&fit=crop&w=600&q=80', TRUE),
(1326, 1109, 'https://images.unsplash.com/photo-1571175432247-fe03d27453b5?auto=format&fit=crop&w=600&q=80', FALSE),
(1327, 1109, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80', FALSE),
(1328, 1109, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80', FALSE),
(1329, 1109, 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80', FALSE);

-- === DANH MỤC: Thời trang, Đồ dùng cá nhân ===
INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1110, 1, 12, 'Giày Sneaker nam Nike Air Force 1 Trắng', 'Size 41, mới đi vài lần còn box, đế hơi bẩn nhẹ vệ sinh là như mới.', 1200000, 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80', 52, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1330, 1110, 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1111, 2, 12, 'Áo khoác da nam Bomber Zara cực ngầu', 'Size L form đẹp chất da mềm không bong tróc, khóa kéo mượt mà.', 450000, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80', 7, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1331, 1111, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80', TRUE),
(1332, 1111, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1112, 3, 12, 'Áo Hoodie nỉ bông Unisex form rộng ấm', 'Size M màu xám basic dễ phối đồ, thích hợp mặc đi học mùa lạnh.', 150000, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80', 74, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1333, 1112, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80', TRUE),
(1334, 1112, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', FALSE),
(1335, 1112, 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1113, 4, 12, 'Balo đi học thời trang nam nữ Hàn Quốc', 'Nhiều ngăn đựng vừa laptop 15.6 inch, chất vải chống thấm nước.', 180000, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', 8, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1336, 1113, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', TRUE),
(1337, 1113, 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80', FALSE),
(1338, 1113, 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80', FALSE),
(1339, 1113, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1114, 1, 12, 'Giày chạy bộ Adidas Duramo 10 siêu êm', 'Size 42 chính hãng chạy bộ êm chân, trọng lượng siêu nhẹ.', 850000, 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80', 36, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1340, 1114, 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80', TRUE),
(1341, 1114, 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80', FALSE),
(1342, 1114, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80', FALSE),
(1343, 1114, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80', FALSE),
(1344, 1114, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1115, 2, 12, 'Quần Jean ống rộng nam nữ phong cách', 'Size 30 chất jean dày dặn đứng form không phai màu khi giặt.', 190000, 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80', 122, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1345, 1115, 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1116, 3, 12, 'Áo khoác gió 2 lớp chống nước The North Face', 'Chống mưa nhẹ cản gió cực tốt thích hợp đi phượt dã ngoại du lịch.', 220000, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80', 51, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1346, 1116, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80', TRUE),
(1347, 1116, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1117, 4, 12, 'Mũ bảo hiểm 3/4 chính hãng Royal M139', 'Có kính âm chống lóa che bụi bẩn tốt, lót trong êm ái tháo giặt được.', 290000, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80', 130, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1348, 1117, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80', TRUE),
(1349, 1117, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', FALSE),
(1350, 1117, 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1118, 1, 12, 'Kính mắt thời trang gọng kim loại tròn', 'Tròng kính chống tia UV ánh sáng xanh tốt, tặng kèm hộp và khăn lau.', 95000, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', 139, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1351, 1118, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', TRUE),
(1352, 1118, 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80', FALSE),
(1353, 1118, 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80', FALSE),
(1354, 1118, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1119, 2, 12, 'Ví da nam cao cấp dáng đứng bỏ túi tiện lợi', 'Da bò thật bền bỉ, nhiều ngăn đựng thẻ card tiền mặt gọn gàng.', 180000, 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80', 93, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1355, 1119, 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80', TRUE),
(1356, 1119, 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80', FALSE),
(1357, 1119, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80', FALSE),
(1358, 1119, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80', FALSE),
(1359, 1119, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', FALSE);

-- === DANH MỤC: Đồ ăn, thực phẩm và các loại khác ===
INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1120, 1, 13, 'Hộp salad ức gà rau củ giảm cân healthy', 'Ức gà áp chảo mềm ngọt kèm sốt mè rang thơm ngậy rau củ tươi ngon.', 35000, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', 59, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1360, 1120, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1121, 2, 13, 'Cà phê hạt Robusta Buôn Ma Thuột 1kg', 'Hạt rang xay nguyên chất thơm ngon nồng nàn, thích hợp tự pha phin.', 220000, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80', 20, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1361, 1121, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80', TRUE),
(1362, 1121, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1122, 3, 13, 'Pizza bò bằm phô mai viền xúc xích nóng hổi', 'Pizza tự làm đế bánh giòn rụm nhiều phô mai kéo sợi thơm ngậy.', 95000, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80', 50, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1363, 1122, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80', TRUE),
(1364, 1122, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80', FALSE),
(1365, 1122, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1123, 4, 13, 'Set 5 bánh mì hoa cúc bơ tỏi thơm lừng', 'Bánh mì nướng nóng giòn quyện bơ tỏi thơm phức, ăn sáng siêu tiện.', 60000, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80', 121, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1366, 1123, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80', TRUE),
(1367, 1123, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80', FALSE),
(1368, 1123, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', FALSE),
(1369, 1123, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1124, 1, 13, 'Thùng 30 gói mì tôm Hảo Hảo chua cay', 'Mì gói quốc dân cho sinh viên chống đói đêm khuya ôn thi.', 110000, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80', 22, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1370, 1124, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80', TRUE),
(1371, 1124, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', FALSE),
(1372, 1124, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80', FALSE),
(1373, 1124, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80', FALSE),
(1374, 1124, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1125, 2, 13, 'Trà sữa trân châu đường đen size L nhà làm', 'Trà đậm vị sữa thơm béo kèm trân châu dai giòn ngọt lịm.', 25000, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', 138, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1375, 1125, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1126, 3, 13, 'Trái cây dĩa thập cẩm mát lạnh giao nhanh', 'Gồm dưa hấu xoài xoài mít bơ kèm sữa đặc đá bào giải nhiệt mùa hè.', 30000, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80', 58, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1376, 1126, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80', TRUE),
(1377, 1126, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1127, 4, 13, 'Hộp bánh tráng phơi sương muối nhuyễn hành phi', 'Bánh tráng dẻo thơm quyện muối nhuyễn cay cay, món ăn vặt quốc dân.', 45000, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80', 8, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1378, 1127, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80', TRUE),
(1379, 1127, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80', FALSE),
(1380, 1127, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1128, 1, 13, 'Khay sushi cuộn trứng tôm tươi ngon', 'Khay 12 viên đầy đặn kèm nước tương gừng hồng mù tạt cay nồng.', 80000, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80', 117, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1381, 1128, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80', TRUE),
(1382, 1128, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80', FALSE),
(1383, 1128, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', FALSE),
(1384, 1128, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1129, 2, 13, 'Cơm cháy chà bông siêu nhiều ruốc giòn rụm', 'Gói 500g cơm cháy giòn tan sốt mắm ớt đậm đà phủ kín chà bông.', 75000, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80', 83, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1385, 1129, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80', TRUE),
(1386, 1129, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', FALSE),
(1387, 1129, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80', FALSE),
(1388, 1129, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80', FALSE),
(1389, 1129, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80', FALSE);

-- === DANH MỤC: Dịch vụ chăm sóc nhà cửa ===
INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1130, 1, 14, 'Dịch vụ dọn dẹp phòng trọ trọn gói sinh viên', 'Quét dọn hút bụi lau nhà cọ toilet sạch sẽ ngăn nắp chỉ trong 2 tiếng.', 120000, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80', 94, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1390, 1130, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1131, 2, 14, 'Giặt sấy quần áo lấy ngay thơm tho sạch sẽ', 'Nhận giặt sấy sấy khô xếp gọn quần áo chăn ga gối nệm giá rẻ giao tận phòng.', 50000, 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80', 34, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1391, 1131, 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80', TRUE),
(1392, 1131, 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1132, 3, 14, 'Dịch vụ vệ sinh điều hòa máy lạnh tại nhà', 'Rửa lưới lọc sịt rửa dàn nóng dàn lạnh nạp ga bổ sung chạy lạnh buốt.', 150000, 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80', 146, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1393, 1132, 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80', TRUE),
(1394, 1132, 'https://images.unsplash.com/photo-1583907608222-7747e8f51f50?auto=format&fit=crop&w=600&q=80', FALSE),
(1395, 1132, 'https://images.unsplash.com/photo-1581578732697-5fffd732b1d6?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1133, 4, 14, 'Dịch vụ dọn nhà chuyển trọ trọn gói sinh viên', 'Có xe ba gác hỗ trợ bê vác tháo lắp tủ bàn ghế nhanh gọn tiết kiệm.', 350000, 'https://images.unsplash.com/photo-1583907608222-7747e8f51f50?auto=format&fit=crop&w=600&q=80', 90, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1396, 1133, 'https://images.unsplash.com/photo-1583907608222-7747e8f51f50?auto=format&fit=crop&w=600&q=80', TRUE),
(1397, 1133, 'https://images.unsplash.com/photo-1581578732697-5fffd732b1d6?auto=format&fit=crop&w=600&q=80', FALSE),
(1398, 1133, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80', FALSE),
(1399, 1133, 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1134, 1, 14, 'Vệ sinh cọ rửa máy giặt lồng đứng lồng ngang', 'Tháo lồng giặt tẩy sạch cặn bẩn nấm mốc tích tụ lâu ngày khử mùi hôi.', 250000, 'https://images.unsplash.com/photo-1581578732697-5fffd732b1d6?auto=format&fit=crop&w=600&q=80', 6, 'available', 'approved', 1, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1400, 1134, 'https://images.unsplash.com/photo-1581578732697-5fffd732b1d6?auto=format&fit=crop&w=600&q=80', TRUE),
(1401, 1134, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80', FALSE),
(1402, 1134, 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80', FALSE),
(1403, 1134, 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80', FALSE),
(1404, 1134, 'https://images.unsplash.com/photo-1583907608222-7747e8f51f50?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1135, 2, 14, 'Dịch vụ phun thuốc diệt muỗi gián kiến an toàn', 'Sử dụng thuốc sinh học không mùi an toàn sức khỏe bảo hành 3 tháng.', 180000, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80', 41, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1405, 1135, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80', TRUE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1136, 3, 14, 'Dịch vụ lau kính nhà cao tầng căn hộ mini', 'Lau sạch bụi bẩn vệt nước kính ngoài trời sáng bóng như mới.', 100000, 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80', 30, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1406, 1136, 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80', TRUE),
(1407, 1136, 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1137, 4, 14, 'Dịch vụ thông tắc cống thoát nước nhà vệ sinh', 'Thông tắc nhanh chóng bằng máy lò xo hiện đại không đục phá sàn.', 200000, 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80', 86, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1408, 1137, 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80', TRUE),
(1409, 1137, 'https://images.unsplash.com/photo-1583907608222-7747e8f51f50?auto=format&fit=crop&w=600&q=80', FALSE),
(1410, 1137, 'https://images.unsplash.com/photo-1581578732697-5fffd732b1d6?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1138, 1, 14, 'Dịch vụ giặt ghế sofa đệm giường hút bụi mịn', 'Giặt hơi nước nóng diệt khuẩn sấy khô nhanh tại chỗ sạch bụi bẩn.', 300000, 'https://images.unsplash.com/photo-1583907608222-7747e8f51f50?auto=format&fit=crop&w=600&q=80', 129, 'available', 'approved', 3, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1411, 1138, 'https://images.unsplash.com/photo-1583907608222-7747e8f51f50?auto=format&fit=crop&w=600&q=80', TRUE),
(1412, 1138, 'https://images.unsplash.com/photo-1581578732697-5fffd732b1d6?auto=format&fit=crop&w=600&q=80', FALSE),
(1413, 1138, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80', FALSE),
(1414, 1138, 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80', FALSE);

INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES 
(1139, 2, 14, 'Vệ sinh lau chùi tủ lạnh khử mùi hôi mốc', 'Rửa khay kệ lau chùi bên trong bên ngoài tủ lạnh sạch sẽ như mới mua.', 90000, 'https://images.unsplash.com/photo-1581578732697-5fffd732b1d6?auto=format&fit=crop&w=600&q=80', 146, 'available', 'approved', 2, FALSE, FALSE);
INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES 
(1415, 1139, 'https://images.unsplash.com/photo-1581578732697-5fffd732b1d6?auto=format&fit=crop&w=600&q=80', TRUE),
(1416, 1139, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80', FALSE),
(1417, 1139, 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80', FALSE),
(1418, 1139, 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80', FALSE),
(1419, 1139, 'https://images.unsplash.com/photo-1583907608222-7747e8f51f50?auto=format&fit=crop&w=600&q=80', FALSE);

