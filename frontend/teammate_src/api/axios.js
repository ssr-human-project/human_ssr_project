import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8111/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// [요청 인터셉터]
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Bearer 다음에 한 칸 띄우는 것 잊지 마세요!
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// [응답 인터셉터] - 추가 추천
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 만약 토큰이 만료되어 401 에러가 나면 로그인 페이지로 강제 이동
    if (error.response && error.response.status === 401) {
      localStorage.clear(); // 깔끔하게 비우기
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;