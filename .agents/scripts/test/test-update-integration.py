"""Full local source fixture: update twice without losing project customizations."""
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[3]
PACK = 'optional-stack-skills/languages/go/go-patterns'
DEST = '.agents/skill-library/engineering/go-patterns'
RETIRED = ['speckit-' + name for name in ('specify', 'plan', 'tasks', 'analyze',
           'clarify', 'checklist', 'implement', 'converge', 'constitution', 'taskstoissues')]
RETIRED += ['ponytail-gain', 'ponytail-help', 'ponytail-audit', 'frontend-design', 'ui-taste-pro', 'route', 'setup-workspace',
            'writing-for-agents', 'ponytail-debt', 'user-guide-with-screenshots']


class FullUpdateIntegration(unittest.TestCase):
    def test_adapter_escape_rejected_before_any_engine_write(self):
        with tempfile.TemporaryDirectory(prefix='uaw-engine-preflight-') as tmp:
            source, target, outside = [Path(tmp) / name for name in ('source', 'target', 'outside')]
            (source / '.agents/scripts').mkdir(parents=True)
            target.mkdir()
            outside.mkdir()
            scripts = ['update-engine.py', 'update-state.py', 'derived-state.cjs',
                       'build-skill-index.mjs', 'sync-harnesses.mjs', 'install-hooks.js']
            for name in scripts:
                shutil.copy2(ROOT / '.agents/scripts' / name, source / '.agents/scripts' / name)
            (source / 'AGENTS.md').write_text('new source instructions')
            (target / 'sentinel.txt').write_text('unchanged')
            (target / '.cursor').symlink_to(outside, target_is_directory=True)
            result = subprocess.run([sys.executable, str(source / '.agents/scripts/update-engine.py'),
                                     '--sync', '--source', str(source), '--target', str(target), '--yes'],
                                    capture_output=True, text=True, timeout=60)
            self.assertNotEqual(0, result.returncode)
            self.assertIn('Symlink path rejected', result.stdout + result.stderr)
            self.assertEqual({'.cursor', 'sentinel.txt'}, {p.name for p in target.iterdir()})
            self.assertEqual('unchanged', (target / 'sentinel.txt').read_text())
            self.assertEqual([], list(outside.iterdir()))

    def test_repeated_local_updates_preserve_custom_data_and_ship_only_framework(self):
        with tempfile.TemporaryDirectory(prefix='uaw-full-update-') as tmp:
            source, target = Path(tmp) / 'source', Path(tmp) / 'target'
            source.mkdir()
            target.mkdir()
            for name in ['.agents', '.specify', 'optional-stack-skills', 'adr', 'docs/architecture']:
                shutil.copytree(ROOT / name, source / name,
                                ignore=shutil.ignore_patterns('__pycache__', 'node_modules', '.cache'))
            for name in ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', 'CONTEXT.md',
                         '.cursorrules', '.windsurfrules', 'version.json']:
                shutil.copy2(ROOT / name, source / name)
            (source / '.github').mkdir()
            shutil.copy2(ROOT / '.github/copilot-instructions.md', source / '.github/copilot-instructions.md')
            protected = {
                'CONTEXT.md': 'custom domain language\n',
                'docs/OPERATIONS.md': '# Local operations\nCustom deployment and recovery procedure.\n',
                'docs/releases/1.2.3.md': '# Local release\nCandidate: user-sha\nKeep owner evidence.\n',
                'docs/user-guides/local-guide.md': '# Custom guide\n\n![Existing image](images/local/step.png)\n',
                '.agents/skill-library/engineering/user-guide-with-screenshots/scripts/capture-screenshots.mjs': 'custom legacy capture code\n',
                '.env': 'LOCAL_FIXTURE=unchanged\n',
                '.specify/features/custom/baseline.md': 'SIGNED-OFF custom baseline\n',
                'adr/accepted.md': 'accepted project decision\n',
                '.agents/.cache/local.txt': 'keep local cache data\n',
                '.agents/skill-library/engineering/archify/SKILL.md': 'user customized legacy diagram skill\n',
                '.agents/scripts/sync-antigravity-global.sh': 'user legacy helper customization\n',
                '.agents/skill-library/engineering/user-guide-with-screenshots/scripts/capture-streak-screenshots.mjs': 'custom legacy screenshot script\n',
                '.agents/skill-library/custom/SKILL.md': '---\nname: custom\ndescription: Local skill\n---\nCustom content.\n',
            }
            for rel, text in protected.items():
                file = target / rel
                file.parent.mkdir(parents=True, exist_ok=True)
                file.write_text(text)
            image = target / 'docs/user-guides/images/local/step.png'
            image.parent.mkdir(parents=True, exist_ok=True)
            image_bytes = b'\x89PNG\r\n\x1a\ncustom image bytes'
            image.write_bytes(image_bytes)
            engine = source / '.agents/scripts/update-engine.py'

            def sync(extra=False):
                command = [sys.executable, str(engine), '--sync', '--source', str(source),
                           '--target', str(target), '--yes']
                if extra:
                    command += ['--extra-ship', PACK + '=' + DEST]
                result = subprocess.run(command, capture_output=True, text=True, timeout=120)
                self.assertEqual(0, result.returncode, result.stdout[-5000:] + result.stderr[-3000:])
                return json.loads((target / '.agents/workflow-source.json').read_text())

            removed_upstream = '.agents/rules/removed-upstream.md'
            (source / removed_upstream).write_text('last installed content\n')
            # Install an older inventory first, then retire its source trees.
            retired_paths = []
            for name in RETIRED:
                category = 'productivity' if name in ('route', 'setup-workspace') else 'engineering'
                rel = f'.agents/skill-library/{category}/{name}/SKILL.md'
                file = source / rel
                file.parent.mkdir(parents=True, exist_ok=True)
                file.write_text(f'---\nname: {name}\ndescription: Legacy fixture\n---\nOriginal.\n')
                retired_paths.append(rel)
            first = sync(extra=True)
            for number, rel in enumerate(retired_paths):
                file = target / rel
                self.assertTrue(file.is_file(), rel)
                # Both unchanged owned copies and edited copies must survive retirement.
                if number % 2:
                    file.write_text(file.read_text() + '\nCustom legacy behavior.\n')
                protected[rel] = file.read_text()
                shutil.rmtree((source / rel).parent)
            (source / removed_upstream).unlink()
            protected[removed_upstream] = 'last installed content\n'
            pack_file = target / DEST / 'SKILL.md'
            self.assertTrue(pack_file.is_file())
            pack_file.write_text(pack_file.read_text() + '\nUser customization.\n')
            protected[DEST + '/SKILL.md'] = pack_file.read_text()
            retained = '.agents/skill-library/productivity/wait-what/SKILL.md'
            retained_file = target / retained
            retained_file.write_text(retained_file.read_text() + '\nCustom explanation conventions.\n')
            protected[retained] = retained_file.read_text()
            guide = '.agents/skill-library/engineering/user-guide/SKILL.md'
            guide_file = target / guide
            guide_file.write_text(guide_file.read_text() + '\nCustom guide policy.\n')
            protected[guide] = guide_file.read_text()
            template = '.specify/templates/release-template.md'
            template_file = target / template
            template_file.write_text(template_file.read_text() + '\nCustom release checklist.\n')
            protected[template] = template_file.read_text()
            adapter = '.claude/agents/code-reviewer.md'
            self.assertTrue((target / adapter).is_file())
            (target / adapter).write_text((target / adapter).read_text() + '\nUser adapter customization.\n')
            protected[adapter] = (target / adapter).read_text()
            settings = target / '.claude/settings.json'
            data = json.loads(settings.read_text())
            data['userFixtureSetting'] = {'keep': True}
            event = next(iter(data['hooks']))
            data['hooks'][event][0]['hooks'][0]['command'] += ' --user-custom-fixture'
            edited_group = data['hooks'][event][0]
            custom_group = {'matcher': 'Fixture', 'hooks': [{'type': 'command', 'command': 'echo user-fixture'}]}
            data['hooks'][event].append(custom_group)
            index = target / '.agents/SKILLS.md'
            index.write_text(index.read_text() + '\nUser index note.\n')
            protected['.agents/SKILLS.md'] = index.read_text()
            settings.write_text(json.dumps(data, indent=2))
            safe_file = '.agents/rules/integration-fixture.md'
            for revision in (2, 3):
                (source / PACK / 'SKILL.md').write_text('---\nname: go-patterns\ndescription: Go\n---\nUpstream revision ' + str(revision))
                (source / retained).write_text((source / retained).read_text() + '\nUpstream revision.\n')
                (source / guide).write_text((source / guide).read_text() + '\nUpstream revision.\n')
                (source / template).write_text((source / template).read_text() + '\nUpstream release template revision.\n')
                (source / safe_file).write_text('safe revision ' + str(revision))
                (source / '.agents/agents/code-reviewer.md').write_text(
                    (source / '.agents/agents/code-reviewer.md').read_text() + '\nUpstream change.\n')
                current = sync()
                self.assertEqual('safe revision ' + str(revision), (target / safe_file).read_text())
                self.assertEqual(image_bytes, image.read_bytes())
                for rel, text in protected.items():
                    self.assertEqual(text, (target / rel).read_text(), rel)
                updated_settings = json.loads(settings.read_text())
                self.assertEqual({'keep': True}, updated_settings['userFixtureSetting'])
                self.assertIn(edited_group, updated_settings['hooks'][event])
                self.assertEqual(1, updated_settings['hooks'][event].count(custom_group))
                self.assertEqual(first['selectedPacks'], current['selectedPacks'])
                key = PACK + '/SKILL.md=>' + DEST + '/SKILL.md'
                self.assertEqual(first['fileHashes'][key], current['fileHashes'][key])
                self.assertEqual(first['fileHashes'][retained], current['fileHashes'][retained])
                self.assertEqual(first['fileHashes'][guide], current['fileHashes'][guide])
                self.assertEqual(first['fileHashes'][template], current['fileHashes'][template])
                for rel in retired_paths:
                    self.assertEqual(first['fileHashes'][rel], current['fileHashes'][rel], rel)
            for rel in ['.agents/handoffs', '.specify/metrics', 'adr/0003-download-only-distribution.md',
                        '.specify/features/ba-first-workflow', '.agents/skill-library/engineering/archify/examples/web-app-rendered.html']:
                self.assertFalse((target / rel).exists(), rel)
            self.assertFalse((target / '.agents/skill-library/engineering/rust-patterns').exists())
            self.assertTrue((target / '.specify/templates/spec-template.md').exists())



if __name__ == '__main__':
    unittest.main()
