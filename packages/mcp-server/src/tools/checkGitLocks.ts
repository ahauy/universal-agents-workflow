import { exec } from "node:child_process";
import { promisify } from "node:util";
import { z } from "zod";
import { getWorkspaceRoot } from "../workspace/resolver.js";

const execAsync = promisify(exec);

export const checkGitLocksSchema = {
  allowDirectMain: z
    .boolean()
    .default(false)
    .describe("If true, suppresses error when working on main/master branch"),
};

export async function executeCheckGitLocks(args: {
  allowDirectMain?: boolean;
}) {
  const cwd = getWorkspaceRoot();

  try {
    const { stdout: branchName } = await execAsync(
      "git rev-parse --abbrev-ref HEAD",
      { cwd },
    );
    const currentBranch = branchName.trim();

    const isProtected = ["main", "master", "release", "production"].includes(
      currentBranch,
    );
    const { stdout: statusOut } = await execAsync("git status --porcelain", {
      cwd,
    });
    const dirtyFiles = statusOut
      .trim()
      .split("\n")
      .filter((l) => Boolean(l.trim()));

    if (isProtected && !args.allowDirectMain) {
      return {
        content: [
          {
            type: "text" as const,
            text:
              `🛑 **GIT HARDWARE LOCK TRIGGERED!**\n\n` +
              `Hiện tại bạn đang ở nhánh được bảo vệ: \`${currentBranch}\`.\n` +
              `Quy chuẩn UAW cấm làm việc hoặc commit trực tiếp trên \`${currentBranch}\`.\n\n` +
              `👉 **Giải pháp:** Hãy tạo nhánh tính năng trước khi tiếp tục:\n` +
              `\`\`\`bash\ngit checkout -b feat/<ten-tinh-nang>\n\`\`\``,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text:
            `✅ **Git Guardrails Cleared!**\n\n` +
            `- **Nhánh hiện tại:** \`${currentBranch}\` (Hợp lệ cho phát triển tính năng)\n` +
            `- **Trạng thái repo:** ${dirtyFiles.length === 0 ? "Sạch (Clean working tree)" : `${dirtyFiles.length} file có thay đổi chưa commit`}\n` +
            (dirtyFiles.length > 0
              ? `  - ${dirtyFiles.slice(0, 5).join("\n  - ")}${dirtyFiles.length > 5 ? "\n  - ..." : ""}`
              : ""),
        },
      ],
    };
  } catch (err) {
    return {
      content: [
        {
          type: "text" as const,
          text: `ℹ️ Thư mục không phải là git repository hoặc git CLI không khả dụng: ${String(err)}`,
        },
      ],
    };
  }
}
