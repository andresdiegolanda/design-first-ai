package com.example.designfirstdemo.service;

import com.example.designfirstdemo.config.RagProperties;
import com.example.designfirstdemo.dto.AskResponse;
import com.example.designfirstdemo.exception.ModelException;
import com.example.designfirstdemo.exception.VectorStoreException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Orchestrates the retrieval-augmented generation (RAG) flow.
 *
 * <p>Flow:
 * <ol>
 *   <li>Retrieve top-K documents from the vector store above the similarity threshold</li>
 *   <li>If no documents found, return a default "no information available" answer</li>
 *   <li>Build a grounded prompt from the retrieved documents</li>
 *   <li>Call the chat model and return the answer</li>
 * </ol>
 *
 * <p>Production note: the system prompt string in {@link #buildSystemPrompt} should be
 * externalised to {@code resources/prompts/question.st} and loaded via
 * {@code PromptTemplate} for easier iteration without recompilation.
 * The template file in this project documents what that would look like.
 */
@Service
public class QuestionService {

    private static final Logger log = LoggerFactory.getLogger(QuestionService.class);
    private static final String NO_INFORMATION = "No information available for this question.";

    private final VectorStore vectorStore;
    private final ChatClient chatClient;
    private final RagProperties ragProperties;

    public QuestionService(VectorStore vectorStore,
                           ChatClient.Builder chatClientBuilder,
                           RagProperties ragProperties) {
        this.vectorStore = vectorStore;
        this.chatClient = chatClientBuilder.build();
        this.ragProperties = ragProperties;
    }

    /**
     * Finds an answer to the given question using retrieval-augmented generation.
     *
     * @param question the natural language question
     * @return the generated answer, or a default message if no relevant documents were found
     * @throws VectorStoreException if the vector store is unavailable
     * @throws ModelException       if the chat model is unavailable
     */
    public AskResponse findAnswer(String question) {
        log.debug("Finding answer for question: {}", question);

        List<Document> documents = retrieveDocuments(question);

        if (documents.isEmpty()) {
            log.warn("No documents found above similarity threshold for question, returning default answer");
            return new AskResponse(NO_INFORMATION);
        }

        log.info("Retrieved {} documents, generating answer", documents.size());
        String answer = generateAnswer(question, documents);
        return new AskResponse(answer);
    }

    private List<Document> retrieveDocuments(String question) {
        try {
            SearchRequest request = SearchRequest.builder()
                    .query(question)
                    .topK(ragProperties.k())
                    .similarityThreshold(ragProperties.similarityThreshold())
                    .build();

            List<Document> documents = vectorStore.similaritySearch(request);
            log.debug("Retrieved {} documents from vector store", documents.size());
            return documents;
        } catch (Exception ex) {
            throw new VectorStoreException("Failed to retrieve documents from vector store", ex);
        }
    }

    private String generateAnswer(String question, List<Document> documents) {
        try {
            String context = documents.stream()
                    .map(Document::getText)
                    .collect(Collectors.joining("\n\n---\n\n"));

            String systemPrompt = buildSystemPrompt(context);

            return chatClient.prompt()
                    .system(systemPrompt)
                    .user(question)
                    .call()
                    .content();
        } catch (Exception ex) {
            throw new ModelException("Failed to generate answer from model", ex);
        }
    }

    /**
     * Builds the system prompt by injecting retrieved document context.
     *
     * <p>Production note: externalise this to {@code resources/prompts/question.st}
     * and use {@code PromptTemplate.create(Map.of("context", context))} for
     * template-managed prompts that can be updated without recompilation.
     *
     * @param context the concatenated text of retrieved documents
     * @return the complete system prompt string
     */
    private String buildSystemPrompt(String context) {
        return """
                You are a helpful assistant. Answer the question based only on the following context.
                If the context does not contain enough information to answer clearly, say so.
                Do not use any knowledge outside of the provided context.
                
                Context:
                %s
                """.formatted(context);
    }
}
