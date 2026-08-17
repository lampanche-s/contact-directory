package com.lampanche.contactdirectory.security;

import com.lampanche.contactdirectory.admin.AdminUser;
import com.lampanche.contactdirectory.admin.AdminUserRepository;
import com.lampanche.contactdirectory.auth.AuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Component
public class AdminSessionAuthenticationFilter extends OncePerRequestFilter {

    private final AdminUserRepository adminUserRepository;

    public AdminSessionAuthenticationFilter(AdminUserRepository adminUserRepository) {
        this.adminUserRepository = adminUserRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            authenticateFromSession(request);
        }

        filterChain.doFilter(request, response);
    }

    private void authenticateFromSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session == null) {
            return;
        }

        UUID adminUserId = extractAdminUserId(session);

        if (adminUserId == null) {
            return;
        }

        adminUserRepository.findByIdAndActiveTrue(adminUserId)
                .ifPresent(this::setAuthentication);
    }

    private UUID extractAdminUserId(HttpSession session) {
        Object value = session.getAttribute(AuthService.ADMIN_USER_ID_SESSION_KEY);

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

    private void setAuthentication(AdminUser adminUser) {
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        adminUser.getUsername(),
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
                );

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
