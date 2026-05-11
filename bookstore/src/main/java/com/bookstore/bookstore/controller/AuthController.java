package com.bookstore.bookstore.controller;

import com.bookstore.bookstore.exception.OtpException;
import com.bookstore.bookstore.model.AppUser;
import com.bookstore.bookstore.service.AuthService;
import com.bookstore.bookstore.service.JwtService;
import com.bookstore.bookstore.service.OtpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final long OTP_VALID_SECONDS = 300;

    private final AuthService authService;
    private final OtpService otpService;
    private final JwtService jwtService;

    // Temporary storage for OTP states since we are stateless now.
    // In production, this should be Redis or a database table.
    private static final Map<String, OtpState> pendingOtpStates = new ConcurrentHashMap<>();

    static class OtpState {
        String mode;
        String name;
        String contact;
        String expectedOtp;
        long expiresAt;
        String email;
        String phone;
        String password;
        String address;
    }

    public AuthController(AuthService authService, OtpService otpService, JwtService jwtService) {
        this.authService = authService;
        this.otpService = otpService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String email = payload.get("email");
        String phoneNumber = payload.get("phoneNumber");
        String password = payload.get("password");
        String confirmPassword = payload.get("confirmPassword");
        String address = payload.get("address");

        String normalizedEmail = authService.normalizeContact(email);
        String normalizedPhone = authService.normalizeContact(phoneNumber);

        if (!authService.isValidContact(normalizedEmail) || !"EMAIL".equals(authService.detectContactType(normalizedEmail))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Enter a valid email address."));
        }

        if (!authService.isValidContact(normalizedPhone) || !"PHONE".equals(authService.detectContactType(normalizedPhone))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Enter a valid 10-15 digit phone number."));
        }

        if (password == null || password.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 6 characters."));
        }

        if (!password.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password and confirm password do not match."));
        }

        if (authService.findByEmail(normalizedEmail).isPresent() || authService.findByContact(normalizedEmail).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "This email is already registered. Please login."));
        }

        if (authService.findByPhoneNumber(normalizedPhone).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "This phone number is already registered. Please login."));
        }

        try {
            startOtpState("REGISTER", name, normalizedEmail, normalizedEmail, normalizedPhone, password, address);
            return ResponseEntity.ok(Map.of("message", "OTP sent to your email and phone.", "contact", normalizedEmail));
        } catch (OtpException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String contact = payload.get("contact");
        String password = payload.get("password");

        String normalizedContact = authService.normalizeContact(contact);
        if (!authService.isValidContact(normalizedContact)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Enter a valid email address or phone number."));
        }

        AppUser user = authService.findByContact(normalizedContact)
                .or(() -> authService.findByEmail(normalizedContact))
                .or(() -> authService.findByPhoneNumber(normalizedContact))
                .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "No account found. Please register first."));
        }

        if (!authService.passwordMatches(user, password)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid password."));
        }

        try {
            startOtpState("LOGIN", null, user.getContact(), user.getEmail(), user.getPhoneNumber(), null, null);
            return ResponseEntity.ok(Map.of("message", "OTP sent to your registered email and phone.", "contact", user.getContact()));
        } catch (OtpException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> payload) {
        String contact = payload.get("contact");
        String otp = payload.get("otp");

        OtpState state = pendingOtpStates.get(contact);

        if (state == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please request a new OTP."));
        }

        if (Instant.now().getEpochSecond() > state.expiresAt) {
            pendingOtpStates.remove(contact);
            return ResponseEntity.badRequest().body(Map.of("error", "OTP expired. Please request a new one."));
        }

        String submittedOtp = otp != null ? otp.replaceAll("\\D+", "") : "";
        if (!state.expectedOtp.equals(submittedOtp)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid OTP. Please try again."));
        }

        AppUser user;
        if ("REGISTER".equals(state.mode)) {
            user = authService.register(state.name, state.email, state.phone, state.password, state.address);
        } else {
            user = authService.findByContact(contact).orElseThrow();
        }

        pendingOtpStates.remove(contact);
        
        String token = jwtService.generateToken(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Welcome, " + user.getName() + "!");
        response.put("token", token);
        response.put("user", user);
        
        return ResponseEntity.ok(response);
    }

    private void startOtpState(String mode, String name, String contact, String email, String phone, String password, String address) {
        String otp = otpService.generateOtp();
        
        OtpState state = new OtpState();
        state.mode = mode;
        state.name = name;
        state.contact = contact;
        state.expectedOtp = otp;
        state.expiresAt = Instant.now().getEpochSecond() + OTP_VALID_SECONDS;
        state.email = email;
        state.phone = phone;
        state.password = password;
        state.address = address;
        
        pendingOtpStates.put(contact, state);
        
        // Ensure we have at least one valid target for OtpService
        String targetEmail = (email != null && !email.isBlank()) ? email : null;
        String targetPhone = (phone != null && !phone.isBlank()) ? phone : null;

        if (targetEmail == null && targetPhone == null && contact != null && !contact.isBlank()) {
            if (contact.contains("@")) {
                targetEmail = contact;
            } else {
                targetPhone = contact;
            }
        }

        otpService.sendOtp(targetEmail, targetPhone, otp);
        System.out.println("OTP for " + contact + " is: " + otp); // For demo purposes
    }
}
