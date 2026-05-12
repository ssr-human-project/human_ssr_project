package com.ggori_salang.backend.Service;


import com.ggori_salang.backend.dao.ReviewDAO;
import com.ggori_salang.backend.vo.ReviewVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewDAO reviewDAO;

    public List<ReviewVO> getReviewList() {
        return reviewDAO.findAll();
    }

    @Transactional
    public Map<String, Object> getReviewDetail(int reviewId) {
        reviewDAO.incrementViewCount(reviewId);
        ReviewVO review = reviewDAO.findById(reviewId);
        List<String> images = reviewDAO.findImagesByReviewId(reviewId);
        review.setImageUrls(images);

        Map<String, Object> result = new HashMap<>();
        result.put("review", review);
        return result;
    }

    @Transactional
    public boolean writeReview(ReviewVO review) {
        int result = reviewDAO.insert(review);
        if (result > 0 && review.getImageUrls() != null) {
            int reviewId = reviewDAO.getLastInsertedId();
            for (String url : review.getImageUrls()) {
                reviewDAO.insertImage(reviewId, url);
            }
        }
        return result > 0;
    }

    public boolean updateReview(ReviewVO review) {
        return reviewDAO.update(review) > 0;
    }

    public boolean deleteReview(int reviewId) {
        return reviewDAO.delete(reviewId) > 0;
    }
}
