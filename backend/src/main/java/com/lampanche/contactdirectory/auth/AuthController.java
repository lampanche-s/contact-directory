package com.lampanche.contactdirectory.auth;

import com.lampanche.contactdirectory.auth.dto.AdminSessionResponse;
import com.lampanche.contactdirectory.auth.dto.LoginRequest;
import com.lampanche.contactdirectory.common.exception.ApiErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request,
            HttpSession session,
            HttpServletRequest servletRequest
    ) {
        var authenticatedSession = authService.login(request, session);

        if (authenticatedSession.isPresent()) {
            servletRequest.changeSessionId();

            return ResponseEntity.ok(authenticatedSession.get());
        }

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new ApiErrorResponse(
                        HttpStatus.UNAUTHORIZED.value(),
                        "UNAUTHENTICATED",
                        "Invalid username or password.",
                        servletRequest.getRequestURI(),
                        List.of()
                ));
    }

    @GetMapping("/me")
    public AdminSessionResponse me(HttpSession session) {
        return authService.currentSession(session);
    }

    @PostMapping("/logout")
    public AdminSessionResponse logout(HttpSession session) {
        authService.logout(session);
        return AdminSessionResponse.unauthenticated();
    }
}
