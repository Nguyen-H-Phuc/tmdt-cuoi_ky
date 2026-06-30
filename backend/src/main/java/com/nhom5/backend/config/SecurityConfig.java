package com.nhom5.backend.config;

import com.nhom5.backend.service.CustomOAuth2UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfiguration = new CorsConfiguration();
                    corsConfiguration.setAllowedOriginPatterns(List.of("*"));
                    corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
                    corsConfiguration.setAllowedHeaders(List.of("*"));
                    corsConfiguration.setAllowCredentials(true);
                    return corsConfiguration;
                }))
                .csrf(csrf -> csrf.disable())
                // ✅ STATELESS: JWT-based API không dùng session, loại bỏ jsessionid khỏi URL
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**", "/login/**", "/oauth2/**",
                                "/api/products/**", "/api/reviews/**", "/api/favorites/**", "/ws/**",
                                "/api/statistics/**", "/api/categories/**", "/api/chat/**", "/api/orders/**",
                                "/api/cart/**", "/api/users/**", "/uploads/**", "/api/boosts/**"
                        ).permitAll()
                        .anyRequest().authenticated())
                // ✅ Trả về 401 JSON thay vì redirect về /login (tránh ERR_TOO_MANY_REDIRECTS)
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Vui lòng đăng nhập để tiếp tục.\"}");
                        })
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .oauth2Login(oauth -> oauth
                        .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
                        // ✅ Dùng successHandler để có principal ngay trong luồng OAuth2
                        // (tránh principal = null với STATELESS session)
                        .successHandler(oAuth2SuccessHandler)
                        .failureUrl(frontendUrl + "/login?error=oauth2_failed")
                );
        return http.build();
    }
}
