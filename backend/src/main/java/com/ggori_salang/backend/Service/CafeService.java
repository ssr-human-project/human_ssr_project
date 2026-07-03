package com.ggori_salang.backend.Service;

import com.ggori_salang.backend.dao.CafeDAO;
import com.ggori_salang.backend.vo.CafeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CafeService {
    private final CafeDAO cafeDAO;

    private void attachImages(List<CafeVO> cafes) {
        for (CafeVO cafe : cafes) {
            cafe.setImageUrls(
                    cafeDAO.findImagesByCafeId(cafe.getCafeId())
            );
        }
    }

    public List<CafeVO> getCafesByRegion(int regionId) {
        List<CafeVO> cafes = cafeDAO.findByRegion(regionId);
        attachImages(cafes);
        return cafes;
    }

    public List<CafeVO> searchCafes(
            int regionId,
            List<String> petTypes,
            Integer maxWeight
    ) {
        List<CafeVO> cafes = cafeDAO.findByFilters(regionId, petTypes, maxWeight);
        attachImages(cafes);
        return cafes;
    }

    public List<CafeVO> searchCafesByKeyword(String keyword) {
        List<CafeVO> cafes = cafeDAO.findByKeyword(keyword);
        attachImages(cafes);
        return cafes;
    }

    public Map<String, Object> getCafeDetail(int cafeId) {
        CafeVO cafe = cafeDAO.findById(cafeId);
        List<String> images = cafeDAO.findImagesByCafeId(cafeId);
        cafe.setImageUrls(images);

        Map<String, Object> result = new HashMap<>();
        result.put("cafe", cafe);
        return result;
    }

    @Transactional
    public boolean createCafe(CafeVO cafe) {
        int result = cafeDAO.insertCafe(cafe);

        if (result > 0 && cafe.getImageUrls() != null) {
            int cafeId = cafeDAO.getLastInsertedId();

            for (String url : cafe.getImageUrls()) {
                cafeDAO.insertCafeImage(cafeId, url);
            }
        }

        return result > 0;
    }

    public boolean updateCafe(CafeVO cafe) {
        return cafeDAO.updateCafe(cafe) > 0;
    }

    public boolean deleteCafe(int cafeId) {
        return cafeDAO.deleteCafe(cafeId) > 0;
    }

    public List<CafeVO> getAllCafes() {
        List<CafeVO> cafes = cafeDAO.findAll();
        attachImages(cafes);
        return cafes;
    }

    public CafeVO getCafeById(int cafeId) {
        CafeVO cafe = cafeDAO.findById(cafeId);
        cafe.setImageUrls(cafeDAO.findImagesByCafeId(cafeId));
        return cafe;
    }
}
