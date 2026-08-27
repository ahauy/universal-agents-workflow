---
name: swift-patterns
invocation: model
description: "Core architectural patterns and best practices for Swift, SwiftUI, and Apple platforms: Swift 6 strict concurrency, Sendable conformance, Observation framework (@Observable), SPM/XcodeGen package seams, and Swift Testing."
metadata:
  plane: data
  language: swift
---

# Swift & SwiftUI Modern Architecture & Deep Modules

## 1. Deep Modules & Package Boundaries (SPM / XcodeGen)

- **Encapsulation & Access Control**: Keep internal implementation details marked `internal` or `private`. Expose only minimal, well-documented `public` APIs at module boundaries.
- **Separate Domain from UI Adapters**: Domain logic (models, business calculators, state machines) must never import `SwiftUI`, `AppKit`, or `UIKit`. UI layers import domain modules, never the reverse.
- **Clean Protocol Seams**: Use protocols for external dependencies (network clients, persistence, hardware sensors) to enable instant in-memory mocking and parallel testability.

## 2. Swift 6 Strict Concurrency & Actor Isolation

- **Actor Boundaries**: Use `@MainActor` for ViewModels, state stores, and UI-bound coordination. Use background `actor` instances for shared mutable state (caches, database managers).
- **Sendable Discipline**: Ensure data passed across actor boundaries conforms to `Sendable`. Prefer immutable `struct` and `enum` value types over reference classes.
- **Structured Concurrency**: Favor `async/await`, `TaskGroup`, and structured task lifecycles over unstructured `Task.detached` or legacy completion handlers (`@escaping (Result<T, Error>) -> Void`).
- **No Data Races**: Never bypass concurrency checks with `@unchecked Sendable` unless backed by an explicit OS-level lock (e.g., `os_unfair_lock` or `NSLock`) and fully documented.

## 3. Modern SwiftUI State Architecture

- **Observation Framework**: Use `@Observable` classes for observable state (iOS 17+ / macOS 14+) instead of legacy `ObservableObject`, `@Published`, and `@ObservedObject`.
- **View Simplicity & Composition**: Keep Views small, declarative, and focused on presentation. Extract heavy business rules into dedicated domain services.
- **Avoid Heavy View Initializers**: Never trigger network calls, database queries, or long computations inside a View's `init`. Trigger side-effects in `.task { ... }` which respects view lifecycle cancellation.
- **Stable State Ownership**: Use `@State` for view-owned state and pass read-only data or bindings (`@Binding`) downward.

## 4. Modern Testing Standards

- **Swift Testing Framework**: Prefer Swift Testing (`import Testing`, `@Suite`, `@Test`, `#expect(...)`) for new tests. Use `XCTest` where legacy compatibility is required.
- **Deterministic & Async-First**: Test async methods directly using `await #expect(...)`. Avoid arbitrary sleep timers; use structured async synchronization.
- **Fast In-Memory Fixtures**: Design domain modules with protocol mocks or in-memory fixtures to run tests in milliseconds without launching the app simulator.
