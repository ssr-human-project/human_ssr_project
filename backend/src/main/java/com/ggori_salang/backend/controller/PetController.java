package com.ggori_salang.backend.controller;

import com.ggori_salang.backend.Service.PetService;
import com.ggori_salang.backend.dto.PetSaveReq;
import com.ggori_salang.backend.vo.PetVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    // 기존 기능: 반려동물 목록 조회
    @GetMapping("/api/pets/{userId}")
    public ResponseEntity<List<PetVO>> getMyPets(@PathVariable int userId) {
        return ResponseEntity.ok(petService.getMyPets(userId));
    }

    // 기존 기능: 반려동물 등록
    @PostMapping("/api/pets")
    public ResponseEntity<String> registerPet(@RequestBody PetVO pet) {
        boolean isSuccess = petService.registerPet(pet);
        return isSuccess
                ? ResponseEntity.ok("반려동물 등록 성공")
                : ResponseEntity.badRequest().body("반려동물 등록 실패");
    }

    // 기존 기능: 반려동물 수정
    @PutMapping("/api/pets/{petId}")
    public ResponseEntity<String> updatePet(@PathVariable int petId, @RequestBody PetVO pet) {
        pet.setPetId(petId);
        boolean isSuccess = petService.updatePet(pet);
        return isSuccess
                ? ResponseEntity.ok("반려동물 수정 성공")
                : ResponseEntity.badRequest().body("반려동물 수정 실패");
    }

    // 기존 기능: 반려동물 삭제
    @DeleteMapping("/api/pets/{petId}")
    public ResponseEntity<String> deletePet(@PathVariable int petId) {
        boolean isSuccess = petService.deletePet(petId);
        return isSuccess
                ? ResponseEntity.ok("반려동물 삭제 성공")
                : ResponseEntity.badRequest().body("반려동물 삭제 실패");
    }

    // 마이페이지: 강아지 정보 조회
    @GetMapping("/api/users/{userId}/pet")
    public ResponseEntity<?> getPet(@PathVariable Long userId) {
        return ResponseEntity.ok(petService.getPet(userId));
    }

    // 마이페이지: 강아지 정보 저장/수정
    @PutMapping("/api/users/{userId}/pet")
    public ResponseEntity<?> savePet(
            @PathVariable Long userId,
            @RequestBody PetSaveReq req
    ) {
        petService.savePet(userId, req);
        return ResponseEntity.ok(petService.getPet(userId));
    }
}