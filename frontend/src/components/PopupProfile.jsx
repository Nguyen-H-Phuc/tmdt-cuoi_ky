import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

// Định nghĩa các SVG gốc từ Figma để tái sử dụng
const ICONS = {
    EDIT: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><g clipPath="url(#clip0_136_18)"><path d="M27 14C27 6.8203 21.1797 1 14 1C6.8203 1 1 6.8203 1 14C1 21.1797 6.8203 27 14 27C21.1797 27 27 21.1797 27 14Z" fill="#222222"/><path d="M27 14C27 6.8203 21.1797 1 14 1C6.8203 1 1 6.8203 1 14C1 21.1797 6.8203 27 14 27C21.1797 27 27 21.1797 27 14Z" stroke="white" strokeWidth="2"/><path d="M19.4914 19.5072L19.4339 19.5044H13.9996C13.6872 19.5045 13.4337 19.7647 13.4336 20.0854C13.4336 20.4063 13.6871 20.6663 13.9996 20.6665H19.4339L19.4914 20.6636C19.7769 20.634 19.9999 20.3864 19.9999 20.0854C19.9998 19.7845 19.7769 19.5368 19.4914 19.5072Z" fill="white"/><path fillRule="evenodd" clipRule="evenodd" d="M15.8813 8.72532C16.8235 7.75823 18.3514 7.75823 19.2936 8.72532L19.3787 8.81781C20.2069 9.75864 20.207 11.1947 19.3787 12.1355L19.3787 12.1355L19.2936 12.2274L19.2864 12.2348L12.3558 19.1091C12.2908 19.1736 12.2113 19.2209 12.1248 19.2476L8.72857 20.2939C8.5292 20.3552 8.31306 20.2991 8.16586 20.148C8.01868 19.997 7.96408 19.7751 8.0238 19.5704L9.04254 16.0842L9.06576 16.0189C9.09269 15.9554 9.13082 15.8971 9.17797 15.847L15.8747 8.7327L15.8813 8.72532ZM9.80478 17.0352L11.2105 18.2721L12.1435 17.5623L10.4217 16.0473L9.80478 17.0352Z" fill="white"/></g><defs><clipPath id="clip0_136_18"><rect width="28" height="28" fill="white"/></clipPath></defs></svg>
    ),
    SAVED_POSTS: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M3.80577 6.20659C4.7059 5.30673 5.92658 4.80122 7.19936 4.80122C8.47215 4.80122 9.69283 5.30673 10.593 6.20659L11.9994 7.61179L13.4058 6.20659C13.8485 5.74815 14.3782 5.38247 14.9638 5.13091C15.5494 4.87934 16.1793 4.74693 16.8166 4.74139C17.454 4.73585 18.086 4.8573 18.6759 5.09865C19.2658 5.34 19.8018 5.69641 20.2525 6.1471C20.7031 6.59778 21.0596 7.13371 21.3009 7.72361C21.5423 8.31352 21.6637 8.94558 21.6582 9.58292C21.6526 10.2203 21.5202 10.8501 21.2686 11.4357C21.0171 12.0214 20.6514 12.551 20.193 12.9938L11.9994 21.1886L3.80577 12.9938C2.9059 12.0937 2.40039 10.873 2.40039 9.60019C2.40039 8.32741 2.9059 7.10673 3.80577 6.20659Z" fill="#8C8C8C"/></svg>,
    SAVED_SEARCH: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M5.72548 3.0995C5.9974 2.82757 6.36622 2.6748 6.75078 2.6748H17.2508C17.6353 2.6748 18.0042 2.82757 18.2761 3.0995C18.548 3.37143 18.7008 3.74024 18.7008 4.1248V20.6248C18.7008 20.8793 18.5627 21.1137 18.3401 21.2371C18.1176 21.3604 17.8456 21.3533 17.6298 21.2184L12.0008 17.7003L6.37178 21.2184C6.37178 21.2184 6.15599 21.3533 5.88401 21.3604 5.66144 21.2371C5.43888 21.1137 5.30078 20.8793 5.30078 20.6248V4.1248C5.30078 3.74024 5.45355 3.37143 5.72548 3.0995Z" fill="#8C8C8C"/></svg>,
    HISTORY: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 6.91211C11.3864 6.91211 10.8887 7.40979 10.8887 8.02344V13.25C10.8887 13.7281 11.1949 14.1524 11.6484 14.3037L15.3984 15.5537L15.5078 15.585C16.0573 15.7082 16.6217 15.3972 16.8037 14.8516C16.9856 14.3057 16.7207 13.7184 16.207 13.4873L16.1016 13.4463L13.1113 12.4492V8.02344C13.1113 7.40979 12.6136 6.91211 12 6.91211Z" fill="#8C8C8C"/></svg>,
    RATINGS: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M11.4956 2.71381C11.7021 2.29527 12.299 2.29527 12.5055 2.71381L15.1795 8.13194C15.2616 8.29814 15.4201 8.41334 15.6036 8.43999L21.5828 9.30883C22.0447 9.37595 22.2291 9.94357 21.8949 10.2694L17.5683 14.4868C17.4355 14.6162 17.375 14.8026 17.4063 14.9852L18.4277 20.9403C18.5066 21.4004 18.0237 21.7512 17.6106 21.534L12.2626 18.7224C12.0986 18.6361 11.9026 18.6361 11.7385 18.7224L6.3905 21.534C5.97738 21.7512 5.49453 21.4004 5.57343 20.9403L6.59481 14.9852C6.62614 14.8026 6.56557 14.6162 6.43285 14.4868L2.10622 10.2694C1.77199 9.94357 1.95642 9.37595 2.41832 9.30883L8.39757 8.43999C8.58099 8.41334 8.73955 8.29814 8.82158 8.13194L11.4956 2.71381Z" fill="#8C8C8C"/></svg>,
    CHOTOT_COIN: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><g clipPath="url(#clip0_136_110)"><path d="M12.1807 0.584961C9.98073 0.584961 7.98073 1.18496 6.26073 2.22496C6.22073 2.22496 6.22073 2.26496 6.18073 2.26496C6.10073 2.26496 6.10073 2.30496 6.10073 2.30496C5.90073 2.50496 5.90073 2.78496 6.06073 2.98496H6.10073V3.02496C6.26073 3.14496 6.46073 3.14496 6.62073 3.06496L6.66073 3.02496C7.10073 2.78496 7.50073 2.54496 7.94073 2.34496C9.26073 1.78496 10.6607 1.54496 12.0607 1.54496C13.4607 1.54496 14.9007 1.82496 16.1807 2.34496C17.4607 2.86496 18.5807 3.62496 19.5807 4.58496C20.5807 5.54496 21.3407 6.66496 21.9007 7.98496C22.4607 9.30496 22.7007 10.665 22.7007 12.105C22.7007 13.545 22.4207 14.945 21.9007 16.225C21.7007 16.665 21.5007 17.065 21.2207 17.505C21.2207 17.545 21.1807 17.545 21.1807 17.585C21.1007 17.745 21.1007 17.985 21.2207 18.105L21.3007 18.145L21.3407 18.185C21.5407 18.345 21.8207 18.345 22.0207 18.145L22.0607 18.105C22.1007 18.065 22.1007 18.025 22.1007 18.025C23.1007 16.305 23.7407 14.305 23.7407 12.145C23.8207 5.74496 18.6207 0.584961 12.1807 0.584961Z" fill="#9C6C18"/><path d="M12.0401 0.399902C9.84011 0.399902 7.84011 0.999902 6.12011 2.0399C6.08011 2.0399 6.08011 2.0799 6.04011 2.0799C6.00011 2.0799 6.0001 2.1199 5.9601 2.1199C5.7601 2.3199 5.76011 2.5999 5.92011 2.7999H5.9601L6.00011 2.8399C6.16011 2.9599 6.36011 2.9599 6.52011 2.8799L6.5601 2.8399C7.0001 2.5999 7.40011 2.3599 7.84011 2.1599C9.16011 1.5999 10.5601 1.3599 11.9601 1.3599C13.3601 1.3599 14.8001 1.6399 16.0801 2.1599C17.3601 2.7199 18.4801 3.4399 19.4801 4.3999C20.4801 5.3599 21.2401 6.4799 21.8001 7.7999C22.3601 9.1199 22.6001 10.4799 22.6001 11.9199C22.6001 13.3599 22.3201 14.7599 21.8001 16.0399C21.6001 16.4799 21.4001 16.8799 21.1201 17.3199C21.1201 17.3599 21.0801 17.3599 21.0801 17.3999C21.0001 17.5599 21.0001 17.7999 21.1201 17.9199L21.1601 17.9599L21.2001 17.9999C21.4001 18.1599 21.6801 18.1599 21.8801 17.9599L21.9201 17.9199C21.9601 17.8799 21.9601 17.8399 21.9601 17.8399C22.9601 16.1599 23.6001 14.1199 23.6001 11.9999C23.7201 5.5599 18.4801 0.399902 12.0401 0.399902Z" fill="url(#p0)" stroke="url(#p1)" strokeWidth="0.1"/></g><defs><linearGradient id="p0" x1="19.6879" y1="19.0247" x2="11.9057" y2="-1.33197" gradientUnits="userSpaceOnUse"><stop offset="0.15" stopColor="#FFE182"/><stop offset="0.36" stopColor="#D98C21"/><stop offset="0.53" stopColor="#FFC737"/><stop offset="1" stopColor="#FDFDD1"/></linearGradient><linearGradient id="p1" x1="19.6755" y1="18.9928" x2="12.2094" y2="-0.539019" gradientUnits="userSpaceOnUse"><stop stopColor="#9F7623"/><stop offset="1" stopColor="#FFE799"/></linearGradient><clipPath id="clip0_136_110"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>
    ),
    PRO: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><g clipPath="url(#clip0_136_141)"><path d="M16 0H8C3.58172 0 0 3.58172 0 8V16C0 20.4183 3.58172 24 8 24H16C20.4183 24 24 20.4183 24 16V8C24 3.58172 20.4183 0 16 0Z" fill="url(#p2)"/><path d="M16 0H8C3.58172 0 0 3.58172 0 8V16C0 20.4183 3.58172 24 8 24H16C20.4183 24 24 20.4183 24 16V8C24 3.58172 20.4183 0 16 0Z" fill="url(#p3)"/><path d="M17.7158 15.6182C17.25 15.6182 16.8135 15.5347 16.4062 15.3677C16.002 15.1978 15.646 14.9619 15.3384 14.6602C15.0337 14.3584 14.7949 14.0068 14.6221 13.6055C14.4521 13.2012 14.3672 12.7676 14.3672 12.3047C17.7026 14.3042 17.9722 14.3042 18.2227 14.2529 18.4541 14.1504" fill="white"/></g><defs><linearGradient id="p2" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#FF8E97"/><stop offset="1" stopColor="#E21115"/></linearGradient><linearGradient id="p3" x1="0.15" y1="0" x2="23.02" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#3E3E3E"/><stop offset="1"/></linearGradient><clipPath id="clip0_136_141"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>
    ),
    LOGOUT: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M8.78056 3.6001H5.07468C4.51304 3.6001 3.97441 3.82135 3.57728 4.21517C3.18014 4.609 2.95703 5.14314 2.95703 5.7001V18.3001C2.95703 18.8571 3.18014 19.3912 3.57728 19.785C3.97441 20.1788 4.51304 20.4001 5.07468 20.4001H8.78056M9.04375 12.0001H21.0438M16.4586 16.8001L21.0438 12.0001L16.4586 7.2001" stroke="#F42D5B" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    ARROW_RIGHT: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6.71675 3.90278C6.9771 3.64243 7.3992 3.64243 7.65955 3.90278L13.2846 9.52776C13.5449 9.78817 13.5449 10.2103 13.2846 10.4706L7.65955 16.0956C7.3992 16.3559 6.9771 16.3559 6.71675 16.0956C6.4564 15.8353 6.4564 15.4132 6.71675 15.1528L11.8703 9.99917L6.71675 4.84559C6.4564 4.58524 6.4564 4.16313 6.71675 3.90278Z" fill="#8C8C8C"/></svg>,
};

const MenuItem = ({ icon, label, extra, isLogout, onClick }) => (
    <div 
        onClick={onClick}
        className="flex items-center justify-between px-4 py-3 bg-white hover:bg-neutral-50 cursor-pointer transition-colors border-b border-neutral-50 last:border-none"
    >
        <div className="flex items-center gap-3">
            <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
            <span className={`text-base font-bold leading-6 ${isLogout ? 'text-rose-500' : 'text-zinc-600'}`}>
                {label}
            </span>
        </div>
        <div className="flex items-center gap-2">
            {extra}
            {ICONS.ARROW_RIGHT}
        </div>
    </div>
);

const SectionHeader = ({ title }) => (
    <div className="w-full px-3 py-2.5 bg-neutral-100">
        <h3 className="text-neutral-400 text-sm font-bold leading-6 uppercase tracking-tight">
            {title}
        </h3>
    </div>
);

const PopupProfile = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const fullName = user?.fullName || "Khách";
    const avatarUrl = user?.avatar || "https://placehold.co/80x80";

    const handleLogout = (e) => {
        e.stopPropagation();
        logout(); 
        // Thay vì dùng navigate của React Router, ta ép trình duyệt tải lại trang luôn
        // Điều này đảm bảo toàn bộ state, URL params, và bộ nhớ đệm được dọn sạch 100%
        // Chuyển hướng về trang chủ thay vì trang login
        window.location.href = "/";
    };

    return (
        <>
            {/* Backdrop to close on click outside */}
            <div className="fixed inset-0 z-[90]" onClick={onClose}></div>
            
            <div 
                className="absolute top-[64px] right-4 w-96 bg-neutral-100 rounded-xl shadow-2xl border-4 border-white overflow-hidden flex flex-col z-[100] max-h-[calc(100vh-100px)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* User Profile Section (Fixed) */}
                <div className="shrink-0 p-5 flex flex-col items-center gap-4">
                    <div className="relative">
                        <img className="w-20 h-20 rounded-full border border-neutral-200 object-cover" src={avatarUrl} alt="Avatar" />
                        <div className="absolute bottom-0 right-0 transform translate-x-1 translate-y-1">
                            {ICONS.EDIT}
                        </div>
                    </div>

                    <div className="text-center">
                        <h2 className="text-neutral-800 text-lg font-bold leading-6">{fullName}</h2>
                        <div className="flex gap-4 mt-2 justify-center">
                            <span className="text-sm text-neutral-400">Người theo dõi <b className="text-neutral-800 font-medium">0</b></span>
                            <span className="text-sm text-neutral-400">Đang theo dõi <b className="text-neutral-800 font-medium">0</b></span>
                        </div>
                    </div>

                    {/* Wallet Info */}
                    <div className="w-full bg-white p-4 rounded-xl space-y-4 shadow-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-neutral-400 text-xs font-medium uppercase">Đồng Tốt</span>
                            <div className="flex items-center gap-1">
                                <span className="text-neutral-800 text-sm font-bold">0</span>
                                <div className="w-5 h-5 flex items-center justify-center scale-90">{ICONS.CHOTOT_COIN}</div>
                            </div>
                        </div>
                        <button className="w-full h-8 bg-yellow-400 hover:bg-yellow-500 rounded-lg text-neutral-800 text-sm font-bold transition-all active:scale-[0.98]">
                            Nạp ngay
                        </button>
                    </div>
                </div>

                {/* Menu List (Scrollable) */}
                <div className="flex-1 overflow-y-auto">
                    <SectionHeader title="Tiện ích" />
                    <MenuItem label="Tin đăng đã lưu" icon={ICONS.SAVED_POSTS} />
                    <MenuItem label="Tìm kiếm đã lưu" icon={ICONS.SAVED_SEARCH} />
                    <MenuItem label="Lịch sử xem tin" icon={ICONS.HISTORY} />
                    <MenuItem label="Đánh giá từ tôi" icon={ICONS.RATINGS} />

                    <SectionHeader title="Dịch vụ trả phí" />
                    <MenuItem label="Đồng Tốt" icon={ICONS.CHOTOT_COIN} />
                    <MenuItem label="Gói PRO" icon={ICONS.PRO} />
                    <MenuItem
                        label="Cửa hàng / chuyên trang"
                        icon={ICONS.HISTORY}
                        extra={<span className="bg-zinc-100 text-neutral-800 text-[10px] px-2 py-1 rounded-full font-bold">Tạo ngay</span>}
                    />

                    <SectionHeader title="Khác" />
                    <MenuItem label="Cài đặt tài khoản" icon={ICONS.HISTORY} />
                    <MenuItem label="Đăng xuất" icon={ICONS.LOGOUT} isLogout onClick={handleLogout} />
                    {/* Padding bottom to ensure space */}
                    <div className="h-4"></div>
                </div>
            </div>
        </>
    );
};

export default PopupProfile;