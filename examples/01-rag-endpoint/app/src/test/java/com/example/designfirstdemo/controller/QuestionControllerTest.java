package com.example.designfirstdemo.controller;

import com.example.designfirstdemo.dto.AskRequest;
import com.example.designfirstdemo.dto.AskResponse;
import com.example.designfirstdemo.exception.ModelException;
import com.example.designfirstdemo.exception.VectorStoreException;
import com.example.designfirstdemo.service.QuestionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(QuestionController.class)
class QuestionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private QuestionService questionService;

    @Test
    void ask_validQuestion_returns200WithAnswer() throws Exception {
        // Arrange
        given(questionService.findAnswer("What is Spring AI?"))
                .willReturn(new AskResponse("Spring AI is a framework for AI-powered applications."));

        // Act & Assert
        mockMvc.perform(post("/api/v1/questions/ask")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AskRequest("What is Spring AI?"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.answer").value("Spring AI is a framework for AI-powered applications."));
    }

    @Test
    void ask_blankQuestion_returns400() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/v1/questions/ask")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AskRequest(""))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
    }

    @Test
    void ask_missingQuestionField_returns400() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/v1/questions/ask")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
    }

    @Test
    void ask_vectorStoreUnavailable_returns503() throws Exception {
        // Arrange
        given(questionService.findAnswer("What is Spring AI?"))
                .willThrow(new VectorStoreException("connection refused", new RuntimeException()));

        // Act & Assert
        mockMvc.perform(post("/api/v1/questions/ask")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AskRequest("What is Spring AI?"))))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.code").value("VECTOR_STORE_UNAVAILABLE"));
    }

    @Test
    void ask_modelUnavailable_returns503() throws Exception {
        // Arrange
        given(questionService.findAnswer("What is Spring AI?"))
                .willThrow(new ModelException("model timeout", new RuntimeException()));

        // Act & Assert
        mockMvc.perform(post("/api/v1/questions/ask")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AskRequest("What is Spring AI?"))))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.code").value("MODEL_UNAVAILABLE"));
    }

    @Test
    void ask_noDocumentsFound_returns200WithDefaultAnswer() throws Exception {
        // Arrange — service returns the default message, not an exception
        given(questionService.findAnswer("Unknown question"))
                .willReturn(new AskResponse("No information available for this question."));

        // Act & Assert
        mockMvc.perform(post("/api/v1/questions/ask")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AskRequest("Unknown question"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.answer").value("No information available for this question."));
    }
}
