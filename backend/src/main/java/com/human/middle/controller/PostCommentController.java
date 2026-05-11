package com.human.middle.controller;

import com.human.middle.Service.PostCommentService;
import com.human.middle.vo.PostCommentVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
@RequiredArgsConstructor
public class PostCommentController {

    private final PostCommentService postCommentService;

    /**
     * 자유게시판 댓글 목록 조회
     * GET /api/posts/{postId}/comments
     */
    @GetMapping
    public ResponseEntity<List<PostCommentVO>> getComments(@PathVariable int postId) {
        return ResponseEntity.ok(postCommentService.getComments(postId));
    }

    /**
     * 자유게시판 댓글 작성
     * POST /api/posts/{postId}/comments
     * body: { "userId": 1, "content": "댓글 내용" }
     */
    @PostMapping
    public ResponseEntity<String> writeComment(@PathVariable int postId, @RequestBody PostCommentVO comment) {
        comment.setPostId(postId);
        boolean isSuccess = postCommentService.writeComment(comment);
        return isSuccess
                ? ResponseEntity.ok("댓글 작성 성공")
                : ResponseEntity.badRequest().body("댓글 작성 실패");
    }

    /**
     * 자유게시판 댓글 삭제
     * DELETE /api/posts/{postId}/comments/{commentId}
     */
    @DeleteMapping("/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable int postId, @PathVariable int commentId) {
        boolean isSuccess = postCommentService.deleteComment(commentId);
        return isSuccess
                ? ResponseEntity.ok("댓글 삭제 성공")
                : ResponseEntity.badRequest().body("댓글 삭제 실패");
    }
}