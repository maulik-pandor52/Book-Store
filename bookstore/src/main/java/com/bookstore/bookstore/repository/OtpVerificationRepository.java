package com.bookstore.bookstore.repository;

import com.bookstore.bookstore.model.OtpVerification;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Integer> {
    Optional<OtpVerification> findTopByEmailOrderByIdDesc(String email);
}
