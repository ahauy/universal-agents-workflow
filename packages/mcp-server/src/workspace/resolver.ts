import fs from "node:fs/promises";
import path from "node:path";

let currentWorkspaceRoot: string = process.cwd();

export function setWorkspaceRoot(root: string): void {
  currentWorkspaceRoot = path.resolve(root);
}

export function getWorkspaceRoot(): string {
  return currentWorkspaceRoot;
}

export function resolvePath(...segments: string[]): string {
  return path.resolve(currentWorkspaceRoot, ...segments);
}

export function getContextPath(): string {
  return resolvePath("CONTEXT.md");
}

export function getAdrDir(): string {
  return resolvePath("adr");
}

export function getSpecifyDir(): string {
  return resolvePath(".specify");
}

export function getAgentsPath(): string {
  return resolvePath("AGENTS.md");
}

export async function fileExists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function readWorkspaceFile(
  targetPath: string,
): Promise<string | null> {
  try {
    return await fs.readFile(targetPath, "utf-8");
  } catch {
    return null;
  }
}
