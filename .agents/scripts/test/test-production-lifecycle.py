"""Source contracts for the release protocol; no claim of executing deployment."""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[3]
PROTOCOL = ROOT / '.agents/docs/production-lifecycle.md'
TEMPLATES = [ROOT / '.specify/templates' / name for name in
             ('operations-template.md', 'release-template.md')]


class ProductionLifecycleContracts(unittest.TestCase):
    def test_protocol_has_distinct_outcomes_and_routed_sections(self):
        text = PROTOCOL.read_text()
        for state in ('DEV_COMPLETE', 'RELEASE_READY', 'PRODUCTION_VERIFIED', 'BLOCKED',
                      'FAILED', 'ROLLED_BACK'):
            self.assertIn(state, text)
        headings = set(re.findall(r'(?m)^## (.+)$', text))
        for section in ('Preparation', 'Readiness', 'Deployment', 'Verification', 'Recovery'):
            self.assertTrue(any(section.lower() == h.lower() for h in headings), section)

    def test_templates_start_without_claimed_execution_success(self):
        for path in TEMPLATES:
            with self.subTest(path=path.name):
                text = path.read_text()
                self.assertNotRegex(text, r'(?m)^\s*- \[x\]')
                self.assertNotRegex(text, r'(?m)^Status:\s*PRODUCTION_VERIFIED\s*$')
                self.assertRegex(text, r'<[^>]+>', 'Unresolved real-product inputs need placeholders')
                self.assertNotRegex(text, r'(?i)(?:password|api_key|token)\s*=\s*[A-Za-z0-9]{12,}')

    def test_concrete_protocol_and_template_links_resolve(self):
        paths = [PROTOCOL, *TEMPLATES]
        for path in paths:
            text = re.sub(r'```.*?```', '', path.read_text(), flags=re.S)
            for href in re.findall(r'\[[^\]]*\]\(([^)]+)\)', text):
                target = href.split('#', 1)[0]
                if not target or '://' in target or re.search(r'[<>* ]', target):
                    continue
                with self.subTest(path=str(path), link=href):
                    self.assertTrue((path.parent / target).exists())

    def test_core_and_verification_expose_all_three_outcomes(self):
        for name in ('AGENTS.md', '.agents/skill-library/engineering/verification-before-completion/SKILL.md'):
            text = (ROOT / name).read_text()
            for state in ('DEV_COMPLETE', 'RELEASE_READY', 'PRODUCTION_VERIFIED'):
                with self.subTest(path=name, state=state):
                    self.assertIn(state, text)


if __name__ == '__main__':
    unittest.main()
