# Python Coding Style & Standards

## 1. Code Style & Formatting

- Format with `ruff format` or `black`.
- Lint with `ruff check` with strict flake8, isort, and bugbear rules.
- Typecheck with `mypy --strict`.

## 2. Typing & Data Modeling

- Use type hints everywhere; never use raw `Any` without narrowing or protocol.
- Use `pydantic` v2 or `@dataclass(frozen=True)` for domain entities and boundary DTOs.
- Use `Protocol` for structural subtyping (interfaces belong to the consumer).

## 3. Immutability & Defensive Design

- Favor immutable data structures; avoid default mutable argument values (`def fn(x=[])` is strictly forbidden).
- Use list/dict comprehensions with clear intent; avoid deeply nested comprehensions ($>2$ levels).

## 4. Error Handling

- Define custom domain exceptions inheriting from a root `AppError`.
- Catch exceptions at system boundaries; never use bare `except:` or `except Exception: pass`.
