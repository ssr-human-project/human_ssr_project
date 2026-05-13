import React from 'react';
import { useNavigate } from 'react-router-dom';

const Review = ({ review }) => {
  const navigate = useNavigate();

  // 평점 별점 변환
  const ratingStars = '⭐'.repeat(review.rating || 0);

  // 날짜 포맷팅
  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString()
    : '날짜 정보 없음';

  // 상세 페이지 이동 함수
  const handleCardClick = () => {
    if (review.id) {
      navigate(`/reviews/${review.id}`);
    }
  };

  return (
    <div
      className="review-card"
      onClick={handleCardClick}
      style={{
        border: '1px solid #ddd',
        margin: '10px',
        padding: '15px',
        borderRadius: '8px',
        cursor: 'pointer',
        background: 'white',
        transition: 'box-shadow 0.3s'
      }}
      onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'}
      onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
      <div className="image-container">
        <img
          src={(review.imageUrls && review.imageUrls.length > 0) ? review.imageUrls[0] : 'https://via.placeholder.com/150?text=No+Image'}
          alt={`${review.cafeName} 사진`}
          style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
        />
      </div>

      <div className="content" style={{ marginTop: '10px' }}>
        <div className="cafe-info">
          <span className="cafe-tag" style={{ color: '#ff6b6b', fontWeight: 'bold' }}>@{review.cafeName}</span>
        </div>
        <h3 style={{ margin: '5px 0' }}>{review.title}</h3>
        <p>평점: {ratingStars}</p>
        <p className="footer" style={{ fontSize: '0.9em', color: '#666' }}>
          {review.nickname} | {formattedDate}
        </p>
      </div>
    </div>
  );
};

export default Review; // 파일명이 Review.js이므로 export 이름도 맞춰줍니다.