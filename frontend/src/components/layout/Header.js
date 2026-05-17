import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/layout/Header.css";

function Header() {
  const navigate = useNavigate();

  // 💡 로그인 상태를 관리할 State 선언
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 💡 화면이 켜지거나 페이지를 이동할 때마다 로그인 토큰이 있는지 검사
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [window.location.pathname]); // 👈 주소(URL)가 바뀔 때마다 실시간으로 실행되는 안전장치

  // 💡 로그아웃 처리 함수
  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      // 로컬 스토리지에 저장되어 있던 회원 정보들 삭제
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("nickname");
      localStorage.removeItem("role");

      setIsLoggedIn(false); // 상태 변경
      alert("로그아웃 되었습니다.");
      navigate("/"); // 메인 페이지로 이동
    }
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo" onClick={() => navigate("/")}>꼬리살랑</div>

        <div className="header-search">
          <span>⌕</span>
          <input placeholder="어떤 반려견 카페를 찾고 있나요?" />
        </div>

        <div className="auth">
          {/* 💡 삼항연산자(? :)를 사용해 로그인 여부에 따라 다른 버튼을 렌더링합니다. */}
          {isLoggedIn ? (
            <>
              {/* 로그인이 성공했을 때 나오는 버튼 구성 */}
              <button onClick={() => navigate("/mypage")}>
                마이페이지
              </button>

              <button
                className="signup-btn"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              {/* 로그인이 안 되어 있을 때 나오는 기존 버튼 구성 */}
              <button onClick={() => navigate("/login")}>
                로그인
              </button>

              <button
                className="signup-btn"
                onClick={() => navigate("/signup")}
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;