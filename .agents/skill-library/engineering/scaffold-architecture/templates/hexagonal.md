# Blueprint B — Hexagonal / Ports & Adapters Architecture

> **Best for**: Microservices, domain-logic-first, Java/Kotlin, C#, Rust, TypeScript (enterprise)
>
> **Pattern**: Domain core at center → Ports (interfaces) → Adapters (concrete implementations) → Infrastructure (external)

## Core Concept

```
         ┌──────────────────────────────┐
         │       Infrastructure         │
         │  ┌────────────────────────┐  │
         │  │      Adapters          │  │
         │  │  ┌──────────────────┐  │  │
         │  │  │   Ports (interfaces)│ │  │
         │  │  │  ┌────────────┐  │  │  │
         │  │  │  │   DOMAIN   │  │  │  │
         │  │  │  │  (pure BL) │  │  │  │
         │  │  │  └────────────┘  │  │  │
         │  │  └──────────────────┘  │  │
         │  └────────────────────────┘  │
         └──────────────────────────────┘
```

- **Domain**: Pure business logic — no framework dependencies, no I/O.
- **Ports**: Interfaces that the domain defines. Two kinds: _Driving_ (API in) and _Driven_ (repository out).
- **Adapters**: Concrete implementations of ports. HTTP controllers implement Driving ports; DB repositories implement Driven ports.
- **Infrastructure**: Framework wiring, DI configuration, migrations.

## Folder Tree

### TypeScript / Node.js

```
src/
├── domain/
│   ├── entities/             # Core domain objects (pure classes, no framework)
│   │   └── <Entity>.ts
│   ├── value-objects/        # Immutable typed values (Email, Money, ID)
│   ├── errors/
│   │   └── domain-errors.ts  # [SEED] Typed domain errors
│   └── services/             # Domain services (pure BL, no I/O)
│       └── <Feature>DomainService.ts
├── ports/
│   ├── driving/              # Interfaces for incoming requests
│   │   └── I<Feature>UseCase.ts
│   └── driven/               # Interfaces for outgoing dependencies
│       └── I<Feature>Repository.ts
├── adapters/
│   ├── http/                 # Driving adapters: HTTP controllers
│   │   └── <Feature>Controller.ts
│   └── persistence/          # Driven adapters: DB repositories
│       └── <Feature>RepositoryImpl.ts
├── application/              # Application use cases (orchestrate domain + ports)
│   └── <Feature>UseCase.ts
└── shared/
    └── types/
        └── index.ts          # [SEED] Shared types
```

### Go

```
internal/
├── domain/
│   ├── <feature>.go          # Domain entities and value objects
│   └── errors.go             # [SEED] Domain errors
├── ports/
│   ├── driving/
│   │   └── usecase.go        # Driving port interfaces
│   └── driven/
│       └── repository.go     # Driven port interfaces
├── adapters/
│   ├── http/
│   │   └── <feature>_handler.go   # Driving adapter
│   └── postgres/
│       └── <feature>_repo.go      # Driven adapter
├── application/
│   └── <feature>_usecase.go  # Orchestration layer
└── shared/
    └── errors.go             # [SEED] Shared error types
```

### Rust

```
src/
├── domain/
│   ├── mod.rs
│   ├── entities.rs           # Core structs
│   ├── errors.rs             # [SEED] Domain errors (thiserror)
│   └── value_objects.rs
├── ports/
│   ├── mod.rs
│   ├── repository.rs         # Driven port traits
│   └── use_case.rs           # Driving port traits
├── adapters/
│   ├── http/                 # Driving (axum / actix handlers)
│   └── db/                   # Driven (sqlx / diesel repos)
├── application/
│   └── <feature>_service.rs  # Orchestration
└── shared/
    └── mod.rs                # [SEED] Common types
```

## Seam Rules for Hexagonal

1. **Domain** MUST NOT import from `adapters/`, `application/`, or any framework.
2. **Ports** are interfaces only — zero implementation in this layer.
3. **Adapters** implement Ports — they are replaceable without touching the domain.
4. **Application** orchestrates use cases by composing domain objects through ports.
5. Infrastructure (DI wiring, DB migrations) lives outside `domain/` and `ports/`.
