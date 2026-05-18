import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

// --- 스타일 컴포넌트 ---
const DetailContainer = styled.div`
  max-width: 850px; margin: 40px auto; padding: 40px; background: white;
  border-radius: 20px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  font-family: 'Pretendard', sans-serif;
`;
const AdminButtonGroup = styled.div` display: flex; gap: 10px; justify-content: flex-end; margin-bottom: 20px; `;
const ActionButton = styled.button`
  padding: 8px 16px; border-radius: 6px; border: 1px solid #ddd; background: white; cursor: pointer; font-size: 0.9rem;
  &:hover { background: #f5f5f5; }
  &.delete { color: #ff4d4d; border-color: #ff4d4d; }
`;
const CommentSection = styled.div` margin-top: 40px; border-top: 2px solid #f0f0f0; padding-top: 30px; `;
const CommentInputArea = styled.div` display: flex; gap: 10px; margin-bottom: 30px; `;
const CommentInput = styled.textarea` flex: 1; padding: 15px; border: 1px solid #ddd; border-radius: 10px; resize: none; height: 80px; `;
const CommentSubmitBtn = styled.button` padding: 0 25px; background: #ff6b35; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; `;
const CommentList = styled.div` display: flex; flex-direction: column; gap: 20px; `;
const CommentItem = styled.div` padding-bottom: 15px; border-bottom: 1px solid #f9f9f9; `;
const CommentHeader = styled.div` display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem; `;

const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [post, setPost] = useState(location.state?.post || (location.state?.id ? location.state : null));
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // 💡 현재 브라우저에 저장되는 로컬스토리지 방식 그대로 동기화 완료!
  const currentUserId = localStorage.getItem("userId") ? Number(localStorage.getItem("userId")) : null;
  const nickname = localStorage.getItem("nickname");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!post || !post.content) {
          const response = await axios.get(`http://localhost:8111/api/posts/${id}`);
          setPost(response.data);
        }
        const commentRes = await axios.get(`http://localhost:8111/api/comments/post/${id}`);
        setComments(commentRes.data);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };
    fetchData();
  }, [id, post]);

  const handleDeletePost = async () => {
    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`http://localhost:8111/api/posts/${id}`, {
        headers: { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` }
      });
      alert("삭제되었습니다.");
      navigate('/boards');
    } catch (error) {
      alert("삭제 권한이 없거나 오류가 발생했습니다.");
    }
  };

  const handleCommentSubmit = async () => {
    // 💡 브라우저에 깔려있는 토큰 정보를 기준으로 실시간 검증
    if (!token || !currentUserId) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }
    if (!newComment.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    // 토큰 규격 포맷팅 (Bearer 자동 조율)
    const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    try {
      // 오라클 DB 구조 및 컨트롤러 DTO 스펙 명밀 매핑 완료
      const commentData = {
        postId: parseInt(id, 10),
        userId: parseInt(currentUserId, 10),
        content: newComment.trim()
      };

      const response = await axios.post(`http://localhost:8111/api/comments`, commentData, {
        headers: {
          Authorization: formattedToken,
          "Content-Type": "application/json"
        }
      });

      if (response.data) {
        // 백엔드 성공 응답 수신 시 목록에 즉시 반영
        setComments(prev => [...prev, { ...response.data, nickname: nickname || "유저" }]);
        setNewComment("");
      }
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      alert("댓글 등록 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      await axios.delete(`http://localhost:8111/api/comments/${commentId}`, {
        headers: { Authorization: formattedToken }
      });
      alert("댓글이 삭제되었습니다.");
      setComments(prev => prev.filter(comment => comment.commentId !== commentId));
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  if (!post) return <div style={{ padding: '100px', textAlign: 'center' }}>로딩 중...</div>;

  return (
    <DetailContainer>
      {/* 본인 글 수정/삭제 권한 매핑 */}
      {currentUserId === post.userId && (
        <AdminButtonGroup>
          <ActionButton onClick={() => navigate(`/edit-post/${id}`, { state: { post } })}>수정</ActionButton>
          <ActionButton className="delete" onClick={handleDeletePost}>삭제</ActionButton>
        </AdminButtonGroup>
      )}

      <div style={{ marginBottom: '25px' }}>
        <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#888' }}>← 뒤로가기</button>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '15px', color: '#222' }}>{post.title}</h2>
        <div style={{ color: '#999', fontSize: '0.9rem', marginTop: '10px' }}>
          👤 {post.nickname} | 📅 {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "날짜 정보 없음"}
        </div>
      </div>

      <div
        style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#444', minHeight: '300px', borderBottom: '1px solid #f0f0f0', paddingBottom: '30px' }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <CommentSection>
        <h3>댓글 {comments.length}</h3>
        <CommentInputArea>
          <CommentInput
            placeholder="따뜻한 댓글을 남겨주세요!"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <CommentSubmitBtn onClick={handleCommentSubmit}>등록</CommentSubmitBtn>
        </CommentInputArea>

        <CommentList>
          {comments.map((comment) => (
            <CommentItem key={comment.commentId}>
              <CommentHeader>
                <div>
                  <span style={{ fontWeight: 'bold', marginRight: '10px' }}>{comment.nickname}</span>
                  <span style={{ color: '#999' }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                {/* 본인 댓글인 경우에만 삭제 버튼 노출 */}
                {currentUserId === comment.userId && (
                  <button
                    onClick={() => handleDeleteComment(comment.commentId)}
                    style={{ border: 'none', background: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    삭제
                  </button>
                )}
              </CommentHeader>
              <div style={{ color: '#444' }}>{comment.content}</div>
            </CommentItem>
          ))}
        </CommentList>
      </CommentSection>

      <button onClick={() => navigate('/boards')} style={{ marginTop: '50px', padding: '12px 30px', background: '#f5f5f5', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
        목록으로 돌아가기
      </button>
    </DetailContainer>
  );
};

export default Post;