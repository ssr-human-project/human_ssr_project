package com.ggori_salang.backend.dao;

import com.ggori_salang.backend.vo.CafeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class CafeDAO {
    private final JdbcTemplate jdbcTemplate;

    public List<CafeVO> findByRegion(int regionId) {
        String sql = "SELECT * FROM CAFES WHERE region_id = ? ORDER BY cafe_id";
        return jdbcTemplate.query(
                sql,
                new BeanPropertyRowMapper<>(CafeVO.class),
                regionId
        );
    }

    public List<CafeVO> findByFilters(int regionId, List<String> petTypes, Integer maxWeight) {
        StringBuilder sql = new StringBuilder("SELECT * FROM CAFES WHERE region_id = ?");
        List<Object> params = new ArrayList<>();
        params.add(regionId);

        if (petTypes != null && !petTypes.isEmpty()) {
            sql.append(" AND (");
            for (int i = 0; i < petTypes.size(); i++) {
                if (i > 0) sql.append(" OR ");
                sql.append("allowed_pet_types LIKE ?");
                params.add("%" + petTypes.get(i) + "%");
            }
            sql.append(")");
        }

        if (maxWeight != null && maxWeight > 0) {
            sql.append(" AND max_weight <= ?");
            params.add(maxWeight);
        }

        sql.append(" ORDER BY cafe_id");

        return jdbcTemplate.query(
                sql.toString(),
                new BeanPropertyRowMapper<>(CafeVO.class),
                params.toArray()
        );
    }

    public List<CafeVO> findByKeyword(String keyword) {
        String sql = """
            SELECT *
            FROM CAFES
            WHERE LOWER(CAFE_NAME) LIKE LOWER(?)
               OR LOWER(ADDRESS) LIKE LOWER(?)
               OR LOWER(DESCRIPTION) LIKE LOWER(?)
            ORDER BY CAFE_ID DESC
        """;

        String likeKeyword = "%" + keyword + "%";

        return jdbcTemplate.query(
                sql,
                new BeanPropertyRowMapper<>(CafeVO.class),
                likeKeyword,
                likeKeyword,
                likeKeyword
        );
    }

    public CafeVO findById(int cafeId) {
        String sql = "SELECT * FROM CAFES WHERE cafe_id = ?";
        return jdbcTemplate.queryForObject(
                sql,
                new BeanPropertyRowMapper<>(CafeVO.class),
                cafeId
        );
    }

    public List<String> findImagesByCafeId(int cafeId) {
        String sql = "SELECT image_url FROM CAFE_IMAGES WHERE cafe_id = ? ORDER BY image_id";
        return jdbcTemplate.queryForList(sql, String.class, cafeId);
    }

    public int insertCafe(CafeVO cafe) {
        String sql = "INSERT INTO CAFES (region_id, cafe_name, address, phone, description, " +
                "allowed_pet_types, max_weight, latitude, longitude, naver_map_url) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        return jdbcTemplate.update(
                sql,
                cafe.getRegionId(),
                cafe.getCafeName(),
                cafe.getAddress(),
                cafe.getPhone(),
                cafe.getDescription(),
                cafe.getAllowedPetTypes(),
                cafe.getMaxWeight(),
                cafe.getLatitude(),
                cafe.getLongitude(),
                cafe.getNaverMapUrl()
        );
    }

    public int insertCafeImage(int cafeId, String imageUrl) {
        String sql = "INSERT INTO CAFE_IMAGES (cafe_id, image_url) " +
                "VALUES (?, ?)";

        return jdbcTemplate.update(sql, cafeId, imageUrl);
    }

    public int updateCafe(CafeVO cafe) {
        String sql = "UPDATE CAFES SET cafe_name=?, address=?, phone=?, description=?, " +
                "allowed_pet_types=?, max_weight=?, latitude=?, longitude=?, naver_map_url=? " +
                "WHERE cafe_id=?";

        return jdbcTemplate.update(
                sql,
                cafe.getCafeName(),
                cafe.getAddress(),
                cafe.getPhone(),
                cafe.getDescription(),
                cafe.getAllowedPetTypes(),
                cafe.getMaxWeight(),
                cafe.getLatitude(),
                cafe.getLongitude(),
                cafe.getNaverMapUrl(),
                cafe.getCafeId()
        );
    }

    public int deleteCafe(int cafeId) {
        return jdbcTemplate.update("DELETE FROM CAFES WHERE cafe_id=?", cafeId);
    }

    public int updateFavoriteCount(int cafeId, int delta) {
        String sql = "UPDATE CAFES SET favorite_count = favorite_count + ? WHERE cafe_id = ?";
        return jdbcTemplate.update(sql, delta, cafeId);
    }

    public int getLastInsertedId() {
        return jdbcTemplate.queryForObject(
                "SELECT LAST_INSERT_ID()",
                Integer.class
        );
    }

    public List<CafeVO> findAll() {
        String sql = "SELECT * FROM CAFES ORDER BY cafe_id DESC";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(CafeVO.class));
    }
}
