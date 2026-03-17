package com.example.designfirstdemo.exception;

/**
 * Thrown when the AI chat model is unavailable or returns an unexpected error.
 * Maps to HTTP 503 Service Unavailable.
 */
public class ModelException extends DemoAppException {

    public ModelException(String message, Throwable cause) {
        super(message, cause);
    }
}
