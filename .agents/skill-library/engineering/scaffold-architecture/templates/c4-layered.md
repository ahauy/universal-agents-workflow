# Blueprint A — C4 Layered Architecture

> **Best for**: REST APIs, backend-heavy projects, TypeScript/Node, Go, Python, Java/Kotlin, C#
>
> **Pattern**: Horizontal layers — Presentation → Business Logic → Data Access → Shared

## Folder Tree

### TypeScript / Node.js (Express / NestJS / Next.js)

```
src/
├── controllers/          # HTTP handlers: parse request, call service, return response
│   └── <feature>.controller.ts
├── services/             # Business logic: orchestrates domain rules, calls repositories
│   └── <feature>.service.ts
├── repositories/         # Data access: database queries, external API calls
│   └── <feature>.repository.ts
├── shared/
│   ├── types/
│   │   └── index.ts      # [SEED] Domain types (ID, Timestamp, shared interfaces)
│   ├── errors/
│   │   └── domain-errors.ts  # [SEED] Typed domain errors
│   └── constants/
│       └── index.ts      # App-level constants
└── index.ts              # [SEED] Module entry point / export barrel
```

### Go

```
internal/
├── handler/              # HTTP handlers (chi, gin, fiber) — thin routing layer
│   └── <feature>_handler.go
├── service/              # Business logic — domain orchestration
│   └── <feature>_service.go
├── repository/           # Data access — DB queries, external calls
│   └── <feature>_repository.go
├── model/                # Domain structs and interfaces
│   └── <feature>.go
└── shared/
    ├── errors.go         # [SEED] Typed domain errors
    └── types.go          # [SEED] Shared types (ID string, Pagination, etc.)
```

### Python (FastAPI / Django / Flask)

```
src/
├── api/                  # Route handlers / views
│   └── <feature>_routes.py
├── services/             # Business logic
│   └── <feature>_service.py
├── repositories/         # Data access (SQLAlchemy / Django ORM / raw)
│   └── <feature>_repository.py
├── models/               # Pydantic schemas / Django models
│   └── <feature>.py
└── shared/
    ├── errors.py         # [SEED] Domain errors
    └── types.py          # [SEED] Shared type aliases
```

### Flutter / Dart (REST client layer)

```
lib/
├── features/<feature>/
│   ├── data/
│   │   ├── datasources/   # Remote API calls, local storage
│   │   └── repositories/  # Repository implementations
│   ├── domain/
│   │   ├── entities/      # Pure domain classes
│   │   ├── repositories/  # Abstract repository interfaces
│   │   └── usecases/      # Single-responsibility use cases
│   └── presentation/
│       ├── pages/
│       ├── widgets/
│       └── providers/     # Riverpod / Bloc / Cubit
└── shared/
    ├── errors/
    │   └── domain_error.dart  # [SEED] Domain error types
    └── types/
        └── index.dart         # [SEED] Shared type defs
```

## Seam Rules for C4 Layered

1. **Controllers** only call **Services** — never Repository directly.
2. **Services** only call **Repositories** — never HTTP clients directly.
3. **Repositories** are the ONLY place database or external API calls exist.
4. **Shared** is imported by any layer but never imports from controllers/services/repositories.
5. Dependency direction: Controller → Service → Repository → Shared (one-way only).
