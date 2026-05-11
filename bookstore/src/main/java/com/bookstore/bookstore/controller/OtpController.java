package com.bookstore.bookstore.controller;

import com.bookstore.bookstore.dto.EmailOtpRequest;
import com.bookstore.bookstore.dto.EmailOtpVerifyRequest;
import com.bookstore.bookstore.dto.OtpResponse;
import com.bookstore.bookstore.dto.PhoneOtpVerifyRequest;
import com.bookstore.bookstore.model.AppUser;
import com.bookstore.bookstore.repository.AppUserRepository;
import com.bookstore.bookstore.service.FirebasePhoneOtpService;
import com.bookstore.bookstore.service.JwtService;
import com.bookstore.bookstore.service.OtpService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/otp")
public class OtpController {

    private final OtpService otpService;
    private final FirebasePhoneOtpService firebasePhoneOtpService;
    private final AppUserRepository userRepository;
    private final JwtService jwtService;

    public OtpController(
            OtpService otpService,
            FirebasePhoneOtpService firebasePhoneOtpService,
            AppUserRepository userRepository,
            JwtService jwtService) {
        this.otpService = otpService;
        this.firebasePhoneOtpService = firebasePhoneOtpService;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @PostMapping("/email/send")
    public OtpResponse sendEmailOtp(@RequestBody EmailOtpRequest request) {
        otpService.sendEmailOtp(request.getEmail());
        return new OtpResponse(true, "OTP sent to your email.");
    }

    @PostMapping("/email/resend")
    public OtpResponse resendEmailOtp(@RequestBody EmailOtpRequest request) {
        otpService.resendEmailOtp(request.getEmail());
        return new OtpResponse(true, "OTP resent to your email.");
    }

    @PostMapping("/email/verify")
    public OtpResponse verifyEmailOtp(@RequestBody EmailOtpVerifyRequest request) {
        AppUser user = otpService.verifyEmailOtp(request.getEmail(), request.getOtp());
        String token = jwtService.generateToken(user);
        return new OtpResponse(true, "Email verified successfully.", token);
    }

    @PostMapping("/phone/verify")
    public OtpResponse verifyPhoneOtp(@RequestBody PhoneOtpVerifyRequest request) {
        String phoneNumber = firebasePhoneOtpService.verifyFirebaseToken(request.getFirebaseIdToken());
        AppUser user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseGet(() -> userRepository.findByContact(phoneNumber).orElseGet(AppUser::new));

        if (user.getContact() == null || user.getContact().isBlank()) {
            user.setName("Reader");
            user.setContact(phoneNumber);
            user.setContactType("PHONE");
        }

        user.setPhoneNumber(phoneNumber);
        user.setPhoneVerified(true);
        AppUser savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);

        return new OtpResponse(true, "Phone number verified successfully.", token);
    }
}
