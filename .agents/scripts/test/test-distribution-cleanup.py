"""Source cleanup and bundled tooling smoke tests (no application/network needed)."""
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[3]
GUIDE = Path('.agents/skill-library/engineering/user-guide')
ARCHIFY = Path('.agents/skill-library/engineering/archify')


class DistributionCleanupTests(unittest.TestCase):
    def test_text_guide_has_no_capture_tooling_or_image_template(self):
        self.assertTrue((ROOT / GUIDE / 'SKILL.md').is_file())
        template = ROOT / GUIDE / 'templates/user-guide-template.md'
        self.assertTrue(template.is_file())
        self.assertNotIn('![', template.read_text())
        self.assertFalse((ROOT / GUIDE / 'scripts').exists())
        self.assertFalse((ROOT / '.agents/skill-library/engineering/user-guide-with-screenshots').exists())
        command = ROOT / '.agents/skills/engineering/command-user-guide/SKILL.md'
        self.assertIn('user-guide/SKILL.md', command.read_text())
        self.assertLessEqual(len(command.read_text().splitlines()), 40)

    def test_removed_tools_are_not_distributed(self):
        self.assertFalse((ROOT / ARCHIFY).exists())
        self.assertFalse((ROOT / 'optional-stack-skills/tools/archify').exists())
        self.assertFalse((ROOT / '.agents/scripts/sync-antigravity-global.sh').exists())
        for catalog in ['optional-stack-skills/catalog.json', '.agents/catalog.json']:
            items = json.loads((ROOT / catalog).read_text())['items']
            self.assertFalse(any(item['id'] == 'archify' for item in items))

    def test_active_instructions_do_not_route_to_retired_capture_owner(self):
        for path in (ROOT / '.agents').rglob('*.md'):
            if '.cache' in path.parts:
                continue
            with self.subTest(path=str(path.relative_to(ROOT))):
                self.assertNotIn('`user-guide-with-screenshots`', path.read_text())
                self.assertNotIn('user-guide-with-screenshots/SKILL.md', path.read_text())
                self.assertNotIn('100% Mandatory Real Screenshots', path.read_text())
                self.assertNotIn('If missing, mocked, or text-only:', path.read_text())

    def test_approved_transient_files_removed(self):
        for rel in ['.agents/.cache', '.agents/handoffs/2026-11-25-fast-lane-default.md',
                    '.specify/metrics/active 2.json']:
            self.assertFalse((ROOT / rel).exists(), rel)


if __name__ == '__main__':
    unittest.main()
