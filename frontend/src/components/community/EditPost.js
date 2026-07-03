import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// --- 스타일 컴포넌트 (EditPetsitter.js 스타일 계승) ---
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

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. 상세 페이지(Post.js)에서 넘겨준 데이터가 있으면 사용하고, 없으면 초기값 설정
  const [title, setTitle] = useState(location.state?.post?.title || '');
  const [content, setContent] = useState(location.state?.post?.content || '');

  useEffect(() => {
    // 2. 만약 상세 페이지를 거치지 않고 직접 들어왔을 경우 데이터를 서버에서 다시 불러옴
    if (!location.state?.post) {
      const fetchPost = async () => {
        try {
          const response = await axios.get(`http://localhost:8111/api/posts/${id}`);
          setTitle(response.data.title);
          setContent(response.data.content);
        } catch (error) {
          console.error("데이터 로딩 실패:", error);
          alert("게시글을 불러올 수 없습니다.");
          navigate('/boards');
        }
      };
      fetchPost();
    }
  }, [id, location.state, navigate]);

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      // 3. PUT 메서드를 사용하여 게시글 수정 요청
      const response = await axios.put(`http://localhost:8111/api/posts/${id}`,
        {
          title: title,
          content: content
        }
      );

      if (response.status === 200) {
        alert("수정되었습니다!");

        // 4. 상세 페이지로 이동할 때 수정된 데이터를 다시 state에 담아 전달
        const updatedPost = {
          ...location.state?.post, // 기존 작성자 정보 등 유지
          title: title,
          content: content
        };

        navigate(`/posts/${id}`, { state: { post: updatedPost } });
      }
    } catch (error) {
      console.error("수정 에러:", error);
      alert("수정 권한이 없거나 오류가 발생했습니다.");
    }
  };

  return (
    <WriteContainer>
      <h2 style={{ borderBottom: '2px solid #ff6b35', paddingBottom: '10px' }}>커뮤니티 게시글 수정</h2>

      <Label>제목</Label>
      <InputField
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Label>상세 내용</Label>
      <div style={{ background: '#f9f9f9', marginBottom: '50px' }}>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          style={{ height: '350px' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: '30%', marginTop: '30px', padding: '15px', background: '#eee', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          취소
        </button>
        <SubmitButton onClick={handleUpdate}>수정 완료</SubmitButton>
      </div>
    </WriteContainer>
  );
};

export default EditPost;
