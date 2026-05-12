import React from "react";
import "./Signup.css";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <div className="logo-area">
          <div className="temp-logo-icon">🐾</div>
          <span className="logo-text">꼬리살랑</span>
        </div>
        <p className="sub-title">반려견과 함께하는 특별한 시간</p>

        <form className="auth-form">
          <h2>회원가입</h2>

          <div className="input-group">
            <label>아이디</label>
            <input
              type="text"
              name="user_id"
              placeholder="사용할 아이디를 입력하세요"
            />
          </div>

          <div className="input-group">
            <label>이름</label>
            <input
              type="text"
              name="username"
              placeholder="본명을 입력하세요"
            />
          </div>

          <div className="input-group">
            <label>닉네임</label>
            <input
              type="text"
              name="nickname"
              placeholder="활동할 닉네임을 입력하세요"
            />
          </div>

          <div className="input-group">
            <label>비밀번호</label>
            <input
              type="password"
              name="password"
              placeholder="8~16자 영문, 숫자 조합"
            />
          </div>

          <div className="input-group">
            <label>비밀번호 확인</label>
            <input type="password" placeholder="비밀번호를 다시 입력하세요" />
          </div>

          <div className="input-group">
            <label>연락처</label>
            <input type="tel" name="phone" placeholder="010-0000-0000" />
          </div>

          <div className="form-options term-options">
            <label className="checkbox-label term-label">
              <input type="checkbox" /> 이용약관 및 개인정보 수집 동의 (필수)
            </label>
          </div>

          <button type="submit" className="main-submit-btn signup-btn">
            가입하기
          </button>
        </form>

        <p className="bottom-link">
          이미 계정이 있으신가요?
          <Link to="/login" className="login-link">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
