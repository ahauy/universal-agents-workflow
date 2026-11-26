# Download distribution and installer data safety

- Download install: retain local skills, catalog, domain artifacts and the validation skill.
- Distribution: no UAW MCP package, runtime, setup instructions or npm command.
- Existing workspace: missing Python/engine must stop without changing files.
- Reinstall: retain user instructions, domain data, manifest history and source version.
- Failed update: propagate failure before any workspace file is copied.
- Validation skill: review missing evidence, unconfirmed assumptions, absent acceptance criteria and broken BR/REQ/US links; no unsupported PASS.
- Third-party MCP integrations remain available.

Run: `python3 .agents/scripts/test/test-installers.py`.
PowerShell cases run when `pwsh` is available; otherwise they are skipped explicitly.
Skill review scenarios and their results are recorded in
`.specify/features/download-only-distribution/implementation/slice-b-report.md`.
