package com.github.leloxo.socialmedia.repository;

import com.github.leloxo.socialmedia.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("""
        SELECT p FROM Post p
        LEFT JOIN FETCH p.author
        LEFT JOIN FETCH p.comments c
        LEFT JOIN FETCH c.author
        WHERE p.author.id = :authorId
        """)
    Page<Post> findByAuthorId(Long authorId, Pageable pageable);

    @Query("""
        SELECT p FROM Post p
        LEFT JOIN FETCH p.author
        LEFT JOIN FETCH p.comments c
        LEFT JOIN FETCH c.author
        WHERE p.author.id IN :authorIds
        """)
    Page<Post> findByAuthorIdIn(Collection<Long> authorIds, Pageable pageable);

    @Query("""
        SELECT p FROM Post p
        LEFT JOIN FETCH p.author
        LEFT JOIN FETCH p.comments c
        LEFT JOIN FETCH c.author
        WHERE p.id = :postId
        """)
    Optional<Post> findByIdWithDetails(Long postId);

    @Query("""
        SELECT p FROM Post p
        LEFT JOIN FETCH p.author
        LEFT JOIN FETCH p.comments c
        LEFT JOIN FETCH c.author
        ORDER BY p.createdAt DESC
        """)
    Page<Post> findAllWithDetails(Pageable pageable);

    @Query("""
        SELECT COUNT(c)
        FROM Post p
        LEFT JOIN p.comments c
        WHERE p.id = :postId
        """)
    int countCommentsById(Long postId);
}
