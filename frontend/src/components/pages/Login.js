import React, { useEffect, useState } from "react";
import "../../styles/pages/Login.css";
import FindAccountModal from "../modal/FindAccountModal";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


const Login = () => {
  // 입력값 state
  const [user_id, setUser_id] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isFindModalOpen, setFindModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8111/api/auth/login",
        {
          email: user_id,
          password: password,
        },
      );

      if (response.data.token) {

        localStorage.setItem("token", response.data.token);
              localStorage.setItem("nickname", response.data.nickname);

              // ⭐ 핵심: 서버가 보내준 실제 유저 번호를 저장해야 합니다!
              // 서버 응답 구조가 { userId: 5, token: "...", ... } 형태인지 확인하세요.
              localStorage.setItem("userId", response.data.userId);

        alert(`${response.data.nickname}님 환영합니다!`);
        navigate("/");
      }
    } catch (error) {
      alert("로그인에 실패했습니다. 아이디이나 비밀번호를 확인하세요.");
      console.log(error);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <div className="logo-area">
          <div className="temp-logo-icon">🐾</div>
          <span className="logo-text">꼬리살랑</span>
        </div>
        <p className="auth-desc">반가워요! 다시 만나서 기뻐요.</p>

        <p className="sub-title">반려견과 함께하는 특별한 시간</p>

        <form className="auth-form" onSubmit={handleLogin}>
          <h2>로그인</h2>

          <div className="input-group">
            <label>아이디</label>

            <input
              type="text"
              placeholder="아이디를 입력하세요"
              value={user_id}
              onChange={(e) => setUser_id(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div
            className="login-options"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginBottom: "30px",
            }}
          >
            <div
              className="remember-group"
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: "16px", height: "16px", cursor: "pointer" }}
              />
              <label
                htmlFor="remember"
                style={{
                  fontSize: "14px",
                  color: "#666",
                  cursor: "pointer",
                  marginBottom: 0,
                }}
              >
                로그인 상태 유지
              </label>
            </div>

            <div className="find-group">
              <span
                className="find-link"
                onClick={() => setFindModalOpen(true)}
                style={{ cursor: "pointer", fontSize: "14px", color: "#888" }}
              >
                이메일/비밀번호 찾기
              </span>
            </div>
          </div>

          <button type="submit" className="main-submit-btn login-btn">
            로그인
          </button>
        </form>

        <div className="divider">
          <span>또는</span>
        </div>

        <div className="social-auth-group">
          <button type="button" className="social-btn kakao">
            <i className="ri-chat-fill"></i> 카카오로 시작하기
          </button>
          <button type="button" className="social-btn naver">
            <span>N</span> 네이버로 시작하기
          </button>
          <button type="button" className="social-btn google">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
              alt="G"
            />
            구글로 시작하기
          </button>
        </div>

        <p className="bottom-link">
          아직 회원이 아니신가요? <Link to="/signup">회원가입</Link>
        </p>

        <FindAccountModal
          isOpen={isFindModalOpen}
          onClose={() => setFindModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Login;