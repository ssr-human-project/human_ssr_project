import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8111/api',
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// [응답 인터셉터] - 추가 추천
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 세션이 만료되어 401 에러가 나면 로그인 페이지로 강제 이동
    if (error.response && error.response.status === 401) {
      ["userId", "nickname", "role"].forEach((key) => localStorage.removeItem(key));
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
