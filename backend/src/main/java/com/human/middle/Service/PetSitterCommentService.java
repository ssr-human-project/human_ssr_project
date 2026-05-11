package com.human.middle.Service;

import com.human.middle.dao.PetSitterCommentDAO;
import com.human.middle.vo.PetSitterCommentVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PetSitterCommentService {
    private final PetSitterCommentDAO petSitterCommentDAO;

    public List<PetSitterCommentVO> getComments(int postId) {
        return petSitterCommentDAO.findByPostId(postId);
    }

    public boolean writeComment(PetSitterCommentVO comment) {
        return petSitterCommentDAO.insert(comment) > 0;
    }

    public boolean deleteComment(int commentId) {
        return petSitterCommentDAO.delete(commentId) > 0;
    }
}