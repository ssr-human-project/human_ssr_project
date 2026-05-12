package com.ggori_salang.backend.Service;


import com.ggori_salang.backend.dao.PetSitterDAO;
import com.ggori_salang.backend.vo.PetSitterPostVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PetSitterService {
    private final PetSitterDAO petSitterDAO;

    public List<PetSitterPostVO> getSitterList() {
        return petSitterDAO.findAll();
    }

    @Transactional
    public Map<String, Object> getSitterDetail(int postId) {
        petSitterDAO.incrementViewCount(postId);
        PetSitterPostVO post = petSitterDAO.findById(postId);
        List<String> images = petSitterDAO.findImagesByPostId(postId);
        post.setImageUrls(images);

        Map<String, Object> result = new HashMap<>();
        result.put("post", post);
        return result;
    }

    @Transactional
    public boolean writeSitterPost(PetSitterPostVO post) {
        int result = petSitterDAO.insert(post);
        if (result > 0 && post.getImageUrls() != null) {
            int postId = petSitterDAO.getLastInsertedId();
            for (String url : post.getImageUrls()) {
                petSitterDAO.insertImage(postId, url);
            }
        }
        return result > 0;
    }

    public boolean updateSitterPost(PetSitterPostVO post) {
        return petSitterDAO.update(post) > 0;
    }

    public boolean deleteSitterPost(int postId) {
        return petSitterDAO.delete(postId) > 0;
    }
}
