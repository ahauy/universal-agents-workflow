import { z } from "zod";

export const grillingPromptArgs = {
  topic: z
    .string()
    .describe("The feature, architecture decision, or user request to grill"),
  context: z
    .string()
    .optional()
    .describe("Optional background context or constraints"),
};

export function getGrillingPrompt(args: { topic: string; context?: string }) {
  return {
    description:
      "Conduct an interactive domain interview without silent assumptions",
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text: `You are executing the Universal Agents Workflow **Grilling** protocol for the following topic:

## Topic: ${args.topic}
${args.context ? `## Context:\n${args.context}\n` : ""}

## Grilling Protocol Rules:
1. **Frame:** Restate the request in one sentence so the user can correct you early.
2. **Branch:** Map the decision space: what sub-questions MUST be answered before code or spec can be produced?
3. **Ask in batches of 2–3 questions:** Cover one domain pillar at a time:
   - Business value & pain
   - Roles / RBAC
   - States & transitions
   - Rules & formulas
   - Workflows & edge cases
   - Data, privacy, observability
   - UX & NFRs
4. **Strict Zero-Silent-Assumption:** If an answer is missing or ambiguous, ask. Never invent default parameters or business rules. Record any necessary working hypotheses as explicit \`ASM-\` IDs.
5. **Close the Loop:** When branches are resolved, produce a compact Decision Summary for user sign-off.

Begin now by framing the topic and asking Batch 1 of grilling questions.`,
        },
      },
    ],
  };
}
