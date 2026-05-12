package com.human.middle.Service;

import com.human.middle.dao.PostCommentDAO;
import com.human.middle.vo.PostCommentVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostCommentService {
    private final PostCommentDAO postCommentDAO;

    public List<PostCommentVO> getComments(int postId) {
        return postCommentDAO.findByPostId(postId);
    }

    public boolean writeComment(PostCommentVO comment) {
        return postCommentDAO.insert(comment) > 0;
    }

    public boolean deleteComment(int commentId) {
        return postCommentDAO.delete(commentId) > 0;
    }
}