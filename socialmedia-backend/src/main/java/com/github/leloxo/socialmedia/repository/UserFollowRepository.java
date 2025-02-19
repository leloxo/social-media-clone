package com.github.leloxo.socialmedia.repository;

import com.github.leloxo.socialmedia.model.UserFollow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserFollowRepository extends JpaRepository<UserFollow, Long> {
    boolean existsByFollowerIdAndFollowingId(Long followerId, Long followingId);
    List<UserFollow> findByFollowerId(Long followerId);
    List<UserFollow> findByFollowingId(Long followingId);
    void deleteByFollowerIdAndFollowingId(Long followerId, Long followingId);
    long countByFollowerId(Long followerId);
    long countByFollowingId(Long followingId);
}
