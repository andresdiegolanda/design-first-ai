package com.example.springmvcdemo.exception;

/**
 * Error response body returned by {@link GlobalExceptionHandler}.
 *
 * @param code    machine-readable error code
 * @param message human-readable description
 */
public record ErrorResponse(String code, String message) {}
