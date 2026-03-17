package com.example.designfirstdemo.config;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * RAG retrieval configuration.
 * All values are validated at startup — the application will not start with invalid config.
 *
 * <pre>
 * app:
 *   rag:
 *     k: 3
 *     similarity-threshold: 0.7
 * </pre>
 *
 * @param k                   number of documents to retrieve from the vector store (1–20)
 * @param similarityThreshold minimum cosine similarity score for a document to be included (0.0–1.0)
 */
@ConfigurationProperties(prefix = "app.rag")
@Validated
public record RagProperties(
        @Min(1) @Max(20) int k,
        @DecimalMin("0.0") @DecimalMax("1.0") double similarityThreshold
) {
}
