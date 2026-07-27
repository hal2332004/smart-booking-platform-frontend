import axios from 'axios';

// Định nghĩa sẵn 2 mốc URL cho môi trường Local và Production
export const LOCAL_API_URL = 'http://localhost:5000/api';
export const PRODUCTION_API_URL = 'https://smart-booking-platform-backend.onrender.com/api';

// Lấy Base URL từ biến môi trường VITE_API_BASE_URL trong file .env
// Nếu chưa khai báo trong .env sẽ mặc định dùng LOCAL_API_URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || LOCAL_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor: Đính kèm Supabase JWT access token vào mỗi request (nếu người dùng đã đăng nhập)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('supabase.auth.token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

