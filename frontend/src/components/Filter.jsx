import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, MapPin, ChevronDown, Check } from 'lucide-react';
import axios from 'axios';

const Filter = ({ filters, setFilters }) => {
    const [categories, setCategories] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null); // 'price', 'category', 'condition', or null
    
    // Temporary states for price inputs before applying
    const [tempPriceMin, setTempPriceMin] = useState(filters?.priceMin || '');
    const [tempPriceMax, setTempPriceMax] = useState(filters?.priceMax || '');
    
    const filterContainerRef = useRef(null);

    const universities = [
        "Đại học Bách Khoa",
        "Đại học Quốc Gia",
        "Đại học Kinh tế Quốc dân",
        "Đại học Ngoại Thương",
        "Đại học FPT",
        "Đại học Cần Thơ",
        "Đại học Sư phạm Kỹ thuật",
        "Đại học Tôn Đức Thắng",
        "Đại học Công nghiệp",
        "Đại học Duy Tân",
        "Đại học Đà Nẵng"
    ];

    // Fetch categories dynamically from backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/categories`);
                setCategories(response.data);
            } catch (error) {
                console.error("Lỗi lấy danh mục:", error);
            }
        };
        fetchCategories();
    }, []);

    // Sync temp price states when parent filters change (e.g. Cleared)
    useEffect(() => {
        setTempPriceMin(filters?.priceMin || '');
        setTempPriceMax(filters?.priceMax || '');
    }, [filters?.priceMin, filters?.priceMax]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterContainerRef.current && !filterContainerRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLocationClick = (loc) => {
        if (filters?.location === loc) {
            setFilters(prev => ({ ...prev, location: 'Toàn quốc' }));
        } else {
            setFilters(prev => ({ ...prev, location: loc }));
        }
    };

    // Helper to format short price labels on filter button
    const formatPrice = (priceVal) => {
        if (priceVal === '' || priceVal === null || priceVal === undefined) return '';
        const num = Number(priceVal);
        if (num >= 1000000) {
            return `${(num / 1000000).toLocaleString('vi-VN')}tr`;
        }
        return `${(num / 1000).toLocaleString('vi-VN')}k`;
    };

    const hasActiveFilters = (filters?.location !== 'Toàn quốc') || 
                             (filters?.categoryId !== null && filters?.categoryId !== undefined) || 
                             (filters?.priceMin !== '') || 
                             (filters?.priceMax !== '') || 
                             (filters?.status !== '');

    return (
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 relative" ref={filterContainerRef}>
            {/* Top Row: Breadcrumbs / Navigation */}
            <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-4 overflow-x-auto whitespace-nowrap no-scrollbar">
                <span className="hover:text-yellow-600 cursor-pointer transition-colors" onClick={() => setFilters({ location: 'Toàn quốc', categoryId: null, priceMin: '', priceMax: '', status: '' })}>Chợ Tốt Sinh Viên</span>
                <ChevronRight size={14} />
                <span className="hover:text-yellow-600 cursor-pointer transition-colors" onClick={() => setFilters(prev => ({ ...prev, categoryId: null }))}>Mua Bán</span>
                <ChevronRight size={14} />
                <span className="text-gray-900 font-semibold">{filters?.location || 'Toàn quốc'}</span>
            </div>

            {/* Middle Row: Filter Categories */}
            <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 relative">
                    
                    {/* Price Filter Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => setActiveDropdown(activeDropdown === 'price' ? null : 'price')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-xs font-bold whitespace-nowrap focus:outline-none cursor-pointer ${
                                filters?.priceMin !== '' || filters?.priceMax !== ''
                                ? 'border-yellow-500 bg-yellow-50 text-yellow-600'
                                : 'border-gray-200 hover:border-yellow-500 hover:bg-[#FFF9E5] text-gray-700'
                            }`}
                        >
                            {filters?.priceMin !== '' || filters?.priceMax !== '' 
                                ? `Giá: ${formatPrice(filters.priceMin)} - ${formatPrice(filters.priceMax)}` 
                                : 'Giá'}
                            <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'price' ? 'rotate-180' : ''}`} />
                        </button>

                        {activeDropdown === 'price' && (
                            <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-100 rounded-lg shadow-lg p-4 z-50 animate-in fade-in duration-100">
                                <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase">Khoảng giá (VND)</h4>
                                <div className="flex gap-2 mb-3">
                                    <input 
                                        type="number" 
                                        placeholder="Tối thiểu"
                                        value={tempPriceMin}
                                        onChange={(e) => setTempPriceMin(e.target.value)}
                                        className="w-1/2 px-2.5 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-yellow-500"
                                    />
                                    <span className="text-gray-400 self-center text-xs">-</span>
                                    <input 
                                        type="number" 
                                        placeholder="Tối đa"
                                        value={tempPriceMax}
                                        onChange={(e) => setTempPriceMax(e.target.value)}
                                        className="w-1/2 px-2.5 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-yellow-500"
                                    />
                                </div>
                                
                                {/* Quick ranges */}
                                <div className="flex flex-col gap-1.5 mb-3 border-t border-gray-100 pt-2">
                                    {[
                                        { label: 'Dưới 500.000 đ', min: 0, max: 500000 },
                                        { label: '500k - 2 triệu', min: 500000, max: 2000000 },
                                        { label: '2 triệu - 5 triệu', min: 2000000, max: 5000000 },
                                        { label: '5 triệu - 10 triệu', min: 5000000, max: 10000000 },
                                        { label: 'Trên 10 triệu', min: 10000000, max: 999000000 }
                                    ].map((range, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setTempPriceMin(range.min);
                                                setTempPriceMax(range.max);
                                            }}
                                            className="text-left text-xs text-gray-600 hover:text-yellow-600 hover:bg-yellow-50/30 py-1 px-1.5 rounded transition-all"
                                        >
                                            {range.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex justify-between gap-2 border-t border-gray-100 pt-3">
                                    <button 
                                        onClick={() => {
                                            setTempPriceMin('');
                                            setTempPriceMax('');
                                            setFilters(prev => ({ ...prev, priceMin: '', priceMax: '' }));
                                            setActiveDropdown(null);
                                        }}
                                        className="px-3 py-1.5 text-xs border border-gray-200 rounded text-gray-500 hover:bg-gray-50 font-medium cursor-pointer"
                                    >
                                        Xóa lọc
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setFilters(prev => ({ ...prev, priceMin: tempPriceMin, priceMax: tempPriceMax }));
                                            setActiveDropdown(null);
                                        }}
                                        className="px-3 py-1.5 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded font-bold cursor-pointer"
                                    >
                                        Áp dụng
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Category Filter Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => setActiveDropdown(activeDropdown === 'category' ? null : 'category')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-xs font-bold whitespace-nowrap focus:outline-none cursor-pointer ${
                                filters?.categoryId !== null && filters?.categoryId !== undefined
                                ? 'border-yellow-500 bg-yellow-50 text-yellow-600'
                                : 'border-gray-200 hover:border-yellow-500 hover:bg-[#FFF9E5] text-gray-700'
                            }`}
                        >
                            {filters?.categoryId !== null && filters?.categoryId !== undefined
                                ? (categories.find(c => c.categoryId === filters.categoryId)?.categoryName || 'Danh mục')
                                : 'Danh mục'}
                            <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'category' ? 'rotate-180' : ''}`} />
                        </button>

                        {activeDropdown === 'category' && (
                            <div className="absolute left-0 mt-2 w-72 bg-white border border-gray-100 rounded-lg shadow-lg py-2 max-h-80 overflow-y-auto z-50 animate-in fade-in duration-100">
                                <button
                                    onClick={() => {
                                        setFilters(prev => ({ ...prev, categoryId: null }));
                                        setActiveDropdown(null);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-xs md:text-sm transition-colors hover:bg-gray-50 flex items-center justify-between cursor-pointer ${
                                        filters?.categoryId === null ? 'text-yellow-600 bg-yellow-50/50 font-bold' : 'text-gray-700'
                                    }`}
                                >
                                    <span>Tất cả danh mục</span>
                                    {filters?.categoryId === null && <Check size={16} className="text-yellow-500" />}
                                </button>
                                <div className="border-b border-gray-100 my-1"></div>
                                {categories.map(cat => (
                                    <button
                                        key={cat.categoryId}
                                        onClick={() => {
                                            setFilters(prev => ({ ...prev, categoryId: cat.categoryId }));
                                            setActiveDropdown(null);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-xs md:text-sm transition-colors hover:bg-gray-50 flex items-center justify-between cursor-pointer ${
                                            filters?.categoryId === cat.categoryId ? 'text-yellow-600 bg-yellow-50/50 font-bold' : 'text-gray-700'
                                        }`}
                                    >
                                        <span>{cat.categoryName}</span>
                                        {filters?.categoryId === cat.categoryId && <Check size={16} className="text-yellow-500" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Condition Filter Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => setActiveDropdown(activeDropdown === 'condition' ? null : 'condition')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-xs font-bold whitespace-nowrap focus:outline-none cursor-pointer ${
                                filters?.status !== ''
                                ? 'border-yellow-500 bg-yellow-50 text-yellow-600'
                                : 'border-gray-200 hover:border-yellow-500 hover:bg-[#FFF9E5] text-gray-700'
                            }`}
                        >
                            {filters?.status === 'available' ? 'Có sẵn' : filters?.status === 'sold' ? 'Đã bán' : 'Tình trạng'}
                            <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'condition' ? 'rotate-180' : ''}`} />
                        </button>

                        {activeDropdown === 'condition' && (
                            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-1.5 z-50 animate-in fade-in duration-100">
                                {[
                                    { value: '', label: 'Tất cả tình trạng' },
                                    { value: 'available', label: 'Có sẵn' },
                                    { value: 'sold', label: 'Đã bán' }
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            setFilters(prev => ({ ...prev, status: opt.value }));
                                            setActiveDropdown(null);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-xs md:text-sm transition-colors hover:bg-gray-50 flex items-center justify-between cursor-pointer ${
                                            filters?.status === opt.value ? 'text-yellow-600 bg-yellow-50/50 font-bold' : 'text-gray-700'
                                        }`}
                                    >
                                        <span>{opt.label}</span>
                                        {filters?.status === opt.value && <Check size={16} className="text-yellow-500" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {hasActiveFilters && (
                    <button
                        onClick={() => {
                            setFilters({
                                location: 'Toàn quốc',
                                categoryId: null,
                                priceMin: '',
                                priceMax: '',
                                status: ''
                            });
                            setTempPriceMin('');
                            setTempPriceMax('');
                            setActiveDropdown(null);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition-all text-xs font-bold whitespace-nowrap focus:outline-none cursor-pointer"
                    >
                        Xóa tất cả lọc
                    </button>
                )}
            </div>

            {/* Bottom Row: Location Filter by Universities */}
            <div className="flex items-center gap-3 relative border-t border-gray-50 pt-3 mt-1">
                <div className="flex items-center gap-1.5 shrink-0 text-xs font-bold text-gray-900">
                    <MapPin size={15} className="text-gray-400" />
                    <span>Trường:</span>
                </div>

                <div className="flex-1 flex items-center gap-2 overflow-hidden relative">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth w-full py-0.5">
                        <button 
                            onClick={() => setFilters(prev => ({ ...prev, location: 'Toàn quốc' }))}
                            className={`px-3 py-1.5 rounded-full border transition-all text-xs whitespace-nowrap font-medium cursor-pointer ${
                                filters?.location === 'Toàn quốc' 
                                ? 'border-yellow-500 bg-yellow-500 text-white font-semibold' 
                                : 'border-gray-200 bg-white hover:border-yellow-500 hover:text-yellow-600'
                            }`}
                        >
                            Toàn quốc
                        </button>
                        {universities.map((uni, index) => (
                            <button 
                                key={index}
                                onClick={() => handleLocationClick(uni)}
                                className={`px-3 py-1.5 rounded-full border transition-all text-xs whitespace-nowrap font-medium cursor-pointer ${
                                    filters?.location === uni
                                    ? 'border-yellow-500 bg-yellow-500 text-white font-semibold' 
                                    : 'border-gray-200 bg-white hover:border-yellow-500 hover:text-yellow-600'
                                }`}
                            >
                                {uni}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filter;
