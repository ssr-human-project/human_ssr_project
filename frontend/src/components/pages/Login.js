import React, { useEffect, useState } from "react";
import "../../styles/pages/Login.css";
import FindAccountModal from "../modal/FindAccountModal";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api/axiosApi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFindModalOpen, setFindModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const data = await api.auth.me({ skipAuthRedirect: true });
        if (!mounted || !data?.userId) return;

        localStorage.setItem("userId", data.userId);
        localStorage.setItem("role", data.role ?? "USER");
        navigate("/", { replace: true });
      } catch {
        ["userId", "nickname", "role"].forEach((key) =>
          localStorage.removeItem(key),
        );
      }
    };

    checkSession();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email.trim() || !password) {
      setMessage("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await api.auth.login(email.trim(), password);

      if (!data?.userId) {
        setMessage("로그인 응답에 사용자 정보가 없습니다.");
        return;
      }

      localStorage.setItem("userId", data.userId);
      localStorage.setItem("nickname", data.nickname ?? data.name ?? "회원");
      localStorage.setItem("role", data.role ?? "USER");

      window.dispatchEvent(new Event("loginStatusChanged"));
      navigate("/", { replace: true });
    } catch (error) {
      console.error("로그인 실패:", error);

      const errorCode = error.response?.data?.errorCode;

      if (errorCode === "EMAIL_NOT_FOUND") {
        alert("아이디를 확인해주세요.");
        return;
      }

      if (errorCode === "PASSWORD_MISMATCH") {
        alert("비밀번호가 틀렸습니다.");
        return;
      }

      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <div className="logo-area">
          <div className="temp-logo-icon" aria-hidden="true">
            🐾
          </div>
          <span className="logo-text">꼬리사랑</span>
        </div>
        <p className="auth-desc">반려견과 함께하는 일상을 더 편하게</p>
        <p className="sub-title">계정에 로그인하고 서비스를 이용해보세요.</p>

        <form className="auth-form" onSubmit={handleLogin} noValidate>
          <h2>로그인</h2>

          <div className="input-group">
            <label htmlFor="login-email">이메일</label>
            <input
              id="login-email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="login-password">비밀번호</label>
            <input
              id="login-password"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <div className="login-options">
            <button
              type="button"
              className="text-link-button"
              onClick={() => setFindModalOpen(true)}
            >
              이메일/비밀번호 찾기
            </button>
          </div>

          {message && <p className="form-message error">{message}</p>}

          <button
            type="submit"
            className="main-submit-btn login-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </button>
        </form>

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
