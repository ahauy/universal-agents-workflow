# Review scope: parts 4–5

Fresh independent review: AGENTS code-reviewer pass A standards/security, pass B fidelity, pass C lean.
Inputs: ../requirements.md and ../test-plan.md. Compare current files to snapshot below.
Review Round 1 only this feature delta; earlier parts 1–3 are baseline, not current changes.
Pre-change snapshot: `/var/folders/s0/d9pljvh53_ggyt5lchb9gsqc0000gn/T/uaw-parts45-before-iq5q0cm8/before`.

Changed files:

- M `.agents/catalog.json`
- M `.agents/docs/harness-compatibility.md`
- M `.agents/docs/smart-update-guide.md`
- M `.agents/scripts/update-engine.py`
- M `.agents/scripts/sync-harnesses.mjs`
- M `.agents/scripts/build-skill-index.mjs`
- M `.agents/scripts/install-hooks.js`
- M `.agents/skill-library/engineering/user-guide-with-screenshots/SETUP.md`
- M `.agents/skill-library/engineering/user-guide-with-screenshots/SKILL.md`
- M `.agents/skill-library/engineering/archify/SKILL.md`
- D `.agents/skill-library/engineering/archify/examples/lifecycle-agent-run.html`
- D `.agents/skill-library/engineering/archify/examples/sequence-cache-miss-request.html`
- D `.agents/skill-library/engineering/archify/examples/dataflow-product-analytics.html`
- D `.agents/skill-library/engineering/archify/examples/web-app-rendered.html`
- D `.agents/skill-library/engineering/archify/examples/workflow-agent-tool-call-rendered.html`
- M `.agents/skill-library/engineering/archify/scripts/render-examples.mjs`
- D `.agents/skill-library/engineering/user-guide-with-screenshots/scripts/capture-freeze-screenshots.mjs`
- D `.agents/skill-library/engineering/user-guide-with-screenshots/scripts/capture-speech-pronunciation-screenshots.mjs`
- D `.agents/skill-library/engineering/user-guide-with-screenshots/scripts/capture-browser-extension-screenshots.mjs`
- D `.agents/skill-library/engineering/user-guide-with-screenshots/scripts/capture-streak-screenshots.mjs`
- M `.agents/skill-library/engineering/user-guide-with-screenshots/scripts/screenshot-plan.example.json`
- D `.agents/skill-library/engineering/user-guide-with-screenshots/scripts/capture-xp-levels-screenshots.mjs`
- D `.agents/skill-library/engineering/user-guide-with-screenshots/scripts/capture-matching-screenshots.mjs`
- D `.agents/skill-library/engineering/user-guide-with-screenshots/scripts/capture-fill-blank-screenshots.mjs`
- D `.agents/skill-library/engineering/user-guide-with-screenshots/scripts/capture-deck-import-export-screenshots.mjs`
- D `.agents/skill-library/engineering/user-guide-with-screenshots/scripts/capture-pwa-offline-screenshots.mjs`
- D `.agents/skill-library/engineering/user-guide-with-screenshots/scripts/capture-analytics-screenshots.mjs`
- D `.agents/skill-library/engineering/user-guide-with-screenshots/scripts/capture-ai-vocabulary-screenshots.mjs`
- D `.agents/skill-library/engineering/user-guide-with-screenshots/scripts/capture-community-decks-screenshots.mjs`
- D `.agents/skill-library/engineering/user-guide-with-screenshots/scripts/verify-extension-live.mjs`
- D `.agents/skill-library/engineering/user-guide-with-screenshots/templates/user-guide-example-card-creation.md`
- M `.agents/skills/engineering/command-update/SKILL.md`
- M `.agents/scripts/test/test-installers.py`
- M `optional-stack-skills/catalog.json`
- M `optional-stack-skills/tools/archify/SKILL.md`
- D `optional-stack-skills/tools/archify/references/cli-usage.md`
- D `optional-stack-skills/tools/archify/references/json-schemas.md`
- D `optional-stack-skills/tools/archify/examples/sequence.example.json`
- D `optional-stack-skills/tools/archify/examples/lifecycle.example.json`
- D `optional-stack-skills/tools/archify/examples/architecture.example.json`
- D `optional-stack-skills/tools/archify/examples/dataflow.example.json`
- D `optional-stack-skills/tools/archify/examples/workflow.example.json`
- M `install.sh`
- M `install.ps1`
- M `README.md`
- A `.agents/scripts/update-state.py`
- A `.agents/scripts/derived-state.cjs`
- A `.agents/scripts/test/test-catalog.mjs`
- A `.agents/scripts/test/test-derived-updates.mjs`
- A `.agents/scripts/test/test-update-integration.py`
- A `.agents/scripts/test/test-update-engine.py`
- A `.agents/scripts/test/test-distribution-cleanup.py`
