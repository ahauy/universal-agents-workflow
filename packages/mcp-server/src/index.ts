import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Command } from "commander";
import { createUawMcpServer } from "./server.js";
import { setWorkspaceRoot } from "./workspace/resolver.js";
import { runInit } from "./cli/init.js";

const program = new Command();

program
  .name("uaw-mcp")
  .description("Universal Agents Workflow Model Context Protocol (MCP) Server")
  .version("1.0.0");

program
  .option(
    "--cwd <path>",
    "Set target workspace directory (defaults to current working directory)",
  )
  .action(async (options) => {
    if (options.cwd) {
      setWorkspaceRoot(options.cwd);
    }

    const server = createUawMcpServer();
    const transport = new StdioServerTransport();

    process.on("SIGINT", async () => {
      await server.close();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      await server.close();
      process.exit(0);
    });

    await server.connect(transport);
    console.error("Universal Agents Workflow MCP Server running on stdio");
  });

program
  .command("init [dir]")
  .description(
    "Initialize Universal Agents Workflow files and MCP configuration in a target project",
  )
  .action(async (dir) => {
    await runInit(dir ?? process.cwd());
  });

program.parse(process.argv);
