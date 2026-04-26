package com.nhom5.backend.service;

import com.nhom5.backend.dto.RegisterRequest;
import com.nhom5.backend.entity.LocalAccount;
import com.nhom5.backend.entity.User;
import com.nhom5.backend.repository.LocalAccountRepository;
import com.nhom5.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final LocalAccountRepository localAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Transactional
    public String register(RegisterRequest request) {
        // 1. Check Email
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        // 2. Create user
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setIsActive(false); // Đợi verify OTP
        User savedUser = userRepository.save(user);

        // Create OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        // 3. Create local account
        LocalAccount localAccount = new LocalAccount();
        localAccount.setUser(savedUser);
        localAccount.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        localAccount.setVerificationCode(otp);
        localAccount.setCodeExpiredAt(LocalDateTime.now().plusMinutes(5));
        localAccountRepository.save(localAccount);
        emailService.sendOtpEmail(request.getEmail(), otp);

        return "Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP.";
    }
}
