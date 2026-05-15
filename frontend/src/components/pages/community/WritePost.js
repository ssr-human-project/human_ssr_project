import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const WriteContainer = styled.div`
  max-width: 850px;
  margin: 40px auto;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  font-family: "Pretendard", sans-serif;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin: 20px 0 10px;
  font-size: 0.95rem;

  span {
    color: #ff6b35;
    margin-left: 4px;
  }
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

  &:hover {
    background: #e55a2b;
  }
`;

const WritePost = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleRegister = async () => {
    const pureContent = content.replace(/<[^>]*>?/gm, "").trim();

    if (!title.trim() || !pureContent) {
      alert("제목과 내용은 필수입니다!");
      return;
    }

    const postData = {
      title,
      content,
      region: "전체",
      userId: 1,
      imageUrls: [],
    };

    try {
      const response = await axios.post(
        "http://localhost:8111/api/pet-sitter",
        postData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("게시글이 성공적으로 등록되었습니다!");
        navigate("/posts");
      }
    } catch (error) {
      console.error("등록 에러 상세:", error.response?.data || error.message);
      alert("게시글 등록에 실패했습니다. 서버 상태와 시큐리티 설정을 확인하세요!");
    }
  };

  return (
    <WriteContainer>
      <h2
        style={{
          marginBottom: "30px",
          borderBottom: "2px solid #ff6b35",
          paddingBottom: "10px",
          display: "inline-block",
        }}
      >
        자유게시판 글쓰기
      </h2>

      <Label>
        제목 <span>*</span>
      </Label>
      <input
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #eee",
          background: "#f9f9f9",
          boxSizing: "border-box",
          fontSize: "1rem",
        }}
        placeholder="글 제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Label>
        상세 내용 <span>*</span>
      </Label>
      <div
        style={{
          background: "#f9f9f9",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          style={{ height: "350px", marginBottom: "50px" }}
          placeholder="당신의 생각을 공유해주세요."
        />
      </div>

      <SubmitButton onClick={handleRegister}>게시글 등록하기</SubmitButton>
    </WriteContainer>
  );
};

export default WritePost;