import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { safeWriteFileWithDiff } from "../src/workspace/safety.js";

describe("Workspace Safety Module", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "uaw-safety-test-"));
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("should create a new file and report diff as new file", async () => {
    const targetFile = path.join(tempDir, "test-new.txt");
    const result = await safeWriteFileWithDiff(
      targetFile,
      "Hello World\nLine 2",
    );

    expect(result.success).toBe(true);
    expect(result.isNew).toBe(true);
    expect(result.backupPath).toBeUndefined();
    expect(result.diff).toContain("+++ test-new.txt (NEW FILE)");

    const fileContent = await fs.readFile(targetFile, "utf-8");
    expect(fileContent).toBe("Hello World\nLine 2");
  });

  it("should update an existing file, create a .bak backup, and generate unified diff", async () => {
    const targetFile = path.join(tempDir, "existing.txt");
    await fs.writeFile(targetFile, "Line 1\nLine 2\nLine 3", "utf-8");

    const result = await safeWriteFileWithDiff(
      targetFile,
      "Line 1\nLine 2 modified\nLine 3",
      {
        createBackup: true,
      },
    );

    expect(result.success).toBe(true);
    expect(result.isNew).toBe(false);
    expect(result.backupPath).toBe(`${targetFile}.bak`);
    expect(result.diff).toContain("-Line 2");
    expect(result.diff).toContain("+Line 2 modified");

    // Check backup preserved old content
    const backupContent = await fs.readFile(result.backupPath!, "utf-8");
    expect(backupContent).toBe("Line 1\nLine 2\nLine 3");

    // Check target has new content
    const newContent = await fs.readFile(targetFile, "utf-8");
    expect(newContent).toBe("Line 1\nLine 2 modified\nLine 3");
  });
});
