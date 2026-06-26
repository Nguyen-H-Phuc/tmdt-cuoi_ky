const fs = require('fs');

const categories = [
  { id: 1, name: 'Bất động sản', query: 'room' },
  { id: 2, name: 'Xe cộ', query: 'motorcycle' },
  { id: 3, name: 'Thú cưng', query: 'pet' },
  { id: 4, name: 'Đồ gia dụng, nội thất, cây cảnh', query: 'furniture' },
  { id: 5, name: 'Giải trí, Thể thao, Sở thích', query: 'sports' },
  { id: 6, name: 'Mẹ và bé', query: 'toy' },
  { id: 7, name: 'Dịch vụ, Du lịch', query: 'travel' },
  { id: 8, name: 'Cho tặng miễn phí', query: 'gift' },
  { id: 9, name: 'Việc làm', query: 'work' },
  { id: 10, name: 'Đồ điện tử', query: 'laptop' },
  { id: 11, name: 'Tủ lạnh, máy lạnh, máy giặt', query: 'appliance' },
  { id: 12, name: 'Thời trang, Đồ dùng cá nhân', query: 'fashion' },
  { id: 13, name: 'Đồ ăn, thực phẩm và các loại khác', query: 'food' },
  { id: 14, name: 'Dịch vụ chăm sóc nhà cửa', query: 'cleaning' }
];

const photoPool = {
  1: [
    'photo-1522708323590-d24dbb6b0267',
    'photo-1502672260266-1c1ef2d93688',
    'photo-1560448204-e02f11c3d0e2',
    'photo-1598928506311-c55ded91a20c',
    'photo-1505691938895-1758d7feb511'
  ],
  2: [
    'photo-1558981403-c5f9899a28bc',
    'photo-1485965120184-e220f721d03e',
    'photo-1541899481282-d53bffe3c35d',
    'photo-1508962914676-134849a727f0',
    'photo-1519641471654-76ce0107ad1b'
  ],
  3: [
    'photo-1543466835-00a7907e9de1',
    'photo-1514888286974-6c03e2ca1dba',
    'photo-1537151608828-ea2b11777ee8',
    'photo-1573865526739-10659fec78a5',
    'photo-1583511655857-d19b40a7a54e'
  ],
  4: [
    'photo-1524758631624-e2822e304c36',
    'photo-1538688525198-9b88f6f53126',
    'photo-1586023492125-27b2c045efd7',
    'photo-1501183007986-d0d080b147f9',
    'photo-1513519245088-0e12902e5a38'
  ],
  5: [
    'photo-1544947950-fa07a98d237f',
    'photo-1511671782779-c97d3d27a1d4',
    'photo-1506157786151-b8491531f063',
    'photo-1517649763962-0c623066013b',
    'photo-1547447134-cd3f5c716030'
  ],
  6: [
    'photo-1515488042361-404e9250afef',
    'photo-1596464716127-f2a82984de30',
    'photo-1519689680058-324335c77ebe',
    'photo-1544078751-58feb2dcb1f3',
    'photo-1555252333-9f8e92e65df9'
  ],
  7: [
    'photo-1527631746610-bca00a040d60',
    'photo-1504280390367-361c6d9f38f4',
    'photo-1530521954074-e64f6810b32d',
    'photo-1517842645767-c639042777db',
    'photo-1486916856992-e4db22c8df33'
  ],
  8: [
    'photo-1549465220-1a8b9238cd48',
    'photo-1490535090187-0b44b2d3d3b2',
    'photo-1512436991641-6745cdb1723f',
    'photo-1457369804613-52c61a468e7d',
    'photo-1516979187457-637abb4f9353'
  ],
  9: [
    'photo-1434030216411-0b793f4b4173',
    'photo-1586281380349-632531db7ed4',
    'photo-1454165804606-c3d57bc86b40',
    'photo-1522202176988-66273c2fd55f',
    'photo-1516321318423-f06f85e504b3'
  ],
  10: [
    'photo-1588872657578-7efd1f1555ed',
    'photo-1511707171634-5f897ff02aa9',
    'photo-1587829741301-dc798b83add3',
    'photo-1615663245857-ac93bb7c39e7',
    'photo-1546868871-7041f2a55e12'
  ],
  11: [
    'photo-1571175432247-fe03d27453b5',
    'photo-1621905251189-08b45d6a269e',
    'photo-1584622650111-993a426fbf0a',
    'photo-1585338107529-13afc5f02586',
    'photo-1601662528567-526cd06f6582'
  ],
  12: [
    'photo-1539185441755-769473a23570',
    'photo-1551028719-00167b16eac5',
    'photo-1556905055-8f358a7a47b2',
    'photo-1553062407-98eeb64c6a62',
    'photo-1491553895911-0055eca6402d'
  ],
  13: [
    'photo-1546069901-ba9599a7e63c',
    'photo-1509042239860-f550ce710b93',
    'photo-1540189549336-e6e99c3679fe',
    'photo-1565299624946-b28f40a0ae38',
    'photo-1567620905732-2d1ec7ab7445'
  ],
  14: [
    'photo-1581578731548-c64695cc6952',
    'photo-1528459801416-a9e53bbf4e17',
    'photo-1607344645866-009c320c5ab8',
    'photo-1583907608222-7747e8f51f50',
    'photo-1581578732697-5fffd732b1d6'
  ]
};

const productDetails = {
  1: [
    { title: 'Phòng trọ gần trường Bách Khoa gác lửng', desc: 'Diện tích 20m2, có gác lửng vệ sinh khép kín, an ninh tốt, gần chợ.', price: 1800000 },
    { title: 'Ký túc xá dịch vụ tiện nghi máy lạnh', desc: 'Giường tầng KTX cao cấp đầy đủ điều hòa, tủ lạnh, bếp nấu ăn chung.', price: 900000 },
    { title: 'Phòng trọ giá rẻ cho sinh viên Sư Phạm', desc: 'Phòng sạch sẽ, lối đi riêng không chung chủ, điện nước giá nhà nước.', price: 1200000 },
    { title: 'Căn hộ mini 1 phòng ngủ full nội thất', desc: 'Có máy giặt, điều hòa, tủ lạnh, nệm ga gối, chỉ cần xách vali vào ở.', price: 3500000 },
    { title: 'Nhà nguyên căn chia phòng ở ghép nhóm bạn', desc: 'Nhà 3 tầng có 3 phòng ngủ rộng rãi, phù hợp nhóm bạn 4-6 người thuê chung.', price: 6500000 },
    { title: 'Phòng trọ khép kín mới xây cực thoáng mát', desc: 'Vị trí mặt tiền hẻm lớn xe ba gác vào được, có ban công phơi đồ.', price: 2200000 },
    { title: 'Góc phòng ở ghép nam sạch sẽ thân thiện', desc: 'Cần tìm 1 bạn nam ở ghép share phòng trọ rộng, bạn học Bách Khoa.', price: 700000 },
    { title: 'Phòng trọ ban công ngắm hoàng hôn siêu chill', desc: 'Phòng lầu 3 sạch sẽ, có cửa sổ lớn cực thoáng mát đón gió tự nhiên.', price: 2000000 },
    { title: 'Căn hộ dịch vụ tiện ích gym hồ bơi free', desc: 'Có đầy đủ tiện ích đi kèm, giờ giấc tự do bằng vân tay bảo mật.', price: 4000000 },
    { title: 'Gác nhỏ ấm cúng giá cực sinh viên', desc: 'Gần trạm xe buýt, an ninh khu vực đảm bảo, thích hợp bạn ở một mình.', price: 1000000 }
  ],
  2: [
    { title: 'Xe Honda Wave Alpha 2018 màu xanh', desc: 'Xe chạy êm, máy móc nguyên bản chưa sửa chữa, giấy tờ chính chủ.', price: 11500000 },
    { title: 'Bicycle địa hình Asama chính hãng còn mới', desc: 'Khung nhôm siêu nhẹ, phanh đĩa trước sau nhạy, phù hợp đi học hàng ngày.', price: 1800000 },
    { title: 'Xe máy điện VinFast Klara S pin tốt', desc: 'Mới đi được 1 năm, pin còn 90% dung lượng, đầy đủ sạc và giấy tờ.', price: 19500000 },
    { title: 'Xe Yamaha Sirius RC 110cc bốc khỏe', desc: 'Ngoại hình hơi cũ theo thời gian nhưng máy cực chất, tiết kiệm xăng.', price: 8200000 },
    { title: 'Xe đạp Martin 107 huyền thoại cho nữ', desc: 'Xe đạp giỏ sắt nhẹ nhàng, thích hợp các bạn nữ đi lại quanh ký túc xá.', price: 800000 },
    { title: 'Xe tay ga Honda Vision 2016 màu đỏ', desc: 'Xe nữ sử dụng giữ gìn, bảo dưỡng thay nhớt định kỳ đầy đủ.', price: 18500000 },
    { title: 'Xe đạp fixed gear sành điệu cá tính', desc: 'Mới ráp đi được vài lần, phụ tùng cao cấp, líp đôi linh hoạt.', price: 2500000 },
    { title: 'Xe máy cúp 50cc không cần bằng lái', desc: 'Thích hợp cho các bạn sinh viên năm nhất chưa có bằng lái xe máy.', price: 6800000 },
    { title: 'Bicycle thể thao Touring Giant bền bỉ', desc: 'Dòng xe cao cấp chạy đường phố cực lướt, bộ đề Shimano 21 tốc độ.', price: 4200000 },
    { title: 'Xe tay ga Suzuki Hayate máy nguyên bản', desc: 'Xe khỏe, cốp rộng chứa được 2 mũ bảo hiểm, giá thanh lý nhanh.', price: 4500000 }
  ],
  3: [
    { title: 'Mèo Anh lông ngắn màu xám cực cuộn', desc: 'Bé mèo 3 tháng tuổi, đã tiêm ngừa 1 mũi, ăn hạt khỏe, biết đi vệ sinh đúng chỗ.', price: 2500000 },
    { title: 'Chó Poodle lai Tiny màu nâu đỏ siêu cute', desc: 'Bé đực 2.5 tháng tuổi, nhanh nhẹn, tinh nghịch, quấn người.', price: 3200000 },
    { title: 'Bể cá cảnh mini để bàn học xả stress', desc: 'Full bộ gồm bể kính, lọc thác nước, đèn LED và vài chú cá bảy màu.', price: 250000 },
    { title: 'Chuồng mèo 3 tầng nan sắt sơn tĩnh điện', desc: 'Chuồng rộng rãi thoải mái có bánh xe di chuyển tiện lợi, kèm khay vệ sinh.', price: 450000 },
    { title: 'Mèo tai cụp Scottish mắt tròn xoe', desc: 'Bé cái dễ thương, lông dày mượt, đã được tẩy giun đầy đủ.', price: 3800000 },
    { title: 'Thức ăn hạt cho chó Royal Canin 1kg', desc: 'Hàng chính hãng hạn sử dụng còn xa, mua về cún không hợp vị nên bán lại.', price: 150000 },
    { title: 'Balo phi hành gia vận chuyển chó mèo', desc: 'Mặt nhựa trong suốt thông thoáng khí, thích hợp mang thú cưng đi chơi.', price: 120000 },
    { title: 'Hamster Winter White siêu ú nu', desc: 'Tặng kèm lồng nuôi mini, bình nước, chén ăn và mùn cưa lót chuồng.', price: 100000 },
    { title: 'Nhà cây cào móng cho mèo handmade', desc: 'Thiết kế nhiều tầng bọc dây thừng gai bền bỉ, giúp mèo giải trí cào móng.', price: 300000 },
    { title: 'Pate lon cho mèo Whiskas vị cá ngừ', desc: 'Hộp 400g thanh lý lốc 6 lon do mèo chuyển sang ăn hạt hoàn toàn.', price: 180000 }
  ],
  4: [
    { title: 'Bàn học làm việc gấp gọn gỗ MDF', desc: 'Chân sắt chắc chắn sơn tĩnh điện, mặt bàn chống xước rộng 60x120cm.', price: 280000 },
    { title: 'Ghế xoay văn phòng có đệm lưng lưới', desc: 'Có piston nâng hạ chiều cao linh hoạt, bánh xe di chuyển mượt mà.', price: 350000 },
    { title: 'Nồi cơm điện mini Supor 1.2L nhỏ gọn', desc: 'Lòng nồi chống dính, phù hợp nấu ăn cho 1-2 người cực tiện lợi.', price: 290000 },
    { title: 'Ấm siêu tốc Inox Lock&Lock 1.8L', desc: 'Đun nước sôi siêu nhanh, tự động ngắt điện khi nước sôi an toàn.', price: 190000 },
    { title: 'Cây kim tiền phong thủy văn phòng bàn học', desc: 'Tặng kèm chậu sứ trắng trang nhã, cây lọc không khí tốt mang may mắn.', price: 80000 },
    { title: 'Tủ quần áo vải 3 buồng 8 ngăn rộng rãi', desc: 'Khung inox chắc chắn chịu lực tốt, áo vải chống thấm bụi bẩn.', price: 220000 },
    { title: 'Kệ sách gỗ 5 tầng đứng lắp ráp tiện lợi', desc: 'Chất liệu gỗ tự nhiên ép bền đẹp, xếp gọn sách vở tài liệu ngăn nắp.', price: 150000 },
    { title: 'Đèn học LED chống cận thị điều chỉnh sáng', desc: 'Có 3 chế độ màu sáng (trắng, ấm, trung tính), điều khiển cảm ứng cực xịn.', price: 120000 },
    { title: 'Chảo chống dính Sunhouse sâu lòng 26cm', desc: 'Mới 100% nguyên seal chưa sử dụng, dùng được trên mọi loại bếp.', price: 140000 },
    { title: 'Chậu cây lưỡi hổ lọc không khí cực tốt', desc: 'Cây dễ chăm sóc không cần tưới nước nhiều, thích hợp để góc phòng ngủ.', price: 70000 }
  ],
  5: [
    { title: 'Đàn Guitar Acoustic gỗ hồng đào tiếng ấm', desc: 'Tặng kèm bao da đựng đàn, phím gảy, bộ dây dự phòng và giáo trình tự học.', price: 1200000 },
    { title: 'Vợt cầu lông Yonex Carbon nhẹ tay', desc: 'Vợt đã căng sẵn lưới 10kg, độ nảy tốt, thích hợp luyện tập thể thao.', price: 450000 },
    { title: 'Quả bóng đá Size 5 Động Lực chính hãng', desc: 'Chất liệu da PU êm chân, giữ hơi tốt, tặng kèm kim bơm và lưới đựng bóng.', price: 220000 },
    { title: 'Ván trượt Skateboard gỗ phong 8 lớp bền', desc: 'Bánh xe cao su đúc đi êm chịu lực 100kg, thích hợp cho người mới tập.', price: 380000 },
    { title: 'Sách giáo trình tiếng Anh IELTS Cam 15-18', desc: 'Sách mới chưa viết vẽ, bản in đẹp rõ nét kèm mã quét tải file nghe audio.', price: 160000 },
    { title: 'Tai nghe chụp tai gaming có mic đàm thoại', desc: 'Kết nối cổng USB âm thanh giả lập 7.1, đệm tai êm ái cách âm tốt.', price: 290000 },
    { title: 'Thảm tập Yoga chống trơn trượt TPE 2 lớp', desc: 'Kích thước chuẩn, thảm dày 6mm bảo vệ xương khớp khi tập luyện.', price: 180000 },
    { title: 'Loa Bluetooth mini không dây Bass cực mạnh', desc: 'Chống nước IPX7, pin trâu phát nhạc liên tục 8 tiếng, nhỏ gọn mang đi chơi.', price: 350000 },
    { title: 'Truyện tranh trọn bộ Doraemon 45 tập', desc: 'Chất lượng giấy đẹp không rách nát, thích hợp cho bạn nào thích sưu tầm.', price: 400000 },
    { title: 'Giày patin trẻ em người lớn có đèn LED bánh', desc: 'Có chốt điều chỉnh size chân dễ dàng, khung hợp kim nhôm cứng cáp.', price: 550000 }
  ],
  6: [
    { title: 'Xe đẩy em bé gấp gọn đi du lịch siêu nhẹ', desc: 'Có mái che nắng điều chỉnh được nhiều tư thế, đai an toàn 5 điểm.', price: 850000 },
    { title: 'Bộ đồ chơi xếp hình Lego 1000 chi tiết', desc: 'Chất liệu nhựa ABS an toàn giúp bé kích thích tư duy sáng tạo vô hạn.', price: 240000 },
    { title: 'Nôi điện tự động ru bé ngủ êm ái', desc: 'Có nhiều tốc độ đưa nôi điều chỉnh bằng remote, nhạc ru bé ngủ ngon.', price: 1100000 },
    { title: 'Máy tiệt trùng bình sữa Philips Avent', desc: 'Sử dụng hơi nước tự nhiên diệt khuẩn 99.9%, tiệt trùng nhanh 10 phút.', price: 750000 },
    { title: 'Set 5 bộ body chip cotton sơ sinh dễ thương', desc: 'Vải cotton mềm mại thấm hút mồ hôi tốt, khuy bấm dưới đũng tiện lợi.', price: 180000 },
    { title: 'Sữa bột Similac Infant Formula Mỹ 900g', desc: 'Hàng chính hãng mới mua, bé không hợp tác đổi sữa nên thanh lý lại.', price: 520000 },
    { title: 'Địu em bé 4 tư thế bọc đệm êm chống gù', desc: 'Chất vải lưới thoáng mát, trợ lực tốt giúp bố mẹ không mỏi vai gáy.', price: 190000 },
    { title: 'Bộ đồ chơi gỗ luồn hạt thông minh', desc: 'Sơn gốc nước không độc hại giúp bé nhận biết màu sắc hình khối tốt.', price: 90000 },
    { title: 'Xe chòi chân thăng bằng 4 bánh cho bé', desc: 'Khung xe chắc chắn, bánh xe bọc cao su êm ái chống trơn trượt.', price: 220000 },
    { title: 'Thảm xốp ghép hình lót sàn cho bé tập bò', desc: 'Set 10 miếng xốp dày 1cm chống va đập, dễ lau chùi vệ sinh.', price: 120000 }
  ],
  7: [
    { title: 'Balo du lịch bụi chuyên nghiệp 50L', desc: 'Có khung trợ lực chống mỏi lưng, áo mưa bọc balo chống nước đi kèm.', price: 480000 },
    { title: 'Lều cắm trại 4 người tự bung chống nước', desc: 'Vải dù oxford chống tia cực tím tốt, mở lều nhanh chóng trong 3 giây.', price: 550000 },
    { title: 'Vali du lịch khung nhôm khóa số TSA 24 inch', desc: 'Bánh xe xoay 360 độ êm mượt, chất liệu nhựa polycarbonate chịu lực cực tốt.', price: 890000 },
    { title: 'Túi ngủ du lịch dã ngoại giữ ấm tốt', desc: 'Chất liệu lót bông siêu nhẹ ấm áp, thu gọn tiện mang đi cắm trại.', price: 190000 },
    { title: 'Tour leo núi Fansipan 2 ngày 1 đêm trọn gói', desc: 'Nhượng lại suất tour do bận lịch học đột xuất, đã bao gồm ăn uống hướng dẫn.', price: 1500000 },
    { title: 'Gậy leo núi dã ngoại hợp kim nhôm rút gọn', desc: 'Có lò xo giảm chấn tay cầm bọc mút êm ái chống trơn trượt.', price: 110000 },
    { title: 'Voucher phòng khách sạn Sapa view núi cực chill', desc: 'Hạn dùng cuối năm, bao gồm buffet sáng cho 2 người lớn.', price: 750000 },
    { title: 'Bình nước giữ nhiệt dã ngoại Lock&Lock 1L', desc: 'Chất liệu inox 316 cao cấp giữ nóng lạnh trên 24 tiếng liên tục.', price: 280000 },
    { title: 'Túi đựng đồ trang điểm cá nhân du lịch', desc: 'Nhiều ngăn phân loại tiện dụng chống thấm nước bảo vệ đồ đạc.', price: 65000 },
    { title: 'Sạc dự phòng năng lượng mặt trời chống nước', desc: 'Dung lượng 20000mAh tích hợp đèn pin siêu sáng đi rừng dã ngoại.', price: 340000 }
  ],
  8: [
    { title: 'Tặng giáo trình Luật đại cương trường BK', desc: 'Sách cũ đã qua sử dụng, có ghi chép bút chì nhưng vẫn dùng học tốt.', price: 0 },
    { title: 'Cho tài liệu ôn thi THPT Quốc Gia môn Toán', desc: 'Tổng hợp đề thi thử và công thức giải nhanh môn Toán, tặng bạn nào cần.', price: 0 },
    { title: 'Tặng quần áo cũ làm từ thiện hoặc mặc ở nhà', desc: 'Set đồ nam nữ thun quần jean cũ sạch sẽ, tặng hội nhóm gom đồ quyên góp.', price: 0 },
    { title: 'Tặng chậu sứ trồng cây mini cũ', desc: 'Nhà thừa vài chậu đất nung chậu sứ nhỏ trồng sen đá, tặng bạn qua lấy.', price: 0 },
    { title: 'Cho gấu bông cũ còn khá mới sạch sẽ', desc: 'Dọn phòng dư vài bé gấu bông nhỏ xinh muốn tặng bạn nữ yêu thích.', price: 0 },
    { title: 'Tặng vở viết học sinh 100 trang mới nguyên', desc: 'Được thưởng cuối kỳ dư dùng nên tặng lại các bạn có hoàn cảnh khó khăn.', price: 0 },
    { title: 'Tặng bộ tài liệu học lập trình Java Web', desc: 'Gồm tài liệu in và file source code bài tập mẫu, hỗ trợ bạn bắt đầu code.', price: 0 },
    { title: 'Cho bát đĩa cốc chén nhựa ăn sinh viên', desc: 'Sắp chuyển phòng trọ xa không mang theo được, tặng lại bạn khóa dưới.', price: 0 },
    { title: 'Tặng thẻ giảm giá khóa học tiếng Anh giao tiếp', desc: 'Thẻ voucher giảm 50% học phí trung tâm Anh ngữ lớn, không đi nên tặng.', price: 0 },
    { title: 'Cho kệ dép nhựa cũ 3 tầng tiện lợi', desc: 'Kệ cũ hơi trầy xước nhưng vẫn đứng chắc chắn đựng giày dép thoải mái.', price: 0 }
  ],
  9: [
    { title: 'Gia sư dạy kèm Toán Lý Hóa cấp 2 tại nhà', desc: 'Sinh viên năm 3 Bách Khoa nhận dạy kèm học sinh lớp 6-9 tiến bộ nhanh.', price: 150000 },
    { title: 'Viết bài content chuẩn SEO bán thời gian', desc: 'Nhận cộng tác viên viết bài bài đăng web/social chuẩn SEO, lương theo bài.', price: 80000 },
    { title: 'Nhận thiết kế Slide PowerPoint thuyết trình xịn', desc: 'Thiết kế slide chuyên nghiệp đẹp mắt theo yêu cầu của sinh viên.', price: 100000 },
    { title: 'Tư vấn chỉnh sửa CV chuẩn ATS cho sinh viên', desc: 'Nhận chỉnh sửa thiết kế CV xin việc thu hút nhà tuyển dụng nổi bật.', price: 120000 },
    { title: 'Dịch thuật tài liệu Anh Việt chuyên ngành', desc: 'Dịch thuật chính xác các bài báo khoa học, giáo trình, bài luận tiếng Anh.', price: 70000 },
    { title: 'Nhận lập trình web đồ án môn học Java Node', desc: 'Hỗ trợ hướng dẫn thực hiện đồ án tốt nghiệp, đồ án môn học CNTT.', price: 500000 },
    { title: 'Tuyển nhân viên phục vụ quán trà sữa tối', desc: 'Quán gần trường tuyển phục vụ ca tối từ 18h-22h, phù hợp làm thêm.', price: 22000 },
    { title: 'Nhận nhập liệu tính toán Excel văn phòng', desc: 'Xử lý dữ liệu bảng biểu, tính toán báo cáo nhanh bằng hàm Excel.', price: 90000 },
    { title: 'Gia sư luyện thi tiếng Anh đại học từ đầu', desc: 'Ôn luyện lấy lại gốc tiếng Anh, giải đề thi thử ĐH trọng tâm đạt điểm cao.', price: 180000 },
    { title: 'Tuyển CTV chụp ảnh mẫu quần áo thời trang', desc: 'Tìm bạn sinh viên đam mê nhiếp ảnh chụp sản phẩm quần áo ngoại cảnh.', price: 250000 }
  ],
  10: [
    { title: 'Laptop Dell Latitude 7490 i5/8G/256G SSD', desc: 'Máy văn phòng mỏng nhẹ chạy mượt mà Word Excel, pin còn dùng tốt 3-4h.', price: 5200000 },
    { title: 'Điện thoại iPhone X 64GB màu trắng quốc tế', desc: 'Mọi chức năng hoàn hảo FaceID nhạy, pin thay mới 100% dung lượng.', price: 3400000 },
    { title: 'Bàn phím cơ không dây RK61 RK Royal Kludge', desc: 'Kết nối bluetooth tốt, LED RGB nhiều chế độ sáng, gõ êm tai.', price: 650000 },
    { title: 'Chuột gaming Logitech G102 có LED RGB', desc: 'Hàng chính hãng chuyên chơi game bắn súng DPI cao nhạy bén.', price: 220000 },
    { title: 'Smartwatch Xiaomi Redmi Watch 3 Active', desc: 'Màn hình to đẹp, pin trâu 12 ngày, đo nhịp tim cuộc gọi Bluetooth.', price: 750000 },
    { title: 'Máy tính bảng iPad Air 2 16G Wifi mượt', desc: 'Màn hình Retina sắc nét, thích hợp xem phim học zoom lướt web.', price: 1950000 },
    { title: 'Ổ cứng di động WD Elements 1TB USB 3.0', desc: 'Ổ cứng lưu trữ tài liệu phim ảnh tốc độ cao cực an toàn tiện lợi.', price: 950000 },
    { title: 'Màn hình máy tính Dell 24 inch IPS Full HD', desc: 'Hiển thị sắc nét không lỗi điểm chết, thích hợp làm đồ họa văn phòng.', price: 1850000 },
    { title: 'Sạc dự phòng Anker 10000mAh PowerCore', desc: 'Công nghệ sạc nhanh thông minh, kích thước nhỏ gọn đút túi quần được.', price: 380000 },
    { title: 'Tai nghe chụp tai chống ồn Baseus H1 Pro', desc: 'Chống ồn chủ động ANC cực tốt để tập trung học bài học online.', price: 580000 }
  ],
  11: [
    { title: 'Tủ lạnh mini Aqua 90L tiết kiệm điện', desc: 'Còn chạy tốt đông đá nhanh phù hợp sinh viên để phòng trọ nhỏ.', price: 1400000 },
    { title: 'Máy lạnh di động mini Casper 1HP tiện lợi', desc: 'Không cần lắp đặt cục nóng chỉ cần cắm điện xả hơi mát lạnh ngay.', price: 3200000 },
    { title: 'Máy giặt mini cửa trên tự động 4kg đồ', desc: 'Thích hợp giặt riêng đồ em bé hoặc giặt tất vớ quần áo mỏng hàng ngày.', price: 850000 },
    { title: 'Quạt điều hòa làm mát bằng hơi nước Sunhouse', desc: 'Kèm 2 viên đá khô hạ nhiệt cực nhanh cho mùa hè phòng trọ nóng nực.', price: 950000 },
    { title: 'Tủ lạnh Toshiba 180L không đóng tuyết', desc: 'Dung tích vừa phải cho gia đình nhỏ hoặc phòng trọ ở ghép 3-4 người.', price: 2400000 },
    { title: 'Máy lạnh LG Inverter 1HP tiết kiệm điện 70%', desc: 'Máy đang sử dụng cực mát, ga đầy đủ bao thợ test tháo lắp.', price: 3800000 },
    { title: 'Máy giặt Panasonic 8.2kg giặt sạch vắt khô', desc: 'Lồng giặt inox bền bỉ, nhiều chương trình giặt tiện dụng cho sinh viên.', price: 1950000 },
    { title: 'Tủ lạnh Sharp 150L tiết kiệm điện J-Tech', desc: 'Máy vận hành êm ái giữ thực phẩm tươi ngon lâu, chưa qua sửa chữa.', price: 1800000 },
    { title: 'Quạt tháp đứng thông minh Xiaomi điều khiển app', desc: 'Thiết kế đẹp hiện đại tạo gió tự nhiên êm ái dịu nhẹ không tiếng ồn.', price: 800000 },
    { title: 'Bình nóng lạnh trực tiếp Ariston an toàn', desc: 'Tích hợp chống giật ELCB cực an toàn, đun nóng nước tức thì.', price: 1100000 }
  ],
  12: [
    { title: 'Giày Sneaker nam Nike Air Force 1 Trắng', desc: 'Size 41, mới đi vài lần còn box, đế hơi bẩn nhẹ vệ sinh là như mới.', price: 1200000 },
    { title: 'Áo khoác da nam Bomber Zara cực ngầu', desc: 'Size L form đẹp chất da mềm không bong tróc, khóa kéo mượt mà.', price: 450000 },
    { title: 'Áo Hoodie nỉ bông Unisex form rộng ấm', desc: 'Size M màu xám basic dễ phối đồ, thích hợp mặc đi học mùa lạnh.', price: 150000 },
    { title: 'Balo đi học thời trang nam nữ Hàn Quốc', desc: 'Nhiều ngăn đựng vừa laptop 15.6 inch, chất vải chống thấm nước.', price: 180000 },
    { title: 'Giày chạy bộ Adidas Duramo 10 siêu êm', desc: 'Size 42 chính hãng chạy bộ êm chân, trọng lượng siêu nhẹ.', price: 850000 },
    { title: 'Quần Jean ống rộng nam nữ phong cách', desc: 'Size 30 chất jean dày dặn đứng form không phai màu khi giặt.', price: 190000 },
    { title: 'Áo khoác gió 2 lớp chống nước The North Face', desc: 'Chống mưa nhẹ cản gió cực tốt thích hợp đi phượt dã ngoại du lịch.', price: 220000 },
    { title: 'Mũ bảo hiểm 3/4 chính hãng Royal M139', desc: 'Có kính âm chống lóa che bụi bẩn tốt, lót trong êm ái tháo giặt được.', price: 290000 },
    { title: 'Kính mắt thời trang gọng kim loại tròn', desc: 'Tròng kính chống tia UV ánh sáng xanh tốt, tặng kèm hộp và khăn lau.', price: 95000 },
    { title: 'Ví da nam cao cấp dáng đứng bỏ túi tiện lợi', desc: 'Da bò thật bền bỉ, nhiều ngăn đựng thẻ card tiền mặt gọn gàng.', price: 180000 }
  ],
  13: [
    { title: 'Hộp salad ức gà rau củ giảm cân healthy', desc: 'Ức gà áp chảo mềm ngọt kèm sốt mè rang thơm ngậy rau củ tươi ngon.', price: 35000 },
    { title: 'Cà phê hạt Robusta Buôn Ma Thuột 1kg', desc: 'Hạt rang xay nguyên chất thơm ngon nồng nàn, thích hợp tự pha phin.', price: 220000 },
    { title: 'Pizza bò bằm phô mai viền xúc xích nóng hổi', desc: 'Pizza tự làm đế bánh giòn rụm nhiều phô mai kéo sợi thơm ngậy.', price: 95000 },
    { title: 'Set 5 bánh mì hoa cúc bơ tỏi thơm lừng', desc: 'Bánh mì nướng nóng giòn quyện bơ tỏi thơm phức, ăn sáng siêu tiện.', price: 60000 },
    { title: 'Thùng 30 gói mì tôm Hảo Hảo chua cay', desc: 'Mì gói quốc dân cho sinh viên chống đói đêm khuya ôn thi.', price: 110000 },
    { title: 'Trà sữa trân châu đường đen size L nhà làm', desc: 'Trà đậm vị sữa thơm béo kèm trân châu dai giòn ngọt lịm.', price: 25000 },
    { title: 'Trái cây dĩa thập cẩm mát lạnh giao nhanh', desc: 'Gồm dưa hấu xoài xoài mít bơ kèm sữa đặc đá bào giải nhiệt mùa hè.', price: 30000 },
    { title: 'Hộp bánh tráng phơi sương muối nhuyễn hành phi', desc: 'Bánh tráng dẻo thơm quyện muối nhuyễn cay cay, món ăn vặt quốc dân.', price: 45000 },
    { title: 'Khay sushi cuộn trứng tôm tươi ngon', desc: 'Khay 12 viên đầy đặn kèm nước tương gừng hồng mù tạt cay nồng.', price: 80000 },
    { title: 'Cơm cháy chà bông siêu nhiều ruốc giòn rụm', desc: 'Gói 500g cơm cháy giòn tan sốt mắm ớt đậm đà phủ kín chà bông.', price: 75000 }
  ],
  14: [
    { title: 'Dịch vụ dọn dẹp phòng trọ trọn gói sinh viên', desc: 'Quét dọn hút bụi lau nhà cọ toilet sạch sẽ ngăn nắp chỉ trong 2 tiếng.', price: 120000 },
    { title: 'Giặt sấy quần áo lấy ngay thơm tho sạch sẽ', desc: 'Nhận giặt sấy sấy khô xếp gọn quần áo chăn ga gối nệm giá rẻ giao tận phòng.', price: 50000 },
    { title: 'Dịch vụ vệ sinh điều hòa máy lạnh tại nhà', desc: 'Rửa lưới lọc sịt rửa dàn nóng dàn lạnh nạp ga bổ sung chạy lạnh buốt.', price: 150000 },
    { title: 'Dịch vụ dọn nhà chuyển trọ trọn gói sinh viên', desc: 'Có xe ba gác hỗ trợ bê vác tháo lắp tủ bàn ghế nhanh gọn tiết kiệm.', price: 350000 },
    { title: 'Vệ sinh cọ rửa máy giặt lồng đứng lồng ngang', desc: 'Tháo lồng giặt tẩy sạch cặn bẩn nấm mốc tích tụ lâu ngày khử mùi hôi.', price: 250000 },
    { title: 'Dịch vụ phun thuốc diệt muỗi gián kiến an toàn', desc: 'Sử dụng thuốc sinh học không mùi an toàn sức khỏe bảo hành 3 tháng.', price: 180000 },
    { title: 'Dịch vụ lau kính nhà cao tầng căn hộ mini', desc: 'Lau sạch bụi bẩn vệt nước kính ngoài trời sáng bóng như mới.', price: 100000 },
    { title: 'Dịch vụ thông tắc cống thoát nước nhà vệ sinh', desc: 'Thông tắc nhanh chóng bằng máy lò xo hiện đại không đục phá sàn.', price: 200000 },
    { title: 'Dịch vụ giặt ghế sofa đệm giường hút bụi mịn', desc: 'Giặt hơi nước nóng diệt khuẩn sấy khô nhanh tại chỗ sạch bụi bẩn.', price: 300000 },
    { title: 'Vệ sinh lau chùi tủ lạnh khử mùi hôi mốc', desc: 'Rửa khay kệ lau chùi bên trong bên ngoài tủ lạnh sạch sẽ như mới mua.', price: 90000 }
  ]
};

let sql = `USE tmdt_db;\n\n`;

// Clear existing large test data if any (optional, let's keep original 1-5 products to not break test orders)
sql += `-- Thêm dữ liệu mẫu sinh viên hàng loạt cho 14 danh mục, mỗi danh mục 10 sản phẩm\n\n`;

let productId = 1000;
let imageId = 1000;

for (const cat of categories) {
  const products = productDetails[cat.id];
  const photos = photoPool[cat.id];
  
  sql += `-- === DANH MỤC: ${cat.name} ===\n`;
  
  for (let i = 0; i < products.length; i++) {
    const prod = products[i];
    const sellerId = (i % 4) + 1; // 1, 2, 3, 4
    const price = prod.price;
    const title = prod.title.replace(/'/g, "''");
    const desc = prod.desc.replace(/'/g, "''");
    
    // Determine image count (1 to 5)
    // To make it different for each product, we can use a rotating count or random
    const imageCount = (i % 5) + 1; // 1 to 5 images
    
    // Choose photos from pool. We can rotate or shift them
    const prodPhotos = [];
    for (let j = 0; j < imageCount; j++) {
      const idx = (i + j) % photos.length;
      prodPhotos.push(photos[idx]);
    }
    
    // Primary main image URL
    const mainPhoto = prodPhotos[0];
    const mainPhotoUrl = `https://images.unsplash.com/${mainPhoto}?auto=format&fit=crop&w=600&q=80`;
    
    // Insert statement for product
    sql += `INSERT INTO products (product_id, user_id, category_id, title, description, price, image_url, view_count, status, approval_status, quantity, is_deleted, is_hidden) VALUES \n`;
    sql += `(${productId}, ${sellerId}, ${cat.id}, '${title}', '${desc}', ${price}, '${mainPhotoUrl}', ${Math.floor(Math.random() * 150)}, 'available', 'approved', ${Math.floor(Math.random() * 3) + 1}, FALSE, FALSE);\n`;
    
    // Insert statements for product images
    sql += `INSERT INTO product_images (image_id, product_id, image_url, is_main) VALUES \n`;
    for (let j = 0; j < prodPhotos.length; j++) {
      const photoId = prodPhotos[j];
      const photoUrl = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=600&q=80`;
      const isMain = j === 0 ? 'TRUE' : 'FALSE';
      sql += `(${imageId}, ${productId}, '${photoUrl}', ${isMain})${j === prodPhotos.length - 1 ? ';' : ',\n'}`;
      imageId++;
    }
    sql += `\n\n`;
    
    productId++;
  }
}

fs.writeFileSync('seed_products.sql', sql);
console.log('Seed SQL file successfully generated as seed_products.sql');
