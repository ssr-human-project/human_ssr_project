import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// --- 스타일 컴포넌트 (WritePetsitter와 동일하게 유지) ---
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
`;

const EditPetsitter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. 상세 페이지에서 넘겨준 데이터가 있으면 바로 쓰고, 없으면 초기값 빈 문자열
  const [title, setTitle] = useState(location.state?.post?.title || '');
  const [content, setContent] = useState(location.state?.post?.content || '');
  const [region, setRegion] = useState(location.state?.post?.region || '');

  // 2. 만약 상세 페이지를 거치지 않고 바로 주소로 들어왔을 경우를 대비해 데이터를 다시 불러옴
  useEffect(() => {
    if (!location.state?.post) {
      const fetchPost = async () => {
        try {
          const response = await axios.get(`http://localhost:8111/api/pet-sitter/${id}`);
          setTitle(response.data.title);
          setContent(response.data.content);
          setRegion(response.data.region);
        } catch (error) {
          console.error("데이터 로딩 실패:", error);
          alert("게시글을 불러올 수 없습니다.");
          navigate('/petsitters');
        }
      };
      fetchPost();
    }
  }, [id, location.state, navigate]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");

    // 유효성 검사
    if (!title.trim() || !content.trim() || !region.trim()) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      // 3. PUT 메서드를 사용하여 게시글 수정 (팀원 코드의 updateSitterPost 방식)
      const response = await axios.put(`http://localhost:8111/api/pet-sitter/${id}`,
        {
          title: title,
          content: content,
          region: region
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
            alert("수정되었습니다!");

            // ⭐ 핵심 수정 부분: 상세 페이지로 이동할 때 수정된 데이터를 다시 담아줍니다.
            // 서버에서 수정된 전체 객체를 반환한다면 response.data를 사용하고,
            // 그렇지 않다면 현재 상태값들을 post 객체 형태로 묶어서 보냅니다.
            const updatedPost = {
              ...location.state.post, // 기존의 작성일, 작성자 정보 등 유지
              title: title,
              content: content,
              region: region
            };

            navigate(`/petsitters/${id}`, { state: { post: updatedPost } });
          }
        } catch (error) {
          console.error("수정 에러:", error);
          alert("수정 권한이 없거나 오류가 발생했습니다.");
        }
      };

  return (
    <WriteContainer>
      <h2 style={{ borderBottom: '2px solid #ff6b35', paddingBottom: '10px' }}>게시글 수정</h2>

      <Label>희망 지역</Label>
      <InputField value={region} onChange={(e) => setRegion(e.target.value)} />

      <Label>제목</Label>
      <InputField value={title} onChange={(e) => setTitle(e.target.value)} />

      <Label>상세 내용</Label>
      <div style={{ background: '#f9f9f9', marginBottom: '50px' }}>
        <ReactQuill theme="snow" value={content} onChange={setContent} style={{ height: '350px' }} />
      </div>

      <SubmitButton onClick={handleUpdate}>수정 완료</SubmitButton>
    </WriteContainer>
  );
};

export default EditPetsitter;