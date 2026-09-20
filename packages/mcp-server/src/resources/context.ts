import { getContextPath, readWorkspaceFile } from "../workspace/resolver.js";

export async function readContextResource() {
  const contextPath = getContextPath();
  const content = await readWorkspaceFile(contextPath);

  return {
    contents: [
      {
        uri: "uaw://context",
        mimeType: "text/markdown",
        text:
          content ??
          "# CONTEXT.md not found in target project.\nRun `uaw_update_context` to initialize.",
      },
    ],
  };
}
