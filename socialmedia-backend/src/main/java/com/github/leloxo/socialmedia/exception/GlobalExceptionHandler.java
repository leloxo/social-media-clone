package com.github.leloxo.socialmedia.exception;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AccountStatusException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Handle validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        // Collect all validation errors
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());

        logger.warn("Validation failed: {}", errors);

        ProblemDetail errorDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "Validation failed for one or more fields."
        );
        errorDetail.setTitle("Invalid Request Data");
        errorDetail.setProperty("timestamp", Instant.now());
        errorDetail.setProperty("errors", errors);

        return errorDetail;
    }

    // TODO: this is for validating @PathVariable in RestController. Add @Validated to Controller
    @ExceptionHandler(ConstraintViolationException.class)
    public ProblemDetail handleConstraintViolation(ConstraintViolationException ex) {
        List<String> errors = ex.getConstraintViolations().stream()
                .map(cv -> cv.getPropertyPath() + ": " + cv.getMessage())
                .collect(Collectors.toList());

        logger.warn("Constraint violation: {}", errors);

        ProblemDetail errorDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "Validation failed for path variables or parameters."
        );
        errorDetail.setTitle("Invalid Request Parameters");
        errorDetail.setProperty("timestamp", Instant.now());
        errorDetail.setProperty("errors", errors);

        return errorDetail;
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail resourceNotFoundException(ResourceNotFoundException ex) {
        logger.warn("Resource not found: {}", ex.getMessage());

        ProblemDetail errorDetail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        errorDetail.setTitle("Resource Not Found");
        errorDetail.setProperty("timestamp", Instant.now());

        return errorDetail;
    }

    // Security-specific exception handlers
    @ExceptionHandler(BadCredentialsException.class)
    public ProblemDetail handleBadCredentialsException(BadCredentialsException ex) {
        logger.warn("Bad credentials attempt: {}", ex.getMessage());

        ProblemDetail errorDetail = ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, "The username or password is incorrect");
        errorDetail.setTitle("Authentication Failed");
        errorDetail.setProperty("timestamp", Instant.now());

        return errorDetail;
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ProblemDetail handleUnauthorizedException(UnauthorizedException ex) {
        logger.warn("Unauthorized access: {}", ex.getMessage());

        ProblemDetail errorDetail = ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, ex.getMessage());
        errorDetail.setTitle("Unauthorized");
        errorDetail.setProperty("timestamp", Instant.now());

        return errorDetail;
    }

    @ExceptionHandler(AccountStatusException.class)
    public ProblemDetail handleAccountStatusException(AccountStatusException ex) {
        logger.warn("Account status issue: {}", ex.getMessage());

        ProblemDetail errorDetail = ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, "Your account cannot be accessed at this time");
        errorDetail.setTitle("Account Access Restricted");
        errorDetail.setProperty("timestamp", Instant.now());

        return errorDetail;
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ProblemDetail handleAccessDeniedException(AccessDeniedException ex) {
        logger.warn("Access denied: {}", ex.getMessage());

        ProblemDetail errorDetail = ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, "You do not have permission to access this resource");
        errorDetail.setTitle("Access Denied");
        errorDetail.setProperty("timestamp", Instant.now());

        return errorDetail;
    }

    @ExceptionHandler(SignatureException.class)
    public ProblemDetail handleSignatureException(SignatureException ex) {
        logger.warn("Invalid JWT signature: {}", ex.getMessage());

        ProblemDetail errorDetail = ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, "Authentication token is invalid");
        errorDetail.setTitle("Invalid Authentication Token");
        errorDetail.setProperty("timestamp", Instant.now());

        return errorDetail;
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ProblemDetail handleExpiredJwtException(ExpiredJwtException ex) {
        logger.warn("Expired JWT token: {}", ex.getMessage());

        ProblemDetail errorDetail = ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, "Authentication token has expired");
        errorDetail.setTitle("Expired Authentication Token");
        errorDetail.setProperty("timestamp", Instant.now());

        return errorDetail;
    }

    // Handle image upload exceptions
    @ExceptionHandler(InvalidFileException.class)
    public ProblemDetail handleInvalidFileException(InvalidFileException ex) {
        logger.warn("Invalid file upload: {}", ex.getMessage());

        ProblemDetail errorDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
        errorDetail.setTitle("Invalid File");
        errorDetail.setProperty("timestamp", Instant.now());

        return errorDetail;
    }

    @ExceptionHandler(CloudinaryUploadException.class)
    public ProblemDetail handleCloudinaryUploadException(CloudinaryUploadException ex) {
        logger.error("Cloudinary upload failed: {}", ex.getMessage());

        ProblemDetail errorDetail = ProblemDetail.forStatusAndDetail(HttpStatus.SERVICE_UNAVAILABLE, "Image upload service is currently unavailable");
        errorDetail.setTitle("Upload Service Unavailable");
        errorDetail.setProperty("timestamp", Instant.now());

        return errorDetail;
    }

    // General exception handler for any uncaught exceptions
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGeneralException(Exception ex) {
        logger.error("Unexpected error: {}", ex.getMessage(), ex);

        ProblemDetail errorDetail = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
        errorDetail.setProperty("timestamp", Instant.now());

        return errorDetail;
    }
}
