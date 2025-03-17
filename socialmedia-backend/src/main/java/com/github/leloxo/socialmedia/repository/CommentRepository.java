package com.github.leloxo.socialmedia.repository;

import com.github.leloxo.socialmedia.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}
