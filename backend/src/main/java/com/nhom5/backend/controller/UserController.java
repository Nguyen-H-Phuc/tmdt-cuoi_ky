package com.nhom5.backend.controller;

import com.nhom5.backend.dto.ProfileUpdateRequest;
import com.nhom5.backend.dto.UserDTO;
import com.nhom5.backend.entity.User;
import com.nhom5.backend.repository.UserRepository;
import com.nhom5.backend.service.CloudinaryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    private UserDTO convertToUserDTO(User user) {
        if (user == null) return null;
        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setAddress(user.getAddress());
        dto.setAvatar(user.getAvatar());
        dto.setBio(user.getBio());
        dto.setIsActive(user.getIsActive());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getUserProfile(@PathVariable Integer userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy người dùng."));
        }
        return ResponseEntity.ok(convertToUserDTO(userOpt.get()));
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<?> updateUserProfile(
            @PathVariable Integer userId,
            @Valid @RequestBody ProfileUpdateRequest request) {
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy người dùng."));
        }

        User user = userOpt.get();

        // Kiểm tra trùng email nếu email bị thay đổi
        if (!user.getEmail().equalsIgnoreCase(request.getEmail())) {
            Optional<User> duplicateEmailUser = userRepository.findByEmail(request.getEmail());
            if (duplicateEmailUser.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email đã được sử dụng bởi tài khoản khác."));
            }
        }

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        user.setAddress(request.getAddress());
        user.setBio(request.getBio());
        if (request.getAvatar() != null && !request.getAvatar().isBlank()) {
            user.setAvatar(request.getAvatar());
        }
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        return ResponseEntity.ok(convertToUserDTO(user));
    }

    @PostMapping("/upload-avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "File không được trống."));
        }

        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png") && !contentType.equals("image/webp"))) {
            return ResponseEntity.badRequest().body(Map.of("message", "Định dạng file không hợp lệ. Chỉ chấp nhận JPG, PNG, WEBP."));
        }

        try {
            Map<?, ?> uploadResult = cloudinaryService.upload(file);
            String fileUrl = (String) uploadResult.get("secure_url");
            return ResponseEntity.ok(Map.of("avatarUrl", fileUrl));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Lỗi trong quá trình upload lên Cloudinary: " + e.getMessage()));
        }
    }
}
