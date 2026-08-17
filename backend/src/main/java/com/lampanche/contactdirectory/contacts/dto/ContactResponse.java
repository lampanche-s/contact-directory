package com.lampanche.contactdirectory.contacts.dto;

import com.lampanche.contactdirectory.contacts.Contact;

import java.time.Instant;
import java.util.UUID;

public class ContactResponse {

    private UUID id;
    private String name;
    private String sector;
    private String extension;
    private String email;
    private String phone;
    private String photo;
    private boolean active;
    private Instant createdAt;
    private Instant updatedAt;

    public static ContactResponse fromEntity(Contact contact) {
        ContactResponse response = new ContactResponse();

        response.id = contact.getId();
        response.name = contact.getName();
        response.sector = contact.getSector();
        response.extension = contact.getExtension();
        response.email = contact.getEmail();
        response.phone = contact.getPhone();
        response.photo = buildPhotoUrl(contact);
        response.active = contact.isActive();
        response.createdAt = contact.getCreatedAt();
        response.updatedAt = contact.getUpdatedAt();

        return response;
    }

    private static String buildPhotoUrl(Contact contact) {
        if (contact.getPhotoPath() == null) {
            return null;
        }

        long version = contact.getUpdatedAt() == null
                ? System.currentTimeMillis()
                : contact.getUpdatedAt().toEpochMilli();

        return "/api/v1/contacts/" + contact.getId() + "/photo?v=" + version;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSector() {
        return sector;
    }

    public String getExtension() {
        return extension;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getPhoto() {
        return photo;
    }

    public boolean isActive() {
        return active;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
