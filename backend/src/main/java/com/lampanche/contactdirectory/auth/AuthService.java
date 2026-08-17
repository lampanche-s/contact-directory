package com.lampanche.contactdirectory.auth;

import com.lampanche.contactdirectory.admin.AdminUser;
import com.lampanche.contactdirectory.admin.AdminUserRepository;
import com.lampanche.contactdirectory.auth.dto.AdminSessionResponse;
import com.lampanche.contactdirectory.auth.dto.LoginRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    public static final String ADMIN_USER_ID_SESSION_KEY = "ADMIN_USER_ID";

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AdminUserRepository adminUserRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Optional<AdminSessionResponse> login(LoginRequest request, HttpSession session) {
        Optional<AdminUser> adminUserOptional = adminUserRepository
                .findByUsernameAndActiveTrue(request.getUsername());

        if (adminUserOptional.isEmpty()) {
            return Optional.empty();
        }

        AdminUser adminUser = adminUserOptional.get();

        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                adminUser.getPasswordHash()
        );

        if (!passwordMatches) {
            return Optional.empty();
        }

        adminUser.markLogin();
        adminUserRepository.save(adminUser);

        session.setAttribute(ADMIN_USER_ID_SESSION_KEY, adminUser.getId());

        return Optional.of(AdminSessionResponse.authenticated(adminUser));
    }

    @Transactional(readOnly = true)
    public AdminSessionResponse currentSession(HttpSession session) {
        UUID adminUserId = getAdminUserIdFromSession(session);

        if (adminUserId == null) {
            return AdminSessionResponse.unauthenticated();
        }

        return adminUserRepository.findByIdAndActiveTrue(adminUserId)
                .map(AdminSessionResponse::authenticated)
                .orElseGet(AdminSessionResponse::unauthenticated);
    }

    public void logout(HttpSession session) {
        session.invalidate();
    }

    private UUID getAdminUserIdFromSession(HttpSession session) {
        Object value = session.getAttribute(ADMIN_USER_ID_SESSION_KEY);

        if (value instanceof UUID uuid) {
            return uuid;
        }

        if (value instanceof String text) {
            try {
                return UUID.fromString(text);
            } catch (IllegalArgumentException ignored) {
                return null;
            }
        }

        return null;
    }
}
