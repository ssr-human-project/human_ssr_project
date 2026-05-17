import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const WriteContainer = styled.div`
  max-width: 850px;
  margin: 40px auto;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin: 20px 0 10px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #eee;
  box-sizing: border-box;
`;

const SelectField = styled.select`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #eee;
  background: white;
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
  &:hover { background: #e85a2a; }
`;

const EditReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 기존 데이터 불러오기 (상세 페이지에서 넘겨준 데이터 우선)
  const [title, setTitle] = useState(location.state?.review?.title || '');
  const [content, setContent] = useState(location.state?.review?.content || '');
  const [cafeName, setCafeName] = useState(location.state?.review?.cafeName || '');
  const [rating, setRating] = useState(location.state?.review?.rating || 5);

  useEffect(() => {
    // 만약 직접 주소를 치고 들어와서 데이터가 없다면 서버에서 다시 가져옴
    if (!location.state?.review) {
      const fetchReview = async () => {
        try {
          const response = await axios.get(`http://localhost:8111/api/reviews/${id}`);
          setTitle(response.data.title);
          setContent(response.data.content);
          setCafeName(response.data.cafeName);
          setRating(response.data.rating);
        } catch (error) {
          console.error("데이터 로딩 실패:", error);
          alert("리뷰 정보를 불러올 수 없습니다.");
          navigate('/reviews');
        }
      };
      fetchReview();
    }
  }, [id, location.state, navigate]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // 실제 로그인 유저 ID 가져오기

    if (!title.trim() || !content.trim() || !cafeName.trim()) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    // 1. WriteReview.js와 동일한 데이터 구조로 구성
      // 백엔드 DTO에 따라 cafeId가 필요한지, cafeName이 필요한지 확인이 필요합니다.
      const reviewData = {
        reviewId: Number(id), // 수정할 때는 어떤 글인지 ID가 필요함
        userId: Number(userId),
        title: title,
        content: content,
        rating: parseFloat(rating),
        // 만약 백엔드에서 수정 시 cafeId를 요구한다면 기존 review 객체에서 가져와야 합니다.
        cafeId: location.state?.review?.cafeId
      };

      try {
        // 2. axios.put 호출 시 헤더를 명확히 전달
        const response = await axios.put(
          `http://localhost:8111/api/reviews/${id}`,
          reviewData, // 위에서 만든 데이터 객체
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.status === 200) {
          alert("리뷰가 성공적으로 수정되었습니다!");

          const updatedReview = {
            ...location.state?.review,
            ...reviewData // 수정된 데이터 덮어쓰기
          };

          navigate(`/reviews/${id}`, { state: { review: updatedReview } });
        }
      } catch (error) {
        console.error("수정 에러 상세:", error.response?.data);

        // 권한 에러(403)인 경우 백엔드 로그 확인이 필요함
        if (error.response?.status === 403) {
          alert("본인이 작성한 글만 수정할 수 있습니다.");
        } else {
          alert("리뷰 수정에 실패했습니다.");
        }
      }
    };

  return (
    <WriteContainer>
      <h2 style={{ borderBottom: '2px solid #ff6b35', paddingBottom: '10px' }}>리뷰 수정</h2>

      <Label>방문한 카페</Label>
      <InputField
        value={cafeName}
        readOnly // 👈 수정 불가하게 설정
        style={{ background: '#f5f5f5', color: '#888', cursor: 'not-allowed' }} // 👈 시각적으로 차단
      />

      <Label>별점</Label>
      <SelectField value={rating} onChange={(e) => setRating(e.target.value)}>
        <option value="5">★★★★★ (5점)</option>
        <option value="4">★★★★☆ (4점)</option>
        <option value="3">★★★☆☆ (3점)</option>
        <option value="2">★★☆☆☆ (2점)</option>
        <option value="1">★☆☆☆☆ (1점)</option>
      </SelectField>

      <Label>제목</Label>
      <InputField
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
      />

      <Label>상세 리뷰</Label>
      <div style={{ background: '#f9f9f9', marginBottom: '50px' }}>
        <ReactQuill theme="snow" value={content} onChange={setContent} style={{ height: '350px' }} />
      </div>

      <SubmitButton onClick={handleUpdate}>수정 완료</SubmitButton>
    </WriteContainer>
  );
};

export default EditReview;