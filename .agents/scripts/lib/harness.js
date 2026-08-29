"use strict";

/**
 * Harness compatibility layer.
 *
 * The hooks in scripts/hooks/ were written for Google Antigravity:
 *   stdin : { toolCall: { name, args } }
 *   stdout: { decision: "allow" | "deny", reason }   (exit 0)
 *
 * Claude Code uses a different contract:
 *   stdin : { hook_event_name, tool_name, tool_input }
 *   PreToolUse  -> stdout { hookSpecificOutput: { hookEventName: "PreToolUse",
 *                        permissionDecision: "allow"|"deny"|"ask",
 *                        permissionDecisionReason } }
 *   PostToolUse -> exit code 2 + stderr surfaces the feedback to the model
 *
 * Instead of rewriting every hook, this module:
 *   1. detects the calling harness from the payload shape / environment,
 *   2. normalizes the payload so hooks keep reading `input.toolCall`,
 *   3. translates a hook's `{ decision, reason }` into the shape the detected
 *      harness enforces, including the right exit code.
 *
 * Unknown payloads fall back to the historical Antigravity behavior, and every
 * hook stays fail-open: a malformed event never blocks the user's work.
 */

const ANTIGRAVITY = "antigravity";
const CLAUDE_CODE = "claude-code";

// Tool names across harnesses, mapped onto the Antigravity vocabulary that the
// hook matchers and guards are written against.
const TOOL_ALIASES = {
  // shell
  bash: "run_command",
  shell: "run_command",
  execute_command: "run_command",
  run_terminal_cmd: "run_command",
  run_command: "run_command",
  // write / create
  write: "write_to_file",
  write_file: "write_to_file",
  create_file: "write_to_file",
  write_to_file: "write_to_file",
  // edit / replace
  edit: "replace_file_content",
  edit_file: "replace_file_content",
  str_replace_editor: "replace_file_content",
  search_and_replace: "replace_file_content",
  replace_file_content: "replace_file_content",
  multi_replace_file_content: "multi_replace_file_content",
  multiedit: "multi_replace_file_content",
};

// Per-process state captured while reading stdin, consumed when writing output.
const state = { harness: ANTIGRAVITY, event: null };

function canonicalToolName(name) {
  if (!name || typeof name !== "string") return "";
  const lower = name.toLowerCase();
  return TOOL_ALIASES[lower] || lower;
}

function detectHarness(payload) {
  if (payload && typeof payload === "object") {
    if (payload.toolCall && typeof payload.toolCall === "object") return ANTIGRAVITY;
    if (payload.hook_event_name || payload.tool_name || payload.tool_input) {
      return CLAUDE_CODE;
    }
  }
  if (process.env.CLAUDECODE === "true" || process.env.CLAUDE_CODE_ENTRYPOINT) {
    return CLAUDE_CODE;
  }
  return ANTIGRAVITY;
}

/**
 * Normalize an incoming payload so hooks can always read `input.toolCall`.
 * Also records the harness + event name for output translation.
 */
function normalizeInput(payload) {
  const input = payload && typeof payload === "object" ? payload : {};
  state.harness = detectHarness(input);
  state.event = typeof input.hook_event_name === "string" ? input.hook_event_name : null;

  if (!input.toolCall || typeof input.toolCall !== "object") {
    const args =
      input.tool_input && typeof input.tool_input === "object" ? input.tool_input : {};
    input.toolCall = {
      name: canonicalToolName(input.tool_name || args.name || ""),
      args,
    };
  } else if (input.toolCall.name) {
    input.toolCall.name = canonicalToolName(input.toolCall.name);
  }

  return input;
}

function isPreToolEvent() {
  return state.event === null || state.event === "PreToolUse" || state.event === "PreInvocation";
}

/**
 * Translate a hook's `{ decision, reason }` (or `{ injectSteps }`) for the
 * detected harness. Returns { payload, exitCode, stderr }.
 */
function translateOutput(payload) {
  const harness = state.harness;

  if (!payload || typeof payload !== "object") {
    return { payload: payload || {}, exitCode: 0, stderr: "" };
  }

  // Session context injection: Antigravity uses injectSteps[].ephemeralMessage,
  // Claude Code uses hookSpecificOutput.additionalContext on SessionStart.
  if (Array.isArray(payload.injectSteps)) {
    if (harness !== CLAUDE_CODE) return { payload, exitCode: 0, stderr: "" };
    const context = payload.injectSteps
      .map((step) => (step && step.ephemeralMessage ? step.ephemeralMessage : ""))
      .filter(Boolean)
      .join("\n\n");
    if (!context) return { payload: {}, exitCode: 0, stderr: "" };
    return {
      payload: {
        hookSpecificOutput: {
          hookEventName: "SessionStart",
          additionalContext: context,
        },
      },
      exitCode: 0,
      stderr: "",
    };
  }

  if (!("decision" in payload)) {
    return { payload, exitCode: 0, stderr: "" };
  }

  const reason = payload.reason || "";

  if (harness !== CLAUDE_CODE) {
    return { payload, exitCode: 0, stderr: "" };
  }

  if (payload.decision === "allow") {
    // Silence is approval for Claude Code; emitting a PreToolUse-specific
    // object on a Post event would be invalid.
    return { payload: {}, exitCode: 0, stderr: "" };
  }

  if (payload.decision === "deny") {
    if (isPreToolEvent()) {
      return {
        payload: {
          hookSpecificOutput: {
            hookEventName: "PreToolUse",
            permissionDecision: "deny",
            permissionDecisionReason: reason,
          },
        },
        exitCode: 0,
        stderr: "",
      };
    }
    // Post-tool events have no permission decision: block/feedback via exit 2.
    return { payload: {}, exitCode: 2, stderr: reason };
  }

  return { payload, exitCode: 0, stderr: "" };
}

function currentHarness() {
  return state.harness;
}

module.exports = {
  ANTIGRAVITY,
  CLAUDE_CODE,
  canonicalToolName,
  detectHarness,
  normalizeInput,
  translateOutput,
  currentHarness,
};
