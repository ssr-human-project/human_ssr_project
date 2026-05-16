import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../styles/community/Post.css";

const Post = () => {
  const { id } = useParams(); // URL 파라미터의 게시글 번호
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // 현재 로그인한 유저 정보 (localStorage에서 가져옴)
  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // 게시글 상세 조회 시에도 토큰을 보낼 수 있습니다 (비공개 게시판 등 대비)
        const response = await axios.get(`http://localhost:8111/api/posts/${id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : ""
          }
        });
        setPost(response.data);
      } catch (error) {
        console.error("게시글 로드 실패:", error);
        alert("존재하지 않거나 삭제된 게시글입니다.");
        navigate("/posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate, token]);

  if (loading) return <div className="loading">로딩 중...</div>;
  if (!post) return null;

  // 내가 쓴 글인지 확인하는 로직 (수정/삭제 버튼 노출 여부)
  // 서버에서 post 객체에 작성자의 userId를 담아준다고 가정합니다.
  const isMyPost = Number(currentUserId) === Number(post.userId);

  return (
    <div className="post-detail-container">
      <div className="post-header">
        <button onClick={() => navigate("/posts")} className="back-btn">← 목록으로</button>
        <h1 className="post-title">{post.title}</h1>
        <div className="post-info">
          <span>작성자: {post.nickname}</span>
          <span>날짜: {new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="post-content">
        {/* 리액트 퀼 등으로 작성된 HTML 내용을 안전하게 출력 */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {/* 내가 쓴 글일 때만 보여주는 관리 버튼 */}
      {isMyPost && (
        <div className="post-actions">
          <button onClick={() => navigate(`/posts/edit/${id}`)} className="edit-btn">수정</button>
          <button className="delete-btn">삭제</button>
        </div>
      )}
    </div>
  );
};

export default Post;