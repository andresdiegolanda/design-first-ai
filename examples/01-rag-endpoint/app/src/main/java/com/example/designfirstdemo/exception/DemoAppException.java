package com.example.designfirstdemo.exception;

/**
 * Base exception for all application-specific failures.
 * Extend this class for each distinct failure category.
 * Do not throw this class directly — use a named subclass.
 */
public class DemoAppException extends RuntimeException {

    public DemoAppException(String message, Throwable cause) {
        super(message, cause);
    }

    public DemoAppException(String message) {
        super(message);
    }
}
