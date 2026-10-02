package com.bookstore.bookstore.config;

import com.bookstore.bookstore.model.AppUser;
import com.bookstore.bookstore.repository.AppUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

/** Creates exactly one initial administrator only when the database has no ADMIN. */
@Component
public class AdminSeeder implements CommandLineRunner {
    private static final Logger LOG = LoggerFactory.getLogger(AdminSeeder.class);
    private final AppUserRepository users;
    private final BCryptPasswordEncoder passwordEncoder;
    @Value("${admin.name}") private String name;
    @Value("${admin.email}") private String email;
    @Value("${admin.password}") private String password;

    public AdminSeeder(AppUserRepository users, BCryptPasswordEncoder passwordEncoder) { this.users = users; this.passwordEncoder = passwordEncoder; }

    @Override public void run(String... args) {
        int normalizedUsers = users.setMissingRolesToUser();
        if (normalizedUsers > 0) LOG.info("Normalized {} existing account(s) with no role to USER.", normalizedUsers);
        if (users.existsByRole("ADMIN")) { LOG.info("An ADMIN account already exists; initial admin creation skipped."); return; }
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase();
        if (normalizedEmail.isBlank() || password == null || password.length() < 6) { LOG.warn("Initial admin was not created: configure ADMIN_EMAIL and a password of at least 6 characters."); return; }
        if (users.findByEmail(normalizedEmail).isPresent() || users.findByContact(normalizedEmail).isPresent()) {
            LOG.warn("Initial admin was not created: configured ADMIN_EMAIL already belongs to a non-admin user. Resolve it explicitly; no role was changed."); return;
        }
        AppUser admin = new AppUser();
        admin.setName(name == null || name.isBlank() ? "Book Store Admin" : name.trim());
        admin.setEmail(normalizedEmail); admin.setContact(normalizedEmail); admin.setContactType("EMAIL");
        admin.setPasswordHash(passwordEncoder.encode(password)); admin.setEmailVerified(true); admin.setRole("ADMIN");
        users.save(admin);
        LOG.info("Initial ADMIN account created for {}.", normalizedEmail);
    }
}
