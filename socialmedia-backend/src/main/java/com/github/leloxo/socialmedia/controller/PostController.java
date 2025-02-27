package com.github.leloxo.socialmedia.controller;

import com.github.leloxo.socialmedia.dto.DataConvertor;
import com.github.leloxo.socialmedia.dto.response.PostDetailsResponse;
import com.github.leloxo.socialmedia.dto.response.PostFeedResponse;
import com.github.leloxo.socialmedia.exception.ResourceNotFoundException;
import com.github.leloxo.socialmedia.model.Post;
import com.github.leloxo.socialmedia.model.User;
import com.github.leloxo.socialmedia.service.PostService;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/posts")
public class PostController {
    private static final Logger logger = LogManager.getLogger(PostController.class);

    private final PostService postService;
    private final DataConvertor dataConvertor;

    public PostController(PostService postService, DataConvertor dataConvertor) {
        this.postService = postService;
        this.dataConvertor = dataConvertor;
    }

    // TODO: use UploadPostRequest class
    // TODO: add HATEOAS
    @PostMapping
    public ResponseEntity<PostDetailsResponse> uploadPost(
            @RequestPart("image") MultipartFile image,
            @RequestPart("caption") String caption,
            @AuthenticationPrincipal User currentUser
    ) throws IOException {

        String imageUrl = postService.uploadImage(image);
        Post newPost = postService.createPost(caption, imageUrl, currentUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(dataConvertor.toPostDto(newPost));
    }

    // TODO: change path
    // TODO: Return type ?
    @PostMapping("/i")
    public ResponseEntity<String> uploadImage(@RequestPart("image") MultipartFile image) throws IOException {
        String imageUrl = postService.uploadImage(image);
        return ResponseEntity.status(HttpStatus.CREATED).body(imageUrl);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDetailsResponse> getPostById(@PathVariable Long postId) throws ResourceNotFoundException {
        Post post = postService.getPostById(postId);
        return ResponseEntity.ok(dataConvertor.toPostDto(post));
    }

    // TODO: remove?
    @GetMapping
    public ResponseEntity<Page<PostDetailsResponse>> getAllPosts(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<Post> posts = postService.getAllPosts(pageable);
        Page<PostDetailsResponse> postDtos = posts.map(dataConvertor::toPostDto);
        return ResponseEntity.ok(postDtos);
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<Page<PostDetailsResponse>> getPostsByUser(
            @PathVariable String username,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<Post> posts = postService.getPostsByUserName(username, pageable);
        Page<PostDetailsResponse> postDtos = posts.map(dataConvertor::toPostDto);
        return ResponseEntity.ok(postDtos);
    }

    @GetMapping("/feed")
    public ResponseEntity<Page<PostFeedResponse>> getFeed(
            @AuthenticationPrincipal User currentUser,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<Post> feed = postService.getFeedForUser(currentUser.getId(), pageable);

        Page<PostFeedResponse> feedDtos = feed.map(post -> {
            int commentCount = postService.getCommentCountForPostById(post.getId());
            return dataConvertor.toFeedDto(post, commentCount);
        });

        return ResponseEntity.ok(feedDtos);
    }

}
