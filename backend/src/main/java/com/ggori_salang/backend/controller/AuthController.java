package com.ggori_salang.backend.controller;

import com.ggori_salang.backend.Service.AuthService;
import com.ggori_salang.backend.vo.UserVO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * 회원가입
     * POST /api/auth/signup
     */
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody UserVO user) {
        boolean isSuccess = authService.signup(user);
        return isSuccess
                ? ResponseEntity.ok("회원가입 성공")
                : ResponseEntity.badRequest().body("회원가입 실패");
    }

    /**
     * 로그인 - 세션 생성
     * POST /api/auth/login
     * 반환 예시: { "userId": "1", "role": "USER", "nickname": "회원" }
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody UserVO user,
                                                     HttpServletRequest request) {
        Map<String, String> result = authService.login(user.getEmail(), user.getPassword());

        if (result.containsKey("errorCode")) {
            return ResponseEntity.status(401).body(result);
        }

        int userId = Integer.parseInt(result.get("userId"));
        String role = result.getOrDefault("role", "USER");
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        userId,
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + role))
                );

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        HttpSession session = request.getSession(true);
        session.setAttribute(
                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                context
        );

        return ResponseEntity.ok(result);
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof Integer userId)) {
            return ResponseEntity.status(401).body(Map.of("message", "로그인이 필요합니다."));
        }

        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority().replaceFirst("^ROLE_", ""))
                .orElse("USER");

        return ResponseEntity.ok(Map.of(
                "userId", String.valueOf(userId),
                "role", role
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(Map.of("message", "로그아웃 성공"));
    }

    /**
     * 이메일 중복 체크
     * GET /api/auth/check-email?email=xxx@xxx.com
     * true: 중복됨, false: 사용 가능
     */
    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
        return ResponseEntity.ok(authService.isEmailDuplicated(email));
    }

    /**
     * 닉네임 중복 체크
     * GET /api/auth/check-nickname?nickname=xxx
     */
    @GetMapping("/check-nickname")
    public ResponseEntity<Boolean> checkNickname(@RequestParam String nickname) {
        return ResponseEntity.ok(authService.isNicknameDuplicated(nickname));
    }
}
