import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// --- 스타일 컴포넌트 ---
const WriteContainer = styled.div`
  max-width: 850px;
  margin: 40px auto;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  font-family: "Pretendard", sans-serif;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin: 20px 0 10px;
  font-size: 0.95rem;
  span {
    color: #ff6b35;
    margin-left: 4px;
  }
`;

const RatingSelect = styled.select`
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 10px;
  background: #f9f9f9;
  font-size: 1rem;
  width: 150px;
  &:focus {
    outline: 2px solid #ff6b35;
    background: white;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  margin-top: 30px;
  padding: 15px;
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background: #e55a2b;
  }
`;

// --- 메인 컴포넌트 ---
const WriteReview = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState("5.0");
  const [selectedCafe, setSelectedCafe] = useState("");
  const [cafes, setCafes] = useState([]);

  const ratingOptions = Array.from({ length: 11 }, (_, i) =>
    (i * 0.5).toFixed(1),
  );

  // WriteReview.js의 useEffect 부분 수정
  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const response = await axios.get("http://localhost:8111/api/cafes/all");
        setCafes(response.data);
      } catch (error) {
        console.error("카페 목록 로드 실패:", error);
      }
    };
    fetchCafes();
  }, []);

  const handleRegister = async () => {
      // 1. 유효성 검사 (Quill 에디터의 HTML 태그 제거 후 체크)
      const pureContent = content.replace(/<[^>]*>?/gm, "").trim();
      if (!selectedCafe || !title.trim() || !pureContent) {
        alert("카페 선택, 제목, 내용은 필수입니다!");
        return;
      }

    // ReviewWrite.js (또는 관련 컴포넌트)
    const reviewData = {
          cafeId: parseInt(selectedCafe), // 선택한 카페 ID
          userId: 1,                      // 현재는 1로 테스트 (나중에 로그인 유저 정보로 변경)
          title: title,                   // 입력한 제목
          content: content,               // 입력한 내용 (HTML 포함)
          rating: parseFloat(rating)      // ⭐ 선택한 별점 (숫자로 변환해서 전송)
        };
        console.log("서버로 보내는 실제 데이터:", reviewData);

    try {
      const response = await axios.post(
        "http://localhost:8111/api/reviews",
        reviewData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        alert("리뷰가 성공적으로 등록되었습니다!");
        navigate("/reviews");
      }
    } catch (error) {
      console.error("등록 에러:", error.response?.data || error.message);
      alert("리뷰 등록에 실패했습니다.");
    }
  };

  return (
    <WriteContainer>
      <h2 style={{ marginBottom: "30px" }}>리뷰 쓰기</h2>

      <Label>
        방문한 카페 선택 <span>*</span>
      </Label>
      <select
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #eee",
          background: "#f9f9f9",
        }}
        value={selectedCafe}
        onChange={(e) => setSelectedCafe(e.target.value)}
      >
        <option value="">카페를 선택하세요</option>
        {cafes.map((cafe) => (
          // cafe.id가 아니라 cafe.cafeId 인지 CafeTest 결과창(JSON)을 확인해보세요!
          <option key={cafe.id || cafe.cafeId} value={cafe.id || cafe.cafeId}>
            {cafe.cafeName || cafe.name}
          </option>
        ))}
      </select>

      <Label>
        평점 선택 (0.5 단위) <span>*</span>
      </Label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <RatingSelect
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          {ratingOptions.map((num) => (
            <option key={num} value={num}>
              {num}점
            </option>
          ))}
        </RatingSelect>
        <span
          style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#ff6b35" }}
        >
          {rating} / 5.0
        </span>
      </div>

      <Label>
        제목 <span>*</span>
      </Label>
      <input
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #eee",
          background: "#f9f9f9",
          boxSizing: "border-box",
        }}
        placeholder="리뷰 제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Label>
        내용 <span>*</span>
      </Label>
      <div style={{ background: "#f9f9f9", borderRadius: "8px" }}>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          style={{ height: "300px", marginBottom: "50px" }}
        />
      </div>

      <SubmitButton onClick={handleRegister}>리뷰 등록하기</SubmitButton>
    </WriteContainer>
  );
};

export default WriteReview;