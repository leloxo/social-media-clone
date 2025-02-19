package com.github.leloxo.socialmedia.dto;

import com.github.leloxo.socialmedia.dto.response.*;
import com.github.leloxo.socialmedia.model.Comment;
import com.github.leloxo.socialmedia.model.Post;
import com.github.leloxo.socialmedia.model.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class DataConvertor {

    public UserDetailsResponse toUserDto(User user) {
        return new UserDetailsResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getUserName(),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                user.getProfileImageUrl(),
                user.getBiography()
        );
    }

    public List<UserDetailsResponse> toUserDtoList(List<User> users) {
        return users.stream()
                .map(user -> new UserDetailsResponse(
                        user.getId(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getUserName(),
                        user.getCreatedAt(),
                        user.getUpdatedAt(),
                        user.getProfileImageUrl(),
                        user.getBiography()
                ))
                .collect(Collectors.toList());
    }

    public UserSummaryResponse toUserSummaryDto(User user) {
        return new UserSummaryResponse(
                user.getId(),
                user.getUserName(),
                user.getProfileImageUrl()
        );
    }

    public List<UserSummaryResponse> toUserSummaryDtoList(List<User> users) {
        return users.stream()
                .map(user -> new UserSummaryResponse(
                        user.getId(),
                        user.getUserName(),
                        user.getProfileImageUrl()
                ))
                .collect(Collectors.toList());
    }

    public PostDetailsResponse toPostDto(Post post) {
        return new PostDetailsResponse(
                post.getId(),
                post.getImageUrl(),
                post.getCaption(),
                post.getCreatedAt(),
                toUserSummaryDto(post.getAuthor()),
                toCommentDtoList(post.getComments())
        );
    }

    public List<CommentDetailsResponse> toCommentDtoList(Set<Comment> comments) {
        return comments.stream()
                .map(comment -> new CommentDetailsResponse(
                        comment.getId(),
                        comment.getContent(),
                        comment.getCreatedAt(),
                        toUserSummaryDto(comment.getAuthor())
                ))
                .collect(Collectors.toList());
    }

    public PostFeedResponse toFeedDto(Post post, int commentCount) {
        return new PostFeedResponse(
                post.getId(),
                post.getImageUrl(),
                post.getCaption(),
                post.getCreatedAt(),
                toUserSummaryDto(post.getAuthor()),
                commentCount
        );
    }
}
