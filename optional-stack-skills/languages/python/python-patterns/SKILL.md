---
name: python-patterns
invocation: model
description: "Core architectural patterns and best practices for Python projects: Deep Modules, strict typing with Mypy/Ruff, testing with Pytest, and dependency management (Poetry/UV)."
metadata:
  plane: data
  language: python
---

# Python Engineering Patterns & Seam Discipline

## 1. Deep Modules in Python

Apply John Ousterhout's _A Philosophy of Software Design_ in Python:

- **Public Surface (`__init__.py`)**: Expose only the essential classes, functions, and DTOs.
- **Hidden Internals (`_internal/` or `_module.py`)**: Prefix internal implementation details with `_` or keep them in dedicated submodules.
- **Contract Enforcement**: Use `import-linter` (with `.importlinter.ini`) to catch unauthorized cross-layer imports during CI.

## 2. Type Hints & Validation

- **Domain Modeling**: Use `pydantic` v2 or `dataclasses(frozen=True)` for domain entities and boundary DTOs.
- **Strict Linting**: Prefer `ruff check` and `mypy --strict` to eliminate dynamic typing runtime crashes.
- Never use `Any` when a Generic, `TypeVar`, or `Protocol` can express the interface.

## 3. Idiomatic Error Handling

- Define domain-specific exception hierarchies inheriting from a root `AppError`.
- Catch exceptions at the outermost boundary; never catch `Exception:` with a silent `pass`.

## 4. Testing

- Use `pytest` with fixtures for dependency injection.
- Run tests via `poetry run pytest` or `pytest -v`.
