import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// --- 스타일 컴포넌트 ---
const Container = styled.div` display: flex; max-width: 1200px; margin: 40px auto; gap: 30px; font-family: "Pretendard", sans-serif; padding: 0 20px; `;
const Sidebar = styled.div` width: 220px; display: flex; flex-direction: column; gap: 10px; flex-shrink: 0; `;
const CommunityCard = styled.div` background: linear-gradient(135deg, #ff4d00, #ff8a00); color: white; padding: 25px; border-radius: 15px; font-weight: bold; font-size: 1.2rem; margin-bottom: 10px; box-shadow: 0 4px 10px rgba(255, 77, 0, 0.2); `;
const MenuButton = styled.button` width: 100%; padding: 14px; border: none; border-radius: 12px; background: ${(props) => (props.active ? "#ff6b35" : "white")}; color: ${(props) => (props.active ? "white" : "#666")}; text-align: left; cursor: pointer; font-weight: ${(props) => (props.active ? "bold" : "500")}; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); transition: all 0.2s; &:hover { background: ${(props) => (props.active ? "#ff6b35" : "#f9f9f9")}; transform: translateX(5px); } `;
const MainContent = styled.div` flex: 1; display: flex; flex-direction: column; gap: 20px; `;

const SearchBar = styled.input` width: 100%; padding: 15px 20px; border: 1px solid #eee; border-radius: 15px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); outline: none; font-size: 1rem; margin-bottom: 10px; &:focus { border-color: #ff6b35; } `;

const WideCard = styled.div` display: flex; background: white; border-radius: 16px; padding: 24px; border: 1px solid #f0f0f0; cursor: pointer; transition: all 0.2s; align-items: center; &:hover { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05); transform: translateY(-2px); } `;
const TextContent = styled.div` flex: 1; `; // 오른쪽 패딩 제거
const CardHeader = styled.div` display: flex; align-items: center; gap: 10px; margin-bottom: 12px; `;
const Tag = styled.span` color: #ff6b35; background: #fff3ef; padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; font-weight: bold; `;
const CafeName = styled.span` color: #555; font-size: 0.9rem; font-weight: 500; `;

const Title = styled.h3` margin: 0 0 10px 0; font-size: 1.2rem; font-weight: 700; color: #222; `;
const Summary = styled.p` color: #666; font-size: 0.95rem; line-height: 1.6; margin-bottom: 15px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; `;

const ReviewList = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:8111/api/reviews");
        setReviews(response.data);
      } catch (error) {
        console.error("리뷰 로딩 실패:", error);
      }
    };
    fetchReviews();
  }, []);

  return (
    <Container>
      <Sidebar>
        <CommunityCard>커뮤니티</CommunityCard>
        <MenuButton onClick={() => navigate("/boards")}>전체</MenuButton>
        <MenuButton onClick={() => navigate("/posts")}>자유게시판</MenuButton>
        <MenuButton active>리뷰</MenuButton>
        <MenuButton onClick={() => navigate("/petsitters")}>펫시터 찾기</MenuButton>
        <MenuButton onClick={() => navigate("/write-review")} style={{ background: "#ff6b35", color: "white", marginTop: "20px", textAlign: "center" }}>
          🖊️ 리뷰 쓰기
        </MenuButton>
      </Sidebar>

      <MainContent>
        <SearchBar placeholder="카페 이름이나 제목으로 검색해보세요..." />
        {reviews.map((review) => (
          <WideCard key={review.reviewId} onClick={() => navigate(`/reviews/${review.reviewId}`, { state: { review } })}>
            <TextContent>
              <CardHeader>
                <Tag>리뷰</Tag>
                <CafeName>{review.cafeName}</CafeName>
              </CardHeader>
              <Title>{review.title}</Title>
              <Summary>
                              {/* ReviewList에서 사용한 방식: 태그 제거 후 텍스트만 추출 */}
                              {review.content ? review.content.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ') : ""}
                            </Summary>
              <div style={{ fontSize: "0.85rem", color: "#999" }}>
                {review.nickname} · {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </TextContent>
            {/* Thumbnail 섹션 삭제됨 */}
          </WideCard>
        ))}
      </MainContent>
    </Container>
  );
};

export default ReviewList;