"""Source cleanup and bundled tooling smoke tests (no application/network needed)."""
import json
from pathlib import Path
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[3]
GUIDE = Path('.agents/skill-library/engineering/user-guide-with-screenshots')
ARCHIFY = Path('.agents/skill-library/engineering/archify')


class DistributionCleanupTests(unittest.TestCase):
    def test_general_guide_remains_without_app_capture_scripts(self):
        scripts = ROOT / GUIDE / 'scripts'
        self.assertEqual([], list(scripts.glob('capture-*-screenshots.mjs')))
        self.assertFalse((scripts / 'verify-extension-live.mjs').exists())
        self.assertTrue((scripts / 'capture-screenshots.mjs').is_file())
        plan = json.loads((scripts / 'screenshot-plan.example.json').read_text())
        self.assertTrue(plan['steps'])
        self.assertTrue((ROOT / GUIDE / 'templates/user-guide-template.md').is_file())
        self.assertFalse((ROOT / GUIDE / 'templates/user-guide-example-card-creation.md').exists())
        subprocess.run(['node', '--check', str(scripts / 'capture-screenshots.mjs')], check=True)

    def test_removed_tools_are_not_distributed(self):
        self.assertFalse((ROOT / ARCHIFY).exists())
        self.assertFalse((ROOT / 'optional-stack-skills/tools/archify').exists())
        self.assertFalse((ROOT / '.agents/scripts/sync-antigravity-global.sh').exists())
        for catalog in ['optional-stack-skills/catalog.json', '.agents/catalog.json']:
            items = json.loads((ROOT / catalog).read_text())['items']
            self.assertFalse(any(item['id'] == 'archify' for item in items))

    def test_approved_transient_files_removed(self):
        for rel in ['.agents/.cache', '.agents/handoffs/2026-11-25-fast-lane-default.md',
                    '.specify/metrics/active 2.json']:
            self.assertFalse((ROOT / rel).exists(), rel)


if __name__ == '__main__':
    unittest.main()
