import fs from "node:fs/promises";
import path from "node:path";
import { createPatch } from "diff";

export interface WriteFileResult {
  success: boolean;
  isNew: boolean;
  diff: string;
  backupPath?: string;
  error?: string;
}

export interface SafeWriteOptions {
  createBackup?: boolean;
  checkSoftImmutability?: boolean;
}

/**
 * Safely writes a file to disk, generating a unified diff and optional .bak backup.
 */
export async function safeWriteFileWithDiff(
  filePath: string,
  newContent: string,
  options: SafeWriteOptions = { createBackup: true },
): Promise<WriteFileResult> {
  try {
    const parentDir = path.dirname(filePath);
    await fs.mkdir(parentDir, { recursive: true });

    let oldContent = "";
    let isNew = true;
    let backupPath: string | undefined;

    try {
      oldContent = await fs.readFile(filePath, "utf-8");
      isNew = false;
    } catch {
      // File does not exist yet
      isNew = true;
    }

    if (!isNew && options.createBackup && oldContent !== newContent) {
      backupPath = `${filePath}.bak`;
      await fs.writeFile(backupPath, oldContent, "utf-8");
    }

    const filename = path.basename(filePath);
    const diff = isNew
      ? `+++ ${filename} (NEW FILE)\n@@ -0,0 +1,${newContent.split("\n").length} @@\n${newContent
          .split("\n")
          .map((line) => `+${line}`)
          .join("\n")}`
      : createPatch(filename, oldContent, newContent, "original", "modified");

    await fs.writeFile(filePath, newContent, "utf-8");

    return {
      success: true,
      isNew,
      diff,
      backupPath,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      isNew: false,
      diff: "",
      error: errorMsg,
    };
  }
}
