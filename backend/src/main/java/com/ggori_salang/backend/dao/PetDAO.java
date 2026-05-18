package com.ggori_salang.backend.dao;

import com.ggori_salang.backend.dto.PetResponse;
import com.ggori_salang.backend.dto.PetSaveReq;
import com.ggori_salang.backend.vo.PetVO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class PetDAO {

    private final JdbcTemplate jdbcTemplate;

    // 기존 기능: 유저의 반려동물 목록 조회
    public List<PetVO> findByUserId(int userId) {
        String sql = "SELECT * FROM USER_PETS WHERE user_id = ?";

        return jdbcTemplate.query(
                sql,
                new BeanPropertyRowMapper<>(PetVO.class),
                userId
        );
    }

    // 기존 기능: 반려동물 등록
    public int insertPet(PetVO pet) {
        String sql = """
            INSERT INTO USER_PETS (
                pet_id,
                user_id,
                pet_name,
                pet_type,
                breed,
                size_type,
                weight,
                description
            ) VALUES (
                SEQ_USER_PET.NEXTVAL,
                ?, ?, ?, ?, ?, ?, ?
            )
        """;

        return jdbcTemplate.update(
                sql,
                pet.getUserId(),
                pet.getPetName(),
                pet.getPetType(),
                pet.getBreed(),
                pet.getSizeType(),
                pet.getWeight(),
                pet.getDescription()
        );
    }

    // 기존 기능: 반려동물 수정
    public int updatePet(PetVO pet) {
        String sql = """
            UPDATE USER_PETS
            SET
                pet_name = ?,
                pet_type = ?,
                breed = ?,
                size_type = ?,
                weight = ?,
                description = ?
            WHERE pet_id = ?
        """;

        return jdbcTemplate.update(
                sql,
                pet.getPetName(),
                pet.getPetType(),
                pet.getBreed(),
                pet.getSizeType(),
                pet.getWeight(),
                pet.getDescription(),
                pet.getPetId()
        );
    }

    // 기존 기능: 반려동물 삭제
    public int deletePet(int petId) {
        String sql = "DELETE FROM USER_PETS WHERE pet_id = ?";
        return jdbcTemplate.update(sql, petId);
    }

    // 마이페이지 기능: 강아지 정보 1개 조회
    public PetResponse getPet(Long userId) {
        String sql = """
            SELECT
                pet_name AS petName,
                pet_type AS petType,
                breed,
                size_type AS sizeType,
                weight,
                description
            FROM USER_PETS
            WHERE user_id = ?
        """;

        List<PetResponse> result = jdbcTemplate.query(
                sql,
                new BeanPropertyRowMapper<>(PetResponse.class),
                userId
        );

        return result.isEmpty() ? null : result.get(0);
    }

    // 마이페이지 기능: 강아지 정보 최초 저장
    public void insertPet(Long userId, PetSaveReq req) {
        String sql = """
            INSERT INTO USER_PETS (
                pet_id,
                user_id,
                pet_name,
                pet_type,
                breed,
                size_type,
                weight,
                description
            ) VALUES (
                SEQ_USER_PET.NEXTVAL,
                ?, ?, ?, ?, ?, ?, ?
            )
        """;

        jdbcTemplate.update(
                sql,
                userId,
                req.getPetName(),
                req.getPetType(),
                req.getBreed(),
                req.getSizeType(),
                req.getWeight(),
                req.getDescription()
        );
    }

    // 마이페이지 기능: 강아지 정보 수정 저장
    public void updatePet(Long userId, PetSaveReq req) {
        String sql = """
            UPDATE USER_PETS
            SET
                pet_name = ?,
                pet_type = ?,
                breed = ?,
                size_type = ?,
                weight = ?,
                description = ?
            WHERE user_id = ?
        """;

        jdbcTemplate.update(
                sql,
                req.getPetName(),
                req.getPetType(),
                req.getBreed(),
                req.getSizeType(),
                req.getWeight(),
                req.getDescription(),
                userId
        );
    }
}