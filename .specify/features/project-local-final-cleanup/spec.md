# Technical spec

Reuse existing installer/update three-way engine, schema 2 and derived ownership.
Do not add deletion/migration to customer updater. Remove source Archify tree,
optional wrapper and catalog row; route diagrams to Mermaid and re-generate source
catalog/index using existing explicit maintenance commands. Replace runtime-coupled
Archify test fixtures with independent synthetic skill fixtures, retaining assertions
for old customized files. Preserve existing metadata selected packs missing upstream:
report unavailable/keep, not purge or pretend updated.

Onboarding instructions resolve verified source checkout and catalog target_path;
use --sync --extra-ship with selected mappings, --yes keeps conflicts. Do not use
--detect-packs to add unapproved choices or write selections manually. Broken rule
links must resolve both in source and after flattened deployment (avoid unsupported
inheritance links where required sources are not shipped). Verification: Fast needs
chat checkpoint/AC + relevant tests/self-check; Full reuses signed artifacts/gates.

Screenshot: infer app command/URL from actual manifest/config; existing capture
script rejects bad/unsupported actions with nonzero exit, does not announce success,
and closes browser in finally. Keep annotation instructions honest about automation
vs manual/browser step. Use mocked Playwright test dependency in temp fixtures,
no real package installation. Hook tests should use isolated cache workspace.
