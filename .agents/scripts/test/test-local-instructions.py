"""Guard project-local onboarding and lane instructions, including shipped links."""
import json
from pathlib import Path
import re
import shutil
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[3]
SETUP = ROOT / '.agents/skills/engineering/command-skill-setup/SKILL.md'
WORKSPACE = ROOT / '.agents/skill-library/productivity/setup-workspace/SKILL.md'
VERIFY = ROOT / '.agents/skill-library/engineering/verification-before-completion/SKILL.md'


class LocalInstructionsTests(unittest.TestCase):
    def test_activation_uses_registered_explicit_catalog_mappings(self):
        text = SETUP.read_text()
        for required in ('--sync', '--extra-ship', 'source_path', 'target_path',
                         'selectedPacks', 'last-written', 'cold', '--yes'):
            self.assertIn(required, text)
        self.assertNotIn('Copy ONLY', text)
        self.assertNotIn('~/.agents/', text)
        self.assertNotIn('Archify', text)
        self.assertIn('Do not use `--detect-packs`', text)
        self.assertIn('command-skill-setup', WORKSPACE.read_text())

    def test_fast_verification_does_not_require_full_artifacts(self):
        text = VERIFY.read_text()
        fast = text.split('## Fast lane', 1)[1].split('## Full lane', 1)[0]
        self.assertIn('chat checkpoint', fast)
        self.assertIn('self-check', fast)
        self.assertIn('more than three', fast)
        self.assertIn('no feature folder', fast)
        full = text.split('## Full lane', 1)[1]
        self.assertIn('SIGNED-OFF', full)
        self.assertIn('plan.md', full)
        self.assertIn('docs/features/<slug>/README.md', full)
        self.assertNotIn('Before running any test suite', text)

    def test_instruction_relative_links_resolve_in_source(self):
        paths = [SETUP, WORKSPACE, ROOT / '.agents/docs/harness-compatibility.md',
                 ROOT / '.agents/docs/token-budget.md']
        for path in paths:
            self.assert_links(path)

    def test_optional_rule_links_resolve_in_source_and_deployed_layout(self):
        catalog = json.loads((ROOT / 'optional-stack-skills/catalog.json').read_text())
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp)
            packs = [p for p in catalog['items'] if p['id'] in
                     ('react-rules', 'typescript-patterns')]
            self.assertEqual(len(packs), 2)
            for pack in packs:
                source = ROOT / pack['source_path']
                deployed = target / pack['target_path']
                shutil.copytree(source, deployed, dirs_exist_ok=True)
                for path in source.glob('*.md'):
                    self.assert_links(path)
                for path in deployed.glob('*.md'):
                    self.assert_links(path)

    def assert_links(self, path):
        for href in re.findall(r'\[[^\]]*\]\(([^)]+)\)', path.read_text()):
            if '://' in href or href.startswith('#'):
                continue
            with self.subTest(path=str(path), link=href):
                self.assertTrue((path.parent / href.split('#', 1)[0]).exists())


if __name__ == '__main__':
    unittest.main()
