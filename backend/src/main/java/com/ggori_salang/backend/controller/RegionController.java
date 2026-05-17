package com.ggori_salang.backend.controller;

import com.ggori_salang.backend.Service.RegionService;
import com.ggori_salang.backend.vo.RegionVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/regions")
@RequiredArgsConstructor
public class RegionController {

    private final RegionService regionService;

    /**
     * 지역 전체 목록 조회 (비로그인도 가능)
     * GET /api/regions
     * 반환: 프론트엔드 로컬 이미지 매핑용 파일명 강제 주입
     */
    @GetMapping
    public ResponseEntity<List<RegionVO>> getRegionList() {
        List<RegionVO> list = regionService.getRegionList();

        // 💡 백엔드에서 리액트가 매핑할 수 있도록 imageUrl 필드를 강제로 가공합니다.
        for (RegionVO vo : list) {
            if (vo.getRegionName() == null) continue;

            switch (vo.getRegionName()) {
                case "서울": vo.setImageUrl("seoul.jpg"); break;
                case "부산": vo.setImageUrl("busan.jpg"); break;
                case "대구": vo.setImageUrl("daegu.jpg"); break;
                case "인천": vo.setImageUrl("incheon.jpg"); break;
                case "경주": vo.setImageUrl("gyeongju.jpg"); break;
                case "대전": vo.setImageUrl("daejeon.jpg"); break;
                case "울산": vo.setImageUrl("ulsan.jpg"); break;
                case "세종": vo.setImageUrl("sejong.jpg"); break;
                case "경기": vo.setImageUrl("gyeonggi.jpg"); break;
                case "강릉": vo.setImageUrl("gangneung.jpg"); break;
                case "제주": vo.setImageUrl("jeju.jpg"); break;
                default: vo.setImageUrl("seoul.jpg"); // 기본값
            }
        }

        return ResponseEntity.ok(list);
    }
}