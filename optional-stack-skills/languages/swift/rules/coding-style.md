# Swift Coding Style & Standards

## 1. Code Style & Naming Conventions

- Strictly follow [Apple's Swift API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/).
- Types, protocols, and enum names use **UpperCamelCase** (`UserProfile`, `PaymentProcessing`).
- Functions, properties, and enum cases use **lowerCamelCase** (`fetchUserData()`, `isActive`, `case pendingPayment`).
- Favor clarity at the point of use over brevity. Name variables according to their role, not their type.
- Format code consistently using `swiftformat` or `swift-format`. Lint with `SwiftLint`.

## 2. Concurrency & Safety (Swift 6)

- Enable Complete Concurrency Checking (`-strict-concurrency=complete`).
- Annotate UI-driven state and view models with `@MainActor`.
- Avoid force unwrapping (`!`) in production code. Use `guard let`, `if let`, or nil-coalescing (`??`). Force unwrapping is permitted only in test fixtures where a failure indicates invalid test setup.
- Avoid retain cycles: Always use `[weak self]` in escaping closures that reference `self`.

## 3. Architecture & Separation of Concerns

- **Domain Isolation**: Domain entities, models, and business logic must remain pure Swift, independent of UI frameworks (`SwiftUI`, `AppKit`, `UIKit`).
- **Dependency Inversion**: Define protocols at consumer boundaries to decouple domain services from third-party libraries (networking, analytics, local storage).
- **Value Semantics First**: Prefer `struct` and `enum` value types for data models and state. Use `class` only when reference identity, lifetime management, or framework inheritance is strictly required.

## 4. Error Handling

- Use typed errors conforming to `Error` or `LocalizedError` with descriptive failure messages.
- In Swift 6, prefer typed throws (`throws(CustomError)`) where the error domain is fully known and exhaustive.
- Never silently discard errors with `try? _ = operation()`. Log or surface failures explicitly.
