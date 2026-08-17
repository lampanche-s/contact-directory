package com.lampanche.contactdirectory.auth;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class CsrfController {

    @GetMapping("/api/v1/auth/csrf")
    public Map<String, String> csrf(CsrfToken csrfToken) {
        return Map.of(
                "parameterName", csrfToken.getParameterName(),
                "headerName", csrfToken.getHeaderName(),
                "token", csrfToken.getToken()
        );
    }
}
