import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/layout/Header.css";

function Header() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 검색어 상태
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [window.location.pathname]);

  // 검색 실행
  const handleSearch = () => {
    const trimmed = keyword.trim();

    if (!trimmed) {
      navigate("/cafes");
      return;
    }

    navigate(`/cafes?keyword=${encodeURIComponent(trimmed)}`);
  };

  // 로그아웃
  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("nickname");
      localStorage.removeItem("role");

      setIsLoggedIn(false);

      alert("로그아웃 되었습니다.");

      navigate("/");
    }
  };

  return (
    <header className="header">
      <div className="header-inner">
        {/* 로고 */}
        <div className="logo" onClick={() => navigate("/")}>
          꼬리살랑
        </div>

        {/* 검색창 */}
        <div className="header-search">
          <span style={{ cursor: "pointer" }} onClick={handleSearch}>
            ⌕
          </span>

          <input
            placeholder="어떤 반려견 카페를 찾고 있나요?"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>

        {/* 로그인 / 회원가입 */}
        <div className="auth">
          {isLoggedIn ? (
            <>
              <button onClick={() => navigate("/mypage")}>마이페이지</button>

              <button className="signup-btn" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")}>로그인</button>

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
