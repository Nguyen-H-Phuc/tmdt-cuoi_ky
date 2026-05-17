import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isLogin, setIsLogin] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken) {
            setToken(storedToken);
            setIsLogin(true);
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
    }, []);

    const login = useCallback((newToken, userData) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        setIsLogin(true);
        
        // Tự động xóa token trên URL nếu có để tránh bị auto-login lại
        if (window.location.search.includes('token')) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const logout = useCallback(async () => {
        // Cập nhật trạng thái cục bộ ngay lập tức để UI thay đổi tức thì
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsLogin(false);

        try {
            // Gọi API ở background, không dùng await để không chặn UI
            axios.post("http://localhost:8080/api/auth/logout");
        } catch (error) {
            console.error("Lỗi khi gọi API logout:", error);
        }
    }, []);

    const value = useMemo(() => ({
        user, token, isLogin, login, logout
    }), [user, token, isLogin, login, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
