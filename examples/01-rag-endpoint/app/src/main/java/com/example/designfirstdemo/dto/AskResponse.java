package com.example.designfirstdemo.dto;

/**
 * Response body for the /ask endpoint.
 *
 * @param answer the generated answer, or a "no information available" message
 *               when no relevant documents were found above the similarity threshold
 */
public record AskResponse(String answer) {
}
