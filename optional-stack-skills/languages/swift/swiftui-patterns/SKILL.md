---
name: swiftui-patterns
description: "SwiftUI declarative UI patterns: modern state management with @Observable, view composition, type-safe NavigationStack, environment injection, and 60fps render optimization."
metadata:
  origin: "Adapted from ECC & Apple Modern SwiftUI Standards"
---

# SwiftUI Modern Architecture & UI Patterns

Production patterns for building declarative, high-performance user interfaces on Apple platforms (macOS 14+, iOS 17+) using modern SwiftUI and the Observation framework.

---

## 1. State Management & Property Wrapper Selection

Choose the simplest wrapper that fits your architectural intent:

| Property Wrapper                      | Usage & Scope                                                          | Example                                           |
| :------------------------------------ | :--------------------------------------------------------------------- | :------------------------------------------------ |
| `@State`                              | View-local value types (sheet toggles, search text, tab selection)     | `@State private var isPresented = false`          |
| `@Binding`                            | Two-way reference back to a parent's `@State`                          | `@Binding var isSelected: Bool`                   |
| `@Observable class` (passed directly) | Read-only reference passed from parent to child                        | `let viewModel: ItemListViewModel`                |
| `@Bindable`                           | Create two-way `$bindings` to properties on an `@Observable` model     | `@Bindable var viewModel: ItemListViewModel`      |
| `@Environment`                        | Shared dependencies or app-wide settings injected via `.environment()` | `@Environment(AuthService.self) private var auth` |

> [!WARNING]
> **Legacy Ban**: Do NOT use `ObservableObject`, `@ObservedObject`, `@StateObject`, or `@Published`. Use the Swift Observation framework (`@Observable`) which tracks property-level invalidations and prevents wasteful whole-view re-renders.

---

## 2. Standard @Observable ViewModel Pattern

ViewModels must be isolated to `@MainActor` and expose explicit, minimal state:

```swift
import SwiftUI
import Observation

@Observable
@MainActor
public final class ItemListViewModel {
    // MARK: - Published State
    public private(set) var items: [Item] = []
    public private(set) var isLoading: Bool = false
    public var searchText: String = ""
    public var errorMessage: String? = nil

    // MARK: - Dependencies (Seams)
    private let repository: any ItemRepository

    public init(repository: any ItemRepository) {
        self.repository = repository
    }

    // MARK: - Actions
    public func loadItems() async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }

        do {
            items = try await repository.fetchItems()
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
```

---

## 3. View Composition & Stable Hover Anchors

```swift
public struct ItemListView: View {
    @State private var viewModel: ItemListViewModel

    public init(viewModel: ItemListViewModel) {
        _viewModel = State(initialValue: viewModel)
    }

    public var body: some View {
        NavigationStack {
            List(viewModel.items) { item in
                ItemRowView(item: item)
            }
            .searchable(text: $viewModel.searchText)
            .overlay {
                if viewModel.isLoading {
                    ProgressView("Loading...")
                }
            }
            .task {
                await viewModel.loadItems()
            }
            .navigationTitle("Items")
        }
    }
}

public struct ItemRowView: View {
    let item: Item
    @State private var isHovered: Bool = false

    public var body: some View {
        // Stable Outer Anchor prevents 60Hz hover jitter when animating scale/offset
        ZStack {
            RoundedRectangle(cornerRadius: 8)
                .fill(isHovered ? Color.secondary.opacity(0.1) : Color.clear)

            HStack {
                Text(item.name)
                    .font(.body)
                Spacer()
                Text(item.status)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
        }
        .contentShape(Rectangle())
        .onHover { hovering in
            withAnimation(.easeInOut(duration: 0.15)) {
                isHovered = hovering
            }
        }
    }
}
```

---

## 4. Performance & Anti-AI-Slop Rules

1. **60fps Render Performance**:
   - Extract expensive subviews into independent `struct` components instead of computed properties (`var bodyView: some View`) so SwiftUI can memoize their identity.
   - Use `List` or `LazyVStack` with persistent identifiers (`id: \.id`), never `UUID()` generated inside body.
2. **Anti-AI-Slop Governance**:
   - Zero unrequested neon gradients or fake glassmorphism blur. Use native Apple HIG semantic colors (`Color(.windowBackgroundColor)`, `Color.secondary`, `Color.accentColor`).
   - Hairline borders: `1.0 / displayScale` or subtle `0.5pt` borders (`Color.separator`).
