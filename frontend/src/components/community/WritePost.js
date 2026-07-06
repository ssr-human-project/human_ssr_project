import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { api } from '../../api/axiosApi';
import ImageUploader from './ImageUploader';

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
  transition: background 0.3s;
  &:hover { background: #e55a2b; }
  &:disabled {
    background: #ffc2ad;
    cursor: not-allowed;
  }
`;

const WritePost = () => {
  const navigate = useNavigate();

  // 입력 필드 상태 관리 (제목과 내용만 유지)
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 페이지 진입 시 로그인 체크
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    }
  }, [navigate]);

  const handleRegister = async () => {
    const userId = localStorage.getItem("userId");

    // 1. 유효성 검사 (빈 값 체크)
    const pureContent = content.replace(/<[^>]*>?/gm, '').trim();
    if (!title.trim() || !pureContent) {
      alert("제목과 내용을 모두 입력해주세요!");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrls = [];
      try {
        imageUrls = imageFiles.length
          ? await api.uploads.images(imageFiles)
          : [];
      } catch (error) {
        console.error("이미지 업로드 실패:", error.response?.data || error.message);
        alert(error.response?.data?.message || "이미지 업로드에 실패했습니다.");
        return;
      }

      try {
        await api.posts.create({
          userId: Number(userId),
          title,
          content,
          imageUrls,
        });
      } catch (error) {
        console.error("게시글 저장 실패:", error.response?.data || error.message);
        throw error;
      }

      alert("게시글이 성공적으로 등록되었습니다!");
      navigate('/posts');
    } catch (error) {
      console.error("등록 에러 상세:", error.response?.data || error.message);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("권한이 없거나 세션이 만료되었습니다. 다시 로그인해주세요.");
        navigate("/login");
      } else {
        alert("게시글 등록에 실패했습니다. 서버 상태를 확인하세요.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <WriteContainer>
      <h2 style={{
        marginBottom: '30px',
        borderBottom: '2px solid #ff6b35',
        paddingBottom: '10px',
        display: 'inline-block',
        fontSize: '1.5rem'
      }}>
        자유게시판 글쓰기
      </h2>

      <Label>제목 <span>*</span></Label>
      <input
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '10px',
          border: '1px solid #eee',
          background: '#f9f9f9',
          boxSizing: 'border-box',
          fontSize: '1rem',
          outline: 'none'
        }}
        placeholder="제목을 입력해주세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Label>상세 내용 <span>*</span></Label>
      <div style={{ background: '#f9f9f9', borderRadius: '8px', overflow: 'hidden' }}>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          style={{ height: '350px', marginBottom: '50px' }}
          placeholder="나누고 싶은 이야기를 작성해보세요."
        />
      </div>

      <Label>이미지</Label>
      <ImageUploader
        id="post-images"
        files={imageFiles}
        onChange={setImageFiles}
      />

      <SubmitButton onClick={handleRegister} disabled={isSubmitting}>
        {isSubmitting ? "등록 중..." : "게시글 등록하기"}
      </SubmitButton>
    </WriteContainer>
  );
};

export default WritePost;
