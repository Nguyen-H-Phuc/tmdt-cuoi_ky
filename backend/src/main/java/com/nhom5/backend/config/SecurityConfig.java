package com.nhom5.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Dùng để mã hóa mật khẩu
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Tắt CSRF để làm việc với API dễ hơn
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/api/auth/**").permitAll() // Cho phép tất cả truy cập vào các API bắt đầu bằng /api/auth/
                    .anyRequest().authenticated() // Các API khác vẫn phải đăng nhập
            );
        return http.build();
    }
}
