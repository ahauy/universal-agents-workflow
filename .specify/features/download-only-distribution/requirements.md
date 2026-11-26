# Requirements: Download-only distribution

## 1. Business context

The owner requests one file-based distribution path and removal of UAW MCP.
Success means download initialization works without the package, the remaining
validation procedure rejects missing evidence, and part-1 data protection remains.
Scope is bounded by 04-risk-register.md's MoSCoW table.

## 2. Product behaviour

Users initialize through install.sh/install.ps1 and use local workflow skills.
The spec-validator skill reads requirements and business evidence and records
its review; missing or unresolved inputs prevent PASS. Historical architectural
decisions remain available through explicit succession.

## 3. Requirements

### REQ-DOWNLOAD-001: Remove UAW MCP distribution
**Priority:** Must-Have
**Derived from:** BR-DOWNLOAD-002, ASM-DOWNLOAD-001
Remove the UAW MCP package, including its server, init, tools, resources,
package-only tests, dependencies, configuration templates and generated output.
Retain unrelated third-party MCP integrations.

### REQ-DOWNLOAD-002: Initialize from downloaded files
**Priority:** Must-Have
**Derived from:** BR-DOWNLOAD-001, ASM-DOWNLOAD-003
Existing installers must initialize local workflow artifacts without requiring
UAW MCP or a replacement init CLI. Active setup instructions describe that path.

### REQ-DOWNLOAD-003: Reject incomplete validation evidence
**Priority:** Must-Have
**Derived from:** BR-DOWNLOAD-003, ASM-DOWNLOAD-002
The local spec-validator procedure must not return PASS when required business
artifacts are missing/unreadable/empty, assumptions are unconfirmed, a requirement
or story lacks applicable acceptance criteria, or BR/REQ/US traceability is broken.
It must record findings and distinguish human/agent review from automated
format checks or a certification assertion.

### REQ-DOWNLOAD-004: Preserve data protection
**Priority:** Must-Have
**Derived from:** BR-DOWNLOAD-004
Installer behavior must retain the part-1 safeguards for missing Python/engine,
failed update, reinstall metadata and user-customized content. Existing unrelated
working-tree changes and project artifacts must not be removed by cleanup.

### REQ-DOWNLOAD-005: Align current guidance and preserve history
**Priority:** Must-Have
**Derived from:** BR-DOWNLOAD-005
Active setup, governance, adapter and test guidance must not direct users to UAW
MCP. A new ADR supersedes the accepted MCP decision without modifying that ADR.
The feature's completion report records actual acceptance evidence and limitations.

## 4. User stories

### US-DOWNLOAD-001: Use the workflow without a UAW server
**As a** repository owner, **I want** one file-based distribution **so that**
I can use UAW without running its MCP server.
**Traces to:** REQ-DOWNLOAD-001
- Given a completed cleanup, when source/dependency inventory is checked, then
  no UAW MCP package or package-only runtime remains.
- Given optional third-party MCP configuration, when cleanup runs, then that
  configuration is retained.

### US-DOWNLOAD-002: Initialize through download
**As a** repository owner, **I want** local initialization **so that**
the needed workflow files are available together.
**Traces to:** REQ-DOWNLOAD-002
- Given a fresh project, when a download installer runs, then local workflow
  instructions and skills are available without the removed UAW package.
- Given an existing project, when reinstalling, then local initialization uses
  the safe synchronization path rather than a missing npm init command.

### US-DOWNLOAD-003: Receive trustworthy validation feedback
**As a** repository owner, **I want** explicit evidence checks **so that**
an incomplete requirements set is not marked complete.
**Traces to:** REQ-DOWNLOAD-003
- Given complete confirmed artifacts, when the skill reviews every REQ/US, then
  it records the eight quality criteria and an intact traceability chain.
- Given missing evidence, unresolved assumptions, missing acceptance criteria
  or a dangling reference, when validating, then it reports specific gaps and
  does not issue PASS or automatic certification.

### US-DOWNLOAD-004: Keep existing project data
**As a** repository owner, **I want** existing safeguards retained **so that**
removing a distribution option does not discard my work.
**Traces to:** REQ-DOWNLOAD-004
- Given customized instructions and metadata, when reinstalling, then they are
  preserved and existing installer regressions pass.
- Given unavailable safety prerequisites or a failed update engine, when
  installing/updating, then installation stops before an unsafe overwrite.

### US-DOWNLOAD-005: Follow current instructions
**As a** repository owner, **I want** current setup guidance **so that**
I do not invoke deleted commands.
**Traces to:** REQ-DOWNLOAD-005
- Given active documentation and generated adapters, when following setup,
  then they point to file-based initialization without UAW MCP instructions.
- Given the old accepted ADR, when viewing architectural history, then it stays
  unchanged and a successor identifies the new decision.
