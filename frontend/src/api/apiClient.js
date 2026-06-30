import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach JWT Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'null' && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return 'https://placehold.co/100x150?text=No+Image';
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('/')) {
    return imageUrl;
  }
  // Tự động fallback: nếu đang chạy online (deploy) mà API_BASE_URL lại trỏ về localhost
  // (do chưa cấu hình VITE_API_URL), dùng ảnh từ public của frontend để hiển thị ảnh mẫu.
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && API_BASE_URL.includes('localhost')) {
    return `/${imageUrl}`;
  }
  return `${API_BASE_URL}/uploads/${imageUrl}`;
};

export { API_BASE_URL };
export default apiClient;
