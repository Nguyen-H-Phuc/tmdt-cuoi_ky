package com.nhom5.backend.controller;

import com.nhom5.backend.dto.LoginRequest;
import com.nhom5.backend.dto.RegisterRequest;
import com.nhom5.backend.dto.VerifyOtpRequest;
import com.nhom5.backend.entity.User;
import com.nhom5.backend.repository.UserRepository;
import com.nhom5.backend.service.AuthService;
import com.nhom5.backend.service.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

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
    public void oauth2Success(@AuthenticationPrincipal OAuth2User principal, HttpServletResponse response) throws IOException {
        if (principal == null) {
            response.sendRedirect("http://localhost:5173/login?error=unauthorized");
            return;
        }

        String email = principal.getAttribute("email");
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Lỗi hệ thống sau khi login Social"));

        String token = jwtService.generateToken(user.getEmail());

        // Chuyển hướng người dùng quay lại React kèm Token trên URL
        String redirectUrl = String.format("http://localhost:5173/?token=%s&fullName=%s&role=%s",
                token,
                URLEncoder.encode(user.getFullName(), StandardCharsets.UTF_8),
                user.getRole().name());

        response.sendRedirect(redirectUrl);
    }
}
