package com.lampanche.contactdirectory.admin;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AdminUserInitializer implements ApplicationRunner {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.initial-admin.username:admin}")
    private String initialAdminUsername;

    @Value("${app.initial-admin.password:}")
    private String initialAdminPassword;

    public AdminUserInitializer(
            AdminUserRepository adminUserRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (adminUserRepository.count() > 0) {
            return;
        }

        if (initialAdminPassword == null || initialAdminPassword.isBlank()) {
            return;
        }

        AdminUser adminUser = new AdminUser();
        adminUser.setUsername(initialAdminUsername);
        adminUser.setPasswordHash(passwordEncoder.encode(initialAdminPassword));
        adminUser.setRole(AdminRole.ADMIN);

        adminUserRepository.save(adminUser);
    }
}
