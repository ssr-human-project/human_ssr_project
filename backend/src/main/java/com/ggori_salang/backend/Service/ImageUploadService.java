package com.ggori_salang.backend.Service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class ImageUploadService {
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;
    private final Path uploadRoot = Paths.get("uploads").toAbsolutePath().normalize();

    public List<String> uploadImages(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException("No image files were provided.");
        }

        return files.stream()
                .map(this::uploadImage)
                .toList();
    }

    private String uploadImage(MultipartFile file) {
        validateImage(file);

        try {
            String directoryName = LocalDate.now().toString();
            Path uploadDir = uploadRoot.resolve(directoryName).normalize();
            Files.createDirectories(uploadDir);

            String extension = getExtension(file.getOriginalFilename());
            String fileName = UUID.randomUUID() + extension;
            Path target = uploadDir.resolve(fileName).normalize();

            if (!target.startsWith(uploadRoot)) {
                throw new IllegalArgumentException("Invalid image path.");
            }

            file.transferTo(target);
            return "/uploads/" + directoryName + "/" + fileName;
        } catch (IOException e) {
            throw new IllegalStateException("Failed to upload image.", e);
        }
    }

    private void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Empty image files cannot be uploaded.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Image files must be 5MB or smaller.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files can be uploaded.");
        }
    }

    private String getExtension(String originalFilename) {
        String filename = StringUtils.cleanPath(originalFilename == null ? "" : originalFilename);
        int dotIndex = filename.lastIndexOf(".");
        return dotIndex >= 0 ? filename.substring(dotIndex).toLowerCase() : "";
    }
}
