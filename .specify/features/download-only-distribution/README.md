# Download-only distribution

**Status:** Implemented and verified for the available local runtimes.
**Updated:** 2026-11-26. Documentation type: feature reference.

UAW now initializes through the existing install.sh/install.ps1 file-based
download path. The UAW MCP server package, npm init route, package-only tests,
dependencies and generated output have been removed.

The existing spec-validator skill now checks required business evidence,
confirmed assumptions, substantive acceptance coverage and BR/REQ/US links
before allowing PASS. It reports structural blockers as FAIL and records
specific accepted qualitative gaps separately. No replacement service or CLI
is introduced.

## Components and usage

- Follow the [download quickstart](../../../README.md) to initialize a project.
- [Installer](../../../install.sh) and [PowerShell installer](../../../install.ps1)
  retain the part-1 data-protection behavior and existing arguments.
- Use the local [spec-validator skill](../../../.agents/skill-library/engineering/spec-validator/SKILL.md)
  for requirements review. This is an agent procedure, not executable certification.
- [ADR 0003](../../../adr/0003-download-only-distribution.md) supersedes the old
  accepted MCP decision while preserving the historical ADR unchanged.

## Verification

Installer regressions: 7 passed; 3 PowerShell cases skipped because pwsh is absent.
Hooks: 21 passed. Full-source local fresh/reinstall smoke checks both passed,
preserving custom instructions, domain context, a signed-off baseline and
manifest metadata. Syntax, agent contracts, skill catalog and whitespace checks
passed. Independent review approved the scoped changes without actionable findings.

See [acceptance evidence](acceptance-report.md), [test cases](test-plan.md),
[review](review-report.md), [approved plan](plan.md) and [completed tasks](tasks.md).
Validator cases are semantic procedure reviews, not executable parser tests or
proof of every future agent response. Remote download services and external
client registrations were not exercised or changed.

## Troubleshooting and boundaries

Existing clients configured for the removed UAW server need that registration
removed from their own client configuration. Third-party MCP integrations remain
unchanged. No package unpublishing, Git staging, commit or push was performed.
Keep user data and accepted baselines intact when changing project setup;
follow the installer's safe synchronization path rather than overwriting files.
