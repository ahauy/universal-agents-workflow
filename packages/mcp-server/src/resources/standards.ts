export async function readStandardsResource(guideName: string) {
  const normalized = guideName.toLowerCase();

  const standards: Record<string, string> = {
    "the-ladder": `# The Ladder — Anti-Overengineering (Ponytail)

1. **Does this need to exist at all?** Speculative future need -> skip it (YAGNI).
2. **Already in this codebase?** Helper, util, pattern already living here -> reuse it.
3. **Stdlib does it?** Use the standard library (\`structuredClone\`, \`Intl.DateTimeFormat\`, \`os.path\`).
4. **Native platform feature covers it?** \`<input type="date">\` over picker lib, CSS over JS.
5. **Already-installed dependency solves it?** Use it. Never add a new one.
6. **Can it be one line?** Write one line.
7. **Only then:** the minimum code that works and passes tests.
`,
    "anti-slop": `# Anti-AI-Slop Frontend Standards

- **Zero Generic AI Slop:** No unrequested multi-color gradients, heavy glassmorphism, or neon floating orbs.
- **Minimal Canvas & Intentional Palette:** Clean document canvas, 1px hairline borders (\`#e5e5e5\` / \`#262626\`), purposeful CTA geometry.
- **Typography Tokens:** Explicit font hierarchy (Display / Heading, Body copy, Monospace code) rather than browser defaults.
- **Stable Outer Anchor:** Never attach hover handlers directly to elements translating on Y-axis.
`,
    "ireb-spec": `# IREB & IEEE 29148 Specification Standards

- Every requirement must have a unique ID: \`REQ-<SLUG>-###\`.
- Traceability: Every requirement must derive from business value or domain pillar.
- Unambiguous: Zero vague subjective words (\`fast\`, \`easy\`, \`seamless\`).
- Acceptance Criteria: Every user story must include Given-When-Then scenarios (Happy + Unhappy).
`,
  };

  const text =
    standards[normalized] ??
    `# Standard Guide Not Found
Available guides:
- \`the-ladder\`: Anti-overengineering rules
- \`anti-slop\`: Frontend and visual standards
- \`ireb-spec\`: Requirements and IEEE 29148 standards
`;

  return {
    contents: [
      {
        uri: `uaw://standards/${normalized}`,
        mimeType: "text/markdown",
        text,
      },
    ],
  };
}
