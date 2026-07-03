package com.ggori_salang.backend.Service;


import com.ggori_salang.backend.dao.UserDAO;
import com.ggori_salang.backend.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

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
}
