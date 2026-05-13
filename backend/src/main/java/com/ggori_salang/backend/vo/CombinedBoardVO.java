package com.ggori_salang.backend.vo;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CombinedBoardVO {
    private int id;             // 게시글 ID
    private String category;    // FREE, SITTER, REVIEW 구분
    private String title;       // 제목
    private String content;     // 내용
    private String nickname;    // 작성자
    private String createdAt;   // 작성일
    private String location;    // 지역 (펫시터/리뷰용)
    private double rating;      // 평점 (리뷰 전용)
    private String thumbnail;   // 목록에 보여줄 대표 이미지 하나
}