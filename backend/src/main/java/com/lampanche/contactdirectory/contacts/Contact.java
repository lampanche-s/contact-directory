package com.lampanche.contactdirectory.contacts;

import com.lampanche.contactdirectory.files.StoredPhoto;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "contacts")
public class Contact {

    @Id
    private UUID id;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "sector", nullable = false, length = 120)
    private String sector;

    @Column(name = "extension", nullable = false, length = 30)
    private String extension;

    @Column(name = "email", length = 180)
    private String email;

    @Column(name = "phone", length = 30)
    private String phone;

    @Column(name = "phone_digits", length = 20)
    private String phoneDigits;

    @Column(name = "photo_path", length = 500)
    private String photoPath;

    @Column(name = "photo_content_type", length = 80)
    private String photoContentType;

    @Column(name = "photo_size_bytes")
    private Long photoSizeBytes;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    @PrePersist
    void prePersist() {
        Instant now = Instant.now();

        if (id == null) {
            id = UUID.randomUUID();
        }

        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = normalizeText(name);
    }

    public String getSector() {
        return sector;
    }

    public void setSector(String sector) {
        this.sector = normalizeText(sector);
    }

    public String getExtension() {
        return extension;
    }

    public void setExtension(String extension) {
        this.extension = normalizeText(extension);
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = normalizeNullableText(email);
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = normalizeNullableText(phone);
        this.phoneDigits = onlyDigits(phone);
    }

    public String getPhoneDigits() {
        return phoneDigits;
    }

    public void setPhoneDigits(String phoneDigits) {
        this.phoneDigits = normalizeNullableText(phoneDigits);
    }

    public String getPhotoPath() {
        return photoPath;
    }

    public void setPhotoPath(String photoPath) {
        this.photoPath = normalizeNullableText(photoPath);
    }

    public String getPhotoContentType() {
        return photoContentType;
    }

    public void setPhotoContentType(String photoContentType) {
        this.photoContentType = normalizeNullableText(photoContentType);
    }

    public Long getPhotoSizeBytes() {
        return photoSizeBytes;
    }

    public void setPhotoSizeBytes(Long photoSizeBytes) {
        this.photoSizeBytes = photoSizeBytes;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Instant getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(Instant deletedAt) {
        this.deletedAt = deletedAt;
    }

    public void deactivate() {
        this.active = false;
        this.deletedAt = Instant.now();
    }

    public void setPhoto(StoredPhoto storedPhoto) {
        this.photoPath = storedPhoto.getPath();
        this.photoContentType = storedPhoto.getContentType();
        this.photoSizeBytes = storedPhoto.getSizeBytes();
    }

    public void removePhoto() {
        this.photoPath = null;
        this.photoContentType = null;
        this.photoSizeBytes = null;
    }

    private String normalizeText(String value) {
        return value == null ? null : value.trim();
    }

    private String normalizeNullableText(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();
        return normalized.isBlank() ? null : normalized;
    }

    private String onlyDigits(String value) {
        if (value == null) {
            return null;
        }

        String digits = value.replaceAll("\\D", "");
        return digits.isBlank() ? null : digits;
    }
}
