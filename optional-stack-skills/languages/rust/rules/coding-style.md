# Rust Idiomatic Coding Style & Architecture Standards

Standards and invariants for developing robust, safe, and performant Rust software within the Universal Agents Workflow.

---

## 1. Safety & Memory Discipline

- **Prohibition of `unsafe`**: `unsafe` blocks are forbidden unless strictly required for low-level FFI or hardware interfaces. Every `unsafe` block must be accompanied by an explicit `// SAFETY:` rationale comment proving why undefined behavior is impossible.
- **Zero Raw `.unwrap()` / `.expect()`**: Prohibited in all production code paths. Use the `?` operator to propagate errors up the call stack.
- **Explicit Domain Errors**: Define strongly-typed error enums using `thiserror` for library/domain code, or `anyhow` for top-level application CLI/runners.

```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum OrderError {
    #[error("item {0} is currently out of stock")]
    OutOfStock(String),
    #[error("payment processing failed: {0}")]
    PaymentFailed(String),
    #[error("database I/O error")]
    Database(#[from] std::io::Error),
}
```

---

## 2. API Design & Ownership Semantics

- **Borrowing Over Cloning**: Prefer taking borrowed references (`&str`, `&[T]`) instead of owned types (`String`, `Vec<T>`) in public function parameters unless the function needs to take ownership.
- **Pub(crate) Encapsulation**: Keep internal module helpers `pub(crate)` rather than `pub`. Expose only minimal public interfaces through `lib.rs` / `mod.rs` (Ousterhout Deep Module principle).
- **RAII & Resource Cleanup**: Implement the `Drop` trait for types managing external resources (file descriptors, sockets, temp directories) to ensure automatic, leak-free cleanup.

---

## 3. Formatting & Linting Compliance

- **Rustfmt**: Code must format cleanly via `cargo fmt -- --check`.
- **Clippy Invariant**: Zero warnings permitted. Must pass `cargo clippy --all-targets -- -D warnings`.
