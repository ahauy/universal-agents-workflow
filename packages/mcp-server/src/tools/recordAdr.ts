import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import {
  getAdrDir,
  fileExists,
  readWorkspaceFile,
} from "../workspace/resolver.js";
import { safeWriteFileWithDiff } from "../workspace/safety.js";

export const recordAdrSchema = {
  title: z
    .string()
    .describe(
      "Descriptive title of the Architectural Decision (e.g., 'Hybrid MCP Architecture')",
    ),
  status: z
    .enum(["PROPOSED", "ACCEPTED", "SUPERSEDED", "DEPRECATED"])
    .default("ACCEPTED")
    .describe("Current status of the ADR"),
  context: z
    .string()
    .describe("Context and problem statement leading to this decision"),
  decision: z.string().describe("The change/decision being committed to"),
  consequences: z
    .string()
    .describe("Consequences (both positive benefits and negative trade-offs)"),
  supersedes: z
    .string()
    .optional()
    .describe(
      "Number or filename of previous ADR superseded by this (e.g., '0001')",
    ),
};

export async function executeRecordAdr(args: {
  title: string;
  status: "PROPOSED" | "ACCEPTED" | "SUPERSEDED" | "DEPRECATED";
  context: string;
  decision: string;
  consequences: string;
  supersedes?: string;
}) {
  const adrDir = getAdrDir();
  await fs.mkdir(adrDir, { recursive: true });

  // Read existing files to calculate next number
  let nextNumber = 1;
  try {
    const files = await fs.readdir(adrDir);
    const adrFiles = files.filter((f) => /^\d{4}-/.test(f));
    if (adrFiles.length > 0) {
      const numbers = adrFiles
        .map((f) => Number.parseInt(f.slice(0, 4), 10))
        .filter((n) => !Number.isNaN(n));
      if (numbers.length > 0) {
        nextNumber = Math.max(...numbers) + 1;
      }
    }
  } catch {
    // Directory newly created
  }

  const paddedNum = String(nextNumber).padStart(4, "0");
  const slug = args.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const filename = `${paddedNum}-${slug}.md`;
  const filePath = path.join(adrDir, filename);

  const dateStr = new Date().toISOString().split("T")[0];

  const adrContent = `# ${paddedNum}. ${args.title}

- **Date:** ${dateStr}
- **Status:** ${args.status}
${args.supersedes ? `- **Supersedes:** [ADR ${args.supersedes}](./${args.supersedes})\n` : ""}
## Context & Problem Statement

${args.context.trim()}

## Decision

${args.decision.trim()}

## Consequences

${args.consequences.trim()}
`;

  const writeResult = await safeWriteFileWithDiff(filePath, adrContent);
  if (!writeResult.success) {
    return {
      content: [
        {
          type: "text" as const,
          text: `❌ Failed to write ADR: ${writeResult.error}`,
        },
      ],
      isError: true,
    };
  }

  // Update adr/README.md index if present
  const readmePath = path.join(adrDir, "README.md");
  let indexUpdated = false;
  if (await fileExists(readmePath)) {
    const readmeContent = await readWorkspaceFile(readmePath);
    if (readmeContent && readmeContent.includes("| Number | Title |")) {
      const tableRow = `| [${paddedNum}](./${filename}) | ${args.title} | ${args.status} | ${dateStr} |`;
      const updatedReadme = readmeContent.trim() + `\n${tableRow}\n`;
      await safeWriteFileWithDiff(readmePath, updatedReadme, {
        createBackup: false,
      });
      indexUpdated = true;
    }
  }

  return {
    content: [
      {
        type: "text" as const,
        text: `✅ Recorded Architectural Decision Record: \`adr/${filename}\`\n\n\`\`\`diff\n${writeResult.diff}\n\`\`\`\n${
          indexUpdated ? "📑 Updated `adr/README.md` index table." : ""
        }`,
      },
    ],
  };
}
