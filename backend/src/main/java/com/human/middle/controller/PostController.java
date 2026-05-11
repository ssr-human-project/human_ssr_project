package com.human.middle.controller;

import com.human.middle.Service.PostService;
import com.human.middle.vo.PostVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    /**
     * 자유게시판 목록 조회
     * GET /api/posts
     */
    @GetMapping
    public ResponseEntity<List<PostVO>> getPostList() {
        return ResponseEntity.ok(postService.getPostList());
    }

    /**
     * 자유게시판 상세 조회 (조회수 증가 포함)
     * GET /api/posts/{postId}
     */
    @GetMapping("/{postId}")
    public ResponseEntity<Map<String, Object>> getPostDetail(@PathVariable int postId) {
        return ResponseEntity.ok(postService.getPostDetail(postId));
    }

    /**
     * 자유게시판 글 작성 (이미지 URL 포함)
     * POST /api/posts
     * body: {
     *   "userId": 1,
     *   "title": "제목",
     *   "content": "내용",
     *   "imageUrls": ["https://firebase.../img1.jpg", "https://firebase.../img2.jpg"]
     * }
     */
    @PostMapping
    public ResponseEntity<String> writePost(@RequestBody PostVO post) {
        boolean isSuccess = postService.writePost(post);
        return isSuccess
                ? ResponseEntity.ok("게시글 작성 성공")
                : ResponseEntity.badRequest().body("게시글 작성 실패");
    }

    /**
     * 자유게시판 글 수정
     * PUT /api/posts/{postId}
     */
    @PutMapping("/{postId}")
    public ResponseEntity<String> updatePost(@PathVariable int postId, @RequestBody PostVO post) {
        post.setPostId(postId);
        boolean isSuccess = postService.updatePost(post);
        return isSuccess
                ? ResponseEntity.ok("게시글 수정 성공")
                : ResponseEntity.badRequest().body("게시글 수정 실패");
    }

    /**
     * 자유게시판 글 삭제
     * DELETE /api/posts/{postId}
     */
    @DeleteMapping("/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable int postId) {
        boolean isSuccess = postService.deletePost(postId);
        return isSuccess
                ? ResponseEntity.ok("게시글 삭제 성공")
                : ResponseEntity.badRequest().body("게시글 삭제 실패");
    }
}