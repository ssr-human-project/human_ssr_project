import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- 스타일 컴포넌트 (기존 코드와 동일) ---
const Container = styled.div` display: flex; max-width: 1200px; margin: 40px auto; gap: 30px; font-family: 'Pretendard', sans-serif; padding: 0 20px; `;
const Sidebar = styled.div` width: 220px; display: flex; flex-direction: column; gap: 10px; flex-shrink: 0; `;
const CommunityCard = styled.div` background: linear-gradient(135deg, #ff4d00, #ff8a00); color: white; padding: 25px; border-radius: 15px; font-weight: bold; font-size: 1.2rem; margin-bottom: 10px; box-shadow: 0 4px 10px rgba(255, 77, 0, 0.2); `;
const MenuButton = styled.button` width: 100%; padding: 14px; border: none; border-radius: 12px; background: ${props => props.active ? '#ff6b35' : 'white'}; color: ${props => props.active ? 'white' : '#666'}; text-align: left; cursor: pointer; font-weight: ${props => props.active ? 'bold' : '500'}; box-shadow: 0 2px 5px rgba(0,0,0,0.05); transition: all 0.2s; &:hover { background: ${props => props.active ? '#ff6b35' : '#f9f9f9'}; transform: translateX(5px); } `;
const MainContent = styled.div` flex: 1; display: flex; flex-direction: column; gap: 20px; `;
const SearchBar = styled.input` width: 100%; padding: 15px 20px; border: 1px solid #eee; border-radius: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); outline: none; font-size: 1rem; margin-bottom: 10px; &:focus { border-color: #ff6b35; } `;

const WideCard = styled.div` display: flex; background: white; border-radius: 16px; padding: 24px; border: 1px solid #f0f0f0; cursor: pointer; transition: all 0.2s; &:hover { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05); transform: translateY(-2px); } `;
const TextContent = styled.div` flex: 1; `;
const CardHeader = styled.div` display: flex; align-items: center; gap: 10px; margin-bottom: 12px; `;
const Tag = styled.span` color: #ff6b35; background: #fff3ef; padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; font-weight: bold; `;
const SubInfo = styled.span` color: #555; font-size: 0.9rem; font-weight: 500; `;

const Title = styled.h3` margin: 0 0 10px 0; font-size: 1.2rem; font-weight: 700; color: #222; `;
const Summary = styled.p` color: #666; font-size: 0.95rem; line-height: 1.6; margin-bottom: 15px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; `;

const Board = () => {
  const navigate = useNavigate();
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. 검색어 입력을 저장할 상태(State) 추가
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [postsRes, reviewsRes, sittersRes] = await Promise.all([
          axios.get('http://localhost:8111/api/posts'),
          axios.get('http://localhost:8111/api/reviews'),
          axios.get('http://localhost:8111/api/pet-sitter')
        ]);

        const combined = [
          ...postsRes.data.map(item => ({ ...item, type: 'post' })),
          ...reviewsRes.data.map(item => ({ ...item, type: 'review' })),
          ...sittersRes.data.map(item => ({ ...item, type: 'sitter' }))
        ];

        combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAllData(combined);
      } catch (error) {
        console.error("통합 데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // 게시글 타입별 정보 반환 함수
  const getDisplayInfo = (item) => {
    switch (item.type) {
      case 'post':
        return { label: '자유게시판', path: `/posts/${item.postId}`, state: { post: item} };
      case 'review':
        return { label: '리뷰', path: `/reviews/${item.reviewId}`, sub: item.cafeName, state: { review: item } };
      case 'sitter':
        return { label: '펫시터 구인', path: `/petsitters/${item.postId}`, sub: `📍 ${item.region}`, state: { post: item } };
      default:
        return { label: '게시판', path: '#', sub: '', state: {} };
    }
  };

  // 2. 검색어에 따라 데이터를 필터링하는 로직 추가
  // 제목(title) 또는 내용(content)에 검색어가 포함된 항목만 걸러냅니다. (대소문자 구분 없음)
  const filteredData = allData.filter(item => {
    const titleMatch = item.title ? item.title.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const contentMatch = item.content ? item.content.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    return titleMatch || contentMatch;
  });

  return (
    <Container>
      <Sidebar>
        <CommunityCard>커뮤니티</CommunityCard>
        <MenuButton active>전체</MenuButton>
        <MenuButton onClick={() => navigate('/posts')}>자유게시판</MenuButton>
        <MenuButton onClick={() => navigate('/reviews')}>리뷰</MenuButton>
        <MenuButton onClick={() => navigate('/petsitters')}>펫시터 찾기</MenuButton>
      </Sidebar>

      <MainContent>
        {/* 3. SearchBar 컴포넌트에 value와 onChange 이벤트 연결 */}
        <SearchBar
          placeholder="궁금한 내용을 검색해보세요!"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {loading ? (
          <div style={{textAlign: 'center', padding: '50px'}}>데이터를 로딩 중입니다...</div>
        ) : filteredData.length === 0 ? (
          // 검색 결과가 없을 때의 예외 처리 추가
          <div style={{textAlign: 'center', padding: '50px', color: '#999'}}>검색 결과가 없습니다.</div>
        ) : (
          // 4. 기존 allData.map 대신 필터링된 filteredData.map을 렌더링
          filteredData.map((item, index) => {
            const info = getDisplayInfo(item);
            return (
              <WideCard key={`${item.type}-${index}`} onClick={() => navigate(info.path, { state: info.state })}>
                <TextContent>
                  <CardHeader>
                    <Tag>{info.label}</Tag>
                    <SubInfo>{info.sub}</SubInfo>
                  </CardHeader>
                  <Title>{item.title}</Title>
                  <Summary>
                    {item.content ? item.content.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ') : ""}
                  </Summary>
                  <div style={{ fontSize: "0.85rem", color: "#999" }}>
                    {item.nickname} · {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </TextContent>
              </WideCard>
            );
          })
        )}
      </MainContent>
    </Container>
  );
};

export default Board;