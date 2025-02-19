package com.github.leloxo.socialmedia.controller;

import com.github.leloxo.socialmedia.dto.DataConvertor;
import com.github.leloxo.socialmedia.dto.request.LoginRequest;
import com.github.leloxo.socialmedia.dto.request.RegisterUserRequest;
import com.github.leloxo.socialmedia.dto.response.LoginResponse;
import com.github.leloxo.socialmedia.dto.response.UserDetailsResponse;
import com.github.leloxo.socialmedia.model.User;
import com.github.leloxo.socialmedia.service.AuthenticationService;
import com.github.leloxo.socialmedia.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;
    private final DataConvertor dataConvertor;

    public AuthenticationController(JwtService jwtService,
                                    AuthenticationService authenticationService,
                                    DataConvertor dataConvertor) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
        this.dataConvertor = dataConvertor;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserDetailsResponse> register(@Valid @RequestBody RegisterUserRequest registerUserRequest) {
        User registeredUser = authenticationService.signup(registerUserRequest);
        return ResponseEntity.ok(dataConvertor.toUserDto(registeredUser));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@Valid @RequestBody LoginRequest loginRequest) {
        User authenticatedUser = authenticationService.authenticate(loginRequest);

        String jwtToken = jwtService.generateToken(authenticatedUser);

        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(jwtToken);
        loginResponse.setExpiresIn(jwtService.getExpirationTime());
        loginResponse.setUsername(authenticatedUser.getUserName());

        return ResponseEntity.ok(loginResponse);
    }

    // TODO: better response messages
    // TODO: check if correct
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            jwtService.invalidateToken(token);
            return ResponseEntity.ok("Successfully logged out");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("No valid token provided.");
    }
}
