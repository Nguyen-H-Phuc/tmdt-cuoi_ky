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
  // Đã là đường dẫn tuyệt đối → trả về luôn
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('/')) {
    return imageUrl;
  }
  // Nếu chưa cấu hình VITE_API_URL (API_BASE_URL vẫn là localhost):
  // Dùng cùng logic với ProductDetailPage – phục vụ ảnh từ thư mục public của Frontend
  // để tránh tình trạng trình duyệt gọi về localhost của máy người dùng khi đang xem trên deploy.
  if (API_BASE_URL.includes('localhost')) {
    return `/${imageUrl}`;
  }
  // Đã cấu hình VITE_API_URL đúng → trỏ về /uploads của Backend
  return `${API_BASE_URL}/uploads/${imageUrl}`;
};

export { API_BASE_URL };
export default apiClient;
