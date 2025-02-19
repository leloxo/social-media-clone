package com.github.leloxo.socialmedia.service;

import com.github.leloxo.socialmedia.exception.ResourceNotFoundException;
import com.github.leloxo.socialmedia.model.User;
import com.github.leloxo.socialmedia.model.UserFollow;
import com.github.leloxo.socialmedia.repository.UserFollowRepository;
import com.github.leloxo.socialmedia.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserFollowService {
    private final UserRepository userRepository;
    private final UserFollowRepository userFollowRepository;

    public UserFollowService(UserRepository userRepository, UserFollowRepository userFollowRepository) {
        this.userRepository = userRepository;
        this.userFollowRepository = userFollowRepository;
    }

    public void followUser(Long followerId, Long followingId) throws ResourceNotFoundException {
        if (followerId.equals(followingId)) {
            throw new IllegalArgumentException("Users cannot follow themselves");
        }

        // Verify both users exist
        userRepository.findById(followerId)
                .orElseThrow(() -> new ResourceNotFoundException("Follower user not found"));
        userRepository.findById(followingId)
                .orElseThrow(() -> new ResourceNotFoundException("Target user not found"));

        // Check if already following
        if (userFollowRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            return;
        }

        UserFollow userFollow = new UserFollow();
        userFollow.setFollowerId(followerId);
        userFollow.setFollowingId(followingId);
        userFollowRepository.save(userFollow);
    }

    public void unfollowUser(Long followerId, Long followingId) {
        userFollowRepository.deleteByFollowerIdAndFollowingId(followerId, followingId);
    }

    public boolean isFollowing(Long followerId, Long followingId) {
        return userFollowRepository.existsByFollowerIdAndFollowingId(followerId, followingId);
    }

    public List<User> getFollowers(Long userId) {
        List<Long> followerIds = userFollowRepository.findByFollowingId(userId)
                .stream()
                .map(UserFollow::getFollowerId)
                .collect(Collectors.toList());

        return userRepository.findAllById(followerIds);
    }

    public List<Long> getFollowerIds(Long userId) {
        return userFollowRepository.findByFollowingId(userId)
                .stream()
                .map(UserFollow::getFollowerId)
                .collect(Collectors.toList());
    }

    public List<User> getFollowing(Long userId) {
        List<Long> followingIds = userFollowRepository.findByFollowerId(userId)
                .stream()
                .map(UserFollow::getFollowingId)
                .collect(Collectors.toList());

        return userRepository.findAllById(followingIds);
    }

    public List<Long> getFollowingIds(Long userId) {
        return userFollowRepository.findByFollowerId(userId)
                .stream()
                .map(UserFollow::getFollowingId)
                .collect(Collectors.toList());
    }

    public long getFollowersCount(Long userId) {
        return userFollowRepository.countByFollowingId(userId);
    }

    public long getFollowingCount(Long userId) {
        return userFollowRepository.countByFollowerId(userId);
    }
}
