package com.github.leloxo.socialmedia.controller;

import com.github.leloxo.socialmedia.dto.DataConvertor;
import com.github.leloxo.socialmedia.dto.response.UserSummaryResponse;
import com.github.leloxo.socialmedia.exception.ResourceNotFoundException;
import com.github.leloxo.socialmedia.model.User;
import com.github.leloxo.socialmedia.service.UserFollowService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/follows")
public class UserFollowController {
    private final UserFollowService userFollowService;
    private final DataConvertor dataConvertor;

    public UserFollowController(UserFollowService userFollowService, DataConvertor dataConvertor) {
        this.userFollowService = userFollowService;
        this.dataConvertor = dataConvertor;
    }

    @PostMapping("/{targetUserId}")
    public ResponseEntity<Void> followUser(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long targetUserId
    ) throws ResourceNotFoundException {
        userFollowService.followUser(currentUser.getId(), targetUserId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{targetUserId}")
    public ResponseEntity<Void> unfollowUser(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long targetUserId
    ) {
        userFollowService.unfollowUser(currentUser.getId(), targetUserId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/followers")
    public ResponseEntity<List<UserSummaryResponse>> getFollowers(@AuthenticationPrincipal User currentUser) {
        List<User> followers = userFollowService.getFollowers(currentUser.getId());
        return ResponseEntity.ok(dataConvertor.toUserSummaryDtoList(followers));
    }

    @GetMapping("/following")
    public ResponseEntity<List<UserSummaryResponse>> getFollowing(@AuthenticationPrincipal User currentUser) {
        List<User> followers = userFollowService.getFollowing(currentUser.getId());
        return ResponseEntity.ok(dataConvertor.toUserSummaryDtoList(followers));
    }

    @GetMapping("/followers/count/{userId}")
    public ResponseEntity<Long> getFollowersCount(@PathVariable Long userId) {
        return ResponseEntity.ok(userFollowService.getFollowersCount(userId));
    }

    @GetMapping("/following/count/{userId}")
    public ResponseEntity<Long> getFollowingCount(@PathVariable Long userId) {
        return ResponseEntity.ok(userFollowService.getFollowingCount(userId));
    }

//    @GetMapping("/status/{targetUserId}")
//    public ResponseEntity<Map<String, Boolean>> getFollowStatus(
//            @AuthenticationPrincipal User currentUser,
//            @PathVariable Long targetUserId
//    ) {
//        boolean isFollowing = userFollowService.isFollowing(currentUser.getId(), targetUserId);
//        Map<String, Boolean> response = new HashMap<>();
//        response.put("following", isFollowing);
//        return ResponseEntity.ok(response);
//    }

    @GetMapping("/status/{targetUserId}")
    public ResponseEntity<Boolean> getFollowStatus(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long targetUserId
    ) {
        boolean isFollowing = userFollowService.isFollowing(currentUser.getId(), targetUserId);
        return ResponseEntity.ok(isFollowing);
    }

    // TODO: leave in or remove?

    @GetMapping("/user/{userId}/following")
    public ResponseEntity<List<UserSummaryResponse>> getUserFollowing(@PathVariable Long userId) {
        List<User> following = userFollowService.getFollowing(userId);
        return ResponseEntity.ok(dataConvertor.toUserSummaryDtoList(following));
    }

    @GetMapping("/user/{userId}/followers")
    public ResponseEntity<List<UserSummaryResponse>> getUserFollowers(@PathVariable Long userId) {
        List<User> followers = userFollowService.getFollowers(userId);
        return ResponseEntity.ok(dataConvertor.toUserSummaryDtoList(followers));
    }
}
