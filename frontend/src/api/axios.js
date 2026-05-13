import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8111/api', // 백엔드 서버 주소
  timeout: 5000,
});

// 요청 인터셉터: 로컬 스토리지에 토큰이 있다면 모든 요청 헤더에 자동으로 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;