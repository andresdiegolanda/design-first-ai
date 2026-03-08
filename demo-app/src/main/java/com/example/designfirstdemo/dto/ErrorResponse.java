package com.example.designfirstdemo.dto;

/**
 * Error response body returned by the GlobalExceptionHandler.
 *
 * @param code    machine-readable error code
 * @param message human-readable description of the error
 */
public record ErrorResponse(String code, String message) {
}
