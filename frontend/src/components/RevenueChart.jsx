import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

const RevenueChart = ({ isAdmin = false, sellerId = 1 }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(-1);

    useEffect(() => {
        const url = isAdmin 
            ? `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/statistics/admin/revenue`
            : `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/statistics/revenue?sellerId=${sellerId}`;

        axios.get(url)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi khi lấy dữ liệu:", err);
                setError("Không thể tải dữ liệu biểu đồ.");
                setLoading(false);
            });
    }, [isAdmin, sellerId]);

    // Hàm định dạng tiền tệ
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(value);
    };

    // Hàm định dạng trục Y
    const formatYAxis = (value) => {
        if (value >= 1000000) return `${Number((value / 1000000).toFixed(1))}Tr`;
        if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
        return value;
    };

    //CÁC HÀM XỬ LÝ TOÁN HỌC & AI
    const chartStats = useMemo(() => {
        // Lưới an toàn 1: Tránh lỗi khi data rỗng
        if (!data || data.length === 0) return null;

        let total = 0;
        let maxObj = data[0];
        let minObj = data[0];

        data.forEach(item => {
            total += item.revenue;
            if (item.revenue > maxObj.revenue) maxObj = item;
            if (item.revenue < minObj.revenue) minObj = item;
        });

        const average = total / data.length;

        // Câu nhận xét AI đã được điều chỉnh chuẩn mô hình C2C
        const insightText = `Hệ thống ghi nhận tổng giá trị giao dịch đạt đỉnh vào ngày ${maxObj.date} với ${formatCurrency(maxObj.revenue)}. Ngược lại, ngày ${minObj.date} có nhịp độ trao đổi trầm lắng nhất. Trung bình mỗi ngày có ${formatCurrency(average)} được luân chuyển qua nền tảng.`;

        return { total, maxObj, minObj, average, insightText };
    }, [data]);

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const val = payload[0].value;

            const isMax = chartStats && val === chartStats.maxObj.revenue;
            const isMin = chartStats && val === chartStats.minObj.revenue;

            let textColor = "text-blue-600";
            if (isMax) textColor = "text-emerald-600";
            if (isMin) textColor = "text-rose-600";

            return (
                <div className="bg-white p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-50">
                    <p className="text-gray-500 text-sm mb-1">Ngày {label}</p>
                    <p className={`${textColor} font-bold text-lg`}>
                        {formatCurrency(val)}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) return (
        <div className="h-[450px] w-full flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-500 font-medium">Đang đồng bộ dữ liệu...</p>
        </div>
    );

    if (error) return (
        <div className="h-[450px] w-full flex items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-red-500 font-medium bg-red-50 px-6 py-3 rounded-full">{error}</p>
        </div>
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col h-full">

            {/* Header */}
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h2 style={{ color: '#374151' }} className="font-bold text-sm uppercase tracking-wider mb-2">
                        Tổng giá trị giao dịch
                    </h2>
                    <div className="text-4xl font-extrabold text-gray-900">
                        {chartStats ? formatCurrency(chartStats.total) : "0 ₫"}
                    </div>
                </div>
            </div>

            {/* AI Insight Box */}
            {chartStats && (
                <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-indigo-50 via-blue-50 to-emerald-50 border border-indigo-100 flex gap-4 items-start">
                    <div className="text-2xl mt-1">✨</div>
                    <div>
                        <h3 className="font-bold text-indigo-900 text-sm mb-1">AI Phân tích hiệu suất</h3>
                        <p className="text-indigo-800 text-sm leading-relaxed">
                            {chartStats.insightText}
                        </p>
                    </div>
                </div>
            )}

            {/* Khu vực vẽ biểu đồ */}
            <div className="h-[300px] w-full mt-auto">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 10, right: 10, left: 15, bottom: 20 }}
                            onMouseMove={(state) => {
                                if (state.isTooltipActive) setActiveIndex(state.activeTooltipIndex);
                                else setActiveIndex(-1);
                            }}
                            onMouseLeave={() => setActiveIndex(-1)}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />

                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
                                dy={15}
                            />

                            <YAxis
                                tickFormatter={formatYAxis}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
                                dx={-10}
                            />

                            <Tooltip content={<CustomTooltip/>} cursor={{ fill: 'transparent' }} />

                            <Bar
                                dataKey="revenue"
                                radius={[6, 6, 6, 6]}
                                barSize={36}
                                animationDuration={1000}
                            >
                                {data.map((entry, index) => {
                                    // Lưới an toàn 3
                                    if (!chartStats) return null;

                                    let cellColor = '#93c5fd';

                                    if (entry.revenue === chartStats.maxObj.revenue) {
                                        cellColor = '#10b981'; // Max -> Xanh ngọc
                                    } else if (entry.revenue === chartStats.minObj.revenue) {
                                        cellColor = '#f43f5e'; // Min -> Đỏ hồng
                                    }

                                    if (activeIndex === index) {
                                        if (entry.revenue === chartStats.maxObj.revenue) cellColor = '#059669';
                                        else if (entry.revenue === chartStats.minObj.revenue) cellColor = '#e11d48';
                                        else cellColor = '#3b82f6';
                                    }

                                    return (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={cellColor}
                                            className="transition-all duration-300 ease-in-out cursor-pointer"
                                        />
                                    );
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <span className="text-3xl mb-2">📊</span>
                        <p>Chưa có dữ liệu giao dịch</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RevenueChart;