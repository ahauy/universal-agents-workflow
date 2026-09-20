import path from "node:path";
import { z } from "zod";
import { getSpecifyDir } from "../workspace/resolver.js";
import { safeWriteFileWithDiff } from "../workspace/safety.js";

export const scaffoldFeatureSchema = {
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens")
    .describe("Feature slug identifier (e.g., 'export-csv-reports')"),
  title: z.string().describe("Human-readable feature title"),
  description: z.string().describe("Brief description of the problem/feature"),
  complexity: z
    .enum(["micro-task", "spike", "bounded", "epic"])
    .default("bounded")
    .describe("Complexity level decided by intake classification"),
};

export async function executeScaffoldFeature(args: {
  slug: string;
  title: string;
  description: string;
  complexity: "micro-task" | "spike" | "bounded" | "epic";
}) {
  const specifyDir = getSpecifyDir();
  const featureDir = path.join(specifyDir, "features", args.slug);
  const dateStr = new Date().toISOString().split("T")[0];

  const filesToCreate: Record<string, string> = {
    "01-elicitation.md": `# 01 — Domain Elicitation: ${args.title}

- **Feature Slug:** \`${args.slug}\`
- **Complexity:** \`${args.complexity}\`
- **Date:** ${dateStr}

## Problem & Business Value

${args.description.trim()}

## 6 Domain Pillars

### 1. RBAC & Personas
- Who can perform this feature?

### 2. State Machine & Lifecycle
- Initial state -> Terminal states.

### 3. Business Rules & Formulas
- Explicit mathematical or logical boundaries.

### 4. Workflows & Edge Cases
- Happy path and unhappy paths.

### 5. Data, Privacy & Observability
- What telemetry/audit trails are mandatory?

### 6. UX & Non-Functional Requirements
- Latency, responsiveness, accessibility constraints.

## Confirmed Assumptions (ASM-)
- [ ] No unconfirmed assumptions.
`,

    "baseline.md": `# Domain Baseline: ${args.title}

- **Status:** DRAFT (Sign-off pending)
- **Version:** v0.1.0
- **Exit Gate:** Stage 8 Handover

> **Notice:** Code implementation strictly forbidden before baseline sign-off.
`,

    "spec.md": `# Technical Specification: ${args.title}

- **Feature:** \`${args.slug}\`
- **Status:** DRAFT

## Requirements Traceability

- REQ-${args.slug.toUpperCase()}-001: [Requirement description]
`,

    "plan.md": `# Implementation Architecture Plan: ${args.title}

## Technical Architecture & Deep Module Design

- Minimal public interface.
- Seams and isolated boundaries.
`,

    "tasks.md": `# Task Breakdown: ${args.title}

- [ ] Task 1: Create failing test cases (Red)
- [ ] Task 2: Implement minimum passing code (Green)
- [ ] Task 3: Refactor and clean up
`,

    "CHANGELOG.md": `# Changelog: ${args.title}

All notable scope changes post-signoff are recorded here.

## [Unreleased]
- Initial scaffolding generated via \`uaw_scaffold_feature\`.
`,
  };

  const createdFiles: string[] = [];
  for (const [relPath, content] of Object.entries(filesToCreate)) {
    const fullPath = path.join(featureDir, relPath);
    const res = await safeWriteFileWithDiff(fullPath, content);
    if (res.success) {
      createdFiles.push(relPath);
    }
  }

  return {
    content: [
      {
        type: "text" as const,
        text:
          `✅ Scaffolding complete for feature \`${args.slug}\` (${args.complexity})!\n\n📁 Thư mục: \`.specify/features/${args.slug}/\`\n` +
          createdFiles
            .map((f) => `- \`.specify/features/${args.slug}/${f}\``)
            .join("\n"),
      },
    ],
  };
}
