import { useNavigate } from "react-router-dom";
import "../../styles/layout/Header.css";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo" onClick={() => navigate("/")}>꼬리살랑</div>

        <div className="header-search">
          <span>⌕</span>
          <input placeholder="어떤 반려견 카페를 찾고 있나요?" />
        </div>

        <div className="auth">
          <button onClick={() => navigate("/login")}>
            로그인
          </button>

          <button
            className="signup-btn"
            onClick={() => navigate("/signup")}
          >
            회원가입
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;