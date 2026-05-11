package com.bookstore.bookstore.service;

import com.bookstore.bookstore.exception.OtpException;
import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.stereotype.Service;

@Service
public class FirebasePhoneOtpService {

    public String verifyFirebaseToken(String firebaseIdToken) {
        if (firebaseIdToken == null || firebaseIdToken.isBlank()) {
            throw new OtpException("Firebase ID token is required.");
        }
        if (FirebaseApp.getApps().isEmpty()) {
            throw new OtpException("Firebase is not configured. Set firebase.credentials.path in application.properties.");
        }

        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(firebaseIdToken);
            String phoneNumber = decodedToken.getClaims().get("phone_number") == null
                    ? null
                    : decodedToken.getClaims().get("phone_number").toString();

            if (phoneNumber == null || phoneNumber.isBlank()) {
                throw new OtpException("Firebase token does not contain a verified phone number.");
            }

            return phoneNumber;
        } catch (OtpException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new OtpException("Invalid Firebase phone OTP token.");
        }
    }
}
