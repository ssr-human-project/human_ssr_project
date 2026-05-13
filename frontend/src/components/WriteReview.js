import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill-new';
// CSS 경로 수정 (패키지 구조에 맞춰 안전하게 변경)
import 'react-quill-new/dist/quill.snow.css';

// --- 스타일 컴포넌트 ---
const WriteContainer = styled.div`
  max-width: 850px;
  margin: 40px auto;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  font-family: 'Pretendard', sans-serif;
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
  &:focus { outline: 2px solid #ff6b35; background: white; }
`;

const SubmitButton = styled.button`
  width: 100%;
  margin-top: 30px;
  padding: 15px;
  background: #ff6b35;
  color: white; /* 이 부분의 에러를 수정했습니다 */
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  &:hover { background: #e55a2b; }
`;

// --- 메인 컴포넌트 ---
const WriteReview = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState("5.0");
  const [selectedCafe, setSelectedCafe] = useState('');
  const [cafes, setCafes] = useState([]);

  const ratingOptions = Array.from({ length: 11 }, (_, i) => (i * 0.5).toFixed(1));

  useEffect(() => {
    setCafes([
      { id: 1, name: "꼬리살랑 천안점" },
      { id: 2, name: "댕댕카페 홍대점" },
      { id: 3, name: "멍멍살롱 강남점" }
    ]);
  }, []);

  const handleRegister = async () => {
    if (!selectedCafe || !title.trim() || !content.trim()) {
      alert("카페 선택, 제목, 내용은 필수입니다!");
      return;
    }

    const reviewData = {
      userId: 1,
      cafeName: selectedCafe,
      title: title,
      content: content,
      rating: parseFloat(rating),
      imageUrls: []
    };

    try {
      const response = await axios.post('http://localhost:8080/api/reviews', reviewData);
      if (response.status === 200) {
        alert("리뷰가 성공적으로 등록되었습니다!");
        navigate('/reviews');
      }
    } catch (error) {
      console.error("등록 에러:", error);
      alert("리뷰 등록 중 에러가 발생했습니다.");
    }
  };

  return (
    <WriteContainer>
      <h2 style={{ marginBottom: '30px' }}>리뷰 쓰기</h2>

      <Label>방문한 카페 선택 <span>*</span></Label>
      <select
        style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #eee', background: '#f9f9f9' }}
        value={selectedCafe}
        onChange={(e) => setSelectedCafe(e.target.value)}
      >
        <option value="">카페를 선택하세요</option>
        {cafes.map(cafe => (
          <option key={cafe.id} value={cafe.name}>{cafe.name}</option>
        ))}
      </select>

      <Label>평점 선택 (0.5 단위) <span>*</span></Label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
        <RatingSelect value={rating} onChange={(e) => setRating(e.target.value)}>
          {ratingOptions.map(num => (
            <option key={num} value={num}>{num}점</option>
          ))}
        </RatingSelect>
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ff6b35' }}>
          {rating} / 5.0
        </span>
      </div>

      <Label>제목 <span>*</span></Label>
      <input
        style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #eee', background: '#f9f9f9', boxSizing: 'border-box' }}
        placeholder="리뷰 제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Label>내용 <span>*</span></Label>
      <div style={{ background: '#f9f9f9', borderRadius: '8px' }}>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          style={{ height: '300px', marginBottom: '50px' }}
        />
      </div>

      <SubmitButton onClick={handleRegister}>
        리뷰 등록하기
      </SubmitButton>
    </WriteContainer>
  );
};

export default WriteReview;