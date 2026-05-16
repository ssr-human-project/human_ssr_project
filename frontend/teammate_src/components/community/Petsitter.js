import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const DetailContainer = styled.div`
  max-width: 850px;
  margin: 40px auto;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  font-family: 'Pretendard', sans-serif;
`;

const RegionTag = styled.span`
  color: #ff6b35;
  background: #fff3ef;
  padding: 6px 15px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.95rem;
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
  &:hover { background: #f5f5f5; }
  &.delete { color: #ff4d4d; border-color: #ff4d4d; }
`;

const Petsitter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. 우선 목록에서 넘겨준 데이터(state)가 있는지 확인합니다.
  const [post, setPost] = useState(location.state?.post || null);

  const currentUserId = Number(localStorage.getItem("userId"));
    const token = localStorage.getItem("token");

    useEffect(() => {
      if (!post) {
        const fetchDetail = async () => {
          try {
            const response = await axios.get(`http://localhost:8111/api/pet-sitter/${id}`);
            setPost(response.data);
          } catch (error) {
            console.error("상세 정보 로딩 실패:", error);
          }
        };
        fetchDetail();
      }
    }, [id, post]);

    // 삭제 함수 (팀원 테스트 코드 로직 반영)
    const handleDelete = async () => {
      if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

      try {
        await axios.delete(`http://localhost:8111/api/pet-sitter/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("삭제되었습니다.");
        navigate('/petsitters');
      } catch (error) {
        console.error("삭제 실패:", error);
        alert("삭제 권한이 없거나 오류가 발생했습니다.");
      }
    };

    // 수정 페이지로 이동
    const handleEdit = () => {
      navigate(`/edit-petsitter/${id}`, { state: { post } });
    };

    if (!post) return <div style={{ padding: '100px', textAlign: 'center' }}>로딩 중...</div>;

    return (
      <DetailContainer>
        {/* 작성자 본인에게만 수정/삭제 버튼 표시 */}
        {currentUserId === post.userId && (
          <AdminButtonGroup>
            <ActionButton onClick={handleEdit}>수정</ActionButton>
            <ActionButton className="delete" onClick={handleDelete}>삭제</ActionButton>
          </AdminButtonGroup>
        )}

        <div style={{ marginBottom: '25px' }}>
          <span style={{ color: '#ff6b35', background: '#fff3ef', padding: '6px 15px', borderRadius: '8px', fontWeight: 'bold' }}>
            📍 {post.region}
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '15px', color: '#222' }}>{post.title}</h2>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '20px', marginBottom: '30px', color: '#888' }}>
          <div>👤 {post.nickname} | 조회수 {post.viewCount}</div>
          <div>📅 {new Date(post.createdAt).toLocaleDateString()}</div>
        </div>

        <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#444', minHeight: '300px' }}
             dangerouslySetInnerHTML={{ __html: post.content }} />

        <button onClick={() => navigate('/petsitters')} style={{ marginTop: '50px', padding: '12px 30px', background: '#f5f5f5', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
          목록으로 돌아가기
        </button>
      </DetailContainer>
    );
  };

  export default Petsitter;