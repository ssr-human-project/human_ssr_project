import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { reviewApi } from "../../api/reviewApi";

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
  span { color: #ff6b35; margin-left: 4px; }
`;

const RatingSelect = styled.select`
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 10px;
  background: #f9f9f9;
  font-size: 1rem;
  width: 150px;
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
  &:hover { background: #e55a2b; }
`;

const WriteReview = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState("5.0");
  const [selectedCafe, setSelectedCafe] = useState("");
  const [cafes, setCafes] = useState([]);

  const ratingOptions = Array.from({ length: 11 }, (_, i) => (i * 0.5).toFixed(1));

  // 1. 페이지 진입 시 로그인 체크 및 카페 목록 로드
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    const fetchCafes = async () => {
      try {
        const response = await axios.get("http://localhost:8111/api/cafes/all");
        setCafes(response.data);
      } catch (error) {
        console.error("카페 목록 로드 실패:", error);
      }
    };
    fetchCafes();
  }, [navigate]);

  const handleRegister = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // 로그인 시 저장한 실제 ID

    // 2. 유효성 검사
    const pureContent = content.replace(/<[^>]*>?/gm, "").trim();
    if (!selectedCafe || !title.trim() || !pureContent) {
      alert("카페 선택, 제목, 내용은 필수입니다!");
      return;
    }

    // 3. 로그인 기반 데이터 구성
    const reviewData = {
      cafeId: parseInt(selectedCafe),
      userId: Number(userId), // 고정값 1 대신 실제 로그인 유저 ID 사용
      title: title,
      content: content,
      rating: parseFloat(rating)
    };

    try {
      // 4. 인증 토큰을 포함하여 API 호출
      // 만약 reviewApi 내부에 헤더 설정이 없다면 아래와 같이 직접 전송하거나
      // reviewApi.writeReview 인자에 token을 추가로 전달해야 할 수 있습니다.
      const response = await axios.post("http://localhost:8111/api/reviews", reviewData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 || response.status === 201) {
        alert("리뷰가 성공적으로 등록되었습니다!");
        navigate("/reviews");
      }
    } catch (error) {
      console.error("등록 에러:", error.response?.data || error.message);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("인증이 만료되었습니다. 다시 로그인해주세요.");
        navigate("/login");
      } else {
        alert("리뷰 등록에 실패했습니다.");
      }
    }
  };

  return (
    <WriteContainer>
      <h2 style={{ marginBottom: "30px", borderBottom: '2px solid #ff6b35', paddingBottom: '10px', display: 'inline-block' }}>리뷰 쓰기</h2>

      <Label>방문한 카페 선택 <span>*</span></Label>
      <select
        style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #eee", background: "#f9f9f9" }}
        value={selectedCafe}
        onChange={(e) => setSelectedCafe(e.target.value)}
      >
        <option value="">카페를 선택하세요</option>
        {cafes.map((cafe) => (
          <option key={cafe.id || cafe.cafeId} value={cafe.id || cafe.cafeId}>
            {cafe.cafeName || cafe.name}
          </option>
        ))}
      </select>

      <Label>평점 선택 (0.5 단위) <span>*</span></Label>
      <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
        <RatingSelect value={rating} onChange={(e) => setRating(e.target.value)}>
          {ratingOptions.map((num) => (
            <option key={num} value={num}>{num}점</option>
          ))}
        </RatingSelect>
        <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#ff6b35" }}>{rating} / 5.0</span>
      </div>

      <Label>제목 <span>*</span></Label>
      <input
        style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #eee", background: "#f9f9f9", boxSizing: "border-box" }}
        placeholder="리뷰 제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Label>내용 <span>*</span></Label>
      <div style={{ background: "#f9f9f9", borderRadius: "8px", overflow: "hidden" }}>
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