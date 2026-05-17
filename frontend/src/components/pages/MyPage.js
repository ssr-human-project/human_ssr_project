import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/pages/MyPage.css";

const MyPage = () => {
  const [activeMenu, setActiveMenu] = useState("profile");
  const [userData, setUserData] = useState(null); // 서버에서 받아올 유저 정보
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. 유저 정보 가져오기
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        alert("로그인이 필요합니다.");
        window.location.href = "/login";
        return;
      }

      try {
        // 서버의 상세 정보 엔드포인트 확인 필요 (예: /api/auth/me 또는 /api/users/{id})
        const response = await axios.get(`http://localhost:8111/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
      } catch (error) {
        console.error("정보 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (!userData) return <div>정보를 불러올 수 없습니다.</div>;

  const renderProfile = () => (
    <div className="content-section">
      <div className="info-card">
        <h3>집사 정보</h3>
        <div className="input-group-row">
          <div className="input-item full">
            <label>닉네임</label>
            {/* 서버에서 받은 실제 닉네임 반영 */}
            <input type="text" defaultValue={userData.nickname} />
          </div>
        </div>
        <div className="input-group-row">
          <div className="input-item full">
            <label>이메일</label>
            <input type="text" value={userData.email} readOnly style={{background: '#eee'}} />
          </div>
        </div>
        <div className="input-group-row">
          <div className="input-item full">
            <label>전화번호</label>
            <input type="text" defaultValue={userData.phone || "정보 없음"} />
          </div>
        </div>
      </div>

      <div className="info-card mt-30">
        <h3>강아지 정보</h3>
        {/* 강아지 정보도 서버 DB 구조에 맞춰 userData.dogName 등으로 변경 필요 */}
        <p style={{color: '#888', fontSize: '0.9rem'}}>강아지 정보를 등록해주세요!</p>
      </div>
      <button className="save-btn">수정내용 저장하기</button>
    </div>
  );

  // ... 나머지 renderWishlist, renderPosts 등은 유지

  return (
    <div className="mypage-container">
      {/* 사이드바 및 메인 콘텐츠 출력 부분은 기존과 동일 */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>마이페이지</h2>
        </div>
        <ul className="menu-list">
          <li className={activeMenu === "profile" ? "active" : ""} onClick={() => setActiveMenu("profile")}>
            <i className="ri-user-line"></i> 내 정보
          </li>
          {/* ... 이하 메뉴 동일 */}
        </ul>
      </div>
      <div className="main-content">
        {activeMenu === "profile" && renderProfile()}
        {/* ... 나머지 메뉴 렌더링 */}
      </div>
    </div>
  );
};

export default MyPage;