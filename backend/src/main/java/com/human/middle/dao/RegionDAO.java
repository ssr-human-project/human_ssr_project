package com.human.middle.dao;

import com.human.middle.vo.RegionVO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class RegionDAO {
    private final JdbcTemplate jdbcTemplate;

    public List<RegionVO> findAll() {
        String sql = "SELECT * FROM REGIONS ORDER BY region_id";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(RegionVO.class));
    }
}