"""Structural workflow regressions; semantic lane decisions are reviewed separately."""
from pathlib import Path
import json
import re
import unittest

ROOT = Path(__file__).resolve().parents[3]
LIBRARY = ROOT / ".agents/skill-library/engineering"
NATIVE = ("technical-spec", "implementation-plan", "task-breakdown", "technical-consistency-review")
LEGACY = ("specify", "plan", "tasks", "analyze", "clarify", "checklist", "implement", "converge", "constitution", "taskstoissues")
RETIRED = tuple('speckit-' + name for name in LEGACY) + (
    'ponytail-gain', 'ponytail-help', 'ponytail-audit', 'route', 'frontend-design', 'ui-taste-pro', 'setup-workspace',
    'writing-for-agents', 'ponytail-debt', 'user-guide-with-screenshots')


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
        self.assertEqual(len(names), 50)
        self.assertIn('wait-what', names)
        self.assertIn('user-guide', names)
        self.assertFalse(set(names).intersection(RETIRED))
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

    def test_retired_skills_have_no_source_or_catalog_activation(self):
        for name in RETIRED:
            for category in ('engineering', 'productivity'):
                self.assertFalse((LIBRARY.parent / category / name).exists(), name)
        catalog = json.loads((ROOT / 'optional-stack-skills/catalog.json').read_text())
        self.assertFalse({item['id'] for item in catalog['items']}.intersection(RETIRED))
        registry = json.loads((ROOT / ".specify/workflows/workflow-registry.json").read_text())
        self.assertNotIn("speckit", registry.get("workflows", {}))


if __name__ == "__main__":
    unittest.main(verbosity=2)
