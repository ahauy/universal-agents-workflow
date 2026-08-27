# CLAUDE.md

This project adheres strictly to the **Universal Agent Development Workflow**.
All architectural guidelines, multi-agent lifecycle protocols, behavioral constraints, and coding standards are defined in:

👉 **[AGENTS.md](./AGENTS.md)**

## Immediate Directives for Claude:

1. **Zero Direct Feature Coding**: Strictly follow the 7-phase pipeline in [AGENTS.md](./AGENTS.md). Decompose tasks and conduct TDD (test-plan -> red -> green -> refactor).
2. **Language Specialization**: Use specialized subagents in `.agents/agents/` (e.g. `swift-reviewer`, `swift-build-resolver`, `go-reviewer`, etc.) for language-specific files.
3. **Anti-AI-Slop**: Reject unrequested neon gradients, heavy glassmorphism, or unstable animations.
4. **Git Discipline**: Zero autonomous git commits/pushes. Only run when user explicitly runs `/command-git-push`.
