---
name: swift-actor-persistence
description: "Thread-safe local data persistence using Swift actors: hybrid in-memory caching with file-backed JSON/binary storage, zero data races by design, and atomic disk writes."
metadata:
  origin: "Adapted from ECC & Swift Actor Architecture"
---

# Swift Actor-Based Thread-Safe Persistence

Patterns for building high-performance, race-free persistence layers using Swift `actor`. Combines an in-memory dictionary cache with atomic file-backed serialization.

---

## 1. Actor Repository Pattern

The actor model ensures that all mutations (save, delete, purge) and queries (find, list) are executed serially without manual mutex locking:

```swift
import Foundation

public actor LocalRepository<T: Codable & Identifiable> where T.ID == String {
    private var cache: [String: T] = [:]
    private let fileURL: URL

    public init(directory: URL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0], filename: String) {
        self.fileURL = directory.appendingPathComponent(filename)
        // Synchronous cold-boot load before actor isolation is fully active
        if let data = try? Data(contentsOf: self.fileURL),
           let decoded = try? JSONDecoder().decode([String: T].self, from: data) {
            self.cache = decoded
        }
    }

    // MARK: - Public CRUD Operations

    public func save(_ item: T) throws {
        cache[item.id] = item
        try persistToDisk()
    }

    public func delete(id: String) throws {
        cache.removeValue(forKey: id)
        try persistToDisk()
    }

    public func find(id: String) -> T? {
        cache[id]
    }

    public func all() -> [T] {
        Array(cache.values)
    }

    // MARK: - Atomic Persistence

    private func persistToDisk() throws {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        let data = try encoder.encode(cache)
        try data.write(to: fileURL, options: [.atomic])
    }
}
```

---

## 2. Best Practices & Invariants

1. **Atomic File Writes**:
   - Always pass `options: [.atomic]` to `data.write(to:)`. This writes to a temporary sibling file and performs an atomic rename, preventing data corruption if the application terminates mid-write.
2. **MainActor Bridging**:
   - Since SwiftUI ViewModels live on `@MainActor`, they interact with the repository asynchronously:
   ```swift
   @MainActor
   func refreshItems() async {
       let items = await repository.all()
       self.items = items
   }
   ```
3. **Seam Isolation**:
   - Keep `LocalRepository` pure Swift. Do not import UI frameworks (`SwiftUI`, `AppKit`).
