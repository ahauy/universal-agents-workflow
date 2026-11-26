# CLAUDE.md

This project adheres strictly to the **Universal Agent Development Workflow**.
All architectural guidelines, multi-agent lifecycle protocols, behavioral constraints, and coding standards are defined in:

👉 **[AGENTS.md](./AGENTS.md)**

## Immediate Directives for Claude:

1. **BA checkpoint and lane**: Follow [AGENTS.md](./AGENTS.md) §§0–2: confirm outcome, behavior, scope, evidence, material unknowns and acceptance before implementation; Fast stays in one context, Full follows signed-off gates.
2. **Context discipline**: read on demand, never preload skills. Write a `context-pack.md` before delegating. Step detail lives in `.agents/docs/pipeline-detail.md` — read only the step you are on.
3. **Language Specialization**: In the Full lane, use specialized subagents in `.agents/agents/` (e.g. `swift-reviewer`, `swift-build-resolver`, `go-reviewer`, etc.) for language-specific files.
4. **Anti-AI-Slop**: Reject unrequested neon gradients, heavy glassmorphism, or unstable animations.
5. **Git Discipline**: Zero autonomous git commits/pushes. Only run when user explicitly runs `/command-git-push`.
