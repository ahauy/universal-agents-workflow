---
name: flutter-patterns
description: "Core architectural patterns and best practices for Flutter and Dart: Clean Architecture seams, Dart 3 sealed classes/pattern matching, widget rebuild optimization, 60fps render performance, and anti-AI-slop design system adherence."
metadata:
  origin: "Adapted from ECC & Flutter Production Standards"
  language: dart
  framework: flutter
---

# Flutter & Dart Modern Architecture & Deep Modules

Production standards for developing scalable, high-performance Flutter applications utilizing Dart 3 modern features and Clean Architecture layer isolation.

---

## 1. Clean Architecture & Layer Seams

Strictly separate code into three layers with unidirectional dependency flow (Presentation $\rightarrow$ Domain $\leftarrow$ Data):

```
lib/
├── domain/                  # PURE DART: Zero Flutter / UI dependencies
│   ├── entities/            # Immutable domain entities
│   ├── failures/            # Typed domain failure models
│   ├── repositories/        # Abstract repository contracts (interfaces)
│   └── usecases/            # Scoped business execution units
├── data/                    # Infrastructure & Adapters
│   ├── datasources/         # REST API (Dio), local SQLite/Drift, SecureStorage
│   ├── models/              # DTOs with JSON serialization (fromJson/toJson)
│   └── repositories/        # Repository implementations mapping DTOs to Entities
└── presentation/            # Flutter UI Layer
    ├── controllers/         # State management (Riverpod Notifier, BLoC/Cubit)
    ├── pages/               # Screen widgets with Scaffold
    ├── widgets/             # Reusable, atomic UI components
    └── theme/               # Design tokens, ColorScheme, typography
```

> [!IMPORTANT]
> **Domain Purity Rule**: Files in `lib/domain/` must **never** import `package:flutter/...`. Keep domain logic independent of any UI framework.

---

## 2. Dart 3 Sealed Classes & Pattern Matching

Use Dart 3 `sealed class` hierarchies for compile-time exhaustive state and operation result modeling:

```dart
// Result Pattern (avoiding thrown exceptions across boundaries)
sealed class Result<T, E> {
  const Result();
}

final class Success<T, E> extends Result<T, E> {
  final T data;
  const Success(this.data);
}

final class Failure<T, E> extends Result<T, E> {
  final E error;
  const Failure(this.error);
}

// UI State Pattern
sealed class UiState<T> {
  const UiState();
}

final class Initial<T> extends UiState<T> {
  const Initial();
}

final class Loading<T> extends UiState<T> {
  const Loading();
}

final class Loaded<T> extends UiState<T> {
  final T data;
  const Loaded(this.data);
}

final class Error<T> extends UiState<T> {
  final String message;
  const Error(this.message);
}
```

Pattern matching in widgets ensures every state case is handled:

```dart
Widget buildStateView(UiState<User> state) {
  return switch (state) {
    Initial() => const SizedBox.shrink(),
    Loading() => const Center(child: CircularProgressIndicator.adaptive()),
    Loaded(data: final user) => UserProfileView(user: user),
    Error(message: final msg) => ErrorBanner(message: msg),
  };
}
```

---

## 3. Widget Performance & 60fps Optimization

1. **`const` Constructor Discipline**:
   - Marking constructors `const` allows Flutter to reuse widget instances, eliminating allocation and layout overhead during rebuilds.
2. **Subwidget Extraction over Private Helper Methods**:
   - Always prefer creating a separate `class CustomHeader extends StatelessWidget` over a method `Widget _buildHeader()`. Standalone classes participate in Flutter's widget caching and element tree memoization.
3. **RepaintBoundary for Dynamic Content**:
   - Wrap frequently updating or animating widgets (e.g. countdown timers, canvas drawings) in `RepaintBoundary` to prevent repainting the entire ancestor render subtree.
4. **Stable Outer Anchor for Desktop/Web Hover**:
   - When adding hover scaling/translations, attach `MouseRegion` to a fixed-size parent container to prevent 60Hz hover jitter.

```dart
class ProductCard extends StatefulWidget {
  final Product product;
  const ProductCard({super.key, required this.product});

  @override
  State<ProductCard> createState() => _ProductCardState();
}

class _ProductCardState extends State<ProductCard> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    // Stable Outer Anchor prevents hover oscillation when translating child
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        curve: Curves.easeInOut,
        transform: Matrix4.translationValues(0, _isHovered ? -2 : 0, 0),
        decoration: BoxDecoration(
          color: theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: _isHovered
                ? theme.colorScheme.primary.withValues(alpha: 0.3)
                : theme.colorScheme.outlineVariant,
            width: 1,
          ),
        ),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(widget.product.title, style: theme.textTheme.titleMedium),
            const SizedBox(height: 8),
            Text('\$${widget.product.price}', style: theme.textTheme.bodyMedium),
          ],
        ),
      ),
    );
  }
}
```

---

## 4. Anti-AI-Slop & Design System Standards

- **Color Tokens**: Use Flutter's `ColorScheme` (e.g., `theme.colorScheme.surface`, `theme.colorScheme.primary`). Never use hardcoded arbitrary hex codes in widgets.
- **Hairline Borders**: Use `1.0` or `0.5` logical pixels with `theme.colorScheme.outlineVariant`.
- **Zero Generic Slop**: Prohibit unrequested high-saturation multi-color gradients, floating glowing neon circles, or fake mocked user data. Follow the project's brand design system.
