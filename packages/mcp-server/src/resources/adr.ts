import fs from "node:fs/promises";
import path from "node:path";
import { getAdrDir } from "../workspace/resolver.js";

export async function readAdrResource() {
  const adrDir = getAdrDir();
  let summary = "# Architectural Decision Records (ADRs)\n\n";

  try {
    const files = await fs.readdir(adrDir);
    const adrFiles = files.filter((f) => /^\d{4}-.*\.md$/.test(f)).sort();

    if (adrFiles.length === 0) {
      summary +=
        "No ADRs found in target project. Use `uaw_record_adr` to record decisions.\n";
    } else {
      for (const file of adrFiles) {
        const filePath = path.join(adrDir, file);
        const content = await fs.readFile(filePath, "utf-8");
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : file;
        const statusMatch = content.match(/Status:\s*([A-Z]+)/i);
        const status = statusMatch ? statusMatch[1].toUpperCase() : "ACCEPTED";

        summary += `### [${title}](adr/${file}) (${status})\n`;
        // Grab context and decision briefly
        const decisionMatch = content.match(/## Decision\s+([^#]+)/i);
        if (decisionMatch) {
          summary += `${decisionMatch[1].trim().slice(0, 200)}...\n\n`;
        }
      }
    }
  } catch {
    summary +=
      "Directory `adr/` does not exist yet. Run `uaw_record_adr` to initialize.\n";
  }

  return {
    contents: [
      {
        uri: "uaw://adr",
        mimeType: "text/markdown",
        text: summary,
      },
    ],
  };
}
