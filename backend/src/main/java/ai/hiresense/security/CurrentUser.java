package ai.hiresense.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class CurrentUser {

    private CurrentUser() {}

    public static String email() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName() == null || "anonymousUser".equals(auth.getName())) {
            return null;
        }
        return auth.getName();
    }

    public static boolean hasRole(String role) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        String expected = role.startsWith("ROLE_") ? role : "ROLE_" + role;
        return auth.getAuthorities().stream().anyMatch(authority -> expected.equals(authority.getAuthority()));
    }

    public static boolean isCandidate() {
        return hasRole("CANDIDATE");
    }
}
