import { z } from "zod";

export const codeReviewArgs = {
  diffOrCode: z.string().describe("Git diff or code content to review"),
  specContext: z
    .string()
    .optional()
    .describe(
      "Optional feature spec or requirements to check fidelity against",
    ),
};

export function getCodeReviewPrompt(args: {
  diffOrCode: string;
  specContext?: string;
}) {
  return {
    description:
      "Conduct dual-pass adversarial code review (Pass A: Standards & Security, Pass B: Spec Fidelity)",
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text: `You are executing the **Code Reviewer** agent under Universal Agents Workflow.

## Review Input:
${args.diffOrCode}
${args.specContext ? `\n## Spec Context:\n${args.specContext}\n` : ""}

## Dual-Pass Review Mandate:
- **Pass A: Standards & Security**
  - Security vulnerabilities (OWASP, injection, auth bypass, secret leaks).
  - Clean code, immutable patterns, error handling, function size (< 50 lines).
  - Boundary discipline: are modules deep or leaky?
- **Pass B: Spec & Domain Fidelity**
  - Does this diff strictly fulfill the acceptance criteria?
  - Are there unrequested scope creep or silent assumptions?

Classify findings by severity: \`CRITICAL\` (blocks merge), \`MAJOR\`, \`MINOR\`, \`NIT\`. Zero critical bugs permitted.`,
        },
      },
    ],
  };
}

export const ponytailReviewArgs = {
  diffOrCode: z
    .string()
    .describe("Diff or implementation code to review for over-engineering"),
};

export function getPonytailReviewPrompt(args: { diffOrCode: string }) {
  return {
    description:
      "Hunt over-engineering, bloat, and redundant abstractions using The Ladder",
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text: `You are executing **Ponytail Review** — hunting exclusively for over-engineering and complexity.

## Code Under Review:
${args.diffOrCode}

## The Ladder Checklist:
1. **delete:** Code solving speculative future problems (YAGNI).
2. **stdlib:** Reinventing functions already in the standard library.
3. **native:** Using third-party packages where modern platform features suffice (\`<dialog>\`, \`<input type="date">\`, \`structuredClone\`, \`fetch\`).
4. **shrink:** 200 lines doing what 20 lines could do.

Format each finding on one line:
\`[RUNG] file:line — what to cut — what replaces it\``,
        },
      },
    ],
  };
}
