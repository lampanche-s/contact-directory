package com.lampanche.contactdirectory.contacts;

import com.lampanche.contactdirectory.common.web.PageResponse;
import com.lampanche.contactdirectory.contacts.dto.ContactRequest;
import com.lampanche.contactdirectory.contacts.dto.ContactResponse;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/contacts")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping
    public PageResponse<ContactResponse> list(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        return contactService.list(search, page, size);
    }

    @GetMapping("/{id}")
    public ContactResponse findById(@PathVariable UUID id) {
        return contactService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactResponse create(@Valid @RequestBody ContactRequest request) {
        return contactService.create(request);
    }

    @PutMapping("/{id}")
    public ContactResponse update(
            @PathVariable UUID id,
            @Valid @RequestBody ContactRequest request
    ) {
        return contactService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        contactService.delete(id);
    }

    @PostMapping(
            value = "/{id}/photo",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ContactResponse uploadPhoto(
            @PathVariable UUID id,
            @RequestParam("file") MultipartFile file
    ) {
        return contactService.uploadPhoto(id, file);
    }

    @GetMapping("/{id}/photo")
    public ResponseEntity<Resource> getPhoto(
            @PathVariable UUID id,
            @RequestParam(name = "v", required = false) Long version
    ) {
        ContactPhotoResource photo = contactService.getPhoto(id);

        ResponseEntity.BodyBuilder response = ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType(photo.getContentType()));

        if (version != null) {
            response.cacheControl(
                    CacheControl.maxAge(Duration.ofDays(365))
                            .cachePublic()
                            .immutable()
            );
        }

        return response.body(photo.getResource());
    }

    @DeleteMapping("/{id}/photo")
    public ContactResponse removePhoto(@PathVariable UUID id) {
        return contactService.removePhoto(id);
    }
}
