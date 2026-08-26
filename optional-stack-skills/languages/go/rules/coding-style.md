# Go Coding Style & Standards

## 1. Code Style & Formatting

- Format with `gofmt` or `goimports`.
- Lint with `golangci-lint` (including `govet`, `staticcheck`, `errcheck`, `gocritic`).
- Enforce package seams via `internal/` directories.

## 2. Interface & Package Design

- Keep package names short, singular, and lowercase (e.g. `auth`, `tenant`, `order`).
- Do NOT export interfaces alongside their concrete implementations in provider packages.
- Define interfaces where they are consumed, specifying only the methods the consumer needs.

## 3. Error Handling

- Never ignore errors with `_`.
- Wrap errors with context: `fmt.Errorf("failed to process order %s: %w", orderID, err)`.
- Use `errors.Is` and `errors.As` for inspecting wrapped errors.

## 4. Concurrency & Context

- Pass `context.Context` as the first parameter to any blocking or I/O-bound function.
- Always ensure goroutines have a well-defined termination condition to prevent memory leaks.
