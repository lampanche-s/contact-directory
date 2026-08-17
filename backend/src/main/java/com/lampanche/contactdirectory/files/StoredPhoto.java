package com.lampanche.contactdirectory.files;

public class StoredPhoto {

    private final String path;
    private final String contentType;
    private final long sizeBytes;

    public StoredPhoto(String path, String contentType, long sizeBytes) {
        this.path = path;
        this.contentType = contentType;
        this.sizeBytes = sizeBytes;
    }

    public String getPath() {
        return path;
    }

    public String getContentType() {
        return contentType;
    }

    public long getSizeBytes() {
        return sizeBytes;
    }
}
