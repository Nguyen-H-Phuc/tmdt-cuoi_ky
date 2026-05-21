package com.nhom5.backend.service;

import com.nhom5.backend.dto.*;
import com.nhom5.backend.entity.LocalAccount;
import com.nhom5.backend.entity.PasswordReset;
import com.nhom5.backend.entity.User;
import com.nhom5.backend.repository.LocalAccountRepository;
import com.nhom5.backend.repository.PasswordResetRepository;
import com.nhom5.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final LocalAccountRepository localAccountRepository;
    private final PasswordResetRepository passwordResetRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtService jwtService;

    @Transactional
    public String forgotPassword(ForgotPasswordRequest request) {
        // 1. Check user exist
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống!"));

        // 2. Generate token
        String token = UUID.randomUUID().toString();

        // 3. Clear old tokens and save new one
        passwordResetRepository.deleteByEmail(request.getEmail());

        PasswordReset passwordReset = new PasswordReset();
        passwordReset.setEmail(request.getEmail());
        passwordReset.setToken(token);
        passwordReset.setExpiresAt(LocalDateTime.now().plusMinutes(15));
        passwordResetRepository.save(passwordReset);

        // 4. Send email
        emailService.sendResetPasswordEmail(request.getEmail(), token);

        return "Link đặt lại mật khẩu đã được gửi tới email của bạn!";
    }

    @Transactional
    public String resetPassword(ResetPasswordRequest request) {
        // 1. Check token valid
        PasswordReset passwordReset = passwordResetRepository.findByToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Link không hợp lệ hoặc đã hết hạn!"));

        // 2. Check expire time
        if (passwordReset.getExpiresAt().isBefore(LocalDateTime.now())) {
            passwordResetRepository.delete(passwordReset);
            throw new RuntimeException("Link đã hết hạn!");
        }

        // 3. Find user
        User user = userRepository.findByEmail(passwordReset.getEmail())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        // 4. Update password
        LocalAccount localAccount = localAccountRepository.findById(user.getUserId())
                .orElse(new LocalAccount());
        
        if (localAccount.getUser() == null) {
            localAccount.setUser(user);
            localAccount.setIsEmailVerified(true);
        }

        localAccount.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        localAccountRepository.save(localAccount);

        // 5. Delete token after use
        passwordResetRepository.delete(passwordReset);

        return "Đặt lại mật khẩu thành công!";
    }

    @Transactional
    public String register(RegisterRequest request) {
        // 1. Check email exist
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();

            // Block them from registering again
            if (user.getIsActive()) {
                throw new RuntimeException("Email đã được sử dụng và xác thực!");
            }

            // If the user already exists but is NOT yet activated, Update the information
            user.setFullName(request.getFullName());
            user.setPhone(request.getPhone());
        } else {
            user = new User();
            user.setFullName(request.getFullName());
            user.setEmail(request.getEmail());
            user.setPhone(request.getPhone());
            user.setIsActive(false);
        }

        User savedUser = userRepository.save(user);

        // 2. Process the local_accounts table (Update the new password and new OTP code)
        String otp = String.format("%06d", new Random().nextInt(999999));

        // Find your old local account or create a new one if you don't already have one.
        LocalAccount localAccount = localAccountRepository.findById(savedUser.getUserId())
                .orElse(new LocalAccount());

        localAccount.setUser(savedUser);
        localAccount.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        localAccount.setVerificationCode(otp);
        localAccount.setCodeExpiredAt(LocalDateTime.now().plusMinutes(5));
        localAccount.setIsEmailVerified(false);

        localAccountRepository.save(localAccount);

        // 3. Resend Email OTP
        emailService.sendOtpEmail(request.getEmail(), otp);

        return "Mã xác thực mới đã được gửi đến email của bạn!";
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

    public LoginResponse login(LoginRequest request) {
        // 1. Check User exist
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không đúng!"));

        // 2. Check user active
        if (!user.getIsActive()) {
            throw new RuntimeException("Tài khoản chưa được kích hoạt OTP!");
        }

        // 3. Check password
        LocalAccount localAccount = localAccountRepository.findById(user.getUserId()).get();
        if (!passwordEncoder.matches(request.getPassword(), localAccount.getPasswordHash())) {
            throw new RuntimeException("Email hoặc mật khẩu không đúng!");
        }

        // 4. Create and return JWT
        String token = jwtService.generateToken(user.getEmail());
        return new LoginResponse(token, user.getFullName(), user.getRole().name(), user.getUserId(), user.getEmail());
    }
}
