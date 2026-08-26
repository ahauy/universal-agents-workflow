# Design It Twice

When exploring alternative interfaces for a chosen deepening candidate, use this parallel sub-agent pattern. Based on "Design It Twice" (John Ousterhout, _A Philosophy of Software Design_): your first idea is rarely your best idea.

Assumes the vocabulary in [SKILL.md](SKILL.md): **module**, **interface**, **seam**, **adapter**, **leverage**, **locality**.

## Process

### 1. Frame the problem space

Before exploring or spawning sub-agents, formulate a clear problem-space summary:

- **Constraints**: What invariants, performance requirements, security rules, and caller expectations must any new interface satisfy?
- **Dependencies**: Which dependencies does this module touch, and which category from [DEEPENING.md](DEEPENING.md) do they belong to (In-process, Local-substitutable, Remote owned, True external)?
- **Illustrative code sketch**: A rough snippet to make the current friction or requirements concrete (not a proposed solution, just grounding the problem).

_Example Problem Frame_:

```typescript
// Current friction: Callers must orchestrate 4 separate services to start a study session
// Goal: Consolidate into a single deep StudySessionModule handling queue retrieval,
// deck permission check, streak validation, and session token generation.
```

Present this frame to the user, then immediately proceed to Step 2.

### 2. Spawn sub-agents

Spawn 3+ sub-agents in parallel to design alternative interfaces. Each sub-agent must produce a **radically different** interface archetype for the deepened module.

Prompt each sub-agent with a dedicated technical brief (relevant file paths, domain context, dependency categories from [DEEPENING.md](DEEPENING.md), and what should be encapsulated behind the seam). Give each agent a distinct design archetype:

- **Agent 1 (Minimalist)**:
  > "Minimize the interface: aim for 1–2 entry points maximum. Maximise leverage per entry point. Hide all internal workflow details behind single-action methods."
- **Agent 2 (Flexible & Extensible)**:
  > "Maximise flexibility: support varied caller scenarios, configuration options, custom strategies/hooks, and progressive disclosure of advanced parameters."
- **Agent 3 (Common-case Optimized)**:
  > "Optimise for the 90% common case: make the default call a zero-config one-liner with smart defaults, while allowing optional configuration overrides for edge cases."
- **Agent 4 (Ports & Adapters / Modular)** _(if cross-boundary dependencies exist)_:
  > "Design around explicit ports & adapters: decouple core domain logic completely from database (Prisma), queues (BullMQ), or third-party APIs (Stripe/LLMs) via clean swappable ports."

#### Required Output for Each Sub-Agent

Each sub-agent must return:

1. **Interface Contract**: TypeScript types, classes, or function signatures, including parameter contracts, return types, invariants, ordering constraints, and error modes.
2. **Caller Usage Example**: Concrete snippet showing how callers (e.g. a NestJS controller or React component) consume the interface.
3. **What Sits Behind the Seam**: Full list of responsibilities, database transactions, validations, and state machines hidden inside the implementation.
4. **Dependency & Test Strategy**: Which dependency category applies and how tests exercise the module across the seam (e.g. testcontainers, in-memory adapter fake, pure unit test).
5. **Trade-offs**: Where leverage is high vs where interface complexity might leak.

### 3. Present and compare

Present the resulting designs sequentially so they can be reviewed clearly. Then, contrast them across three foundational axes:

| Evaluation Axis    | Key Question                                                          | High Score Indicator                                                                            |
| :----------------- | :-------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------- |
| **Depth**          | How much behaviour does the caller get per unit of interface learned? | Caller writes 1 line of code; module handles transaction, validation, events, and persistence.  |
| **Locality**       | Where does change concentrate when business rules change?             | Business rule changes require editing only the module implementation; 0 changes across callers. |
| **Seam Placement** | Is the seam at a natural boundary with justified adapters?            | Clean seam with ≥2 concrete adapters (prod + test fake), no single-adapter indirection.         |

#### Provide an Opinionated Recommendation

Conclude with a clear recommendation:

- State decisively which interface design is superior and why.
- If elements from multiple designs create a stronger interface (e.g. Minimalist entry point + Common-case default config with internal Ports), propose the **Hybrid Design**.
- Guide the user with a strong architectural opinion rather than leaving them with an ambiguous list.
