package com.nhom5.backend.controller;

import com.nhom5.backend.dto.LoginRequest;
import com.nhom5.backend.dto.LoginResponse;
import com.nhom5.backend.dto.RegisterRequest;
import com.nhom5.backend.dto.VerifyOtpRequest;
import com.nhom5.backend.entity.User;
import com.nhom5.backend.repository.UserRepository;
import com.nhom5.backend.service.AuthService;
import com.nhom5.backend.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        try {
            String result = authService.register(request);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody VerifyOtpRequest request) {
        try {
            String result = authService.verifyOtp(request);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(authService.login(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/oauth2-success")
    public ResponseEntity<?> oauth2Success(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Đăng nhập Google thất bại");
        }

        // Lấy email từ principal (thông tin Google trả về)
        String email = principal.getAttribute("email");

        // Tìm user trong DB (vì CustomOAuth2UserService đã lưu user này rồi)
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Lỗi hệ thống sau khi login Social"));

        // Tạo JWT Token dựa trên email
        String token = jwtService.generateToken(user.getEmail());

        // Trả về thông tin cho Frontend giống hệt lúc login Local
        return ResponseEntity.ok(new LoginResponse(
                token,
                user.getFullName(),
                user.getRole().name()
        ));
    }
}
