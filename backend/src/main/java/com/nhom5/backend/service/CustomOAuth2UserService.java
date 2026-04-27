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

        // Xác định đang dùng Google hay Facebook
        String clientRegistrationId = userRequest.getClientRegistration().getRegistrationId();
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String providerId = clientRegistrationId.equals("google")
                ? (String) attributes.get("sub")
                : (String) attributes.get("id");

        // Xử lý ảnh đại diện (Facebook có cấu trúc lồng nhau)
        // Tính toán URL ảnh đại diện trước
        String tempPicture = ""; // Biến tạm để tính toán
        if (clientRegistrationId.equals("google")) {
            tempPicture = (String) attributes.get("picture");
        } else if (clientRegistrationId.equals("facebook")) {
            Map<String, Object> pictureObj = (Map<String, Object>) attributes.get("picture");
            if (pictureObj != null) {
                Map<String, Object> dataObj = (Map<String, Object>) pictureObj.get("data");
                tempPicture = (String) dataObj.get("url");
            }
        }

        final String picture = tempPicture;

        // Sử dụng trong userRepository.findByEmail
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFullName(name);
            newUser.setAvatar(picture);
            newUser.setIsActive(true);
            return userRepository.save(newUser);
        });

        // Liên kết với SocialAccount nếu chưa có
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
