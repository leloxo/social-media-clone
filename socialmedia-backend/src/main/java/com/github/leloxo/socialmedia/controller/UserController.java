package com.github.leloxo.socialmedia.controller;

import com.github.leloxo.socialmedia.dto.DataConvertor;
import com.github.leloxo.socialmedia.dto.request.UpdateUserDetailsRequest;
import com.github.leloxo.socialmedia.dto.response.UserDetailsResponse;
import com.github.leloxo.socialmedia.exception.ResourceNotFoundException;
import com.github.leloxo.socialmedia.exception.UnauthorizedException;
import com.github.leloxo.socialmedia.model.User;
import com.github.leloxo.socialmedia.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/users")
@RestController
public class UserController {
    private final UserService userService;
    private final DataConvertor dataConvertor;

    public UserController(UserService userService, DataConvertor dataConvertor) {
        this.userService = userService;
        this.dataConvertor = dataConvertor;
    }

    @GetMapping
    public ResponseEntity<List<UserDetailsResponse>> allUsers() {
        List<User> users = userService.allUsers();
        return ResponseEntity.ok(dataConvertor.toUserDtoList(users));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDetailsResponse> authenticatedUser(
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(dataConvertor.toUserDto(currentUser));
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserDetailsResponse> getUserByUserName(
            @PathVariable String username
    ) throws ResourceNotFoundException {
        User user = userService.findUserByUserName(username);
        return ResponseEntity.ok(dataConvertor.toUserDto(user));
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDetailsResponse>> searchUsers(
            @RequestParam("username") String username
    ) {
        List<User> users = userService.findUsersByUserName(username);
        return ResponseEntity.ok(dataConvertor.toUserDtoList(users));
    }

    // TODO: expand UpdateUserDetailsRequest with fields to update
    @PutMapping("/{userId}")
    public ResponseEntity<UserDetailsResponse> updateUser(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long userId,
            @Valid @RequestBody UpdateUserDetailsRequest updatedUserDetails
    ) throws ResourceNotFoundException {
        if (!currentUser.getId().equals(userId)) {
            throw new UnauthorizedException("You can only update your own profile");
        }

        User updatedUser = userService.updateUser(userId, updatedUserDetails);
        return ResponseEntity.ok(dataConvertor.toUserDto(updatedUser));
    }
}
