import React from 'react';
import RevenueChart from '../components/RevenueChart';

const DashboardPage = () => {
    return (
        <div className="max-w-[1920px] mx-auto px-4 md:px-6 py-8">

            {/* Tiêu đề trang - Đã đổi thành Nền tảng và làm đậm chữ */}
            <div className="mb-8">
                <h1 style={{ color: '#111827' }} className="text-3xl font-bold mb-2">
                    Tổng quan nền tảng
                </h1>
                <p className="text-base text-gray-600 mt-1">
                    Theo dõi tổng giá trị giao dịch và mức độ hoạt động của cộng đồng.
                </p>
            </div>

            {/* Lưới chứa các biểu đồ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Biểu đồ giao dịch */}
                <div className="w-full">
                    <RevenueChart />
                </div>

                {/* Khối trống để dành cho các trang khác */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center items-center min-h-[450px] border-dashed">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <span className="text-gray-400 text-2xl">+</span>
                    </div>
                    <p className="text-gray-600 font-medium">Thêm biểu đồ mới</p>
                    <p className="text-sm text-gray-400 mt-1">Tính năng đang phát triển</p>
                </div>

            </div>
        </div>
    );
};

export default DashboardPage;