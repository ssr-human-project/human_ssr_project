package com.ggori_salang.backend.vo;


import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
public class ReviewVO {
    private int reviewId;
    private int userId;
    private String nickname;  // 작성자 닉네임 (JOIN)
    private String cafeName;  // 카페명 직접 저장
    private String title;
    private String content;
    private int rating;       // 별점 1~5
    private int viewCount;
    private Date createdAt;
    private List<String> imageUrls;  // Firebase URL 목록
}
