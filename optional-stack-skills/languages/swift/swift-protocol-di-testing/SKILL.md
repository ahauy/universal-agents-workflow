---
name: swift-protocol-di-testing
description: "Protocol-based dependency injection for testable Swift code: mock file system, network, Keychain, and system clocks using focused protocols and modern Swift Testing (@Test)."
metadata:
  origin: "Adapted from ECC & Swift Testing Standards"
---

# Swift Protocol-Based Dependency Injection & Testing

Patterns for making Swift code 100% testable by abstracting I/O, file systems, network, and system singletons behind minimal, focused protocols conforming to `Sendable`.

---

## 1. Minimal Consumer-Focused Protocols (Seam Discipline)

Each protocol must handle exactly one responsibility and conform to `Sendable`:

```swift
import Foundation

// MARK: - File System Protocol
public protocol FileSystemProviding: Sendable {
    func read(from url: URL) throws -> Data
    func write(_ data: Data, to url: URL) throws
    func fileExists(at url: URL) -> Bool
}

// MARK: - Network Request Protocol
public protocol NetworkClientProviding: Sendable {
    func fetch(from url: URL) async throws -> Data
}

// MARK: - Time Provider Protocol
public protocol ClockProviding: Sendable {
    var now: Date { get }
}
```

---

## 2. Production Implementations (Default)

```swift
public struct DefaultFileSystemProvider: FileSystemProviding {
    public init() {}

    public func read(from url: URL) throws -> Data {
        try Data(contentsOf: url)
    }

    public func write(_ data: Data, to url: URL) throws {
        try data.write(to: url, options: .atomic)
    }

    public func fileExists(at url: URL) -> Bool {
        FileManager.default.fileExists(atPath: url.path)
    }
}
```

---

## 3. Test Double (In-Memory Mock)

```swift
public final class MockFileSystemProvider: FileSystemProviding, @unchecked Sendable {
    private let lock = NSLock()
    private var storage: [URL: Data] = [:]

    public init(initialData: [URL: Data] = [:]) {
        self.storage = initialData
    }

    public func read(from url: URL) throws -> Data {
        lock.lock()
        defer { lock.unlock() }
        guard let data = storage[url] else {
            throw CocoaError(.fileReadNoSuchFile)
        }
        return data
    }

    public func write(_ data: Data, to url: URL) throws {
        lock.lock()
        defer { lock.unlock() }
        storage[url] = data
    }

    public func fileExists(at url: URL) -> Bool {
        lock.lock()
        defer { lock.unlock() }
        return storage[url] != nil
    }
}
```

---

## 4. Swift Testing (@Test Framework)

Use Apple's modern Swift Testing (`import Testing`) with parameterized inputs:

```swift
import Testing
import Foundation

@Suite("Document Repository Tests")
struct DocumentRepositoryTests {
    @Test("Save and retrieve document successfully")
    func testSaveAndRetrieve() throws {
        let mockFS = MockFileSystemProvider()
        let testURL = URL(fileURLWithPath: "/test/doc.txt")
        let testData = "Hello World".data(using: .utf8)!

        try mockFS.write(testData, to: testURL)

        #expect(mockFS.fileExists(at: testURL) == true)
        let retrieved = try mockFS.read(from: testURL)
        #expect(retrieved == testData)
    }

    @Test("Read missing file throws error")
    func testReadMissingFileThrows() {
        let mockFS = MockFileSystemProvider()
        let missingURL = URL(fileURLWithPath: "/test/missing.txt")

        #expect(throws: CocoaError.self) {
            try mockFS.read(from: missingURL)
        }
    }
}
```
