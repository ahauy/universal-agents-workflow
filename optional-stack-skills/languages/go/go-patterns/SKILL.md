---
name: go-patterns
invocation: model
description: "Core architectural patterns and best practices for Go codebases: package-oriented design, internal/ seams, interfaces at consumption sites, error wrapping, and concurrency discipline."
metadata:
  plane: data
  language: go
---

# Go Engineering Patterns & Seam Discipline

## 1. Deep Modules & Package-Oriented Design in Go

- **`internal/` Enforces Seams**: The Go toolchain natively forbids external modules from importing any package inside an `internal/` directory. Place all private implementation details inside `internal/`.
- **Public API Root**: Keep the public API surface clean in the package root or `pkg/`.
- **Keep Package Names Short & Meaningful**: Avoid `utils`, `common`, `helpers`. Use nouns like `auth`, `tenant`, `billing`.

## 2. Interfaces Belong to the Consumer

- Do **not** export interfaces alongside their concrete implementations in the provider package.
- Define interfaces where they are consumed (at the boundary of the caller), declaring only the methods that the caller actually needs.

## 3. Explicit Error Handling

- Never ignore errors with `_`.
- Wrap errors with context: `fmt.Errorf("failed to fetch user %s: %w", userID, err)`.
- Use `errors.Is` and `errors.As` for inspecting wrapped errors.

## 4. Concurrency Discipline

- Always accept a `context.Context` as the first argument in blocking operations or goroutines.
- Clean up goroutines to prevent leaks (use channels or `sync.WaitGroup`).
