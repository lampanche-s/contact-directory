package com.lampanche.contactdirectory.auth.dto;

import com.lampanche.contactdirectory.admin.AdminUser;

import java.util.UUID;

public class AdminSessionResponse {

    private final boolean authenticated;
    private final AdminInfo admin;

    public AdminSessionResponse(boolean authenticated, AdminInfo admin) {
        this.authenticated = authenticated;
        this.admin = admin;
    }

    public static AdminSessionResponse unauthenticated() {
        return new AdminSessionResponse(false, null);
    }

    public static AdminSessionResponse authenticated(AdminUser adminUser) {
        return new AdminSessionResponse(
                true,
                new AdminInfo(
                        adminUser.getId(),
                        adminUser.getUsername(),
                        adminUser.getRole().name()
                )
        );
    }

    public boolean isAuthenticated() {
        return authenticated;
    }

    public AdminInfo getAdmin() {
        return admin;
    }

    public static class AdminInfo {

        private final UUID id;
        private final String username;
        private final String role;

        public AdminInfo(UUID id, String username, String role) {
            this.id = id;
            this.username = username;
            this.role = role;
        }

        public UUID getId() {
            return id;
        }

        public String getUsername() {
            return username;
        }

        public String getRole() {
            return role;
        }
    }
}
