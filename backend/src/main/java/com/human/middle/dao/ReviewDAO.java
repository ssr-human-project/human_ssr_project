package com.human.middle.dao;

import com.human.middle.vo.ReviewVO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class ReviewDAO {
    private final JdbcTemplate jdbcTemplate;

    public List<ReviewVO> findAll() {
        String sql = "SELECT r.*, u.nickname FROM REVIEWS r " +
                "JOIN USERS u ON r.user_id = u.user_id " +
                "ORDER BY r.created_at DESC";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ReviewVO.class));
    }

    public ReviewVO findById(int reviewId) {
        String sql = "SELECT r.*, u.nickname FROM REVIEWS r " +
                "JOIN USERS u ON r.user_id = u.user_id " +
                "WHERE r.review_id = ?";
        return jdbcTemplate.queryForObject(sql,
                new BeanPropertyRowMapper<>(ReviewVO.class), reviewId);
    }

    public List<String> findImagesByReviewId(int reviewId) {
        String sql = "SELECT image_url FROM REVIEW_IMAGES WHERE review_id = ?";
        return jdbcTemplate.queryForList(sql, String.class, reviewId);
    }

    public List<ReviewVO> findByUserId(int userId) {
        String sql = "SELECT r.*, u.nickname FROM REVIEWS r " +
                "JOIN USERS u ON r.user_id = u.user_id " +
                "WHERE r.user_id = ? ORDER BY r.created_at DESC";
        return jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(ReviewVO.class), userId);
    }

    public int insert(ReviewVO review) {
        String sql = "INSERT INTO REVIEWS (review_id, user_id, cafe_name, title, content, rating) " +
                "VALUES (SEQ_REVIEW.NEXTVAL, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                review.getUserId(), review.getCafeName(),
                review.getTitle(), review.getContent(), review.getRating());
    }

    public int insertImage(int reviewId, String imageUrl) {
        String sql = "INSERT INTO REVIEW_IMAGES (image_id, review_id, image_url) " +
                "VALUES (SEQ_REVIEW_IMAGE.NEXTVAL, ?, ?)";
        return jdbcTemplate.update(sql, reviewId, imageUrl);
    }

    public int update(ReviewVO review) {
        String sql = "UPDATE REVIEWS SET cafe_name=?, title=?, content=?, rating=? " +
                "WHERE review_id=?";
        return jdbcTemplate.update(sql,
                review.getCafeName(), review.getTitle(),
                review.getContent(), review.getRating(), review.getReviewId());
    }

    public int delete(int reviewId) {
        return jdbcTemplate.update("DELETE FROM REVIEWS WHERE review_id=?", reviewId);
    }

    public int incrementViewCount(int reviewId) {
        return jdbcTemplate.update(
                "UPDATE REVIEWS SET view_count = view_count + 1 WHERE review_id=?", reviewId);
    }

    public int getLastInsertedId() {
        return jdbcTemplate.queryForObject(
                "SELECT SEQ_REVIEW.CURRVAL FROM DUAL", Integer.class);
    }
}