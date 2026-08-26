# CONTEXT.md — Shared Language (Ubiquitous Language)

> **Purpose:** A single "shared language" for human developers and AI agents. Agents read this file to decode project-specific jargon instead of guessing every time. This implements the Ubiquitous Language pattern (Eric Evans, _Domain-Driven Design_) — origin: `mattpocock/skills`.
>
> **Role in Framework:** `CONTEXT.md` serves as the "Data Plane" bridging the Control Plane (BA pipeline & governance) with execution. Whenever `domain-modeling` or an elicitation interview introduces or refines a domain concept, it must **update inline** this file. Nobody reinvents terminology across sessions.

## Usage Rules

1. **One-line concise definitions** for each term — do not replicate extensive documentation.
2. **Before / After** comparisons to demonstrate value: verbose phrase (Before) → concise shorthand (After).
3. **Naming consistency:** variables, functions, components, and files must strictly adhere to the terms established here.
4. **Update inline:** whenever a decision or definition surfaces during elicitation or domain modeling, add or update the entry immediately (link to the relevant ADR if it is an architectural decision).
5. **Soft immutability:** never delete terms already in use across the codebase; mark them as `deprecated → alias`.

## Glossary (Populate in Target Project)

> In this master template, the table below serves as a **placeholder**. Each target project should maintain its own real glossary here.

| Term     | Short definition | Before (verbose)          | After (concise)   | Notes                    |
| -------- | ---------------- | ------------------------- | ----------------- | ------------------------ |
| _<term>_ | _one-liner_      | "…how we used to say it…" | "_new shorthand_" | _link ADR if applicable_ |

### Examples (Illustrative, from mattpocock/skills)

| Before                                                                                                               | After                                                    |
| -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| "There's a problem when a lesson inside a section of a course is made 'real' (i.e. given a spot in the file system)" | "There's a problem with the **materialization cascade**" |

## Where to Look

- **Scan codebase** to identify existing implicit terms or jargon not yet cataloged here → add them to the table.
- **`adr/`** for load-bearing architectural decisions that require extensive rationale (link from the glossary where applicable).
- **`.specify/features/<slug>/`** for full business rules and finite state machines (this file is an index of ubiquitous language, not a substitute for formal SRS documents).
