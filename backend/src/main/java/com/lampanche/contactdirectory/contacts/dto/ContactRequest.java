package com.lampanche.contactdirectory.contacts.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ContactRequest {

    @NotBlank(message = "Name is required.")
    @Size(max = 150, message = "Name must be no longer than 150 characters.")
    private String name;

    @NotBlank(message = "Department is required.")
    @Size(max = 120, message = "Department must be no longer than 120 characters.")
    private String sector;

    @NotBlank(message = "Extension is required.")
    @Size(max = 30, message = "Extension must be no longer than 30 characters.")
    private String extension;

    @Email(message = "Invalid email address.")
    @Size(max = 180, message = "Email must be no longer than 180 characters.")
    private String email;

    @Size(max = 30, message = "Phone must be no longer than 30 characters.")
    private String phone;

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
}
