package com.human.middle.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    // 256bit 이상의 시크릿 키 (실제 운영시 application.properties로 분리 권장)
    private static final String SECRET = "ggori-sallang-secret-key-must-be-256bit!!";
    private static final long EXPIRATION_MS = 1000L * 60 * 60 * 24; // 24시간

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    /**
     * JWT 토큰 생성
     * @param userId 유저 PK
     * @param role   "USER" or "ADMIN"
     */
    public String generateToken(int userId, String role) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact()
                .trim(); // 추가
    }

    /** 토큰에서 userId 추출 */
    public int getUserId(String token) {
        return Integer.parseInt(getClaims(token).getSubject());
    }

    /** 토큰에서 role 추출 */
    public String getRole(String token) {
        return (String) getClaims(token).get("role");
    }

    /** 토큰 유효성 검사 */
    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}