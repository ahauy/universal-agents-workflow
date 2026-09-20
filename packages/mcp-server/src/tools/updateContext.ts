import { z } from "zod";
import { getContextPath, readWorkspaceFile } from "../workspace/resolver.js";
import { safeWriteFileWithDiff } from "../workspace/safety.js";

export const updateContextSchema = {
  term: z
    .string()
    .describe(
      "The domain term name (e.g., 'Materialization Cascade', 'Hardware Locks')",
    ),
  definition: z.string().describe("Concise one-line definition of the term"),
  before: z
    .string()
    .optional()
    .describe("Verbose phrasing previously used before this term existed"),
  after: z
    .string()
    .optional()
    .describe("Concise shorthand phrasing now established"),
  notes: z
    .string()
    .optional()
    .describe("Notes or link to relevant ADR (e.g., 'adr/0002-...')"),
  deprecatedAlias: z
    .string()
    .optional()
    .describe("If deprecating, specify the new alias term (Soft-immutability)"),
};

const DEFAULT_CONTEXT_TEMPLATE = `# CONTEXT.md — Shared Language (Ubiquitous Language)

> **Purpose:** A single "shared language" for human developers and AI agents. Agents read this file to decode project-specific jargon instead of guessing every time.
> **Role in Framework:** Serves as the "Data Plane" bridging the Control Plane (BA pipeline & governance) with execution.

## Usage Rules

1. **One-line concise definitions** for each term.
2. **Before / After** comparisons to demonstrate value.
3. **Naming consistency:** Variables, functions, components, and files must strictly adhere to terms here.
4. **Soft immutability:** Never delete terms already in use; mark them as \`deprecated → alias\`.

## Glossary

| Term | Short definition | Before (verbose) | After (concise) | Notes |
| :--- | :--- | :--- | :--- | :--- |
`;

export async function executeUpdateContext(args: {
  term: string;
  definition: string;
  before?: string;
  after?: string;
  notes?: string;
  deprecatedAlias?: string;
}) {
  const contextPath = getContextPath();
  let content = await readWorkspaceFile(contextPath);

  if (!content) {
    content = DEFAULT_CONTEXT_TEMPLATE;
  }

  const cleanTerm = args.term.trim();
  const cleanDef = args.definition.trim();
  const cleanBefore = (args.before ?? "-").trim();
  const cleanAfter = (args.after ?? cleanTerm).trim();
  let cleanNotes = (args.notes ?? "-").trim();

  if (args.deprecatedAlias) {
    cleanNotes =
      `DEPRECATED → use \`${args.deprecatedAlias}\` (${cleanNotes !== "-" ? cleanNotes : ""})`.trim();
  }

  const newRow = `| **${cleanTerm}** | ${cleanDef} | "${cleanBefore}" | "${cleanAfter}" | ${cleanNotes} |`;

  // Check if term already exists in table
  const lines = content.split("\n");
  const termRegex = new RegExp(
    `\\|\\s*\\*\\*${escapeRegex(cleanTerm)}\\*\\*\\s*\\|`,
    "i",
  );

  let updated = false;
  const newLines = lines.map((line) => {
    if (termRegex.test(line)) {
      updated = true;
      return newRow;
    }
    return line;
  });

  if (!updated) {
    // Append to table
    const tableHeaderIndex = newLines.findIndex((line) =>
      line.includes("| :--- |"),
    );
    if (tableHeaderIndex !== -1) {
      newLines.splice(tableHeaderIndex + 1, 0, newRow);
    } else {
      newLines.push(newRow);
    }
  }

  const newContent = newLines.join("\n");
  const result = await safeWriteFileWithDiff(contextPath, newContent);

  if (!result.success) {
    return {
      content: [
        {
          type: "text" as const,
          text: `❌ Failed to update CONTEXT.md: ${result.error}`,
        },
      ],
      isError: true,
    };
  }

  const actionText = updated
    ? "Updated existing term inline"
    : "Added new term";
  return {
    content: [
      {
        type: "text" as const,
        text: `✅ ${actionText} in CONTEXT.md: **${cleanTerm}**\n\n\`\`\`diff\n${result.diff}\n\`\`\`\n${
          result.backupPath
            ? `📦 Backup saved to: \`${result.backupPath}\``
            : ""
        }`,
      },
    ],
  };
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
