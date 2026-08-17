package com.lampanche.contactdirectory.contacts;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface ContactRepository extends JpaRepository<Contact, UUID> {

    Optional<Contact> findByIdAndActiveTrue(UUID id);

    @Query("""
            SELECT c
            FROM Contact c
            WHERE c.active = true
              AND (
                    :search IS NULL
                    OR :search = ''
                    OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(c.sector) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(c.extension) LIKE LOWER(CONCAT('%', :search, '%'))
              )
            """)
    Page<Contact> searchActiveContacts(String search, Pageable pageable);
}
