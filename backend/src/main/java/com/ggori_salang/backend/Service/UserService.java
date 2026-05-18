package com.ggori_salang.backend.Service;

import com.ggori_salang.backend.dao.UserDAO;
import com.ggori_salang.backend.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserDAO userDAO;

    public boolean updatePhone(Long userId, String phone) {
        return userDAO.updatePhone(userId, phone) > 0;
    }

    public Optional<UserVO> getUser(Long userId) {
        return userDAO.findByUserId(userId);
    }
}