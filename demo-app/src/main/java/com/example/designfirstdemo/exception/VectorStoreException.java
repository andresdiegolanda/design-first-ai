package com.example.designfirstdemo.exception;

/**
 * Thrown when the vector store is unavailable or returns an unexpected error.
 * Maps to HTTP 503 Service Unavailable.
 */
public class VectorStoreException extends DemoAppException {

    public VectorStoreException(String message, Throwable cause) {
        super(message, cause);
    }
}
