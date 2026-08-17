package com.lampanche.contactdirectory.files;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface PhotoStorageService {

    StoredPhoto store(MultipartFile file);

    Resource loadAsResource(String path);

    void delete(String path);
}
