package com.human.middle.Service;

import com.human.middle.dao.RegionDAO;
import com.human.middle.vo.RegionVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RegionService {
    private final RegionDAO regionDAO;

    public List<RegionVO> getRegionList() {
        return regionDAO.findAll();
    }
}
