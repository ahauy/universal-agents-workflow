# HTML Report Format

The architecture review is rendered as a single self-contained HTML file in the operating system temp directory. Tailwind CSS and Mermaid JS both load via CDNs. Mermaid handles graph-shaped and sequence diagrams reliably; hand-crafted Tailwind `div`s and inline SVG handle editorial visuals (mass diagrams, cross-sections, module collapsing).

---

## 1. Complete HTML Scaffold

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Architecture Review — {{repo-name}}</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Mermaid JS ESM CDN -->
    <script type="module">
      import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
      mermaid.initialize({
        startOnLoad: true,
        theme: "neutral",
        securityLevel: "loose",
        flowchart: { useMaxWidth: true, htmlLabels: true, curve: "basis" },
      });
    </script>
    <style>
      /* Custom architectural styling */
      .seam {
        stroke-dasharray: 4 4;
        border-style: dashed;
      }
      .leak {
        stroke: #dc2626;
        border-color: #dc2626;
        color: #dc2626;
      }
      .deep {
        background: linear-gradient(135deg, #0f172a, #1e293b);
      }
      .shallow {
        background: #f8fafc;
        border: 1px dashed #94a3b8;
      }
      pre.mermaid {
        background: transparent !important;
        margin: 0;
        display: flex;
        justify-content: center;
      }
    </style>
  </head>
  <body class="bg-stone-50 text-slate-900 font-sans antialiased min-h-screen">
    <main class="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <!-- HEADER -->
      <header class="border-b border-slate-200 pb-6">
        <div
          class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2"
        >
          <div>
            <h1 class="text-2xl font-bold text-slate-900 tracking-tight">
              Codebase Architecture Review
            </h1>
            <p class="text-sm text-slate-500 font-mono mt-1">
              {{repo-name}} · {{timestamp}}
            </p>
          </div>
          <!-- Visual Legend -->
          <div
            class="flex flex-wrap items-center gap-3 text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200"
          >
            <span class="flex items-center gap-1.5"
              ><span
                class="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-400"
              ></span>
              Module</span
            >
            <span class="flex items-center gap-1.5"
              ><span class="w-3.5 h-3.5 rounded bg-slate-900"></span> Deep
              Module</span
            >
            <span class="flex items-center gap-1.5"
              ><span
                class="w-3.5 border-t-2 border-dashed border-slate-500"
              ></span>
              Seam</span
            >
            <span class="flex items-center gap-1.5"
              ><span class="w-3.5 border-t-2 border-red-600"></span>
              Leakage</span
            >
          </div>
        </div>
      </header>

      <!-- CANDIDATE CARDS -->
      <section id="candidates" class="space-y-10">
        <!-- Candidate articles rendered here -->
      </section>

      <!-- TOP RECOMMENDATION -->
      <section id="top-recommendation" class="pt-6 border-t border-slate-200">
        <!-- Top recommendation card rendered here -->
      </section>
    </main>
  </body>
</html>
```

---

## 2. Recommendation Strength Badges

Use these exact color classes for recommendation badges:

| Strength            | Tailwind Classes                                     | Visual Meaning                                                        |
| :------------------ | :--------------------------------------------------- | :-------------------------------------------------------------------- |
| **Strong**          | `bg-emerald-100 text-emerald-800 border-emerald-300` | High churn area, immediate payoff, high leverage.                     |
| **Worth exploring** | `bg-amber-100 text-amber-800 border-amber-300`       | Definite shallowness, moderate churn or requires interface alignment. |
| **Speculative**     | `bg-slate-100 text-slate-700 border-slate-300`       | Conceptual cleanup, low recent churn, or high migration cost.         |

### Dependency Tag Classes

- `in-process`: `bg-sky-50 text-sky-700 border-sky-200`
- `local-substitutable`: `bg-indigo-50 text-indigo-700 border-indigo-200`
- `ports & adapters`: `bg-purple-50 text-purple-700 border-purple-200`
- `mock`: `bg-rose-50 text-rose-700 border-rose-200`

---

## 3. Candidate Card Structure

Each candidate must be an `<article>` with side-by-side before/after visuals:

```html
<article
  class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
  id="candidate-1"
>
  <!-- Card Header -->
  <div class="p-6 border-b border-slate-100 space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-xl font-bold text-slate-900">
        1. Collapse Quiz Engine Pipeline
      </h2>
      <div class="flex items-center gap-2">
        <span
          class="px-2.5 py-1 text-xs font-semibold rounded-full border bg-emerald-100 text-emerald-800 border-emerald-300"
          >Strong</span
        >
        <span
          class="px-2.5 py-1 text-xs font-medium rounded-full border bg-indigo-50 text-indigo-700 border-indigo-200"
          >in-process</span
        >
      </div>
    </div>
    <div
      class="text-xs font-mono text-slate-600 bg-slate-50 p-2.5 rounded-md border border-slate-200 overflow-x-auto"
    >
      apps/api/src/modules/quiz/quiz.controller.ts · quiz.service.ts ·
      quiz-validator.service.ts · quiz-grading.helper.ts · quiz.repository.ts
    </div>
  </div>

  <!-- Problem & Solution -->
  <div
    class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-50/50 border-b border-slate-100"
  >
    <div class="space-y-1">
      <h3 class="text-xs uppercase font-bold tracking-wider text-slate-500">
        Problem
      </h3>
      <p class="text-sm text-slate-700 leading-relaxed">
        Quiz orchestration is fragmented across 4 shallow services. Controller
        coordinates step-by-step scoring, leaking grading invariants across
        layers.
      </p>
    </div>
    <div class="space-y-1">
      <h3 class="text-xs uppercase font-bold tracking-wider text-slate-500">
        Solution
      </h3>
      <p class="text-sm text-slate-700 leading-relaxed">
        Deepen into a unified
        <code class="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded"
          >QuizEngine</code
        >
        module. Single entry point accepts submissions, internally evaluates
        rules, commits transactions, and returns final evaluated state.
      </p>
    </div>
  </div>

  <!-- Before / After Visual Container -->
  <div class="p-6 space-y-3">
    <h3 class="text-xs uppercase font-bold tracking-wider text-slate-500">
      Architecture Transformation
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- BEFORE -->
      <div
        class="rounded-lg border border-slate-200 bg-white p-4 flex flex-col justify-between"
      >
        <span
          class="text-xs font-bold uppercase tracking-wider text-red-600 mb-2"
          >Before: Shallow & Leaky</span
        >
        <div class="min-h-[260px] flex items-center justify-center">
          <pre class="mermaid">
            flowchart TD
              Ctrl[QuizController] --> V[QuizValidator]
              Ctrl --> Svc[QuizService]
              Svc --> G[GradingHelper]
              Svc -.leak.-> Repo[(QuizRepo)]
              classDef leak stroke:#dc2626,stroke-width:2px,color:#dc2626;
              class Svc,Repo leak
          </pre>
        </div>
      </div>
      <!-- AFTER -->
      <div
        class="rounded-lg border border-slate-200 bg-white p-4 flex flex-col justify-between"
      >
        <span
          class="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2"
          >After: Deep & Encapsulated</span
        >
        <div class="min-h-[260px] flex items-center justify-center">
          <pre class="mermaid">
            flowchart TD
              Ctrl[QuizController] --> Engine[QuizEngine Module]
              subgraph Engine["QuizEngine (Deep Module)"]
                V[Validator]
                G[Grading Invariants]
                R[(Internal Storage)]
              end
              classDef deep fill:#0f172a,stroke:#334155,color:#ffffff;
              class Engine deep
          </pre>
        </div>
      </div>
    </div>
  </div>

  <!-- Wins & ADR Callouts -->
  <div class="p-6 pt-0 space-y-4">
    <div class="space-y-2">
      <h3 class="text-xs uppercase font-bold tracking-wider text-slate-500">
        Architectural Wins
      </h3>
      <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
        <li class="flex items-center gap-2">
          <span class="text-emerald-500 font-bold">✓</span>
          <span
            ><strong>Locality:</strong> Grading rules and state transitions
            co-located</span
          >
        </li>
        <li class="flex items-center gap-2">
          <span class="text-emerald-500 font-bold">✓</span>
          <span
            ><strong>Leverage:</strong> 1 simple interface replaces 4
            inter-dependent services</span
          >
        </li>
        <li class="flex items-center gap-2">
          <span class="text-emerald-500 font-bold">✓</span>
          <span
            ><strong>Test Surface:</strong> Tests hit the engine seam without
            fragile unit mocks</span
          >
        </li>
        <li class="flex items-center gap-2">
          <span class="text-emerald-500 font-bold">✓</span>
          <span
            ><strong>AI Navigation:</strong> Single file boundary for all quiz
            execution rules</span
          >
        </li>
      </ul>
    </div>

    <!-- ADR Note (if applicable) -->
    <div
      class="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2"
    >
      <span class="font-bold">⚠️ ADR Note:</span>
      <span
        >Revises ADR-0004 (separate validator micro-services) because validation
        and scoring share identical invariant models.</span
      >
    </div>
  </div>
</article>
```

---

## 4. Diagram Patterns

### Pattern A: Mermaid Flowchart with Leaky Edges

Best for dependency graphs and cross-module entanglement:

```html
<pre class="mermaid">
  flowchart LR
    A[OrderController] --> B[OrderService]
    B --> C[PricingCalculator]
    B -.leak.-> D[(PrismaClient)]
    C -.leak.-> D
    classDef leak stroke:#dc2626,stroke-width:2px,stroke-dasharray: 4 4,color:#dc2626;
    class B,C,D leak
</pre>
```

### Pattern B: Mermaid Sequence Diagram

Best for highlighting excessive inter-module chatty round-trips:

```html
<pre class="mermaid">
  sequenceDiagram
    autonumber
    Client->>Controller: submit(payload)
    Controller->>Validator: validate(payload)
    Controller->>Service: process(payload)
    Service->>Helper: score(items)
    Service->>Repo: save(record)
    Repo-->>Controller: result
</pre>
```

### Pattern C: Hand-Crafted CSS Cross-Section (Layer Collapse)

Best for demonstrating removal of redundant passthrough layers:

```html
<!-- BEFORE: 4 Thin Layers -->
<div class="space-y-1.5 w-full">
  <div
    class="h-9 rounded bg-slate-100 border border-slate-300 text-xs flex items-center justify-center font-mono text-slate-600"
  >
    Controller (Passthrough)
  </div>
  <div
    class="h-9 rounded bg-slate-100 border border-slate-300 text-xs flex items-center justify-center font-mono text-slate-600"
  >
    FacadeService (Delegates 1:1)
  </div>
  <div
    class="h-9 rounded bg-slate-100 border border-slate-300 text-xs flex items-center justify-center font-mono text-slate-600"
  >
    DomainService (Shallow Wrapper)
  </div>
  <div
    class="h-9 rounded bg-slate-100 border border-slate-300 text-xs flex items-center justify-center font-mono text-slate-600"
  >
    PrismaRepository (1:1 CRUD)
  </div>
</div>

<!-- AFTER: 1 Deep Module -->
<div
  class="w-full h-[156px] rounded-lg deep text-white p-4 flex flex-col justify-between"
>
  <div class="text-xs font-mono text-emerald-400 font-bold uppercase">
    Interface: submit(payload)
  </div>
  <div class="text-xs text-slate-300">
    Encapsulates: Validation · State Machine · Data Access · Domain Invariants
  </div>
  <div class="text-[11px] font-mono text-slate-400">
    Zero intermediate mocks required in tests
  </div>
</div>
```

### Pattern D: Mass Diagram (Interface vs Implementation Ratio)

Best for showing that an interface was as wide as its code:

```html
<div class="flex items-end gap-3 h-44 w-full p-2 justify-center">
  <!-- Shallow Module -->
  <div class="flex flex-col items-center gap-1">
    <div
      class="w-16 h-20 bg-rose-200 border border-rose-400 rounded flex items-center justify-center text-[10px] text-center font-bold text-rose-900"
    >
      Wide Interface (12 methods)
    </div>
    <div
      class="w-16 h-12 bg-slate-200 border border-slate-400 rounded flex items-center justify-center text-[10px] text-center text-slate-700"
    >
      Small Impl (40 lines)
    </div>
    <span class="text-xs font-bold text-slate-500 mt-1">Shallow</span>
  </div>

  <div class="text-xl font-bold text-slate-400 pb-12">→</div>

  <!-- Deep Module -->
  <div class="flex flex-col items-center gap-1">
    <div
      class="w-20 h-8 bg-emerald-200 border border-emerald-400 rounded flex items-center justify-center text-[10px] text-center font-bold text-emerald-900"
    >
      Narrow Interface (2 methods)
    </div>
    <div
      class="w-20 h-32 deep text-white rounded flex items-center justify-center text-[10px] text-center p-1"
    >
      Deep Implementation (400 lines internal logic)
    </div>
    <span class="text-xs font-bold text-emerald-600 mt-1">Deep</span>
  </div>
</div>
```

---

## 5. Top Recommendation Section Structure

```html
<section
  id="top-recommendation"
  class="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-8 space-y-4"
>
  <div
    class="flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-400 font-bold"
  >
    <span>★</span> Top Priority Recommendation
  </div>
  <h2 class="text-2xl font-bold tracking-tight">
    Candidate 1: Collapse Quiz Engine Pipeline
  </h2>
  <p class="text-slate-300 text-sm leading-relaxed max-w-3xl">
    Quiz execution is the highest-churn subsystem in the repository.
    Consolidating the 4 fragmented services into a single deep
    <code class="text-emerald-300 font-mono text-xs">QuizEngine</code>
    eliminates 18 fragile unit mock tests, centralizes domain grading
    invariants, and gives both human and AI developers a single seam for feature
    additions.
  </p>
  <div>
    <a
      href="#candidate-1"
      class="inline-flex items-center gap-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-lg transition-colors"
    >
      View Candidate Details & Diagrams ↑
    </a>
  </div>
</section>
```

---

## 6. Style & Tone Enforcement

- **Strict Terminology**: Always write _module_, _interface_, _implementation_, _seam_, _depth_, _adapter_, _leverage_, and _locality_. Never substitute with vague synonyms like _layer_, _service_, _component_, _boundary_, or _clean code_.
- **Concision**: Maximum 1–2 sentences for Problem and Solution. Bullet points for Wins must be ≤ 8 words each.
- **Visual Balance**: Maintain before/after diagrams at roughly ~260–320px height for clean side-by-side desktop rendering.
- **Zero Local Artifacts in Git**: Always output the file to the OS temp directory and launch via the OS default viewer.
