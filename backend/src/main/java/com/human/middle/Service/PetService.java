package com.human.middle.Service;

import com.human.middle.dao.PetDAO;
import com.human.middle.vo.PetVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PetService {
    private final PetDAO petDAO;

    public List<PetVO> getMyPets(int userId) {
        return petDAO.findByUserId(userId);
    }

    public boolean registerPet(PetVO pet) {
        return petDAO.insertPet(pet) > 0;
    }

    public boolean updatePet(PetVO pet) {
        return petDAO.updatePet(pet) > 0;
    }

    public boolean deletePet(int petId) {
        return petDAO.deletePet(petId) > 0;
    }
}