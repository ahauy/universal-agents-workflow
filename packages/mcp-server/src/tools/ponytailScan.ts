import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import { z } from "zod";
import { resolvePath } from "../workspace/resolver.js";

export const ponytailScanSchema = {
  targetPath: z
    .string()
    .default(".")
    .describe(
      "File or directory relative to workspace root to scan for over-engineering",
    ),
};

interface Finding {
  file: string;
  line: number;
  rung: "delete" | "stdlib" | "native" | "yagni";
  issue: string;
  replacement: string;
}

export async function executePonytailScan(args: { targetPath?: string }) {
  const root = resolvePath(args.targetPath ?? ".");
  let files: string[] = [];

  try {
    const stat = await fs.stat(root);
    if (stat.isDirectory()) {
      files = await fg(["**/*.{js,ts,jsx,tsx,py,go,rs}"], {
        cwd: root,
        absolute: true,
        ignore: [
          "**/node_modules/**",
          "**/dist/**",
          "**/.git/**",
          "**/build/**",
        ],
      });
    } else {
      files = [root];
    }
  } catch (err) {
    return {
      content: [
        { type: "text" as const, text: `❌ Cannot scan path: ${String(err)}` },
      ],
      isError: true,
    };
  }

  const findings: Finding[] = [];

  for (const file of files) {
    try {
      const content = await fs.readFile(file, "utf-8");
      const lines = content.split("\n");
      const relFile = path.relative(resolvePath("."), file);

      lines.forEach((line, index) => {
        const lineNum = index + 1;

        // Check Lodash / Underscore imports
        if (
          /from\s+['"](lodash|underscore)['"]|require\(['"](lodash|underscore)['"]\)/.test(
            line,
          )
        ) {
          findings.push({
            file: relFile,
            line: lineNum,
            rung: "stdlib",
            issue: "Importing entire utility library (lodash/underscore).",
            replacement:
              "Use native JS array/object methods (Array.prototype.flat, structuredClone, Object.assign, etc.).",
          });
        }

        // Check Moment.js
        if (/from\s+['"]moment['"]|require\(['"]moment['"]\)/.test(line)) {
          findings.push({
            file: relFile,
            line: lineNum,
            rung: "native",
            issue: "Using heavy legacy date library (moment).",
            replacement:
              "Use native Intl.DateTimeFormat or lightweight Temporal / date-fns.",
          });
        }

        // Check axios for simple Node 18+ apps
        if (/from\s+['"]axios['"]|require\(['"]axios['"]\)/.test(line)) {
          findings.push({
            file: relFile,
            line: lineNum,
            rung: "native",
            issue: "Importing third-party HTTP client (axios).",
            replacement:
              "Use native global fetch() available in Node 18+ and all modern runtimes.",
          });
        }

        // Check deep-clone packages
        if (
          /from\s+['"](clone-deep|deep-clone|lodash\.clonedeep)['"]/.test(line)
        ) {
          findings.push({
            file: relFile,
            line: lineNum,
            rung: "native",
            issue: "Using external package for deep clone.",
            replacement:
              "Use native structuredClone() built into the platform.",
          });
        }
      });
    } catch {
      // Skip unreadable files
    }
  }

  if (findings.length === 0) {
    return {
      content: [
        {
          type: "text" as const,
          text: `🎉 **Ponytail Audit Clean!** No common over-engineering anti-patterns found in \`${args.targetPath ?? "."}\`.\nCode conforms to The Ladder simplicity principles.`,
        },
      ],
    };
  }

  const grouped = findings
    .map(
      (f) =>
        `- **[${f.rung.toUpperCase()}]** \`${f.file}:${f.line}\`: ${f.issue}\n  👉 *Thay thế:* ${f.replacement}`,
    )
    .join("\n");

  return {
    content: [
      {
        type: "text" as const,
        text:
          `### ✂️ Ponytail Over-Engineering Findings (${findings.length})\n\n` +
          `${grouped}\n\n` +
          `> Áp dụng quy tắc **The Ladder**: Ưu tiên Stdlib > Native Platform > One-liner trước khi thêm thư viện bên thứ ba.`,
      },
    ],
  };
}
