package com.ggori_salang.backend.controller;

import com.ggori_salang.backend.Service.ImageUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
public class ImageUploadController {
    private final ImageUploadService imageUploadService;

    @PostMapping("/images")
    public ResponseEntity<Map<String, List<String>>> uploadImages(
            @RequestParam("files") List<MultipartFile> files
    ) {
        List<String> imageUrls = imageUploadService.uploadImages(files).stream()
                .map(path -> ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path(path)
                        .toUriString())
                .toList();

        return ResponseEntity.ok(Map.of(
                "imageUrls",
                imageUrls
        ));
    }

    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<Map<String, String>> handleUploadException(RuntimeException exception) {
        return ResponseEntity.badRequest().body(Map.of("message", exception.getMessage()));
    }
}
