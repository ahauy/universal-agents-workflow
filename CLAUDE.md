# CLAUDE.md

This project adheres strictly to the **Universal Agent Development Workflow**.
All architectural guidelines, multi-agent lifecycle protocols, behavioral constraints, and coding standards are defined in:

👉 **[AGENTS.md](./AGENTS.md)**

## Immediate Directives for Claude:

1. **Zero Direct Feature Coding**: Follow the 7-step pipeline in [AGENTS.md](./AGENTS.md) §1 and the 6 non-negotiables in §0. Decompose tasks and conduct TDD (test-plan -> red -> green -> refactor).
2. **Context discipline**: read on demand, never preload skills. Write a `context-pack.md` before delegating. Step detail lives in `.agents/docs/pipeline-detail.md` — read only the step you are on.
3. **Language Specialization**: Use specialized subagents in `.agents/agents/` (e.g. `swift-reviewer`, `swift-build-resolver`, `go-reviewer`, etc.) for language-specific files.
4. **Anti-AI-Slop**: Reject unrequested neon gradients, heavy glassmorphism, or unstable animations.
5. **Git Discipline**: Zero autonomous git commits/pushes. Only run when user explicitly runs `/command-git-push`.
