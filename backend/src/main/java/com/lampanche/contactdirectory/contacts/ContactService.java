package com.lampanche.contactdirectory.contacts;

import com.lampanche.contactdirectory.common.exception.ResourceNotFoundException;
import com.lampanche.contactdirectory.common.web.PageResponse;
import com.lampanche.contactdirectory.contacts.dto.ContactRequest;
import com.lampanche.contactdirectory.contacts.dto.ContactResponse;
import com.lampanche.contactdirectory.files.PhotoStorageService;
import com.lampanche.contactdirectory.files.StoredPhoto;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public class ContactService {

    private static final int DEFAULT_PAGE_SIZE = 6;
    private static final int MAX_PAGE_SIZE = 50;

    private final ContactRepository contactRepository;
    private final PhotoStorageService photoStorageService;

    public ContactService(
            ContactRepository contactRepository,
            PhotoStorageService photoStorageService
    ) {
        this.contactRepository = contactRepository;
        this.photoStorageService = photoStorageService;
    }

    @Transactional(readOnly = true)
    public PageResponse<ContactResponse> list(String search, int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = normalizePageSize(size);

        Pageable pageable = PageRequest.of(
                safePage,
                safeSize,
                Sort.by(Sort.Direction.ASC, Contact::getName)
        );

        Page<Contact> contacts = contactRepository.searchActiveContacts(
                normalizeSearch(search),
                pageable
        );

        return PageResponse.fromPage(contacts, ContactResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public ContactResponse findById(UUID id) {
        Contact contact = findActiveContactOrThrow(id);
        return ContactResponse.fromEntity(contact);
    }

    @Transactional
    public ContactResponse create(ContactRequest request) {
        Contact contact = new Contact();

        applyRequestToContact(contact, request);

        Contact savedContact = contactRepository.save(contact);

        return ContactResponse.fromEntity(savedContact);
    }

    @Transactional
    public ContactResponse update(UUID id, ContactRequest request) {
        Contact contact = findActiveContactOrThrow(id);

        applyRequestToContact(contact, request);

        Contact savedContact = contactRepository.save(contact);

        return ContactResponse.fromEntity(savedContact);
    }

    @Transactional
    public void delete(UUID id) {
        Contact contact = findActiveContactOrThrow(id);

        if (contact.getPhotoPath() != null) {
            photoStorageService.delete(contact.getPhotoPath());
            contact.removePhoto();
        }

        contact.deactivate();

        contactRepository.save(contact);
    }

    @Transactional
    public ContactResponse uploadPhoto(UUID id, MultipartFile file) {
        Contact contact = findActiveContactOrThrow(id);

        String previousPhotoPath = contact.getPhotoPath();

        StoredPhoto storedPhoto = photoStorageService.store(file);
        contact.setPhoto(storedPhoto);

        Contact savedContact = contactRepository.save(contact);

        if (previousPhotoPath != null) {
            photoStorageService.delete(previousPhotoPath);
        }

        return ContactResponse.fromEntity(savedContact);
    }

    @Transactional(readOnly = true)
    public ContactPhotoResource getPhoto(UUID id) {
        Contact contact = findActiveContactOrThrow(id);

        if (contact.getPhotoPath() == null) {
            throw new ResourceNotFoundException("Photo not found.");
        }

        Resource resource = photoStorageService.loadAsResource(contact.getPhotoPath());

        return new ContactPhotoResource(
                resource,
                contact.getPhotoContentType()
        );
    }

    @Transactional
    public ContactResponse removePhoto(UUID id) {
        Contact contact = findActiveContactOrThrow(id);

        String previousPhotoPath = contact.getPhotoPath();

        contact.removePhoto();

        Contact savedContact = contactRepository.save(contact);

        if (previousPhotoPath != null) {
            photoStorageService.delete(previousPhotoPath);
        }

        return ContactResponse.fromEntity(savedContact);
    }

    private Contact findActiveContactOrThrow(UUID id) {
        return contactRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found."));
    }

    private void applyRequestToContact(Contact contact, ContactRequest request) {
        contact.setName(request.getName());
        contact.setSector(request.getSector());
        contact.setExtension(request.getExtension());
        contact.setEmail(request.getEmail());
        contact.setPhone(request.getPhone());
    }

    private String normalizeSearch(String search) {
        if (search == null) {
            return null;
        }

        String normalized = search.trim();

        return normalized.isBlank() ? null : normalized;
    }

    private int normalizePageSize(int size) {
        if (size <= 0) {
            return DEFAULT_PAGE_SIZE;
        }

        return Math.min(size, MAX_PAGE_SIZE);
    }
}
