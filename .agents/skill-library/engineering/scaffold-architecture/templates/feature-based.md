# Blueprint C — Feature-Based Modules Architecture

> **Best for**: Flutter, React Native, fullstack apps, feature-heavy web apps
>
> **Pattern**: Vertical slices by feature domain — each feature is self-contained with its own types, logic, and UI

## Core Concept

Instead of horizontal layers across the whole app, each **feature is a vertical slice** containing everything it needs. Features communicate only through a thin `shared/` layer and never import each other's internals.

```
features/
├── auth/          ← Everything for authentication
├── dashboard/     ← Everything for the dashboard
├── profile/       ← Everything for user profile
└── ...

shared/            ← Only cross-cutting concerns (types, errors, utils, design system)
```

## Folder Tree

### Flutter / Dart

```
lib/
├── features/
│   └── <feature_name>/
│       ├── data/
│       │   ├── datasources/
│       │   │   └── <feature>_remote_datasource.dart   # API calls
│       │   ├── models/
│       │   │   └── <feature>_model.dart                # JSON serialization
│       │   └── repositories/
│       │       └── <feature>_repository_impl.dart      # Repository impl
│       ├── domain/
│       │   ├── entities/
│       │   │   └── <feature>.dart                      # Pure domain entity
│       │   ├── repositories/
│       │   │   └── <feature>_repository.dart           # Abstract interface
│       │   └── usecases/
│       │       └── get_<feature>.dart                  # Single-responsibility
│       └── presentation/
│           ├── pages/
│           │   └── <feature>_page.dart
│           ├── widgets/
│           │   └── <feature>_widget.dart
│           └── providers/
│               └── <feature>_provider.dart             # Riverpod / Bloc
├── shared/
│   ├── errors/
│   │   └── domain_error.dart                           # [SEED] Domain errors
│   ├── types/
│   │   └── index.dart                                  # [SEED] Shared type defs
│   ├── widgets/                                         # Design system components
│   ├── theme/
│   └── utils/
└── main.dart
```

### TypeScript / React (Next.js / Vite)

```
src/
├── features/
│   └── <feature-name>/
│       ├── api/                  # React Query hooks / SWR fetchers
│       │   └── use-<feature>.ts
│       ├── components/           # Feature-specific UI components
│       │   └── <Feature>Card.tsx
│       ├── hooks/                # Feature-specific React hooks
│       ├── types/                # Feature-local types
│       │   └── index.ts
│       ├── utils/                # Feature-local utilities
│       └── index.ts              # [SEED] Feature public export barrel
├── shared/
│   ├── components/               # Design system / shared UI
│   ├── types/
│   │   └── index.ts              # [SEED] Global types (ID, Timestamp, ApiResponse)
│   ├── errors/
│   │   └── domain-errors.ts      # [SEED] Typed errors
│   └── utils/
└── app/                          # Next.js app router / Vite entry
    └── page.tsx
```

### Swift (iOS / macOS)

```
Sources/
├── Features/
│   └── <FeatureName>/
│       ├── Models/               # Feature data models
│       ├── ViewModels/           # @Observable ViewModels
│       ├── Views/                # SwiftUI Views
│       ├── UseCases/             # Business logic
│       └── Repositories/        # Data access (protocol + impl)
└── Shared/
    ├── Errors/
    │   └── DomainError.swift     # [SEED] Domain errors
    ├── Types/
    │   └── SharedTypes.swift     # [SEED] Shared types
    └── DesignSystem/             # Colors, fonts, reusable views
```

## Seam Rules for Feature-Based

1. Features MUST NOT import from each other's internals (cross-feature imports are forbidden).
2. Features communicate only through `shared/` types or through a DI container / event bus.
3. Each feature's `index.ts` (or equivalent) is its **public API** — only export what other features need.
4. `shared/` contains ONLY cross-cutting concerns — never feature-specific logic.
5. Design system components live in `shared/components/` or `shared/widgets/`, not in individual features.
