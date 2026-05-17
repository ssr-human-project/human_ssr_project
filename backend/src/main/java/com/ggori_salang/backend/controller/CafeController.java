package com.ggori_salang.backend.controller;

import com.ggori_salang.backend.Service.CafeService;
import com.ggori_salang.backend.vo.CafeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cafes")
@RequiredArgsConstructor
public class CafeController {

    private final CafeService cafeService;

    @GetMapping
    public ResponseEntity<List<CafeVO>> getCafesByRegion(@RequestParam int regionId) {
        return ResponseEntity.ok(cafeService.getCafesByRegion(regionId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<CafeVO>> getAllCafes() {
        return ResponseEntity.ok(cafeService.getAllCafes());
    }

    @GetMapping("/search")
    public ResponseEntity<List<CafeVO>> searchCafes(
            @RequestParam int regionId,
            @RequestParam(required = false) List<String> petTypes,
            @RequestParam(required = false) Integer maxWeight // 💡 Double에서 Integer로 변경하여 프론트엔드와 일치시킴
    ) {
        return ResponseEntity.ok(
                cafeService.searchCafes(regionId, petTypes, maxWeight)
        );
    }

    @GetMapping("/search/keyword")
    public ResponseEntity<List<CafeVO>> searchCafesByKeyword(
            @RequestParam String keyword
    ) {
        return ResponseEntity.ok(
                cafeService.searchCafesByKeyword(keyword)
        );
    }

    @GetMapping("/{cafeId}")
    public ResponseEntity<Map<String, Object>> getCafeDetail(@PathVariable int cafeId) {
        return ResponseEntity.ok(cafeService.getCafeDetail(cafeId));
    }

    @PostMapping
    public ResponseEntity<String> createCafe(@RequestBody CafeVO cafe) {
        boolean isSuccess = cafeService.createCafe(cafe);

        return isSuccess
                ? ResponseEntity.ok("카페 등록 성공")
                : ResponseEntity.badRequest().body("카페 등록 실패");
    }

    @PutMapping("/{cafeId}")
    public ResponseEntity<String> updateCafe(
            @PathVariable int cafeId,
            @RequestBody CafeVO cafe
    ) {
        cafe.setCafeId(cafeId);
        boolean isSuccess = cafeService.updateCafe(cafe);

        return isSuccess
                ? ResponseEntity.ok("카페 수정 성공")
                : ResponseEntity.badRequest().body("카페 수정 실패");
    }

    @DeleteMapping("/{cafeId}")
    public ResponseEntity<String> deleteCafe(@PathVariable int cafeId) {
        boolean isSuccess = cafeService.deleteCafe(cafeId);

        return isSuccess
                ? ResponseEntity.ok("카페 삭제 성공")
                : ResponseEntity.badRequest().body("카페 삭제 실패");
    }
}