import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  setWorkspaceRoot,
  getWorkspaceRoot,
} from "../src/workspace/resolver.js";
import { executeUpdateContext } from "../src/tools/updateContext.js";
import { executeRecordAdr } from "../src/tools/recordAdr.js";
import { executeScaffoldFeature } from "../src/tools/scaffoldFeature.js";
import { executeValidateSpec } from "../src/tools/validateSpec.js";
import { executePonytailScan } from "../src/tools/ponytailScan.js";

describe("MCP Server Tools Suite", () => {
  let tempDir: string;
  const originalCwd = getWorkspaceRoot();

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "uaw-tools-test-"));
    setWorkspaceRoot(tempDir);
  });

  afterEach(async () => {
    setWorkspaceRoot(originalCwd);
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("executeUpdateContext should initialize CONTEXT.md and add terms", async () => {
    const res1 = await executeUpdateContext({
      term: "Materialization Cascade",
      definition: "Cascade issue when creating physical folders on disk",
      before: "Folder creation error",
      after: "Materialization cascade",
      notes: "adr/0001",
    });

    expect(res1.content[0].text).toContain("Added new term");

    const content = await fs.readFile(
      path.join(tempDir, "CONTEXT.md"),
      "utf-8",
    );
    expect(content).toContain("**Materialization Cascade**");
    expect(content).toContain(
      "Cascade issue when creating physical folders on disk",
    );

    // Update the same term inline (Soft-immutability)
    const res2 = await executeUpdateContext({
      term: "Materialization Cascade",
      definition: "Refined definition for folder creation",
      before: "Folder creation error",
      after: "Materialization cascade",
    });

    expect(res2.content[0].text).toContain("Updated existing term inline");

    const updatedContent = await fs.readFile(
      path.join(tempDir, "CONTEXT.md"),
      "utf-8",
    );
    expect(updatedContent).toContain("Refined definition for folder creation");
    // Ensure only 1 row exists for this term (no duplicate rows)
    const matches = updatedContent.match(/\*\*Materialization Cascade\*\*/g);
    expect(matches?.length).toBe(1);
  });

  it("executeRecordAdr should create numbered ADR and update README", async () => {
    // Setup README
    const adrDir = path.join(tempDir, "adr");
    await fs.mkdir(adrDir, { recursive: true });
    await fs.writeFile(
      path.join(adrDir, "README.md"),
      "# Architectural Decision Records\n\n| Number | Title | Status | Date |\n| :--- | :--- | :--- | :--- |\n",
      "utf-8",
    );

    const res = await executeRecordAdr({
      title: "Use Vitest For Unit Testing",
      status: "ACCEPTED",
      context: "Need fast ESM native testing runner",
      decision: "Adopt Vitest across packages",
      consequences: "Instant execution, zero babel overhead",
    });

    expect(res.content[0].text).toContain(
      "0001-use-vitest-for-unit-testing.md",
    );

    const adrFile = path.join(adrDir, "0001-use-vitest-for-unit-testing.md");
    const fileContent = await fs.readFile(adrFile, "utf-8");
    expect(fileContent).toContain("# 0001. Use Vitest For Unit Testing");
    expect(fileContent).toContain("Adopt Vitest across packages");

    const readmeContent = await fs.readFile(
      path.join(adrDir, "README.md"),
      "utf-8",
    );
    expect(readmeContent).toContain(
      "[0001](./0001-use-vitest-for-unit-testing.md)",
    );
  });

  it("executeScaffoldFeature should create feature folder and all 6 life-cycle templates", async () => {
    const res = await executeScaffoldFeature({
      slug: "auth-oauth-login",
      title: "Google OAuth Login",
      description: "Allow users to login using Google OAuth 2.0",
      complexity: "bounded",
    });

    expect(res.content[0].text).toContain(
      "Scaffolding complete for feature `auth-oauth-login`",
    );

    const featureDir = path.join(
      tempDir,
      ".specify",
      "features",
      "auth-oauth-login",
    );
    const files = await fs.readdir(featureDir);
    expect(files).toContain("01-elicitation.md");
    expect(files).toContain("baseline.md");
    expect(files).toContain("spec.md");
    expect(files).toContain("plan.md");
    expect(files).toContain("tasks.md");
    expect(files).toContain("CHANGELOG.md");
  });

  it("executeValidateSpec should validate spec files against IEEE 29148", async () => {
    const featureDir = path.join(
      tempDir,
      ".specify",
      "features",
      "test-feature",
    );
    await fs.mkdir(featureDir, { recursive: true });

    // Incomplete spec
    await fs.writeFile(
      path.join(featureDir, "spec.md"),
      "# Spec without proper IDs or GWT",
      "utf-8",
    );
    await fs.writeFile(
      path.join(featureDir, "01-elicitation.md"),
      "# Elicitation [ ] unconfirmed",
      "utf-8",
    );

    const failRes = await executeValidateSpec({ slug: "test-feature" });
    expect(failRes.content[0].text).toContain("FAILED (Revisions Needed)");

    // Valid spec
    const validSpec = `# Technical Specification: test-feature

## Requirements
- REQ-TESTFEATURE-001: The system shall encrypt all stored tokens using AES-256.

## Acceptance Scenarios
Scenario: Valid Login
Given an unauthenticated user
When the user submits valid OAuth credentials
Then the system issues a JWT session token within 200ms.
`;
    await fs.writeFile(path.join(featureDir, "spec.md"), validSpec, "utf-8");
    await fs.writeFile(
      path.join(featureDir, "01-elicitation.md"),
      "# Elicitation all confirmed",
      "utf-8",
    );

    const passRes = await executeValidateSpec({ slug: "test-feature" });
    expect(passRes.content[0].text).toContain("PASSED (Quality Gate Cleared)");
  });

  it("executePonytailScan should detect over-engineering anti-patterns", async () => {
    const badCode = `import _ from "lodash";
import moment from "moment";
import axios from "axios";
`;
    const srcDir = path.join(tempDir, "src");
    await fs.mkdir(srcDir, { recursive: true });
    await fs.writeFile(path.join(srcDir, "bad.ts"), badCode, "utf-8");

    const scanRes = await executePonytailScan({ targetPath: "src" });
    expect(scanRes.content[0].text).toContain(
      "Ponytail Over-Engineering Findings",
    );
    expect(scanRes.content[0].text).toContain("lodash");
    expect(scanRes.content[0].text).toContain("moment");
    expect(scanRes.content[0].text).toContain("axios");
  });
});
