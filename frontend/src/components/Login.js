import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  // 입력값 state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 로그인 함수
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8111/api/auth/login",
        {
          email: email,
          password: password,
        },
      );

      // 로그인 성공
      if (response.data.token) {
        // 토큰 저장
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("nickname", response.data.nickname);

        alert(`${response.data.nickname}님 환영합니다!`);

        // 메인페이지 이동
        window.location.href = "/";
      }
    } catch (error) {
      alert("로그인에 실패했습니다. 이메일이나 비밀번호를 확인하세요.");
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

        <p className="sub-title">반려견과 함께하는 특별한 시간</p>

        <form className="auth-form" onSubmit={handleLogin}>
          <h2>로그인</h2>

          {/* 이메일 */}
          <div className="input-group">
            <label>이메일</label>

            <input
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* 비밀번호 */}
          <div className="input-group">
            <label>비밀번호</label>

            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              로그인 상태 유지
            </label>

            <div className="find-group">
              <a href="#/" className="find-pw">
                아이디 찾기
              </a>

              <span className="divider-bar">|</span>

              <a href="#/" className="find-pw">
                비밀번호 찾기
              </a>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <button type="submit" className="main-submit-btn login-btn">
            로그인
          </button>
        </form>

        {/* 구분선 */}
        <div className="divider">
          <span>또는</span>
        </div>

        {/* 소셜 로그인 */}
        <div className="social-auth-group">
          <button type="button" className="social-btn kakao">
            <i className="ri-chat-fill"></i>
            카카오로 시작하기
          </button>

          <button type="button" className="social-btn naver">
            <span>N</span>
            네이버로 시작하기
          </button>

          <button type="button" className="social-btn google">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
              alt="G"
            />
            구글로 시작하기
          </button>
        </div>

        {/* 회원가입 */}
        <p className="bottom-link">
          아직 회원이 아니신가요?{" "}
          <Link to="/signup" className="signup-link">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
