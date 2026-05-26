import React from 'react';
import { ChevronRight, MapPin, Filter as FilterIcon, ChevronDown } from 'lucide-react';

const Filter = () => {
    const locations = [
        "Tp Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Bình Dương", "Đồng Nai", 
        "Cần Thơ", "Hải Phòng", "Long An", "Bà Rịa - Vũng Tàu"
    ];

    const filterCategories = [
        { id: 'price', label: 'Giá', icon: <ChevronDown size={14} /> },
        { id: 'category', label: 'Danh mục', icon: <ChevronDown size={14} /> },
        { id: 'condition', label: 'Tình trạng', icon: <ChevronDown size={14} /> },
        { id: 'more', label: 'Lọc khác', icon: <FilterIcon size={14} /> },
    ];

    return (
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
            {/* Top Row: Breadcrumbs / Navigation */}
            <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-4 overflow-x-auto whitespace-nowrap no-scrollbar">
                <span className="hover:text-[#FFBA00] cursor-pointer">Chợ Tốt</span>
                <ChevronRight size={14} />
                <span className="hover:text-[#FFBA00] cursor-pointer">Mua Bán</span>
                <ChevronRight size={14} />
                <span className="text-gray-900 font-medium">Toàn quốc</span>
            </div>

            {/* Middle Row: Filter Categories */}
            <div className="flex items-center gap-3 mb-4 overflow-x-auto no-scrollbar">
                {filterCategories.map((cat) => (
                    <button 
                        key={cat.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#FFBA00] hover:bg-[#FFF9E5] transition-all text-xs font-bold text-gray-700 whitespace-nowrap"
                    >
                        {cat.label}
                        {cat.icon}
                    </button>
                ))}
            </div>

            {/* Bottom Row: Location Filter */}
            <div className="flex items-center gap-3 relative group">
                <div className="flex items-center gap-2 shrink-0 text-xs font-bold text-gray-900">
                    <MapPin size={16} className="text-gray-400" />
                    <span>Khu vực:</span>
                </div>

                <div className="flex-1 flex items-center gap-2 overflow-hidden relative">
                    {/* Scrollable Container */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
                        {locations.map((loc, index) => (
                            <button 
                                key={index}
                                className="px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#FFBA00] hover:text-[#FFBA00] transition-all text-xs whitespace-nowrap bg-white"
                            >
                                {loc}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filter;
