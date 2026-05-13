package com.ggori_salang.backend.config;

import com.ggori_salang.backend.jwt.JwtAuthFilter;
import com.ggori_salang.backend.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // JWT 방식이므로 CSRF 비활성화
                .csrf(csrf -> csrf.disable())

                // JWT 방식이므로 세션 사용 안 함
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // CORS 설정 적용
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // URL별 권한 설정
                .authorizeHttpRequests(auth -> auth

                        // 회원가입, 로그인, 이메일/닉네임 중복체크 → 누구나
                        .requestMatchers("/api/auth/**").permitAll()

                        // 카페 조회 → 누구나 (비로그인도 가능)
                        .requestMatchers(HttpMethod.GET, "/api/cafes").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/cafes/**").permitAll()

                        // 지역 조회 → 누구나
                        .requestMatchers(HttpMethod.GET, "/api/regions/**").permitAll()

                        // 게시판/펫시터/리뷰 목록·상세 조회 → 누구나
                        .requestMatchers(HttpMethod.GET, "/api/posts/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/pet-sitter/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/reviews/**").permitAll()

                        // 카페 등록/수정/삭제 → ADMIN만
                        .requestMatchers(HttpMethod.POST,   "/api/cafes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,    "/api/cafes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/cafes/**").hasRole("ADMIN")

                        // 관리자 페이지 (Thymeleaf) → ADMIN만
                        .requestMatchers("/admin/**").hasRole("ADMIN")

                        // 나머지 모든 API → 로그인 필요
                        .anyRequest().authenticated()
                )

                // JWT 필터를 Security 필터 앞에 추가
                .addFilterBefore(
                        new JwtAuthFilter(jwtTokenProvider),
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    /** CORS 설정 - React(3000포트)에서 Spring Boot(8111포트)로 요청 허용 */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000")); // React 주소
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}