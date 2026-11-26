"""Structural workflow regressions; semantic lane decisions are reviewed separately."""
from pathlib import Path
import json
import re
import unittest

ROOT = Path(__file__).resolve().parents[3]
LIBRARY = ROOT / ".agents/skill-library/engineering"
NATIVE = ("technical-spec", "implementation-plan", "task-breakdown", "technical-consistency-review")
LEGACY = ("specify", "plan", "tasks", "analyze", "clarify", "checklist", "implement", "converge", "constitution", "taskstoissues")


class WorkflowStructure(unittest.TestCase):
    def test_native_skill_identity_and_inventory(self):
        for name in NATIVE:
            p = LIBRARY / name / "SKILL.md"
            self.assertTrue(p.is_file(), str(p))
            self.assertRegex(p.read_text(), rf"(?m)^name:\s*[\"']?{re.escape(name)}[\"']?\s*$")
        names = []
        for parent in (ROOT / ".agents/skills", ROOT / ".agents/skill-library"):
            for p in parent.glob("*/*/SKILL.md"):
                match = re.search(r"(?m)^name:\s*[\"']?([^\"'\n]+?)[\"']?\s*$", p.read_text())
                self.assertIsNotNone(match, str(p))
                names.append(match.group(1))
        self.assertEqual(len(names), len(set(names)), "Duplicate discoverable skill identities")
        self.assertEqual(len(list((ROOT / ".agents/skills").glob("*/*/SKILL.md"))), 9)

    def test_planning_has_no_upstream_execution_dependency(self):
        forbidden = re.compile(r"\.specify/scripts/(?:powershell|bash|python)/|specify preset resolve|__SPECKIT_COMMAND_|command:\s*speckit\.")
        files = [LIBRARY / name / "SKILL.md" for name in NATIVE]
        files += [p for name in LEGACY for p in (LIBRARY / f"speckit-{name}").rglob("*.md")]
        files += list((ROOT / ".specify/templates").glob("*.md"))
        files += list((ROOT / ".specify/workflows").rglob("*.yml"))
        for p in files:
            if p.is_file():
                self.assertIsNone(forbidden.search(p.read_text()), str(p.relative_to(ROOT)))

    def test_legacy_entrypoints_and_workflow_retirement(self):
        for name in LEGACY:
            p = LIBRARY / f"speckit-{name}" / "SKILL.md"
            self.assertTrue(p.is_file(), str(p))
            links = re.findall(r"\]\(([^)]+)\)", p.read_text())
            for target in links:
                if '://' not in target and not target.startswith('#'):
                    self.assertTrue((p.parent / target.split('#')[0]).exists(), (str(p), target))
        registry = json.loads((ROOT / ".specify/workflows/workflow-registry.json").read_text())
        self.assertNotIn("speckit", registry.get("workflows", {}))


if __name__ == "__main__":
    unittest.main(verbosity=2)
