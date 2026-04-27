package com.nhom5.backend.service;

import com.nhom5.backend.entity.SocialAccount;
import com.nhom5.backend.entity.User;
import com.nhom5.backend.repository.SocialAccountRepository;
import com.nhom5.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final SocialAccountRepository socialAccountRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // Lấy thông tin từ Google
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String providerId = (String) attributes.get("sub"); // Google ID
        String picture = (String) attributes.get("picture");

        // 1. Tìm hoặc tạo User
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFullName(name);
            newUser.setAvatar(picture);
            newUser.setIsActive(true); // Mặc định true vì Google đã verify email rồi
            return userRepository.save(newUser);
        });

        // 2. Liên kết với SocialAccount nếu chưa có
        if (socialAccountRepository.findByProviderAndProviderId(SocialAccount.Provider.google, providerId).isEmpty()) {
            SocialAccount socialAccount = new SocialAccount();
            socialAccount.setUser(user);
            socialAccount.setProvider(SocialAccount.Provider.google);
            socialAccount.setProviderId(providerId);
            socialAccount.setEmail(email);
            socialAccountRepository.save(socialAccount);
        }

        return oAuth2User;
    }
}
