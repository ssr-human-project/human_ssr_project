import React, { useState } from "react";
import "../../styles/pages/MyPage.css";

const MyPage = () => {
  const [activeMenu, setActiveMenu] = useState("profile");
  const renderProfile = () => (
    <div className="content-section">
      <div className="info-card">
        <h3>집사 정보</h3>
        <div className="input-group-row">
          <div className="input-item full">
            <label>닉네임</label>
            <input type="text" defaultValue="꼬리살랑러버" />
          </div>
        </div>
        <div className="input-group-row">
          <div className="input-item full">
            <label>전화번호</label>
            <input type="text" defaultValue="010-1234-5678" />
          </div>
        </div>
        <div className="input-group-row">
          <div className="input-item half">
            <label>새 비밀번호</label>
            <input type="password" placeholder="변경할 비밀번호" />
          </div>
          <div className="input-item half">
            <label>비밀번호 확인</label>
            <input type="password" placeholder="비밀번호 재입력" />
          </div>
        </div>
      </div>

      <div className="info-card mt-30">
        <h3>강아지 정보</h3>
        <div className="input-group-row">
          <div className="input-item full">
            <label>이름</label>
            <input type="text" defaultValue="뭉치" />
          </div>
        </div>
        <div className="input-group-row">
          <div className="input-item half">
            <label>견종</label>
            <input type="text" defaultValue="포메라니안" />
          </div>
          <div className="input-item half">
            <label>크기</label>
            <select defaultValue="small">
              <option value="small">소형견 (7kg 이하)</option>
              <option value="medium">중형견 (7~15kg)</option>
              <option value="large">대형견 (15kg 이상)</option>
            </select>
          </div>
        </div>
        <div className="input-group-row">
          <div className="input-item full">
            <label>강아지 소개</label>
            <textarea defaultValue="활발하고 사람을 좋아하는 3살 남아입니다." />
          </div>
        </div>
      </div>
      <button className="save-btn">저장하기</button>
    </div>
  );

  const renderWishlist = () => (
    <div className="content-section">
      <h3>찜한 카페</h3>
      <div className="wishlist-grid">
        {[1, 2, 3].map((item) => (
          <div className="wish-card" key={item}>
            <div className="wish-img-wrapper">
              <img
                src={`https://via.placeholder.com/200?text=Cafe+${item}`}
                alt="카페"
              />
              <button className="heart-icon">❤️</button>
            </div>
            <div className="wish-info">
              <h4>더펀팀</h4>
              <p className="location">📍 서울 강남구</p>
              <p className="rating">⭐ 4.8</p>
              <button className="detail-btn">상세보기</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPosts = () => {
    const posts = []; // 실제로는 서버에서 가져온 배열 (지금은 비어있음)

    return (
      <div className="content-section">
        <h3>내가 쓴 글</h3>
        {posts.length > 0 ? (
          <div className="post-list">
            {posts.map((post) => (
              <div className="post-item" key={post.id}>
                {/* 게시물 내용 */}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <i className="ri-error-warning-line"></i>
            <p>아직 작성한 게시물이 없어요.</p>
          </div>
        )}
      </div>
    );
  };

  const renderReviews = () => {
    const reviews = []; // 실제로는 서버에서 가져온 리뷰 배열

    return (
      <div className="content-section">
        <h3>내가 작성한 리뷰</h3>
        {reviews.length > 0 ? (
          <div className="review-list">
            {reviews.map((review) => (
              <div className="review-item" key={review.id}>
                {/* 리뷰 내용 */}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <i className="ri-chat-history-line"></i>
            <p>아직 작성한 리뷰가 없어요.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mypage-container">
      {/* 왼쪽 사이드바 메뉴 */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>마이페이지</h2>
        </div>
        <ul className="menu-list">
          <li
            className={activeMenu === "profile" ? "active" : ""}
            onClick={() => setActiveMenu("profile")}
          >
            <i className="ri-user-line"></i> 내 정보
          </li>
          <li
            className={activeMenu === "wish" ? "active" : ""}
            onClick={() => setActiveMenu("wish")}
          >
            <i className="ri-heart-line"></i> 찜목록
          </li>
          <li onClick={() => setActiveMenu("posts")}>
            <i className="ri-file-list-line"></i> 내 게시물
          </li>
          <li onClick={() => setActiveMenu("reviews")}>
            <i className="ri-star-line"></i> 리뷰
          </li>
        </ul>
      </div>

      {/* 오른쪽 메인 콘텐츠 영역 */}
      <div className="main-content">
        {activeMenu === "profile" && renderProfile()}
        {activeMenu === "wish" && renderWishlist()}
        {activeMenu === "posts" && renderPosts()}
        {activeMenu === "reviews" && renderReviews()}
      </div>
    </div>
  );
};

export default MyPage;
