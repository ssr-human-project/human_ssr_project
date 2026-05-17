import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

// --- 스타일 컴포넌트 (Petsitter.js 스타일 반영) ---
const DetailContainer = styled.div`
  max-width: 850px;
  margin: 40px auto;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  font-family: "Pretendard", sans-serif;
`;

const StarContainer = styled.div`
  display: flex;
  color: #ffb800;
  font-size: 1.2rem;
  letter-spacing: -2px;
`;

const AdminButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover {
    background: #f5f5f5;
  }
  &.delete {
    color: #ff4d4d;
    border-color: #ff4d4d;
  }
`;

const Review = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [review, setReview] = useState(location.state?.review || null);
  const currentUserId = Number(localStorage.getItem("userId"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!review) {
      const fetchDetail = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8111/api/reviews/${id}`,
          );
          setReview(response.data);
        } catch (error) {
          console.error("리뷰 상세 정보 로딩 실패:", error);
        }
      };
      fetchDetail();
    }
  }, [id, review]);

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 리뷰를 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`http://localhost:8111/api/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("삭제되었습니다.");
      navigate("/reviews");
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 권한이 없거나 오류가 발생했습니다.");
    }
  };

  const handleEdit = () => {
    navigate(`/edit-review/${id}`, { state: { review } });
  };

  if (!review)
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>로딩 중...</div>
    );

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) stars.push(<span key={i}>★</span>);
      else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span
            key={i}
            style={{
              position: "relative",
              display: "inline-block",
              width: "1em",
              overflow: "hidden",
            }}
          >
            <span style={{ position: "absolute", color: "#eee" }}>★</span>
            <span
              style={{
                position: "absolute",
                width: "50%",
                overflow: "hidden",
                color: "#ffb800",
              }}
            >
              ★
            </span>
          </span>,
        );
      } else
        stars.push(
          <span key={i} style={{ color: "#eee" }}>
            ★
          </span>,
        );
    }
    return stars;
  };

  return (
    <DetailContainer>
      {/* 작성자 본인일 때만 수정/삭제 버튼 표시 */}
      {currentUserId === review.userId && (
        <AdminButtonGroup>
          <ActionButton onClick={handleEdit}>수정</ActionButton>
          <ActionButton className="delete" onClick={handleDelete}>
            삭제
          </ActionButton>
        </AdminButtonGroup>
      )}

      {/* 헤더 섹션 */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          <span
            style={{
              color: "#ff6b35",
              fontWeight: "bold",
              background: "#fff3ef",
              padding: "4px 12px",
              borderRadius: "8px",
            }}
          >
            📍 {review.cafeName || "정보 없음"}
          </span>
          <StarContainer>{renderStars(review.rating)}</StarContainer>
          <span style={{ color: "#ff6b35", fontWeight: "bold" }}>
            {review.rating?.toFixed(1)}
          </span>
        </div>
        <h2
          style={{
            fontSize: "2.2rem",
            fontWeight: "800",
            margin: "15px 0 20px 0",
            color: "#222",
          }}
        >
          {review.title}
        </h2>
      </div>

      {/* 정보 섹션 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #f0f0f0",
          paddingBottom: "20px",
          marginBottom: "30px",
          color: "#888",
        }}
      >
        <div style={{ display: "flex", gap: "15px" }}>
          <span>👤 {review.nickname}</span>
          <span>
            📅{" "}
            {review.createdAt
              ? new Date(review.createdAt).toLocaleDateString()
              : "날짜 정보 없음"}
          </span>
        </div>
      </div>

      {/* 본문 내용 */}
      <div
        style={{
          fontSize: "1.1rem",
          lineHeight: "1.8",
          color: "#444",
          minHeight: "300px",
        }}
        dangerouslySetInnerHTML={{ __html: review.content }}
      />

      <button
        onClick={() => navigate("/reviews")}
        style={{
          marginTop: "50px",
          padding: "12px 30px",
          background: "#f5f5f5",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "bold",
          color: "#666",
        }}
      >
        목록으로 돌아가기
      </button>
    </DetailContainer>
  );
};

export default Review;
