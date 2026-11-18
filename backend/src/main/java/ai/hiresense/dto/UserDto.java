package ai.hiresense.dto;

import ai.hiresense.entity.User;

public class UserDto {
    private Long id;
    private String email;
    private String fullName;
    private String role;
    private String title;
    private String department;
    private String avatarUrl;

    public UserDto() {}

    public static UserDto fromEntity(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setRole(user.getRole() != null ? user.getRole().name().replace("ROLE_", "") : "GUEST");
        dto.setTitle(user.getTitle());
        dto.setDepartment(user.getDepartment());
        dto.setAvatarUrl(user.getAvatarUrl());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}

