---
name: swift-concurrency
description: "Swift 6 & 6.2 concurrency patterns: actor isolation, Sendable enforcement, isolated conformances, structured concurrency (TaskGroup), and preventing data races without speculative locks."
metadata:
  origin: "Adapted from ECC & Swift 6.2 Concurrency Guidelines"
---

# Swift 6 & 6.2 Concurrency Architecture

Modern concurrency patterns for Swift 6+ eliminating data races at compile time while maintaining high throughput and ergonomics.

---

## 1. Actor Isolation & Sendable Discipline

1. **Actors for Shared Mutable State**:
   - Use `actor` to protect shared state accessed across threads.
   - External access must use `await`. Internal access is synchronous.

```swift
public actor SessionCache {
    private var tokens: [String: String] = [:]

    public func store(token: String, for key: String) {
        tokens[key] = token
    }

    public func token(for key: String) -> String? {
        tokens[key]
    }
}
```

2. **Sendable Value Types**:
   - Data passed across actor boundaries MUST conform to `Sendable`.
   - Prefer immutable `struct` or `enum` containing only Sendable properties.

```swift
public struct UserProfile: Sendable, Equatable {
    public let id: String
    public let name: String
    public let email: String
}
```

---

## 2. Approachable Concurrency (Swift 6.2+)

In Swift 6.2, async functions stay on the calling actor by default (single-threaded by default). Background offloading is made explicit:

```swift
@MainActor
public final class PhotoGalleryViewModel {
    private let processor = ImageProcessor()

    // Runs on MainActor without implicit thread hopping
    public func processImage(_ data: Data) async throws -> ProcessedImage {
        // Explicitly offload CPU-intensive operations using @concurrent or detached Task
        let processed = await Task.detached(priority: .userInitiated) {
            return ImageProcessor.heavyFilter(data)
        }.value

        return processed
    }
}
```

### Isolated Conformances

MainActor types can conform safely to protocols using `@MainActor` isolated conformances:

```swift
public protocol Exportable {
    func exportData() -> Data
}

// Swift 6.2 isolated conformance ensures exportData() is only called on MainActor
extension PhotoGalleryViewModel: @MainActor Exportable {
    public func exportData() -> Data {
        Data()
    }
}
```

---

## 3. Structured Concurrency vs Unstructured Tasks

| Pattern                                   | When to Use                                             | Safety Rule                                                    |
| :---------------------------------------- | :------------------------------------------------------ | :------------------------------------------------------------- |
| `withTaskGroup` / `withThrowingTaskGroup` | Parallel work with parent-child lifecycle               | Automatically propagates cancellation and awaits all children. |
| `.task {}` in SwiftUI                     | View-lifecycle bound async operations                   | Automatically cancelled when view disappears.                  |
| `Task {}` (unstructured)                  | Rare: triggering async action from synchronous UI event | Capture `[weak self]` if escaping or mutating state.           |
| `Task.detached`                           | Strict CPU offloading to background pool                | **Never** access `self` or mutable shared state directly.      |

---

## 4. Diagnostics & Compiler Checks

```bash
# Verify Complete Concurrency Checking:
swift build -Xswiftc -strict-concurrency=complete 2>&1
```
