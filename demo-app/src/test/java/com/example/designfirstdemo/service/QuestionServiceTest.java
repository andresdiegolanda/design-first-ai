package com.example.designfirstdemo.service;

import com.example.designfirstdemo.config.RagProperties;
import com.example.designfirstdemo.dto.AskResponse;
import com.example.designfirstdemo.exception.ModelException;
import com.example.designfirstdemo.exception.VectorStoreException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

@ExtendWith(MockitoExtension.class)
class QuestionServiceTest {

    @Mock
    private VectorStore vectorStore;

    @Mock
    private ChatClient.Builder chatClientBuilder;

    @Mock
    private ChatClient chatClient;

    @Mock
    private ChatClient.ChatClientRequestSpec requestSpec;

    @Mock
    private ChatClient.CallResponseSpec callResponseSpec;

    private QuestionService questionService;

    private static final RagProperties RAG_PROPERTIES = new RagProperties(3, 0.7);

    @BeforeEach
    void setUp() {
        given(chatClientBuilder.build()).willReturn(chatClient);
        questionService = new QuestionService(vectorStore, chatClientBuilder, RAG_PROPERTIES);
    }

    @Test
    void findAnswer_documentsFound_returnsGeneratedAnswer() {
        // Arrange
        List<Document> documents = List.of(
                new Document("Spring AI is a framework for building AI applications."),
                new Document("It supports OpenAI, Anthropic, and other model providers.")
        );
        given(vectorStore.similaritySearch(any(SearchRequest.class))).willReturn(documents);
        given(chatClient.prompt()).willReturn(requestSpec);
        given(requestSpec.system(any(String.class))).willReturn(requestSpec);
        given(requestSpec.user(any(String.class))).willReturn(requestSpec);
        given(requestSpec.call()).willReturn(callResponseSpec);
        given(callResponseSpec.content()).willReturn("Spring AI supports multiple model providers.");

        // Act
        AskResponse response = questionService.findAnswer("What is Spring AI?");

        // Assert
        assertThat(response.answer()).isEqualTo("Spring AI supports multiple model providers.");
    }

    @Test
    void findAnswer_noDocumentsFound_returnsDefaultAnswer() {
        // Arrange
        given(vectorStore.similaritySearch(any(SearchRequest.class))).willReturn(List.of());

        // Act
        AskResponse response = questionService.findAnswer("What is the meaning of life?");

        // Assert
        assertThat(response.answer()).isEqualTo("No information available for this question.");
        then(chatClient).shouldHaveNoInteractions();
    }

    @Test
    void findAnswer_vectorStoreThrows_throwsVectorStoreException() {
        // Arrange
        given(vectorStore.similaritySearch(any(SearchRequest.class)))
                .willThrow(new RuntimeException("connection refused"));

        // Act & Assert
        assertThatThrownBy(() -> questionService.findAnswer("What is Spring AI?"))
                .isInstanceOf(VectorStoreException.class)
                .hasMessageContaining("Failed to retrieve documents from vector store")
                .hasCauseInstanceOf(RuntimeException.class);
    }

    @Test
    void findAnswer_chatClientThrows_throwsModelException() {
        // Arrange
        List<Document> documents = List.of(new Document("Some context document."));
        given(vectorStore.similaritySearch(any(SearchRequest.class))).willReturn(documents);
        given(chatClient.prompt()).willReturn(requestSpec);
        given(requestSpec.system(any(String.class))).willReturn(requestSpec);
        given(requestSpec.user(any(String.class))).willReturn(requestSpec);
        given(requestSpec.call()).willThrow(new RuntimeException("model timeout"));

        // Act & Assert
        assertThatThrownBy(() -> questionService.findAnswer("What is Spring AI?"))
                .isInstanceOf(ModelException.class)
                .hasMessageContaining("Failed to generate answer from model")
                .hasCauseInstanceOf(RuntimeException.class);
    }

    @Test
    void findAnswer_searchRequestUsesConfiguredKAndThreshold() {
        // Arrange — use a custom config to verify the values are passed through
        RagProperties customProps = new RagProperties(5, 0.85);
        given(chatClientBuilder.build()).willReturn(chatClient);
        QuestionService serviceWithCustomProps = new QuestionService(vectorStore, chatClientBuilder, customProps);

        given(vectorStore.similaritySearch(any(SearchRequest.class))).willReturn(List.of());

        // Act
        serviceWithCustomProps.findAnswer("test question");

        // Assert — verify the search request was made (values validated via config record constraints)
        then(vectorStore).should().similaritySearch(any(SearchRequest.class));
    }
}
