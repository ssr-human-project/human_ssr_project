import React, { useState, useEffect } from 'react'; // useState, useEffect 추가
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // axios 추가
import Review from './Review';

// --- 스타일 컴포넌트 (기존과 동일) ---
const Container = styled.div` display: flex; max-width: 1000px; margin: 40px auto; gap: 20px; font-family: 'Pretendard', sans-serif; `;
const Sidebar = styled.div` width: 200px; display: flex; flex-direction: column; gap: 10px; `;
const CommunityCard = styled.div` background: linear-gradient(135deg, #ff4d00, #ff8a00); color: white; padding: 20px; border-radius: 15px; font-weight: bold; font-size: 1.2rem; margin-bottom: 10px; `;
const MenuButton = styled.button` width: 100%; padding: 12px; border: none; border-radius: 10px; background: ${props => props.active ? '#ff6b35' : 'white'}; color: ${props => props.active ? 'white' : '#666'}; text-align: left; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.05); &:hover { background: #f9f9f9; } `;
const MainContent = styled.div` flex: 1; display: flex; flex-direction: column; gap: 20px; `;
const SearchBar = styled.input` width: 100%; padding: 15px; border: none; border-radius: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); box-sizing: border-box; outline: none; &:focus { border: 1px solid #ff6b35; } `;

const ReviewList = () => {
  const navigate = useNavigate();

  // 1. 상태 관리: 백엔드에서 받아올 리뷰 목록을 저장할 빈 배열 생성
  const [reviews, setReviews] = useState([]);

  // 2. 백엔드 데이터 불러오기
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // 김도형님이 만든 ReviewController API 호출
        const response = await axios.get('http://localhost:8111/api/reviews');
        setReviews(response.data); // 성공하면 상태값 업데이트
      } catch (error) {
        console.error("리뷰 목록을 불러오지 못했습니다:", error);
      }
    };
    fetchReviews();
  }, []);

  const goToWrite = () => navigate('/write-review');

  return (
    <Container>
      <Sidebar>
        <CommunityCard>커뮤니티</CommunityCard>
        {/* 전체 목록은 BoardController(/api/board/all)를 사용하는 페이지로 연결하세요 */}
        <MenuButton onClick={() => navigate('/board/all')}>전체</MenuButton>
        <MenuButton onClick={() => navigate('/posts')}>자유게시판</MenuButton>
        <MenuButton active>리뷰</MenuButton>

        <MenuButton
          onClick={goToWrite}
          style={{background: '#ff6b35', color: 'white', marginTop: '20px', textAlign: 'center'}}
        >
          🖊️ 글쓰기
        </MenuButton>
      </Sidebar>

      <MainContent>
        <SearchBar placeholder="게시글 검색..." />

        {/* 3. 백엔드에서 받아온 데이터(reviews)를 반복문으로 출력 */}
        {reviews.length > 0 ? (
          reviews.map((review) => (
            // reviewId를 key로 사용하고, 전체 review 객체를 넘겨줍니다.
            <Review key={review.reviewId} review={review} />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
            등록된 리뷰가 없습니다. 첫 리뷰를 작성해 보세요!
          </div>
        )}
      </MainContent>
    </Container>
  );
};

export default ReviewList;