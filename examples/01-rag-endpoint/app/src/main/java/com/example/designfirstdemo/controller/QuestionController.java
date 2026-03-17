package com.example.designfirstdemo.controller;

import com.example.designfirstdemo.dto.AskRequest;
import com.example.designfirstdemo.dto.AskResponse;
import com.example.designfirstdemo.service.QuestionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Handles HTTP requests for the question-answering endpoint.
 * Delegates all business logic to {@link QuestionService}.
 */
@RestController
@RequestMapping("/api/v1/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    /**
     * Accepts a natural language question and returns a generated answer.
     *
     * <p>The answer is grounded in documents retrieved from the vector store.
     * If no relevant documents are found above the similarity threshold,
     * returns a "no information available" message rather than a hallucinated answer.
     *
     * @param request the question request body; question field must not be blank
     * @return HTTP 200 with the answer, HTTP 400 for invalid input,
     *         HTTP 503 if the vector store or model is unavailable
     */
    @PostMapping("/ask")
    public ResponseEntity<AskResponse> ask(@Valid @RequestBody AskRequest request) {
        AskResponse response = questionService.findAnswer(request.question());
        return ResponseEntity.ok(response);
    }
}
