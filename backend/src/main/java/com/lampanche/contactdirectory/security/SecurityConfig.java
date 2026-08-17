package com.lampanche.contactdirectory.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            AdminSessionAuthenticationFilter adminSessionAuthenticationFilter
    ) throws Exception {
        return http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/health").permitAll()
                        .requestMatchers("/actuator/health").permitAll()

                        .requestMatchers("/api/v1/auth/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/v1/contacts").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/contacts/*").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/contacts/*/photo").permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/v1/contacts").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/contacts/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/contacts/*").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/v1/contacts/*/photo").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/contacts/*/photo").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        adminSessionAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                )
                .build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
