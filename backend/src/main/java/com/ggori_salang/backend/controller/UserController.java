package com.ggori_salang.backend.controller;

import com.ggori_salang.backend.Service.UserService;
import com.ggori_salang.backend.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/api/users/{userId}")
    public ResponseEntity<?> getUser(@PathVariable Long userId) {
        UserVO user = userService.getUser(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(Map.of(
                "userId", String.valueOf(user.getUserId()),
                "email", user.getEmail() == null ? "" : user.getEmail(),
                "nickname", user.getNickname() == null ? "" : user.getNickname(),
                "phone", user.getPhone() == null ? "" : user.getPhone(),
                "role", user.getRole() == null ? "USER" : user.getRole()
        ));
    }

    @PutMapping("/api/users/{userId}/phone")
    public ResponseEntity<?> updatePhone(
            @PathVariable Long userId,
            @RequestBody Map<String, String> body
    ) {
        String phone = body.get("phone");

        boolean success = userService.updatePhone(userId, phone);

        return success
                ? ResponseEntity.ok("전화번호 저장 성공")
                : ResponseEntity.badRequest().body("전화번호 저장 실패");
    }
}