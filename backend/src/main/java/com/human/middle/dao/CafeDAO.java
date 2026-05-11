package com.human.middle.dao;

import com.human.middle.vo.CafeVO;
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
        return jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(CafeVO.class), regionId);
    }

    // 동적 필터링 (petType, maxWeight 선택적)
    public List<CafeVO> findByFilters(int regionId, String petType, Double maxWeight) {
        StringBuilder sql = new StringBuilder("SELECT * FROM CAFES WHERE region_id = ?");
        List<Object> params = new ArrayList<>();
        params.add(regionId);

        if (petType != null && !petType.isEmpty()) {
            sql.append(" AND allowed_pet_types LIKE ?");
            params.add("%" + petType + "%");
        }
        if (maxWeight != null && maxWeight > 0) {
            sql.append(" AND max_weight >= ?");
            params.add(maxWeight);
        }

        return jdbcTemplate.query(sql.toString(),
                new BeanPropertyRowMapper<>(CafeVO.class), params.toArray());
    }

    public CafeVO findById(int cafeId) {
        String sql = "SELECT * FROM CAFES WHERE cafe_id = ?";
        return jdbcTemplate.queryForObject(sql,
                new BeanPropertyRowMapper<>(CafeVO.class), cafeId);
    }

    public List<String> findImagesByCafeId(int cafeId) {
        String sql = "SELECT image_url FROM CAFE_IMAGES WHERE cafe_id = ?";
        return jdbcTemplate.queryForList(sql, String.class, cafeId);
    }

    public int insertCafe(CafeVO cafe) {
        String sql = "INSERT INTO CAFES (cafe_id, region_id, cafe_name, address, phone, description, " +
                "allowed_pet_types, max_weight, latitude, longitude, naver_map_url) " +
                "VALUES (SEQ_CAFE.NEXTVAL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                cafe.getRegionId(), cafe.getCafeName(), cafe.getAddress(),
                cafe.getPhone(), cafe.getDescription(), cafe.getAllowedPetTypes(),
                cafe.getMaxWeight(), cafe.getLatitude(), cafe.getLongitude(),
                cafe.getNaverMapUrl()); //추가
    }

    public int insertCafeImage(int cafeId, String imageUrl) {
        String sql = "INSERT INTO CAFE_IMAGES (image_id, cafe_id, image_url) " +
                "VALUES (SEQ_CAFE_IMAGE.NEXTVAL, ?, ?)";
        return jdbcTemplate.update(sql, cafeId, imageUrl);
    }

    public int updateCafe(CafeVO cafe) {
        String sql = "UPDATE CAFES SET cafe_name=?, address=?, phone=?, description=?, " +
                "allowed_pet_types=?, max_weight=?, latitude=?, longitude=? " +
                "WHERE cafe_id=?";
        return jdbcTemplate.update(sql,
                cafe.getCafeName(), cafe.getAddress(), cafe.getPhone(),
                cafe.getDescription(), cafe.getAllowedPetTypes(), cafe.getMaxWeight(),
                cafe.getLatitude(), cafe.getLongitude(),
                cafe.getNaverMapUrl(),  // 추가
                cafe.getCafeId());
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
                "SELECT SEQ_CAFE.CURRVAL FROM DUAL", Integer.class);
    }

    public int updateRating(int cafeId) {
        // 리뷰는 CAFES 참조 없이 cafe_name으로 저장하므로 rating 갱신 없음
        // 필요 시 구현
        return 0;
    }
}