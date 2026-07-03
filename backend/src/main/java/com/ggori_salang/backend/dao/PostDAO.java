package com.ggori_salang.backend.dao;

import com.ggori_salang.backend.vo.PostVO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class PostDAO {
    private final JdbcTemplate jdbcTemplate;

    public List<PostVO> findAll() {
        String sql = "SELECT p.*, u.nickname FROM POSTS p " +
                "JOIN USERS u ON p.user_id = u.user_id " +
                "ORDER BY p.created_at DESC";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(PostVO.class));
    }

    public PostVO findById(int postId) {
        String sql = "SELECT p.*, u.nickname FROM POSTS p " +
                "JOIN USERS u ON p.user_id = u.user_id " +
                "WHERE p.post_id = ?";
        return jdbcTemplate.queryForObject(sql,
                new BeanPropertyRowMapper<>(PostVO.class), postId);
    }

    public List<String> findImagesByPostId(int postId) {
        String sql = "SELECT image_url FROM POST_IMAGES WHERE post_id = ?";
        return jdbcTemplate.queryForList(sql, String.class, postId);
    }

    public List<PostVO> findByUserId(int userId) {
        String sql = "SELECT p.*, u.nickname FROM POSTS p " +
                "JOIN USERS u ON p.user_id = u.user_id " +
                "WHERE p.user_id = ? ORDER BY p.created_at DESC";
        return jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(PostVO.class), userId);
    }

    public int insert(PostVO post) {
        String sql = "INSERT INTO POSTS (user_id, title, content) " +
                "VALUES (?, ?, ?)";
        return jdbcTemplate.update(sql,
                post.getUserId(), post.getTitle(), post.getContent());
    }

    public int insertImage(int postId, String imageUrl) {
        String sql = "INSERT INTO POST_IMAGES (post_id, image_url) " +
                "VALUES (?, ?)";
        return jdbcTemplate.update(sql, postId, imageUrl);
    }

    public int update(PostVO post) {
        String sql = "UPDATE POSTS SET title=?, content=? WHERE post_id=?";
        return jdbcTemplate.update(sql,
                post.getTitle(), post.getContent(), post.getPostId());
    }

    public int delete(int postId) {
        return jdbcTemplate.update("DELETE FROM POSTS WHERE post_id=?", postId);
    }

    public int incrementViewCount(int postId) {
        return jdbcTemplate.update(
                "UPDATE POSTS SET view_count = view_count + 1 WHERE post_id=?", postId);
    }

    // 가장 최근에 삽입된 post_id 가져오기 (이미지 INSERT 시 필요)
    public int getLastInsertedId() {
        return jdbcTemplate.queryForObject(
                "SELECT LAST_INSERT_ID()", Integer.class);
    }

    public List<PostVO> searchPosts(String keyword) {
    String sql = """
        SELECT p.*, u.nickname
        FROM POSTS p
        JOIN USERS u ON p.user_id = u.user_id
        WHERE LOWER(p.title) LIKE LOWER(?)
           OR LOWER(p.content) LIKE LOWER(?)
        ORDER BY p.created_at DESC
    """;

    String likeKeyword = "%" + keyword + "%";

    return jdbcTemplate.query(
            sql,
            new BeanPropertyRowMapper<>(PostVO.class),
            likeKeyword,
            likeKeyword
    );
}
}
