# Optional Stack & Language Skills

This directory contains modular, specialized skills and configuration templates organized by **language** and **framework**. They are kept separate from `.agents/skills/` to prevent context bloat and ensure that `Universal-Agents-Workflow` remains lean, polyglot, and fast.

---

## Directory Structure

```
optional-stack-skills/
├── languages/                 # Language-specific patterns & architectural boundaries
│   ├── python/
│   │   ├── python-patterns/   # Deep modules, Pydantic, Ruff/Mypy, Pytest
│   │   └── .importlinter.ini  # Seam enforcement config template
│   ├── go/
│   │   ├── go-patterns/       # internal/ package boundaries, interfaces, error wrapping
│   │   └── depguard.yaml      # Golangci-lint boundary checker template
│   ├── rust/
│   │   ├── rust-patterns/     # Cargo workspaces, pub(crate), thiserror/anyhow
│   │   └── cargo-deny.toml    # Crate dependency verification template
│   └── typescript/
│       ├── typescript-patterns/
│       └── dependency-cruiser.config.cjs # Deep module boundary checker template
└── frameworks/                # Framework & domain-specific skills
    ├── frontend-patterns/     # Modern component patterns
    ├── liquid-glass-design/   # Rich visual aesthetics & tokens
    ├── nestjs-patterns/       # NestJS enterprise architecture
    └── prisma-patterns/       # Prisma ORM schema & migration conventions
```

---

## How to Use

1. **Automatic Onboarding**: Run `/setup-workspace`. It inspects your project root and prompts you to activate the matching skills.
2. **Automated Deep Modules**: Run `/setup-deep-modules`. It detects your project language and installs the boundary checker and matching config template.
3. **Manual Activation**: Copy any desired folder into `.agents/skills/engineering/` when needed.
