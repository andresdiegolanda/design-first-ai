package com.example.designfirstdemo.exception;

import com.example.designfirstdemo.dto.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Translates domain exceptions to HTTP responses.
 * All exception-to-status mapping lives here — never in service code.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Handles validation failures on request bodies (@Valid).
     * Returns HTTP 400 with the first validation error message.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .orElse("Validation failed");

        log.warn("Request validation failed: {}", message);
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("VALIDATION_ERROR", message));
    }

    /**
     * Handles vector store failures.
     * Returns HTTP 503 — the downstream dependency is unavailable.
     */
    @ExceptionHandler(VectorStoreException.class)
    public ResponseEntity<ErrorResponse> handleVectorStoreException(VectorStoreException ex) {
        log.error("Vector store unavailable", ex);
        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(new ErrorResponse("VECTOR_STORE_UNAVAILABLE", ex.getMessage()));
    }

    /**
     * Handles AI model failures.
     * Returns HTTP 503 — the downstream dependency is unavailable.
     */
    @ExceptionHandler(ModelException.class)
    public ResponseEntity<ErrorResponse> handleModelException(ModelException ex) {
        log.error("AI model unavailable", ex);
        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(new ErrorResponse("MODEL_UNAVAILABLE", ex.getMessage()));
    }

    /**
     * Catch-all for unexpected failures.
     * Returns HTTP 500. Logs the full stack trace — this should never happen in normal operation.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpectedException(Exception ex) {
        log.error("Unexpected error", ex);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("INTERNAL_ERROR", "An unexpected error occurred"));
    }
}
