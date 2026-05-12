import React from "react";
import "./MyPage.css";

const MyPage = () => {
  return (
    <div className="mypage-container">
      {/* 왼쪽 사이드바 */}
      <div className="sidebar">
        <h3>마이페이지</h3>
        <ul>
          <li className="active">내 정보</li>
          <li>찜목록</li>
          <li>내 게시물</li>
          <li>내 리뷰</li>
        </ul>
      </div>

      {/* 오른쪽 콘텐츠 영역 */}
      <div className="content">
        <h2>내 정보 수정</h2>
        <section className="info-section">
          <h4>집사 정보</h4>
          <div className="info-grid">
            <label>닉네임</label>
            <input type="text" defaultValue="도형" />
            <label>연락처</label>
            <input type="text" defaultValue="010-1234-5678" />
          </div>
        </section>

        <section className="info-section">
          <h4>강아지 정보</h4>
          <div className="pet-info-box">
            <div className="pet-photo">이미지 업로드</div>
            <div className="pet-inputs">
              <input type="text" placeholder="강아지 이름" />
              <select>
                <option>견종 선택</option>
                <option>말티즈</option>
                <option>푸들</option>
              </select>
              <div className="size-btns">
                <button type="button">소형견</button>
                <button type="button">중형견</button>
                <button type="button">대형견</button>
              </div>
            </div>
          </div>
        </section>
        <button className="save-btn">수정 완료</button>
      </div>
    </div>
  );
};

export default MyPage;
