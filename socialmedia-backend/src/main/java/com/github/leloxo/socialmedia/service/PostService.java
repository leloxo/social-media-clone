package com.github.leloxo.socialmedia.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.github.leloxo.socialmedia.exception.CloudinaryUploadException;
import com.github.leloxo.socialmedia.exception.InvalidFileException;
import com.github.leloxo.socialmedia.exception.ResourceNotFoundException;
import com.github.leloxo.socialmedia.model.Post;
import com.github.leloxo.socialmedia.model.User;
import com.github.leloxo.socialmedia.repository.PostRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class PostService {
    private final Cloudinary cloudinary;
    private final PostRepository postRepository;
    private final UserFollowService userFollowService;

    public PostService(Cloudinary cloudinary, PostRepository postRepository, UserFollowService userFollowService) {
        this.cloudinary = cloudinary;
        this.postRepository = postRepository;
        this.userFollowService = userFollowService;
    }

    // Docs:
    // https://cloudinary.com/documentation/image_upload_api_reference#upload
    // https://cloudinary.com/documentation/java_quickstart

    public String uploadImage(MultipartFile image) throws IOException {
        if (image == null || image.isEmpty()) {
            throw new InvalidFileException("Image file is required");
        }

        try {
            byte[] fileBytes = image.getBytes();
            Map uploadResult = cloudinary.uploader().upload(fileBytes,
                    ObjectUtils.asMap("resource_type", "auto"));
            return (String) uploadResult.get("url");
        } catch (IOException e) {
            if (e instanceof InvalidFileException) {
                throw new InvalidFileException("Invalid or corrupted file: " + e.getMessage());
            } else {
                throw new CloudinaryUploadException("Failed to upload image to Cloudinary: " + e.getMessage());
            }
        }
    }

    public Post createPost(String caption, String imageUrl, User author) {
        Post post = new Post();
        post.setCaption(caption);
        post.setImageUrl(imageUrl);
        post.setAuthor(author);
        return postRepository.save(post);
    }

    public Post getPostById(Long postId) throws ResourceNotFoundException {
        return postRepository.findByIdWithDetails(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post with id " + postId + " not found"));
    }

    public Page<Post> getAllPosts(Pageable pageable) {
        return postRepository.findAll(pageable);
    }

    public Page<Post> getPostsByUserId(Long userId, Pageable pageable) {
        return postRepository.findByAuthorId(userId, pageable);
    }

    public Page<Post> getPostsByUserName(String username, Pageable pageable) {
        return postRepository.findByAuthorUserName(username, pageable);
    }

    public Page<Post> getFeedForUser(Long userId, Pageable pageable) {
        List<Long> followingIds = userFollowService.getFollowingIds(userId);
        followingIds.add(userId); // To see own posts in feed
        return postRepository.findByAuthorIdIn(followingIds, pageable);
    }

    public int getCommentCountForPostById(Long postId) {
        return postRepository.countCommentsById(postId);
    }
}
