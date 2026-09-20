import path from "node:path";
import { z } from "zod";
import { getSpecifyDir, readWorkspaceFile } from "../workspace/resolver.js";

export const validateSpecSchema = {
  slug: z
    .string()
    .describe("The feature slug to validate in .specify/features/<slug>/"),
};

export interface QualityCheck {
  id: string;
  name: string;
  passed: boolean;
  message: string;
}

export async function executeValidateSpec(args: { slug: string }) {
  const specifyDir = getSpecifyDir();
  const specPath = path.join(specifyDir, "features", args.slug, "spec.md");
  const elicitationPath = path.join(
    specifyDir,
    "features",
    args.slug,
    "01-elicitation.md",
  );

  const specContent = await readWorkspaceFile(specPath);
  if (!specContent) {
    return {
      content: [
        {
          type: "text" as const,
          text: `❌ Error: Spec file not found at \`.specify/features/${args.slug}/spec.md\`. Run \`uaw_scaffold_feature\` first.`,
        },
      ],
      isError: true,
    };
  }

  const elicitationContent = (await readWorkspaceFile(elicitationPath)) ?? "";

  const checks: QualityCheck[] = [];

  // Check 1: Requirement IDs (REQ-<SLUG>-###)
  const reqRegex = new RegExp(
    `REQ-${args.slug.replace(/-/g, "").toUpperCase()}-\\d{3}|REQ-${args.slug.toUpperCase()}-\\d{3}`,
    "i",
  );
  const hasReqIds = reqRegex.test(specContent);
  checks.push({
    id: "IEEE-REQ-ID",
    name: "Standard Requirement IDs",
    passed: hasReqIds,
    message: hasReqIds
      ? "Found standard REQ IDs format (REQ-<SLUG>-###)."
      : "Missing numbered requirement IDs (Expected format: REQ-<SLUG>-001).",
  });

  // Check 2: User Stories or Scenarios with Given-When-Then
  const gwtRegex = /Given\s+.*When\s+.*Then/is;
  const hasGwt = gwtRegex.test(specContent);
  checks.push({
    id: "IEEE-GWT",
    name: "Given-When-Then Acceptance Criteria",
    passed: hasGwt,
    message: hasGwt
      ? "Found Given-When-Then behavioral criteria."
      : "Acceptance criteria lacking Given-When-Then scenarios.",
  });

  // Check 3: Zero Unconfirmed Assumptions in Elicitation
  const unconfirmedAsm =
    elicitationContent.includes("NOT confirmed") ||
    elicitationContent.includes("[ ]");
  checks.push({
    id: "ZERO-SILENT-ASM",
    name: "Zero Unconfirmed Assumptions",
    passed: !unconfirmedAsm,
    message: unconfirmedAsm
      ? "Found unconfirmed assumptions (ASM-) in 01-elicitation.md."
      : "All domain assumptions are confirmed or resolved.",
  });

  // Check 4: Verifiability & Measurable Criteria
  const hasNonVerifiableWords =
    /\b(easy|fast|seamless|user-friendly|robust)\b/i.test(specContent);
  checks.push({
    id: "IEEE-VERIFIABLE",
    name: "Verifiable & Unambiguous Language",
    passed: !hasNonVerifiableWords,
    message: hasNonVerifiableWords
      ? "Detected ambiguous subjective terms ('fast', 'user-friendly', 'seamless'). Replace with measurable metrics."
      : "Requirements use clear, objective, verifiable language.",
  });

  const allPassed = checks.every((c) => c.passed);
  const score = checks.filter((c) => c.passed).length;
  const total = checks.length;

  const report = checks
    .map(
      (c) => `${c.passed ? "✅" : "❌"} **[${c.id}] ${c.name}**: ${c.message}`,
    )
    .join("\n");

  return {
    content: [
      {
        type: "text" as const,
        text:
          `### 🛡️ IEEE 29148 Spec Quality Validation: \`${args.slug}\`\n\n` +
          `**Result:** ${allPassed ? "PASSED (Quality Gate Cleared)" : "FAILED (Revisions Needed)"} (${score}/${total})\n\n` +
          `${report}\n\n` +
          (allPassed
            ? "🎉 Đặc tả đạt chuẩn IEEE 29148. Có thể tiến hành phê duyệt `baseline.md` và bước sang Phase 3 (Plan)."
            : "⚠️ Vui lòng hoàn thiện các tiêu chí chưa đạt trước khi ký duyệt baseline."),
      },
    ],
  };
}
