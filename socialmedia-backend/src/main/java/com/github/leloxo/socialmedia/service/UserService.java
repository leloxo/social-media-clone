package com.github.leloxo.socialmedia.service;

import com.github.leloxo.socialmedia.dto.request.UpdateUserDetailsRequest;
import com.github.leloxo.socialmedia.exception.ResourceNotFoundException;
import com.github.leloxo.socialmedia.model.User;
import com.github.leloxo.socialmedia.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> allUsers() {
        return new ArrayList<>(userRepository.findAll());
    }

    public List<User> findUsersByUserName(String username) {
        return userRepository.findByUserNameContainingIgnoreCase(username);
    }

    public User findUserByUserName(String username) throws ResourceNotFoundException {
        return userRepository.findByUserName(username)
                .orElseThrow(() -> new ResourceNotFoundException("User with username '" + username + "' not found."));
    }

    public User updateUser(Long userId, UpdateUserDetailsRequest details) throws ResourceNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id '" + userId + "' not found"));

        if (details.getBiography() != null) {
            user.setBiography(details.getBiography());
        }
        if (details.getProfileImageUrl() != null) {
            user.setProfileImageUrl(details.getProfileImageUrl());
        }

        return userRepository.save(user);
    }
}
