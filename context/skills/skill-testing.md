# Skill: Testing

> **What this is:** A reusable skill for writing consistent, well-structured tests across
> service and controller layers.
> **When to load it:** When writing any new test, or adding test coverage to an existing
> feature.
> **How to load it:** Reference by path in agent mode, or `#file:context/skills/skill-testing.md`

---

## What This Skill Does

Produces unit tests for the service layer (plain JUnit + Mockito, no Spring context) and
integration tests for the controller layer (`@WebMvcTest`). Enforces a consistent naming
convention and test structure.

---

## Rules

**Unit tests (service layer):**
- Use Mockito. No Spring context loaded. Fast.
- Test observable behavior, not internal implementation. Mock the boundary, not internals.
- One logical assertion per test is a guideline, not a law. Assert what matters.

**Controller tests:**
- Use `@WebMvcTest`. Do not load the full Spring context.
- Use `MockMvc`. Assert HTTP status and response body shape.
- Mock the service layer with `@MockBean`.

**Naming:** `methodName_condition_expectedResult`
Example: `getById_unknownId_returns404`

---

## Pattern

**Unit test:**
```java
@ExtendWith(MockitoExtension.class)
class [Resource]ServiceTest {

    @Mock
    private [Dependency] dependency;

    @InjectMocks
    private [Resource]Service service;

    @Test
    void [methodName]_[condition]_[expectedResult]() {
        // Arrange
        given(dependency.[method]()).willReturn([value]);

        // Act
        [ReturnType] result = service.[method]([args]);

        // Assert
        assertThat(result).[assertion];
    }
}
```

**Controller test:**
```java
@WebMvcTest([Resource]Controller.class)
class [Resource]ControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private [Resource]Service service;

    @Test
    void [methodName]_[condition]_[expectedResult]() throws Exception {
        given(service.[method]([args])).willReturn([value]);

        mockMvc.perform(get("/api/v1/[resource]/{id}", [id]))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.field").value([expected]));
    }
}
```

---

## Design Constraints

- Do not use `@SpringBootTest` for tests that only need one layer
- Do not test Spring wiring in unit tests — that is what `@WebMvcTest` is for
- Do not assert on exact error message strings — assert on status codes or error type fields
- Do not name tests with `test` prefix or `should` — use `method_condition_result`
