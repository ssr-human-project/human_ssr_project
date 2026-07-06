import React, { useEffect, useState } from "react";
import styled from "styled-components";

const ImageActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const ImageSelectButton = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 11px 16px;
  border: 1px solid #ff6b35;
  border-radius: 8px;
  color: #ff6b35;
  background: #fff7f3;
  font-weight: 700;
  cursor: pointer;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ImageCount = styled.span`
  color: #777;
  font-size: 0.9rem;
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 12px;
  margin-top: 14px;
`;

const PreviewItem = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #eee;
  background: #f9f9f9;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.62);
  color: white;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
`;

const ImageUploader = ({ id, files, onChange, maxFiles = 5 }) => {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const nextPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setPreviews(nextPreviews);

    return () => {
      nextPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [files]);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    const imageFiles = selectedFiles.filter((file) => file.type.startsWith("image/"));
    const validFiles = imageFiles.filter((file) => file.size <= 5 * 1024 * 1024);

    if (selectedFiles.length !== imageFiles.length) {
      alert("이미지 파일만 선택할 수 있습니다.");
    }

    if (imageFiles.length !== validFiles.length) {
      alert("5MB 이하 이미지만 업로드할 수 있습니다.");
    }

    const nextFiles = [...files, ...validFiles].slice(0, maxFiles);
    if (files.length + validFiles.length > maxFiles) {
      alert(`이미지는 최대 ${maxFiles}장까지 선택할 수 있습니다.`);
    }

    onChange(nextFiles);
    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    onChange(files.filter((_, fileIndex) => fileIndex !== index));
  };

  return (
    <>
      <ImageActions>
        <ImageSelectButton htmlFor={id}>이미지 선택</ImageSelectButton>
        <HiddenFileInput
          id={id}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        <ImageCount>{files.length}/{maxFiles}</ImageCount>
      </ImageActions>

      {previews.length > 0 && (
        <PreviewGrid>
          {previews.map((preview, index) => (
            <PreviewItem key={`${preview.file.name}-${preview.file.lastModified}-${index}`}>
              <img src={preview.url} alt={`선택 이미지 ${index + 1}`} />
              <RemoveImageButton
                type="button"
                onClick={() => handleRemoveImage(index)}
                aria-label="이미지 삭제"
              >
                &times;
              </RemoveImageButton>
            </PreviewItem>
          ))}
        </PreviewGrid>
      )}
    </>
  );
};

export default ImageUploader;
