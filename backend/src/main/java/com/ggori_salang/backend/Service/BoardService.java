package com.ggori_salang.backend.Service;

import com.ggori_salang.backend.vo.CombinedBoardVO;
import com.ggori_salang.backend.vo.PostVO;
import com.ggori_salang.backend.vo.PetSitterPostVO;
import com.ggori_salang.backend.vo.ReviewVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final PostService postService;
    private final PetSitterService petSitterService;
    private final ReviewService reviewService;

    private final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

    public List<CombinedBoardVO> getCombinedList() {
        List<CombinedBoardVO> combinedList = new ArrayList<>();

        // 1. 자유게시판 데이터
        List<PostVO> posts = postService.getPostList();
        for (PostVO p : posts) {
            combinedList.add(CombinedBoardVO.builder()
                    .id(p.getPostId())
                    .category("FREE")
                    .title(p.getTitle())
                    .content(p.getContent())
                    .nickname("사용자")
                    .createdAt(p.getCreatedAt() != null ? sdf.format(p.getCreatedAt()) : null)
                    // .views() 제거됨
                    .thumbnail(p.getImageUrls() != null && !p.getImageUrls().isEmpty() ? p.getImageUrls().get(0) : null)
                    .build());
        }

        // 2. 펫시터 게시판 데이터
        List<PetSitterPostVO> sitters = petSitterService.getSitterList();
        for (PetSitterPostVO s : sitters) {
            combinedList.add(CombinedBoardVO.builder()
                    .id(s.getPostId())
                    .category("SITTER")
                    .title(s.getTitle())
                    .content(s.getContent())
                    .location(s.getRegion())
                    .createdAt(s.getCreatedAt() != null ? sdf.format(s.getCreatedAt()) : null)
                    // .views() 제거됨
                    .build());
        }

        // 3. 리뷰 게시판 데이터
        List<ReviewVO> reviews = reviewService.getReviewList();
        for (ReviewVO r : reviews) {
            combinedList.add(CombinedBoardVO.builder()
                    .id(r.getReviewId())
                    .category("REVIEW")
                    .title(r.getTitle())
                    .content(r.getContent())
                    .rating(r.getRating())
                    .createdAt(r.getCreatedAt() != null ? sdf.format(r.getCreatedAt()) : null)
                    // .views() 제거됨
                    .thumbnail(r.getImageUrls() != null && !r.getImageUrls().isEmpty() ? r.getImageUrls().get(0) : null)
                    .build());
        }

        return combinedList.stream()
                .sorted(Comparator.comparing(CombinedBoardVO::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());
    }
}