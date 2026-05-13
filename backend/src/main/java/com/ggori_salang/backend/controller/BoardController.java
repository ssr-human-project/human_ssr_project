package com.ggori_salang.backend.controller;

import com.ggori_salang.backend.Service.BoardService;
import com.ggori_salang.backend.vo.CombinedBoardVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    /**
     * 모든 카테고리 게시글 통합 조회 (전체 목록용)
     * GET /api/board/all
     */
    @GetMapping("/all")
    public ResponseEntity<List<CombinedBoardVO>> getAllPosts() {
        List<CombinedBoardVO> list = boardService.getCombinedList();
        return ResponseEntity.ok(list);
    }
}