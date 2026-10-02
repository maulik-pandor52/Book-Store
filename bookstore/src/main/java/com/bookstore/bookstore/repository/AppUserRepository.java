package com.bookstore.bookstore.repository;

import com.bookstore.bookstore.model.AppUser;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface AppUserRepository extends JpaRepository<AppUser, Integer> {
    Optional<AppUser> findByContact(String contact);
    Optional<AppUser> findByEmail(String email);
    Optional<AppUser> findByPhoneNumber(String phoneNumber);
    boolean existsByRole(String role);
    @Modifying @Transactional @Query("update AppUser u set u.role = 'USER' where u.role is null or trim(u.role) = ''")
    int setMissingRolesToUser();
}
