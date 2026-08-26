---
name: rust-patterns
invocation: model
description: "Core architectural patterns and best practices for Rust codebases: Deep Modules with workspace crates and pub(crate), type-driven design, and error handling with thiserror/anyhow."
metadata:
  plane: data
  language: rust
---

# Rust Engineering Patterns & Seam Discipline

## 1. Deep Modules in Rust

- **Cargo Workspaces**: For complex domains, split the project into distinct crates inside a Cargo workspace (e.g. `crates/domain`, `crates/storage`, `crates/api`).
- **Encapsulation with `pub(crate)`**: Keep items visible only within their parent crate by using `pub(crate)` instead of bare `pub`.
- **Public Façade**: Only re-export the high-level structs and traits from `lib.rs`.

## 2. Type-Driven Design & State Machines

- Encode invalid states as unrepresentable using Rust's rich `enum` and type system.
- Use the Typestate pattern to enforce correct sequence of operations at compile time (e.g. `DraftInvoice -> PaidInvoice`).

## 3. Error Handling

- Libraries / Core Domain: Use `thiserror` to define strongly typed enum errors.
- Applications / CLI / Binaries: Use `anyhow::Result` with `.context("description")` for actionable error chains.
- Never use `.unwrap()` in production code paths; use `expect("detailed invariant violation reason")` or return a `Result`.

## 4. Tooling & Verification

- Check code with `cargo check` and `cargo clippy -- -D warnings`.
- Run tests via `cargo test`.
