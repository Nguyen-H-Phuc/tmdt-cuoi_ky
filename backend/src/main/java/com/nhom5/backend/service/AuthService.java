package com.nhom5.backend.service;

import com.nhom5.backend.dto.RegisterRequest;
import com.nhom5.backend.dto.VerifyOtpRequest;
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

    @Transactional
    public String verifyOtp(VerifyOtpRequest request) {
        // 1. Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        // 2. Get information local account
        LocalAccount localAccount = localAccountRepository.findById(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Tài khoản không hợp lệ!"));

        // 3. Check otp
        if (localAccount.getVerificationCode() == null ||
                !localAccount.getVerificationCode().equals(request.getOtp())) {
            throw new RuntimeException("Mã OTP không chính xác!");
        }

        // 4. Check expire time
        if (localAccount.getCodeExpiredAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Mã OTP đã hết hạn!");
        }

        // 5. Active account
        user.setIsActive(true);
        userRepository.save(user);

        // 6. Delete OTP
        localAccount.setVerificationCode(null);
        localAccount.setCodeExpiredAt(null);
        localAccount.setIsEmailVerified(true);
        localAccountRepository.save(localAccount);

        return "Xác thực tài khoản thành công! Bây giờ bạn có thể đăng nhập.";
    }
}
