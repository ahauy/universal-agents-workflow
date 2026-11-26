# Independent review scope

Read baseline and requirements.md section4 plus scenario-review.md synthetic inputs/expected decisions. Review ONLY review-change.patch vs the saved before snapshot (prior work is uncommitted; cumulative Git diff is out of scope). Inspect actual touched source/tests. Pass A standards/security B acceptance fidelity C lean. Check deploy readiness/auth/identity/required-evidence/recovery gates, cross-skill consistency, scoped loading and data preservation. Protocol is instruction-only, not executable state validator. No implementer slice reports, source writes or Git mutations. Write review-round-1.md with grouped actionable severities or APPROVE.

Snapshot: /var/folders/s0/d9pljvh53_ggyt5lchb9gsqc0000gn/T/uaw-production-flow-before-vjah8fld/before

- .agents/docs/pipeline-detail.md
- .agents/docs/production-lifecycle.md
- .agents/docs/workflow-step-by-step.md
- .agents/scripts/test/test-installers.py
- .agents/scripts/test/test-production-lifecycle.py
- .agents/scripts/test/test-update-integration.py
- .agents/skill-library/engineering/implementation-plan/SKILL.md
- .agents/skill-library/engineering/task-breakdown/SKILL.md
- .agents/skill-library/engineering/technical-consistency-review/SKILL.md
- .agents/skill-library/engineering/technical-documentation/SKILL.md
- .agents/skill-library/engineering/technical-spec/SKILL.md
- .agents/skill-library/engineering/verification-before-completion/SKILL.md
- .agents/skills/engineering/command-continue-project/SKILL.md
- .agents/skills/engineering/command-generate-backlog/SKILL.md
- .agents/skills/engineering/command-git-push/SKILL.md
- .specify/features/README.md
- .specify/templates/PRODUCT_BACKLOG_ROADMAP-template.md
- .specify/templates/operations-template.md
- .specify/templates/release-template.md
- AGENTS.md
- README.md
- adr/0008-release-evidence-and-production-boundaries.md
- adr/README.md
- docs/features/README.md
- docs/features/lean-production-lifecycle/README.md
