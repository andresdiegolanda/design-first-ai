package com.example.designfirstdemo.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request body for the /ask endpoint.
 *
 * @param question the natural language question to answer; must not be blank
 */
public record AskRequest(@NotBlank(message = "question must not be blank") String question) {
}
