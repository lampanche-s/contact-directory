package com.lampanche.contactdirectory.admin;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AdminUserRepository extends JpaRepository<AdminUser, UUID> {

    Optional<AdminUser> findByUsernameAndActiveTrue(String username);

    Optional<AdminUser> findByIdAndActiveTrue(UUID id);
}
