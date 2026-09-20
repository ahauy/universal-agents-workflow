import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  executeUpdateContext,
  updateContextSchema,
} from "./tools/updateContext.js";
import { executeRecordAdr, recordAdrSchema } from "./tools/recordAdr.js";
import {
  executeScaffoldFeature,
  scaffoldFeatureSchema,
} from "./tools/scaffoldFeature.js";
import {
  executeValidateSpec,
  validateSpecSchema,
} from "./tools/validateSpec.js";
import {
  executePonytailScan,
  ponytailScanSchema,
} from "./tools/ponytailScan.js";
import {
  executeCheckGitLocks,
  checkGitLocksSchema,
} from "./tools/checkGitLocks.js";

import { getGrillingPrompt, grillingPromptArgs } from "./prompts/grilling.js";
import {
  getIntakeClassifierPrompt,
  intakeClassifierArgs,
} from "./prompts/intakeClassifier.js";
import {
  getSpeckitSpecifyPrompt,
  speckitSpecifyArgs,
  getSpeckitPlanPrompt,
  speckitPlanArgs,
} from "./prompts/speckit.js";
import {
  getCodeReviewPrompt,
  codeReviewArgs,
  getPonytailReviewPrompt,
  ponytailReviewArgs,
} from "./prompts/review.js";

import { readContextResource } from "./resources/context.js";
import { readAdrResource } from "./resources/adr.js";
import { readStandardsResource } from "./resources/standards.js";

export function createUawMcpServer() {
  const server = new McpServer({
    name: "universal-agents-workflow",
    version: "1.0.0",
  });

  // ==========================================
  // Register MCP Tools (Data Plane & Automation)
  // ==========================================

  server.tool(
    "uaw_update_context",
    "Safely update or add a term in CONTEXT.md with soft-immutability and backup",
    updateContextSchema,
    async (args) => executeUpdateContext(args),
  );

  server.tool(
    "uaw_record_adr",
    "Record a new Architectural Decision Record in adr/ with auto-increment number and index update",
    recordAdrSchema,
    async (args) => executeRecordAdr(args),
  );

  server.tool(
    "uaw_scaffold_feature",
    "Scaffold .specify/features/<slug>/ folder with elicitation, baseline, spec, plan and tasks templates",
    scaffoldFeatureSchema,
    async (args) => executeScaffoldFeature(args),
  );

  server.tool(
    "uaw_validate_spec",
    "Validate feature spec against IEEE 29148 standards (IDs, Given-When-Then, assumptions)",
    validateSpecSchema,
    async (args) => executeValidateSpec(args),
  );

  server.tool(
    "uaw_ponytail_scan",
    "Scan codebase for over-engineering anti-patterns against The Ladder (Ponytail)",
    ponytailScanSchema,
    async (args) => executePonytailScan(args),
  );

  server.tool(
    "uaw_check_git_locks",
    "Verify Git branch guardrails and hardware locks (blocks direct commits on main/master)",
    checkGitLocksSchema,
    async (args) => executeCheckGitLocks(args),
  );

  // ==========================================
  // Register MCP Prompts (Control Plane & Workflows)
  // ==========================================

  server.prompt(
    "uaw_grilling",
    "Interactive domain grilling interview without silent assumptions",
    grillingPromptArgs,
    (args) => getGrillingPrompt(args),
  );

  server.prompt(
    "uaw_intake_classifier",
    "Classify feature request complexity (Micro-task, Spike, Bounded, Epic)",
    intakeClassifierArgs,
    (args) => getIntakeClassifierPrompt(args),
  );

  server.prompt(
    "uaw_speckit_specify",
    "Generate IEEE 29148 specification from approved baseline",
    speckitSpecifyArgs,
    (args) => getSpeckitSpecifyPrompt(args),
  );

  server.prompt(
    "uaw_speckit_plan",
    "Generate architecture plan and contract boundaries from spec",
    speckitPlanArgs,
    (args) => getSpeckitPlanPrompt(args),
  );

  server.prompt(
    "uaw_code_review",
    "Dual-pass adversarial code review (Standards + Security, Spec Fidelity)",
    codeReviewArgs,
    (args) => getCodeReviewPrompt(args),
  );

  server.prompt(
    "uaw_ponytail_review",
    "Over-engineering review hunting complexity and bloat via The Ladder",
    ponytailReviewArgs,
    (args) => getPonytailReviewPrompt(args),
  );

  // ==========================================
  // Register MCP Resources (Dynamic Context Streaming)
  // ==========================================

  server.resource("context", "uaw://context", async () =>
    readContextResource(),
  );

  server.resource("adr", "uaw://adr", async () => readAdrResource());

  server.resource(
    "standards",
    new ResourceTemplate("uaw://standards/{guide}", { list: undefined }),
    async (_uri, { guide }) => readStandardsResource(String(guide)),
  );

  return server;
}
