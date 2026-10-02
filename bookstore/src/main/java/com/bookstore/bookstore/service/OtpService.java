package com.bookstore.bookstore.service;

import com.bookstore.bookstore.exception.OtpException;
import com.bookstore.bookstore.model.AppUser;
import com.bookstore.bookstore.model.OtpVerification;
import com.bookstore.bookstore.repository.AppUserRepository;
import com.bookstore.bookstore.repository.OtpVerificationRepository;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class OtpService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final JavaMailSender mailSender;
    private final BCryptPasswordEncoder passwordEncoder;
    private final OtpVerificationRepository otpRepository;
    private final AppUserRepository userRepository;

    @Value("${otp.expiry-minutes}")
    private long otpExpiryMinutes;

    @Value("${otp.resend-cooldown-seconds}")
    private long resendCooldownSeconds;

    @Value("${otp.max-resend-count}")
    private int maxResendCount;

    public OtpService(
            JavaMailSender mailSender,
            BCryptPasswordEncoder passwordEncoder,
            OtpVerificationRepository otpRepository,
            AppUserRepository userRepository) {
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
        this.otpRepository = otpRepository;
        this.userRepository = userRepository;
    }

    public void sendEmailOtp(String email) {
        String normalizedEmail = normalizeEmail(email);
        validateEmail(normalizedEmail);

        otpRepository.findTopByEmailOrderByIdDesc(normalizedEmail)
                .ifPresent(this::validateRequestLimit);

        createAndSendOtp(normalizedEmail, 0);
    }

    public void resendEmailOtp(String email) {
        String normalizedEmail = normalizeEmail(email);
        validateEmail(normalizedEmail);

        OtpVerification latestOtp = otpRepository.findTopByEmailOrderByIdDesc(normalizedEmail)
                .orElseThrow(() -> new OtpException("Please request an OTP first."));

        validateRequestLimit(latestOtp);
        if (latestOtp.getResendCount() >= maxResendCount) {
            throw new OtpException("Maximum resend limit reached. Please try again later.");
        }

        createAndSendOtp(normalizedEmail, latestOtp.getResendCount() + 1);
    }

    public AppUser verifyEmailOtp(String email, String otp) {
        String normalizedEmail = normalizeEmail(email);
        String submittedOtp = otp != null ? otp.replaceAll("\\D+", "") : "";
        if (submittedOtp.isEmpty() || !submittedOtp.matches("[0-9]{6}")) {
            throw new OtpException("Please enter a valid 6-digit OTP.");
        }

        OtpVerification latestOtp = otpRepository.findTopByEmailOrderByIdDesc(normalizedEmail)
                .orElseThrow(() -> new OtpException("OTP not found. Please request a new OTP."));

        if (latestOtp.isVerified()) {
            throw new OtpException("Email is already verified.");
        }
        if (LocalDateTime.now().isAfter(latestOtp.getExpiresAt())) {
            throw new OtpException("OTP expired. Please request a new OTP.");
        }
        if (latestOtp.getFailedAttempts() >= 5) {
            throw new OtpException("Too many invalid attempts. Please request a new OTP.");
        }
        if (!passwordEncoder.matches(submittedOtp, latestOtp.getOtpHash())) {
            latestOtp.setFailedAttempts(latestOtp.getFailedAttempts() + 1);
            otpRepository.save(latestOtp);
            throw new OtpException("Invalid OTP. Please try again.");
        }

        latestOtp.setVerified(true);
        otpRepository.save(latestOtp);
        return markEmailVerified(normalizedEmail);
    }

    public String generateOtp() {
        return String.valueOf(100000 + RANDOM.nextInt(900000));
    }

    public void sendOtp(String email, String phone, String otp) {
        boolean sent = false;
        if (email != null && email.contains("@")) {
            sendEmail(email, otp);
            sent = true;
        }
        if (phone != null && !phone.isBlank()) {
            System.out.println("Phone OTP for " + phone + " is " + otp);
            sent = true;
        }
        if (!sent) {
            throw new OtpException("No valid email or phone number provided to send OTP. (Email: " + email + ", Phone: " + phone + ")");
        }
    }

    private void createAndSendOtp(String email, int resendCount) {
        String otp = generateOtp();
        OtpVerification otpVerification = new OtpVerification();
        otpVerification.setEmail(email);
        otpVerification.setOtpHash(passwordEncoder.encode(otp));
        otpVerification.setExpiresAt(LocalDateTime.now().plusMinutes(otpExpiryMinutes));
        otpVerification.setLastSentAt(LocalDateTime.now());
        otpVerification.setResendCount(resendCount);
        otpRepository.save(otpVerification);

        sendEmail(email, otp);
    }

    private void sendEmail(String email, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Book Store OTP Verification");
            message.setText("Your OTP is " + otp + ". It is valid for " + otpExpiryMinutes + " minutes.");
            mailSender.send(message);
        } catch (MailException ex) {
            throw new OtpException("Email OTP could not be sent. Please check spring.mail.username and spring.mail.password in application.properties.");
        }
    }

    private void validateRequestLimit(OtpVerification otpVerification) {
        LocalDateTime nextAllowedTime = otpVerification.getLastSentAt().plusSeconds(resendCooldownSeconds);
        if (LocalDateTime.now().isBefore(nextAllowedTime)) {
            throw new OtpException("Please wait before requesting another OTP.");
        }
    }

    private AppUser markEmailVerified(String email) {
        AppUser user = userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.findByContact(email).orElseGet(AppUser::new));

        if (user.getContact() == null || user.getContact().isBlank()) {
            user.setContact(email);
            user.setContactType("EMAIL");
            user.setName("Reader");
        }

        user.setEmail(email);
        user.setEmailVerified(true);
        return userRepository.save(user);
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private void validateEmail(String email) {
        if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new OtpException("Please enter a valid email address.");
        }
    }
}
