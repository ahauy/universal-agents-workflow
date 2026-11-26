# Project onboarding and activation

Use this protocol for first-time onboarding or a requested change to selected
project skills. Read only the relevant section; existing confirmed setup is reused.

## 1. Discover existing evidence

Inspect root/workspace manifests and lockfiles to identify languages, frameworks,
package manager, databases, container tooling, test runners and linters. Examples:
package.json/tsconfig, pyproject/requirements, go.mod, Cargo.toml, pom/build.gradle,
Flutter/Swift manifests, Prisma schema and Docker/Compose files. Do not infer a
stack or create optional skill directories when no marker matches.

Read repository docs for terminology, components and existing conventions. Inspect
Git branch/remote and issue-tracker convention when present; read-only discovery
does not authorize Git writes or issue creation. A .git file can identify a worktree.

## 2. Prepare project context and ADRs safely

Read existing CONTEXT.md and adr/ before writing. Preserve custom text and accepted
ADRs. Add only confirmed facts from manifests, README and owner evidence to the
relevant component/terminology sections; do not regenerate the document. Fill a
recognized placeholder only with established facts, retaining unrelated sections.
For conflicting terminology or ambiguous content, ask rather than replace it.

Create missing CONTEXT.md from the framework template with confirmed facts and
leave unknown business content unresolved. Ensure adr/ and its adr-template.md
exist; copy the verified template only when absent. Do not replace an existing
template or record an architectural choice that has not been made. If recording
adoption of ADRs is needed, create a new unused numbered file only for that
confirmed decision; never reuse or overwrite an existing decision path.

## 3. Match catalog and reuse selections

Read the runtime [catalog](../../../../catalog.json). Match detection markers;
show matching choices in a compact table with name, category, recommendation and
short_description so the owner can understand their value. Use catalog source_path
and target_path as authority, not hardcoded pack copies or benchmark claims.

Reuse explicit selections and Git tracking mode already confirmed in this session
or project metadata. Ask only for missing choices. Optional third-party MCP needs
its own explicit selection and project-local configuration; never infer activation
from a .git directory or a language marker.

## 4. Activate confirmed mappings

Resolve the verified framework source checkout from workflow-source.json sourcePath
or an explicitly supplied checkout. Verify update-engine.py and the catalog exist;
if unavailable, report the missing source rather than guess a global directory.

For approved non-MCP items, run the verified source engine with --sync, --source,
--target and --extra-ship containing only approved source_path=target_path mappings.
Keep skill destinations in the cold .agents/skill-library tier; rules/configs keep
their catalog targets. Do not use `--detect-packs` to add unapproved choices or
`--ship` to replace the core set. Example only, substitute verified paths/mappings:

```bash
python3 /verified/uaw/.agents/scripts/update-engine.py --sync \
  --source /verified/uaw --target /project \
  --extra-ship 'optional-stack-skills/languages/go/go-patterns=.agents/skill-library/engineering/go-patterns'
```

The engine records selectedPacks and last-written hashes, then refreshes index,
adapters and hooks. Never copy packs manually or edit registry/hash state to adopt
existing files. --yes keeps conflicts; it never permits overwriting custom data.
Inspect exit status and phase reports; distinguish activated, kept/customized,
unavailable and failed work. Do not claim a kept or unavailable item was activated.
The customer receives selected files, not the optional-stack-skills source tree.

For selected code-review-graph MCP, check existing uvx first. Missing dependencies
need their own approval; no global install or cross-project configuration changes.
Merge only the selected server into the supported project config, preserving all
other servers. Use command uvx with args [code-review-graph, serve], type stdio.
Run uvx code-review-graph build in that project only if fetching/running the
selected runtime is authorized, and report build failures as incomplete.

## 5. Apply only the confirmed Git tracking mode

Preserve existing ignore entries; append only missing relevant entries. Never
rewrite ignore files or change a previously confirmed mode as a side effect.
Use the project's installer mode contract instead of inventing different coverage:

- Team: keep framework files shared; ignore temporary hook logs if needed.
- Local-only: add framework paths to .gitignore.
- Stealth: use .git/info/exclude; leave .gitignore unchanged.
- Hybrid: share CONTEXT.md, adr/ and .specify/; ignore the framework engine/rules.

If the mode is unknown, obtain the choice before editing ignore configuration.
These selections do not authorize git add, commit, push or modifying Git history.

## 6. Verify and report

Check preserved context/ADRs and ignore content, source exit/phase reports and the
actual activated paths. Report detected stack/package manager and test/lint tools,
Git branch/remote/tracking mode, context/ADR changes, successful and retained or
blocked selections, and a relevant next step such as skills-index or intake.
