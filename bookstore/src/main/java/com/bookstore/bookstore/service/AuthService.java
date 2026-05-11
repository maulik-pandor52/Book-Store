package com.bookstore.bookstore.service;

import com.bookstore.bookstore.model.AppUser;
import com.bookstore.bookstore.repository.AppUserRepository;
import java.util.Optional;
import java.util.regex.Pattern;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^[0-9]{10,15}$");

    private final AppUserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(AppUserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String normalizeContact(String contact) {
        if (contact == null) {
            return "";
        }
        String trimmed = contact.trim();
        if (trimmed.contains("@")) {
            return trimmed.toLowerCase();
        }
        return trimmed.replaceAll("[^0-9]", "");
    }

    public String detectContactType(String contact) {
        if (EMAIL_PATTERN.matcher(contact).matches()) {
            return "EMAIL";
        }
        if (PHONE_PATTERN.matcher(contact).matches()) {
            return "PHONE";
        }
        return "";
    }

    public boolean isValidContact(String contact) {
        return !detectContactType(contact).isBlank();
    }

    public Optional<AppUser> findById(int id) {
        return userRepository.findById(id);
    }

    public Optional<AppUser> findByContact(String contact) {
        return userRepository.findByContact(contact);
    }

    public Optional<AppUser> findByEmail(String email) {
        return userRepository.findByEmail(normalizeContact(email));
    }

    public Optional<AppUser> findByPhoneNumber(String phoneNumber) {
        return userRepository.findByPhoneNumber(normalizeContact(phoneNumber));
    }

    public AppUser register(String name, String contact) {
        AppUser user = new AppUser();
        user.setName(name == null || name.isBlank() ? "Reader" : name.trim());
        user.setContact(contact);
        user.setContactType(detectContactType(contact));
        if ("EMAIL".equals(user.getContactType())) {
            user.setEmail(contact);
        }
        if ("PHONE".equals(user.getContactType())) {
            user.setPhoneNumber(contact);
        }
        return userRepository.save(user);
    }

    public AppUser register(String name, String email, String phoneNumber, String password, String address) {
        String normalizedEmail = normalizeContact(email);
        String normalizedPhone = normalizeContact(phoneNumber);

        AppUser user = new AppUser();
        user.setName(name == null || name.isBlank() ? "Reader" : name.trim());
        user.setContact(normalizedEmail);
        user.setContactType("EMAIL");
        user.setEmail(normalizedEmail);
        user.setPhoneNumber(normalizedPhone);
        user.setPasswordHash(encryptPassword(password));
        user.setAddress(address == null ? "" : address.trim());
        user.setEmailVerified(true);
        user.setPhoneVerified(false);
        return userRepository.save(user);
    }

    public boolean passwordMatches(AppUser user, String rawPassword) {
        if (user.getPasswordHash() == null || user.getPasswordHash().isBlank()) {
            return true;
        }
        return passwordEncoder.matches(rawPassword, user.getPasswordHash());
    }

    public String encryptPassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }
}
