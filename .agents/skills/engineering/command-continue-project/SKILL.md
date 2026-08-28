---
invocation: user
name: command-continue-project
description: >-
  Activated when the user types /command-continue-project (or shortcuts /continue, /next, /auto-continue-project).
  Automatically scans docs/PRODUCT_BACKLOG_ROADMAP.md (schema-version 1.1+), reads YAML frontmatter tech-stack,
  checks Depends-on/Blocks dependency chain, reads Effort + Context-budget for auto-routing,
  integrates grilling to resolve blockers [!] and Stage 2 elicitation,
  and activates the full development pipeline (BA Pipeline -> Speckit -> TDD -> Docs).
triggers:
  - "/command-continue-project"
  - "/continue"
  - "/next"
  - "/auto-continue-project"
  - "continue project"
  - "next roadmap task"
  - "work on next user story"
---

# Command: Continue Project Workflow (/command-continue-project)

This command skill automatically inspects project progress in [PRODUCT_BACKLOG_ROADMAP.md](../../docs/PRODUCT_BACKLOG_ROADMAP.md) and triggers the next development phase in full compliance with [AGENTS.md](../../.agents/AGENTS.md).

**Requires:** `docs/PRODUCT_BACKLOG_ROADMAP.md` following schema-version `1.1` or `1.2`.
If file is missing or not schema-version 1.1+, instruct user to run `/generate-backlog` first.
Template: [PRODUCT_BACKLOG_ROADMAP-template.md](../../.specify/templates/PRODUCT_BACKLOG_ROADMAP-template.md)

---

## Execution Workflow

### Step 0: Pre-flight Git Sync & Environment Refresh

Before starting analysis or code, ensure the working environment is synced with the latest codebase:

1. **Check Branch & Sync with Remote**:
   - Fetch remote main: `git fetch origin main`.
   - If on `main`: Prompt/switch to the designated feature/chore branch (`git checkout -b feat/<slug> origin/main`).
   - If on an active feature branch: Safely rebase onto latest `origin/main` (`git rebase origin/main`).
   - _Working tree protection_: If uncommitted changes exist, run `git stash push -m "pre-sync-stash"`, execute rebase, and restore with `git stash pop`.

2. **Monorepo Ecosystem Drift Check**:
   - If `pnpm-lock.yaml` or `package.json` was updated during sync: Run `pnpm install`.
   - If `prisma/schema.prisma` or `prisma/migrations/` was updated during sync: Run `pnpm --filter api prisma generate`.

### Step 1: Scan Backlog & Roadmap

1. Read `docs/PRODUCT_BACKLOG_ROADMAP.md`.

2. **Extract YAML Frontmatter** (schema-version 1.1+ / 1.2):
   - Read `tech-stack` block (language, backend, frontend, database, infra, test).
   - Store as `$TECH_CONTEXT` — this MUST be injected into the system prompt of every subagent
     dispatched in this session (business-analyst, system-architect, backend-developer, frontend-developer).
   - If YAML frontmatter is missing → STOP. Instruct user: _"File chưa đúng schema v1.1+. Chạy
     `/generate-backlog` để tạo file chuẩn."_

3. **Find the target User Story** — in strict priority order:
   - First: any story with `[/]` (In Progress — resume before starting new work).
   - Then: the first `[ ]` from the top of the active Sprint downward.
   - **Skip `[~]`**: Ignore deferred / future phase items.

4. **🛑 Blocked Story Gate (`[!]`) (MANDATORY)**:
   - If the candidate story is marked `[!]` (Blocked / Review Needed):
     - **STOP IMMEDIATELY**. Do not dispatch autonomous implementation pipeline.
     - Output:
       ```markdown
       ⚠️ **Story đang bị chặn / Cần làm rõ:** `[!] <US-ID> - <Story Title>`
       Story này đã được đánh dấu là đang gặp vướng mắc hoặc cần quyết định kiến trúc trước khi thực thi.
       👉 Hãy làm rõ yêu cầu hoặc gỡ bỏ rào cản trước khi tiếp tục.
       ```
     - **Proactive Unblocking via `grilling`**:
       - Offer or prompt the user immediately:
         _"Bạn có muốn kích hoạt phiên phỏng vấn nhanh (`grilling`) để làm rõ khúc mắc nghiệp vụ / trade-off kiến trúc và gỡ trạng thái [!] ngay không?"_
       - If user confirms: run a focused `grilling` loop (`.agents/skills/productivity/grilling`) (2–3 targeted questions with Context, Options A/B, and Recommended), record the resolution into the story notes or `01-elicitation.md`, update status in `docs/PRODUCT_BACKLOG_ROADMAP.md` from `[!]` to `[/]` or `[ ]`, and proceed with the pipeline.
       - If user declines: wait for user's manual instructions or unblock action.

5. **Dependency Gate (MANDATORY — do NOT skip)**:
   - Read the story's `Depends-on` field.
   - For each dependency listed:
     - Check its checkbox status in the file.
     - If any dependency is NOT `[x]`:
       - If dependency is `[!]`: Output: _"🚫 **Blocked:** `<US-ID>` phụ thuộc vào `<Depends-on>` nhưng story đó đang bị chặn `[!]`."_
       - Else: Output: _"🚫 **Blocked:** `<US-ID>` cannot start until `<Depends-on>` is `[x]`. Recommend working on `<Depends-on>` first."_
       - **REFUSE** to proceed with the current story.
   - If `Depends-on: (none)` or all dependencies are `[x]` → proceed.

6. **Extract story metadata**:
   - US ID (e.g. `US-AUTH-001`), Title, Slug, Priority, Effort, Context-budget, Acceptance Criteria (AC).
   - **Tasks breakdown** (schema 1.2+): Extract `Tasks (Backend)` and `Tasks (Frontend)` checklist if present.

### Step 2: Inspect Current Story Deliverables

1. Check `.specify/features/<slug>/` and `specs/<num>-<slug>/` to determine the current state:
   - Domain Baseline (`baseline.md` - is it `SIGNED-OFF`?)
   - Speckit artifacts (`spec.md`, `plan.md`, `tasks.md`)
   - Test Plan (`test-plan.md`)
   - Source code and test implementation progress.

### Step 3: Route & Execute the Appropriate Phase

**Auto-routing matrix** (read BEFORE dispatching any subagent):

| Effort | Context-budget | BA Depth                                           | wayfinder?                            |
| :----- | :------------- | :------------------------------------------------- | :------------------------------------ |
| S      | single-session | Fast-Track (2–3 questions only, skip gap-analysis) | ❌ No                                 |
| M      | single-session | Bounded Task (stages 1→2→4→5→6→7→8)                | ❌ No                                 |
| L      | single-session | Full Feature (all 8 stages)                        | ❌ No                                 |
| L      | multi-session  | Full Feature (all 8 stages)                        | ✅ Yes — invoke `wayfinder` before BA |
| XL     | multi-session  | Full Feature (all 8 stages)                        | ✅ Yes — invoke `wayfinder` before BA |

> **Tech Context Injection (MANDATORY):** Every `invoke_subagent` call in Steps A–D MUST
> include `$TECH_CONTEXT` from Step 1 in the subagent's system prompt. This eliminates
> tech stack hallucination across all phases.

#### Case A: No Domain Baseline (Net-New Feature)

- **Pre-check wayfinder** (if Effort = L|XL AND Context-budget = multi-session):
  - Dispatch `wayfinder` skill to map decision tickets before any BA work.
  - Only proceed to BA after wayfinder map is confirmed by user.

- **MANDATORY AUTOMATIC SUBAGENT DELEGATION**:
  - The Orchestrator MUST NEVER run BA stages directly on the primary context.
  - **Step 1 (Intake)**: Dispatch `business-analyst` via `invoke_subagent` (`claude-opus-4.6` / `inherit`)
    with `$TECH_CONTEXT` in system prompt. Run `intake-classifier` and create `.specify/features/<slug>/`.
  - Override classification to match roadmap Effort field: `S`→Micro-Task, `M`→Bounded, `L|XL`→Full Feature.

- **🛑 INTERACTIVE ELICITATION INTERVIEW GATE (Stage 2 — MANDATORY CUSTOMER INTERVIEW)**:
  - The AI **MUST PAUSE** before domain modeling, gap analysis, or spec writing.
  - **Delegation to `grilling` Primitive (`.agents/skills/productivity/grilling`) & `elicitation-interview`**:
    - Subagent `business-analyst` conducts the interview following the `grilling` recursive protocol: Frame → Branch → Batch 2–3 questions → Zero silent assumptions.
    - AI MUST present 2–3 targeted clarification questions directly to the user covering business goals, key state machine transitions, business rules/formulas, and edge cases.
    - **Anchor on Roadmap AC**: The Acceptance Criteria (AC) already documented in `PRODUCT_BACKLOG_ROADMAP.md` serve as the interview ANCHOR. Only grill on branches that are underspecified, missing, or high-risk (e.g. error recovery, concurrency, RBAC boundaries). Do not re-ask what is already settled in AC.
    - **Effort-Calibrated Depth**:
      - `Effort: S` (Fast-Track): Max 1 batch (1–2 concise questions) or skip interview if AC is 100% crystal clear.
      - `Effort: M` (Bounded Task): 1 batch (2–3 targeted questions) focused on touched domain pillars.
      - `Effort: L|XL` (Full Feature): Standard multi-batch grilling across 6 domain pillars.
    - **Standard Question Format**:
      ```markdown
      **Question <N>: <Subject>**

      - Context & Why it matters: <impact>
      - Proposed Options:
        - Option A: <details>
        - Option B: <details>
      - Recommended: <recommendation with rationale>
      ```
    - **Strict Zero-Hallucination Policy**: AI is strictly prohibited from inventing business rules or silently making assumptions. Anything ambiguous or unspecified must be asked and confirmed.

- **Step 2 (Domain Modeling & Spec Generation — Stages 3–8)**:
  - Once the user answers the elicitation questions, dispatch `business-analyst` to execute
    Stages 3–8 (`gap-analysis`, `domain-modeling`, `risk-contradiction-scanner`, `spec-writer`,
    `spec-validator`, `handover`) and compile `baseline.md`.

- **🛑 CONFIRMATION GATE 1 — Spec Sign-Off (MANDATORY)**:
  After `business-analyst` completes and `baseline.md` is drafted, the Orchestrator **MUST STOP** and present a structured summary of the Domain Baseline to the user for review. The AI may **not** proceed to Speckit or any implementation work until the user gives explicit approval.

  **Present to user:**
  - A concise summary of: scope, key business rules (`BR-`), user stories drafted, risks identified, and anything marked Won't-Have.
  - Any open questions or assumptions (`ASM-`) that are still unresolved.
  - Concrete proposals for unresolved items, formatted as selectable options where possible.

  **If the user does NOT confirm (asks questions, requests changes, or is unsure):**
  - Do NOT proceed and do NOT guess changes silently.
  - Trigger a focused `grilling` loop (`.agents/skills/productivity/grilling`) to isolate the root objection, explore trade-offs, and present concrete options (Option A vs Option B with rationale).
  - Re-present the updated spec summary and loop back to this gate until the user explicitly says "approve", "confirmed", "let's proceed", or equivalent.

  **Only when the user explicitly approves**: mark `baseline.md` as `SIGNED-OFF v1.0` and advance to Case B.

---

#### Case B: Domain Baseline SIGNED-OFF but Technical Plan Missing

- **MANDATORY AUTOMATIC SUBAGENT DELEGATION**:
  - Dispatch `system-architect` via `invoke_subagent` (`claude-sonnet-4.6` / `inherit`) to run the Speckit Pipeline:
    - Run `speckit-specify` -> create `spec.md`.
    - Run `speckit-plan` -> create `plan.md`, `data-model.md`, `contracts/`.
    - Run `speckit-tasks` -> create `tasks.md`.

- **🛑 CONFIRMATION GATE 2 — Technical Plan & Task Sign-Off (MANDATORY)**:
  After `system-architect` completes, the Orchestrator **MUST STOP** and present the technical plan summary to the user for review. The AI may **not** begin any code writing until the user explicitly approves.

  **Present to user:**
  - A concise summary of: architecture decisions, data model changes, API contracts, implementation phases from `tasks.md`.
  - Any technical risks or trade-offs identified during planning.
  - Proposals for any unresolved design questions.

  **If the user does NOT confirm (asks questions, requests changes, or is unsure):**
  - Do NOT proceed and do NOT make speculative architecture changes.
  - Trigger a technical `grilling` loop (`.agents/skills/productivity/grilling`) to resolve architectural conflicts or trade-offs with the user.
  - Update the plan with the architect subagent, and re-present for approval.
  - Loop back to this gate until the user explicitly approves.

  **Only when the user explicitly approves**: advance to Case C.

---

#### Case C: Technical Plan Complete & Approved, Ready to Implement

- **MANDATORY AUTOMATIC SUBAGENT DELEGATION**:
  - The Orchestrator is **STRICTLY PROHIBITED** from coding directly.
  - Create `test-plan.md` mapping User Stories to `TC-###` test cases.
  - **Task Checklist Delegation** (schema 1.2+):
    - Pass `Tasks (Backend)` checklist directly to `backend-developer` (`gemini-3.7-flash`).
    - Pass `Tasks (Frontend)` checklist directly to `frontend-developer` (`gemini-3.7-flash`).
  - Dispatch `backend-developer` via `invoke_subagent` for Backend API, DTOs, Services, and Unit/Integration tests.
  - Dispatch `frontend-developer` via `invoke_subagent` for UI components, state stores, pages, and tests.
  - Dispatch `slice-implementer` (`gemini-3.7-flash`) to wire fullstack integration.
  - Dispatch `build-resolver` (`gemini-3.7-flash`) to fix any compilation / lint errors.
  - Follow TDD cycle in each slice: Write failing tests (Red) -> Implement minimal passing code (Green) -> Refactor.

#### Case D: Implementation Finished, Final Review & Documentation

- **MANDATORY AUTOMATIC SUBAGENT DELEGATION**:
  - Dispatch `code-reviewer` (`claude-sonnet-4.6` / `inherit`) via `invoke_subagent` for adversarial code quality & security audit.
  - Dispatch `ui-ux-reviewer` (`gemini-3.7-flash`) via `invoke_subagent` for adversarial UI, anti-slop, and WCAG AA review.
  - Dispatch `user-guide-creator` (`gemini-3.7-flash`) via `invoke_subagent` to generate [docs/user-guides/<slug>.md](../../docs/user-guides/) with real Playwright screenshots.
  - Dispatch `tech-doc-architect` (`gemini-3.7-flash`) via `invoke_subagent` to update [docs/features/<slug>/README.md](../../docs/features/).
  - Run full test suites (`pnpm test`).
  - Mark the User Story as `[x]` in `docs/PRODUCT_BACKLOG_ROADMAP.md`.

#### Case E: Production Hardening & Go-Live Sprints (`US-DEPLOY-###`)

- When the target User Story belongs to a Deployment / Go-Live sprint:
  - Bypasses standard BA feature pipeline; routes to DevOps & Hardening Verification:
    1. **Pre-Deploy Security Audit**: Verify zero hardcoded secrets, validate strong JWT secrets, inspect CORS whitelist.
    2. **Database Migration Verification**: Verify schema migrations (`prisma migrate deploy` or equivalent).
    3. **Hosting & SPA Routing Fallback**: Verify production Dockerfile/Nginx or CDN SPA fallback routing.
    4. **Production Smoke Test**: Run automated Playwright smoke tests against target URL.
  - Update Go-Live checklist in `docs/PRODUCT_BACKLOG_ROADMAP.md` and mark story as `[x]`.

---

## Output Format for User

When `/command-continue-project` runs, output a concise status summary:

```markdown
🎯 **Target User Story:** [<US ID> - <Story Title>]
📌 **Epic / Sprint:** [<Epic Name> | Sprint <Number>]
⚡ **Effort / Budget:** [<S|M|L|XL> / <single-session|multi-session>]
🔗 **Dependency Gate:** [✅ Clear | 🚫 Blocked by <US-ID>]
🛠️ **Tech Context:** [<language> + <backend> + <frontend> + <database>]
📊 **Current Stage:** [Not Started / wayfinder / BA Analysis / Technical Planning / TDD Implementation / Quality Review & Docs]
🚀 **Next Immediate Action:** [<Specific step the agent is executing now>]
```
