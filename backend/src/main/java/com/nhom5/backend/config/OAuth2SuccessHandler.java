package com.nhom5.backend.config;

import com.nhom5.backend.entity.User;
import com.nhom5.backend.repository.UserRepository;
import com.nhom5.backend.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * Xử lý redirect sau khi OAuth2 (Google/Facebook) xác thực thành công.
 * Dùng SimpleUrlAuthenticationSuccessHandler để có principal ngay trong luồng OAuth2,
 * tránh lỗi principal = null khi dùng STATELESS session + defaultSuccessUrl.
 */
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        if (email == null) {
            response.sendRedirect(frontendUrl + "/login?error=no_email");
            return;
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            response.sendRedirect(frontendUrl + "/login?error=user_not_found");
            return;
        }

        String token = jwtService.generateToken(user.getEmail());

        String redirectUrl = String.format(
                "%s/?token=%s&fullName=%s&role=%s&userId=%d&email=%s&avatar=%s",
                frontendUrl,
                token,
                URLEncoder.encode(user.getFullName() != null ? user.getFullName() : "", StandardCharsets.UTF_8),
                user.getRole().name(),
                user.getUserId(),
                URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8),
                URLEncoder.encode(user.getAvatar() != null ? user.getAvatar() : "", StandardCharsets.UTF_8)
        );

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
