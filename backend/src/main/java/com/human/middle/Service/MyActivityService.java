package com.human.middle.Service;

import com.human.middle.dao.PostDAO;
import com.human.middle.dao.PetSitterDAO;
import com.human.middle.dao.ReviewDAO;
import com.human.middle.vo.PostVO;
import com.human.middle.vo.PetSitterPostVO;
import com.human.middle.vo.ReviewVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MyActivityService {
    private final PostDAO postDAO;
    private final PetSitterDAO petSitterDAO;
    private final ReviewDAO reviewDAO;

    public List<PostVO> getMyPosts(int userId) {
        return postDAO.findByUserId(userId);
    }

    public List<PetSitterPostVO> getMyPetSitterPosts(int userId) {
        return petSitterDAO.findByUserId(userId);
    }

    public List<ReviewVO> getMyReviews(int userId) {
        return reviewDAO.findByUserId(userId);
    }
}