import { z } from "zod";

export const intakeClassifierArgs = {
  request: z.string().describe("The user's initial task or feature request"),
};

export function getIntakeClassifierPrompt(args: { request: string }) {
  return {
    description:
      "Classify feature request into Micro-Task, Spike, Bounded, or Epic",
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text: `You are executing the **Intake Classifier** stage of Universal Agents Workflow.

## User Request:
${args.request}

## Classification Rules:
- **Micro-Task / Fast-Fix:** Surgical change (< 30 lines, bug fix, typo, single config tweak). Bypasses BA ceremony. Path: Reproduce -> Failing Test -> Surgical Fix -> Verification -> Single-line Conventional Commit.
- **Spike:** Research note only. Timeboxed investigation. No feature folder.
- **Bounded Task:** 1–3 files, clear scope, low architectural risk. Stages 1 -> 2 (interactive 2-3 questions) -> 4 (light) -> 5 -> 6 -> 7 -> 8.
- **Full Feature / Epic:** Multi-component, schema migration, or new domain entity. Full 8-stage BA pipeline with mandatory elicitation interview.

Output your classification scorecard with clear rationale, name the suggested feature slug, and specify the next action.`,
        },
      },
    ],
  };
}
