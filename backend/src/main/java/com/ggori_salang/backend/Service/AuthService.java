package com.ggori_salang.backend.Service;


import com.ggori_salang.backend.dao.UserDAO;
import com.ggori_salang.backend.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserDAO userDAO;
    private final PasswordEncoder passwordEncoder;

    public boolean signup(UserVO user) {
        if (userDAO.existsByEmail(user.getEmail())) return false;
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userDAO.insertUser(user) > 0;
    }

    public Map<String, String> login(String email, String password) {
        return userDAO.findByEmail(email)
                .map(user -> {
                    if (!passwordEncoder.matches(password, user.getPassword())) {
                        Map<String, String> result = new HashMap<>();
                        result.put("errorCode", "PASSWORD_MISMATCH");
                        result.put("message", "비밀번호가 틀렸습니다.");
                        return result;
                    }

                    Map<String, String> result = new HashMap<>();
                    result.put("role", user.getRole() == null ? "USER" : user.getRole());
                    result.put("nickname", user.getNickname());
                    result.put("userId", String.valueOf(user.getUserId()));
                    result.put("email", user.getEmail());
                    return result;
                })
                .orElseGet(() -> {
                    Map<String, String> result = new HashMap<>();
                    result.put("errorCode", "EMAIL_NOT_FOUND");
                    result.put("message", "아이디를 확인해주세요.");
                    return result;
                });
    }

    public boolean isEmailDuplicated(String email) {
        return userDAO.existsByEmail(email);
    }

    public boolean isNicknameDuplicated(String nickname) {
        return userDAO.existsByNickname(nickname);
    }

    public Optional<String> findEmailByPhone(String phone) {
        return userDAO.findByPhone(normalizePhone(phone))
                .map(UserVO::getEmail);
    }

    public boolean verifyPasswordResetUser(String email, String phone) {
        if (email == null || email.isBlank()) return false;
        return userDAO.findByEmail(email.trim())
                .map(user -> normalizePhone(user.getPhone()).equals(normalizePhone(phone)))
                .orElse(false);
    }

    public boolean resetPassword(String email, String phone, String newPassword) {
        if (newPassword == null || newPassword.isBlank() || newPassword.length() < 8) return false;
        if (!verifyPasswordResetUser(email, phone)) return false;

        String encodedPassword = passwordEncoder.encode(newPassword);
        return userDAO.updatePasswordByEmailAndPhone(
                email.trim(),
                normalizePhone(phone),
                encodedPassword
        ) > 0;
    }

    private String normalizePhone(String phone) {
        return phone == null ? "" : phone.replaceAll("\\D", "");
    }
}
