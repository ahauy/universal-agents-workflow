import { z } from "zod";

export const speckitSpecifyArgs = {
  slug: z.string().describe("Feature slug identifier"),
  baseline: z
    .string()
    .describe("Approved domain baseline content from Phase 1"),
};

export function getSpeckitSpecifyPrompt(args: {
  slug: string;
  baseline: string;
}) {
  return {
    description:
      "Generate official IEEE 29148 specification in .specify/features/<slug>/spec.md",
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text: `You are executing **Speckit Specify** for feature: \`${args.slug}\`.

## Approved Domain Baseline:
${args.baseline}

## Requirements for spec.md:
1. Every requirement must have a numbered ID: \`REQ-${args.slug.toUpperCase()}-###\`.
2. Traceability: Every requirement must state **Derived from: [Domain Pillar / Rule / Pain point]**.
3. User Stories: Numbered \`US-${args.slug.toUpperCase()}-###\` with Given-When-Then acceptance criteria.
4. Edge cases & Failure Modes: Unhappy path scenarios must be explicit.
5. Strict anti-ambiguity: Zero vague adjectives (fast, easy, robust). Use measurable boundaries.

Output the complete, validated \`spec.md\` content.`,
        },
      },
    ],
  };
}

export const speckitPlanArgs = {
  slug: z.string().describe("Feature slug identifier"),
  spec: z.string().describe("Approved specification content"),
};

export function getSpeckitPlanPrompt(args: { slug: string; spec: string }) {
  return {
    description:
      "Generate architecture plan in .specify/features/<slug>/plan.md",
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text: `You are executing **Speckit Plan** for feature: \`${args.slug}\`.

## Approved Specification:
${args.spec}

## Deep Module Design & Architecture Rules:
1. Apply Ousterhout Deep Modules: Deep interfaces that hide high internal complexity behind minimal API surfaces.
2. Avoid shallow wrappers and anemic pass-through layers.
3. Seam discipline: Map independent testable boundaries (Data -> Logic -> API -> UI).
4. Polyglot & language idiomatic conventions.

Produce the technical \`plan.md\` and DTO contracts.`,
        },
      },
    ],
  };
}
