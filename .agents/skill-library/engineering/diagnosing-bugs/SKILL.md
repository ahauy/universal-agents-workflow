---
invocation: model
name: diagnosing-bugs
description: >
  MANDATORY when diagnosing, debugging, or troubleshooting hard bugs, regressions, flaky tests,
  data anomalies, or performance issues. Enforces a 6-phase gated diagnosis discipline (Feedback Loop ->
  Reproduce/Minimise -> Hypothesise -> Instrument -> Fix/Regression Test -> Cleanup) to prevent
  unfalsifiable theorizing and unverified fixes.
metadata:
  origin: mattpocock/skills (adapted)
---

# Diagnosing Bugs

A disciplined, 6-phase gated methodology for investigating and fixing non-trivial bugs, regressions, and performance bottlenecks.

Skipping phases is prohibited unless explicitly justified.

When exploring the codebase, read relevant architecture documentation, domain models (`docs/domain-models/`), and ADRs (`docs/adr/` or `CONTEXT.md`) before diving into the code.

---

## When to Activate

- Any user report of broken behavior, runtime exceptions, 500 errors, or data inconsistencies.
- Flaky unit, integration, or Playwright E2E test failures.
- Performance regressions, memory leaks, slow database queries, or UI stutter.
- Unexpected state transitions, race conditions, or cache invalidation defects.
- When asked to "diagnose this", "debug this", "why is this failing", or "fix this bug".

---

## Redaction & Credential Hygiene

Debugging commands frequently inspect logs, traces, and payloads. **Redact every secret before outputting**:

- Replace API keys, bearer tokens, passwords, and private keys with `<REDACTED>`.
- Run loops against environment variables (`process.env.SESSION_SECRET`, `.env.test`) rather than hardcoding credentials into scripts.
- When quoting captured HAR traces, network payloads, or database dumps, extract only the specific lines carrying the diagnostic signal.

If redacted outputs obscure essential diagnostic signals, state the problem clearly and request explicit user assistance.

---

## The 6-Phase Gated Loop

```
┌──────────────────────────────────────────────────────────────┐
│  Phase 1: Build a Feedback Loop (Tight, Red-Capable, Fast)   │
└──────────────────────────────┬───────────────────────────────┘
                               │ (Loop goes RED)
┌──────────────────────────────▼───────────────────────────────┐
│  Phase 2: Reproduce + Minimise (Isolate Load-Bearing Parts)  │
└──────────────────────────────┬───────────────────────────────┘
                               │ (Minimal Repro Confirmed)
┌──────────────────────────────▼───────────────────────────────┐
│  Phase 3: Hypothesise (3-5 Ranked Falsifiable Hypotheses)    │
└──────────────────────────────┬───────────────────────────────┘
                               │ (Predictions Formulated)
┌──────────────────────────────▼───────────────────────────────┐
│  Phase 4: Instrument (Tagged [DEBUG-xxxx] Probes & Profiling) │
└──────────────────────────────┬───────────────────────────────┘
                               │ (Hypothesis Confirmed)
┌──────────────────────────────▼───────────────────────────────┐
│  Phase 5: Fix + Regression Test at Correct Seam              │
└──────────────────────────────┬───────────────────────────────┘
                               │ (Regression Green & Verified)
┌──────────────────────────────▼───────────────────────────────┐
│  Phase 6: Cleanup (Remove Tags, Throwaways, Document Fix)    │
└──────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Build a Feedback Loop

**This is the core of the skill.** Everything else is mechanical execution. If you have a **tight** pass/fail signal for the bug (one that turns RED on this specific failure), finding the root cause is straightforward. If you do not have one, theorizing about code leads to false fixes.

Disproportionate effort belongs here. **Be aggressive. Be creative. Refuse to guess.**

### Hierarchy of Feedback Loops

Construct a loop using the lowest (fastest, most isolated) viable seam:

1. **Vitest Unit / Integration Test**: Fast test targeting pure logic, hooks, service methods, or utility calculations.
2. **NestJS HTTP E2E Test (Supertest)**: Fast in-memory HTTP harness running controllers, pipes, interceptors, and guards.
3. **Database Query Trace / Prisma Script**: Standalone script executing Prisma queries against test database with query logging enabled.
4. **Playwright Headless Browser Script**: Automated browser script targeting frontend DOM state, network responses, and console logs.
5. **Replay Captured Trace**: Replaying saved JSON payload, network request, or event stream through the handler in isolation.
6. **Throwaway Minimal Harness**: Dedicated Node/TS script executing the single buggy function path with mocked dependencies.
7. **Property / Fuzz Loop**: Iterating 1,000 randomized inputs to expose edge-case failure boundaries.
8. **Bisection Harness (`git bisect run`)**: Script checking commit history to identify exact regression introduction.
9. **Differential Loop**: Comparing output of old vs new implementation or baseline vs target environment.
10. **HITL Bash Script**: Human-in-the-loop interactive script when manual 2FA, OAuth, or visual inspection is unavoidable. See [HITL-LOOP.md](HITL-LOOP.md) for the interactive human-in-the-loop bash template.

### Stack-Specific Feedback Loop Examples

#### 1. Vitest Unit / Integration Loop (`apps/web` or `apps/api`)

```typescript
// apps/api/src/modules/study/spaced-repetition.spec.ts
import { describe, it, expect } from "vitest";
import { calculateNextReview } from "./spaced-repetition.service";

describe("Spaced Repetition Calculation", () => {
  it("should not schedule next review in the past on grade 0", () => {
    const lastReviewedAt = new Date("2026-08-25T10:00:00Z");
    const result = calculateNextReview({
      repetitions: 3,
      interval: 6,
      easeFactor: 2.5,
      grade: 0,
      now: lastReviewedAt,
    });

    // RED ASSERTION: Exposes interval reset bug
    expect(result.interval).toBe(1);
    expect(result.nextReviewDate.getTime()).toBeGreaterThan(
      lastReviewedAt.getTime(),
    );
  });
});
```

_Run command:_ `pnpm --filter api vitest run src/modules/study/spaced-repetition.spec.ts`

#### 2. NestJS HTTP E2E Loop with Supertest (`apps/api`)

```typescript
// apps/api/test/repro-card-update.e2e-spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";

describe("PATCH /cards/:id (Repro Bug #142)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  it("fails to update card with nested tags without clearing existing tags", async () => {
    const card = await prisma.card.create({
      data: {
        front: "Hello",
        back: "World",
        tags: { create: [{ name: "v1" }] },
      },
    });

    // RED ASSERTION: Verifies PATCH endpoint retains or updates relationships correctly
    const response = await request(app.getHttpServer())
      .patch(`/cards/${card.id}`)
      .send({ tags: ["v2"] })
      .expect(200);

    expect(response.body.tags).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "v2" })]),
    );
  });
});
```

_Run command:_ `pnpm --filter api vitest run test/repro-card-update.e2e-spec.ts`

#### 3. Database Query Trace with Prisma Logging

```typescript
// apps/api/scripts/debug-prisma-query.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: [
    { emit: "event", level: "query" },
    { emit: "stdout", level: "error" },
  ],
});

prisma.$on("query", (e) => {
  console.log(
    `[DEBUG-SQL] Query: ${e.query} | Params: ${e.params} | Duration: ${e.duration}ms`,
  );
});

async function main() {
  const deckId = "test-deck-uuid";
  console.time("query-exec");
  // Reproduce N+1 query or slow transaction
  const result = await prisma.deck.findUnique({
    where: { id: deckId },
    include: { cards: { include: { reviews: true } } },
  });
  console.timeEnd("query-exec");
  console.log("Result count:", result?.cards.length);
}

main().finally(() => prisma.$disconnect());
```

_Run command:_ `pnpm --filter api tsx scripts/debug-prisma-query.ts`

#### 4. Playwright Headless Script (`tests/e2e`)

```typescript
// tests/e2e/repro-session-crash.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Quiz Session State Bug", () => {
  test("does not freeze when rapidly navigating cards", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/study/session");
    await page.locator('[data-testid="start-session-btn"]').click();

    // Trigger rapid state transition
    for (let i = 0; i < 5; i++) {
      await page.locator('[data-testid="show-answer-btn"]').click();
      await page.locator('[data-testid="grade-good-btn"]').click();
    }

    // RED ASSERTION: Console errors and frozen UI
    expect(consoleErrors).toHaveLength(0);
    await expect(page.locator('[data-testid="session-summary"]')).toBeVisible({
      timeout: 3000,
    });
  });
});
```

_Run command:_ `npx playwright test tests/e2e/repro-session-crash.spec.ts --project=chromium`

### Tighten the Loop

Optimize the feedback loop for maximum speed and deterministic fidelity:

- **Speed**: Target execution within < 3 seconds. Skip full server boot if an isolated unit/integration harness suffices.
- **Sharpness**: Assert the exact failure symptom (specific exception, exact payload mismatch, error code), not a generic "did not throw".
- **Determinism**: Seed random number generators, mock clock timers (`vi.useFakeTimers()`), isolate test database transactions, mock flaky external network calls.

### Non-Deterministic & Flaky Bugs

Do not accept intermittent repros. Elevate reproduction probability:

- Stress the loop in a loop harness (`for (let i = 0; i < 100; i++)`).
- Inject concurrency via `Promise.all` to provoke race conditions.
- Constrain network latency or inject jitter.
- Once reproduction rate exceeds 80%, proceed to Phase 2.

### When a Feedback Loop Cannot Be Built

If environment constraints prevent automated loop creation:

1. Stop immediately. Do not jump to hypotheses.
2. Document all attempted harness configurations.
3. Request required prerequisites from the user:
   - Environment access / staging database snapshot.
   - Redacted capture file (HAR, production log snippet, video with timestamps).
   - Approval to deploy temporary tagged diagnostic probes.

### Phase 1 Completion Gate

- [ ] Loop is **red-capable**: Drives the actual bug code path and asserts the user's exact symptom.
- [ ] Loop is **deterministic**: Produces reliable red verdict across consecutive runs.
- [ ] Loop is **fast**: Executes in seconds, enabling rapid iterative debugging.
- [ ] Loop is **agent-runnable**: Single shell command executable without unscripted manual intervention.
- [ ] Command and redacted output shown in the diagnostic log.

---

## Phase 2: Reproduce + Minimise

Run the feedback loop and capture the initial RED state.

### Verification Checklist

- [ ] Symptom matches the user's reported problem (not an unrelated adjacent failure).
- [ ] Error message, stack trace, or anomaly is captured and recorded.
- [ ] Output is reproducible across multiple consecutive runs.

### Minimisation Procedure

Shrink the reproduction scenario to the absolute minimum:

1. Strip away unrelated query parameters, payload attributes, DOM elements, and middleware.
2. Remove dependencies one by one. Re-run the loop after each removal.
3. If removing an element turns the loop GREEN, that element is **load-bearing**. Keep it.
4. If removing an element keeps the loop RED, discard it permanently.

**Phase 2 Completion Gate:**

- [ ] Minimal reproduction achieved: Removing any single remaining parameter causes the failure to vanish.

---

## Phase 3: Hypothesise

Generate **3 to 5 ranked, falsifiable hypotheses** before writing any fix or adding arbitrary probes.

### Falsifiable Hypothesis Structure

Every hypothesis must follow this strict predictive format:

```
Hypothesis N: [Proposed Root Cause]
Prediction: If [Cause] is true, then [Action/Probe X] will result in [Observable Effect Y], while [Action Z] will make the bug disappear/worsen.
Confidence Rank: [1-5]
```

### Checkpoint with the User

Present the ranked hypotheses to the user:

```markdown
### Diagnostic Hypotheses

1. **Hypothesis 1 (Top Candidate)**: Prisma nested write inside `$transaction` fails to rollback on foreign key violation due to unhandled promise rejection.
   - _Prediction_: Wrapping the nested call in try/catch will capture error code `P2003` at line 45.
2. **Hypothesis 2**: React state batching in `useQuizSession` causes stale closure access when rapid clicks fire before re-render.
   - _Prediction_: Functional state update `setCards(prev => ...)` will eliminate duplicate state insertion.
3. **Hypothesis 3**: NestJS `ValidationPipe` strips undefined nested fields due to `whitelist: true` without `@ValidateNested()`.
   - _Prediction_: Adding `@Type(() => TagDto)` decorator will restore missing fields in controller payload.
```

_Note: If the user is offline/unresponsive, proceed testing in rank order without stalling._

**Phase 3 Completion Gate:**

- [ ] 3–5 hypotheses formulated with explicit falsifiable predictions.
- [ ] Hypotheses ranked and presented to the user.

---

## Phase 4: Instrument

Validate hypotheses one at a time using structured, observable instrumentation.

### Instrumentation Rules

1. **Probe Preference**:
   - Level 1: Debugger / breakpoint / REPL inspection.
   - Level 2: Targeted log statements at domain boundaries.
   - Forbidden: Indiscriminate global logging (`console.log(everything)`).
2. **Tagged Logging**: Every temporary log statement MUST contain a unique search tag:
   ```typescript
   console.log("[DEBUG-d92a] cardId:", cardId, "calculatedInterval:", interval);
   ```
3. **Single Variable Isolation**: Modify exactly one variable, argument, or mock at a time. Re-run the Phase 1 loop.
4. **Performance Regression Path**:
   - Never use ad-hoc logs for profiling.
   - Establish baseline metrics using `performance.now()`, Node `--cpu-prof`, or PostgreSQL `EXPLAIN (ANALYZE, BUFFERS)`.
   - Measure first, identify hot path, optimize, measure second.

**Phase 4 Completion Gate:**

- [ ] Exactly one hypothesis confirmed by instrumentation evidence matching its falsifiable prediction.
- [ ] Root cause verified with concrete probe data.

---

## Phase 5: Fix + Regression Test at Correct Seam

Fix the defect and lock down the behavior against future regressions.

### Seam Selection

Select the correct architectural seam for the permanent regression test:

- **Correct Seam**: Exercises the actual multi-component interaction or edge-case boundary where the defect occurred.
- **Shallow / False Seam**: Mocking out the exact component that caused the bug, creating a passing test that cannot catch real regressions.

> **If no clean seam exists**: Document the architectural coupling or missing test boundary as a structural finding. Refactor seams if safe, or elevate to integration/E2E level.

### Execution Steps

1. Convert the minimal repro from Phase 2 into a permanent regression test at the selected seam.
2. Run the regression test: Confirm it is **RED**.
3. Apply the targeted code fix.
4. Run the regression test: Confirm it turns **GREEN**.
5. Run the original un-minimised Phase 1 feedback loop: Confirm it turns **GREEN**.
6. Run the entire module/project test suite: Confirm zero secondary regressions.

**Phase 5 Completion Gate:**

- [ ] Regression test written at the correct seam.
- [ ] Regression test fails before fix and passes after fix.
- [ ] Original un-minimised feedback loop passes.
- [ ] Full test suite passes without collateral breakage.

---

## Phase 6: Cleanup

Before closing the task or submitting code review, execute the mandatory cleanup checklist.

### Cleanup Checklist

- [ ] **Re-verify Original Scenario**: Re-run the Phase 1 feedback loop to ensure complete resolution.
- [ ] **Regression Test Integrated**: Ensure regression test is committed to the proper test directory (`tests/`, `*.spec.ts`, or `*.e2e-spec.ts`).
- [ ] **Remove All Tagged Logs**: Search and remove all temporary probes:
  ```bash
  git grep '\[DEBUG-'
  ```
- [ ] **Delete Throwaway Scripts**: Remove temporary files (e.g. `scripts/debug-*.ts`, `test/repro-*.ts`) or archive them if intended for persistent monitoring.
- [ ] **Document Verified Hypothesis**: State the confirmed root cause and solution clearly in the commit message or PR summary.

---

## Summary Protocol Checklist

| Phase                       | Core Objective                          | Key Deliverable                       | Gate Check                                      |
| --------------------------- | --------------------------------------- | ------------------------------------- | ----------------------------------------------- |
| **1. Feedback Loop**        | Create fast, deterministic test/harness | Single command yielding RED           | Is it fast, deterministic, and red-capable?     |
| **2. Reproduce & Minimise** | Isolate load-bearing failure factors    | Minimal reproducible scenario         | Does removing any element make it green?        |
| **3. Hypothesise**          | Generate 3-5 falsifiable theories       | Ranked list with predictions          | Are predictions concrete and testable?          |
| **4. Instrument**           | Probe boundaries with `[DEBUG-xxxx]`    | Probe evidence matching prediction    | Did one prediction prove true?                  |
| **5. Fix & Test**           | Implement fix at correct seam           | Passing regression test + clean suite | Did regression test fail before and pass after? |
| **6. Cleanup**              | Clean codebase and document findings    | Zero debug logs + clean git diff      | Is `git grep '[DEBUG-'` completely empty?       |
