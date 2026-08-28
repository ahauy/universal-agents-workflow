# Flutter & Dart Coding Style & Standards

## 1. Code Style & Naming Conventions

- Strictly follow official [Effective Dart Guidelines](https://dart.dev/effective-dart).
- Classes, enums, typedefs, and extensions use **UpperCamelCase** (`UserProfile`, `PaymentState`).
- Functions, methods, variables, and parameters use **lowerCamelCase** (`fetchUserData()`, `isLoading`, `itemCount`).
- Files, libraries, and asset directories use **lowercase_with_underscores** (`user_profile_screen.dart`, `auth_repository.dart`).
- Format all code with `dart format` (line length: 80 or 120 per project conventions).

## 2. Widget Construction & Performance

- **Const Constructors**: Always declare constructors as `const` when all instance fields are final, and instantiate widgets with `const` wherever possible to avoid unnecessary rebuilds.
- **Extract Subwidgets over Helper Methods**: Extract complex widget trees into standalone `StatelessWidget` / `StatefulWidget` classes rather than private helper methods (`Widget _buildHeader()`). Independent widgets enable Flutter to memoize and optimize subtree rebuilds.
- **Keys for State Continuity**: Provide explicit `Key` (e.g. `ValueKey(item.id)`) when dynamically rearranging, sorting, or removing items in a list.
- **Keep `build()` Pure**: Never perform network requests, file I/O, heavy sorting, or state mutation inside `Widget.build()`.

## 3. Null Safety & Async Hygiene

- Enable strict null safety and sound type system checks.
- **BuildContext Async Gaps**: Never use `BuildContext` across an `await` point without verifying lifecycle validity:
  ```dart
  final data = await authService.login();
  if (!context.mounted) return;
  Navigator.of(context).pushNamed('/home');
  ```
- **Resource Disposal**: Always override `dispose()` to cancel stream subscriptions, dispose `TextEditingController`, `AnimationController`, `ScrollController`, and `FocusNode`.

## 4. Architecture & Layer Separation

- **Pure Domain Layer**: Code in `lib/domain/` (entities, value objects, use cases, repository interfaces) must be 100% pure Dart and must never import `package:flutter/...`.
- **Dependency Inversion**: Define repository and service interfaces in the domain layer. Implement data sources (REST API, SQLite/Drift, SharedPreferences) in `lib/data/` or `lib/infrastructure/`.
- **Immutable State Objects**: State models must be immutable. Use Dart 3 `sealed class` hierarchies or `@freezed` unions to represent exhaustive UI states (Loading, Success, Failure).

## 5. Error Handling & Anti-Patterns

- Never catch and swallow exceptions silently with `catch (e) {}`. Always log or map exceptions to domain failures.
- Prefer typed result objects (e.g., `Result<T, AppFailure>` or `Either<AppFailure, T>`) for operational errors instead of throwing raw unchecked exceptions across architectural layers.
