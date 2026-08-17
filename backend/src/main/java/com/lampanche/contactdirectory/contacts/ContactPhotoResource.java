package com.lampanche.contactdirectory.contacts;

import org.springframework.core.io.Resource;

public class ContactPhotoResource {

    private final Resource resource;
    private final String contentType;

    public ContactPhotoResource(Resource resource, String contentType) {
        this.resource = resource;
        this.contentType = contentType;
    }

    public Resource getResource() {
        return resource;
    }

    public String getContentType() {
        return contentType;
    }
}
