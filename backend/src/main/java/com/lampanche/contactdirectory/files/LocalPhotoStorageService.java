package com.lampanche.contactdirectory.files;

import com.lampanche.contactdirectory.common.exception.BadRequestException;
import com.lampanche.contactdirectory.common.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Set;
import java.util.UUID;

@Service
public class LocalPhotoStorageService implements PhotoStorageService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    private final Path rootDirectory;
    private final long maxPhotoSizeBytes;

    public LocalPhotoStorageService(
            @Value("${app.storage.contact-photos-dir}") String contactPhotosDir,
            @Value("${app.upload.max-photo-size-bytes}") long maxPhotoSizeBytes
    ) {
        this.rootDirectory = Path.of(contactPhotosDir).toAbsolutePath().normalize();
        this.maxPhotoSizeBytes = maxPhotoSizeBytes;
    }

    @Override
    public StoredPhoto store(MultipartFile file) {
        validateFile(file);

        try {
            Files.createDirectories(rootDirectory);

            String contentType = file.getContentType();
            String filename = UUID.randomUUID() + extensionFor(contentType);

            Path destination = rootDirectory.resolve(filename).normalize();

            if (!destination.startsWith(rootDirectory)) {
                throw new BadRequestException("Invalid file path.");
            }

            file.transferTo(destination);

            return new StoredPhoto(
                    filename,
                    contentType,
                    file.getSize()
            );
        } catch (IOException exception) {
            throw new BadRequestException("Unable to save the photo.");
        }
    }

    @Override
    public Resource loadAsResource(String path) {
        try {
            Path filePath = rootDirectory.resolve(path).normalize();

            if (!filePath.startsWith(rootDirectory)) {
                throw new ResourceNotFoundException("Photo not found.");
            }

            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new ResourceNotFoundException("Photo not found.");
            }

            return resource;
        } catch (MalformedURLException exception) {
            throw new ResourceNotFoundException("Photo not found.");
        }
    }

    @Override
    public void delete(String path) {
        if (path == null || path.isBlank()) {
            return;
        }

        try {
            Path filePath = rootDirectory.resolve(path).normalize();

            if (!filePath.startsWith(rootDirectory)) {
                return;
            }

            Files.deleteIfExists(filePath);
        } catch (IOException ignored) {
            // Keep the main flow running if the physical file no longer exists.
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Photo was not provided.");
        }

        if (file.getSize() > maxPhotoSizeBytes) {
            throw new BadRequestException("The photo must be no larger than 5 MB.");
        }

        String contentType = file.getContentType();

        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new BadRequestException("Invalid photo format. Use JPG, PNG, or WEBP.");
        }
    }

    private String extensionFor(String contentType) {
        return switch (contentType) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> throw new BadRequestException("Invalid photo format.");
        };
    }
}
