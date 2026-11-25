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
  // Prompts are intentionally NOT registered.
  //
  // The six `uaw_*` prompts that used to live here (grilling, intake_classifier,
  // speckit_specify, speckit_plan, code_review, ponytail_review) duplicated
  // skills that already exist in `.agents/skills/`. Two sources of truth for the
  // same instruction means they drift, and every request paid for the schema.
  // Use the skills instead; this server exposes only tools and resources.
  // ==========================================

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
