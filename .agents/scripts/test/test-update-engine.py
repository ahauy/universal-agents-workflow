"""Offline lifecycle safety regressions."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import subprocess

SPEC = importlib.util.spec_from_file_location('update_engine', Path(__file__).resolve().parents[1] / 'update-engine.py')
engine = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(engine)


class UpdateSafety(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.source, self.target = [Path(self.tmp.name) / n for n in ('source', 'target')]
        self.source.mkdir()
        self.target.mkdir()

    def put(self, root, rel, value='upstream'):
        path = root / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(value)
        return path

    def sync(self, ship=None):
        return engine.cmd_sync(self.target, self.source, '1', ship=ship, non_interactive=True)

    def test_unowned_identical_is_not_adopted(self):
        self.put(self.source, 'AGENTS.md')
        self.put(self.target, 'AGENTS.md')
        self.sync()
        data = engine.load_workflow_source(self.target)
        self.assertNotIn('AGENTS.md', data['manifest'])
        self.put(self.source, 'AGENTS.md', 'new')
        self.sync()
        self.assertEqual((self.target / 'AGENTS.md').read_text(), 'upstream')

    def test_pack_mapping_persists_and_updates(self):
        self.put(self.source, 'optional-stack-skills/pack/SKILL.md')
        self.sync(['optional-stack-skills/pack=.agents/skill-library/pack'])
        self.put(self.source, 'optional-stack-skills/pack/SKILL.md', 'new')
        self.sync()
        self.assertEqual((self.target / '.agents/skill-library/pack/SKILL.md').read_text(), 'new')

    def test_kept_hash_does_not_advance(self):
        self.put(self.source, 'AGENTS.md')
        self.sync()
        before = engine.load_workflow_source(self.target)['manifest']
        self.put(self.target, 'AGENTS.md', 'custom')
        self.put(self.source, 'AGENTS.md', 'new')
        self.sync()
        self.sync()
        self.assertEqual(engine.load_workflow_source(self.target)['manifest'], before)
        self.assertEqual((self.target / 'AGENTS.md').read_text(), 'custom')

    def test_corrupt_metadata_fails_before_copy(self):
        self.put(self.target, '.agents/workflow-source.json', '{')
        self.put(self.source, 'AGENTS.md')
        with self.assertRaises(ValueError): self.sync()
        self.assertFalse((self.target / 'AGENTS.md').exists())

    def test_escape_preflight_prevents_any_copy(self):
        self.put(self.source, 'AGENTS.md')
        with self.assertRaises(ValueError): self.sync(['AGENTS.md', 'AGENTS.md=../escape'])
        self.assertFalse((self.target / 'AGENTS.md').exists())

    def test_target_symlink_preflight(self):
        self.put(self.source, '.agents/a.txt')
        outside = self.source / 'outside'
        outside.mkdir()
        (self.target / '.agents').symlink_to(outside, target_is_directory=True)
        with self.assertRaises(ValueError): self.sync()
        self.assertFalse((outside / 'a.txt').exists())

    def test_distribution_exclusions(self):
        excluded = ['.agents/handoffs/session.md', '.agents/.cache/a', '.specify/features/a/spec.md', '.specify/metrics/task.json', 'adr/accepted.md', '.agents/harness-manifest.json']
        for name in excluded: self.put(self.source, name)
        self.put(self.source, 'adr/adr-template.md')
        self.sync()
        for name in excluded: self.assertFalse((self.target / name).exists(), name)
        self.assertTrue((self.target / 'adr/adr-template.md').exists())

    def test_missing_pack_retains_registry_and_reports_partial(self):
        self.put(self.source, 'optional-stack-skills/pack/SKILL.md')
        self.sync(['optional-stack-skills/pack=.agents/pack'])
        (self.source / 'optional-stack-skills/pack/SKILL.md').unlink()
        (self.source / 'optional-stack-skills/pack').rmdir()
        self.sync()
        data = engine.load_workflow_source(self.target)
        self.assertTrue(data['selectedPacks'])
        self.assertTrue(data['lastSync']['files']['unavailable'])
        self.assertEqual(data['lastSync']['status'], 'partial')
        self.assertEqual((self.target / '.agents/pack/SKILL.md').read_text(), 'upstream')

    def test_core_pack_collision_fails_before_copy(self):
        self.put(self.source, 'AGENTS.md')
        self.put(self.source, 'optional-stack-skills/pack')
        with self.assertRaises(ValueError):
            self.sync(['AGENTS.md', 'optional-stack-skills/pack=AGENTS.md'])
        self.assertFalse((self.target / 'AGENTS.md').exists())

    def test_missing_node_records_failed_phase_and_retries(self):
        self.put(self.source, '.agents/scripts/build-skill-index.mjs', 'console.log("source")')
        self.put(self.source, 'AGENTS.md')
        with patch.object(engine.shutil, 'which', return_value=None):
            self.assertEqual(self.sync(), 1)
        data = engine.load_workflow_source(self.target)
        self.assertEqual(data['lastSync']['status'], 'partial')
        self.assertEqual(data['lastSync']['phases'][0]['status'], 'failed')
        self.assertTrue((self.target / 'AGENTS.md').exists())

    def test_postprocessing_uses_source_in_order_and_reports_failure(self):
        for name in ('build-skill-index.mjs', 'sync-harnesses.mjs', 'install-hooks.js'):
            self.put(self.source, '.agents/scripts/' + name, 'source')
        self.put(self.target, '.agents/scripts/install-hooks.js', 'custom target code')
        commands = []
        def run(args, **kwargs):
            commands.append(args)
            return subprocess.CompletedProcess(args, 0 if '--validate-only' in args else 3, '', 'failed')
        with patch.object(engine.shutil, 'which', return_value='node'), patch.object(engine.subprocess, 'run', side_effect=run):
            self.assertEqual(self.sync(), 1)
        self.assertEqual([Path(c[1]).name for c in commands[3:]], ['build-skill-index.mjs', 'sync-harnesses.mjs', 'install-hooks.js'])
        self.assertTrue(all(str(self.source) in c[1] for c in commands))
        self.assertNotIn('--mode', commands[4])
        self.assertEqual((self.target / '.agents/scripts/install-hooks.js').read_text(), 'custom target code')

    def test_apply_same_version_retries_selected_only(self):
        self.put(self.source, 'version.json', '{"version":"1"}')
        self.put(self.source, 'optional-stack-skills/pack/SKILL.md')
        self.put(self.source, 'optional-stack-skills/other/SKILL.md')
        self.sync(['optional-stack-skills/pack=.agents/pack'])
        self.put(self.source, 'optional-stack-skills/pack/SKILL.md', 'new')
        def clone(args, **kwargs):
            import shutil
            shutil.copytree(self.source, args[-1], dirs_exist_ok=True)
            return subprocess.CompletedProcess(args, 0, '', '')
        with patch.object(engine, 'fetch_json', return_value={'version':'1'}), patch.object(engine.subprocess, 'run', side_effect=clone):
            self.assertEqual(engine.cmd_apply(self.target, non_interactive=True), 0)
        self.assertEqual((self.target / '.agents/pack/SKILL.md').read_text(), 'new')
        self.assertFalse((self.target / '.agents/other').exists())

    def test_invalid_derived_state_rejected_before_source_writes(self):
        self.put(self.source, 'AGENTS.md')
        self.put(self.source, '.agents/scripts/build-skill-index.mjs')
        rejected = subprocess.CompletedProcess([], 1, '', 'unsafe manifest')
        with patch.object(engine.shutil, 'which', return_value='node'), patch.object(engine.subprocess, 'run', return_value=rejected):
            with self.assertRaises(ValueError): self.sync()
        self.assertFalse((self.target / 'AGENTS.md').exists())
        self.assertFalse((self.target / '.agents/workflow-source.json').exists())

    def test_alias_does_not_reuse_source_only_baseline(self):
        source = self.put(self.source, 'optional-stack-skills/pack/SKILL.md')
        self.put(self.target, '.agents/pack/SKILL.md', 'user')
        self.put(self.target, '.agents/workflow-source.json', json.dumps({'manifest': {'optional-stack-skills/pack/SKILL.md': engine.sha256_file(source)}}))
        self.sync(['optional-stack-skills/pack=.agents/pack'])
        self.assertEqual((self.target / '.agents/pack/SKILL.md').read_text(), 'user')
        self.assertNotIn('optional-stack-skills/pack/SKILL.md=>.agents/pack/SKILL.md', engine.load_workflow_source(self.target)['fileHashes'])

    def test_unsafe_metadata_mapping_rejected_before_writes(self):
        self.put(self.source, 'AGENTS.md')
        self.put(self.target, '.agents/workflow-source.json', json.dumps({'fileHashes': {'AGENTS.md=>../outside': 'a' * 64}}))
        with self.assertRaises(ValueError): self.sync()
        self.assertFalse((self.target / 'AGENTS.md').exists())

    def test_invalid_source_metadata_rejected_before_writes(self):
        self.put(self.source, 'AGENTS.md')
        self.put(self.source, 'version.json', '[]')
        with self.assertRaises(ValueError): self.sync()
        self.assertFalse((self.target / 'AGENTS.md').exists())

    def test_directory_detection_marker_accepts_one_trailing_slash(self):
        (self.target / '.specify').mkdir()
        self.assertTrue(engine.state.detected(self.target, ['.specify/']))
        self.assertFalse(engine.state.detected(self.target, ['missing/']))
        for marker in ('../', '/', '.specify//'):
            with self.assertRaises(ValueError): engine.state.detected(self.target, [marker])

    def test_detection_content_and_nested_glob_markers(self):
        self.put(self.target, 'package.json', '{"dependencies":{"react":"1"}}')
        (self.target / 'ios/App.xcodeproj').mkdir(parents=True)
        self.assertTrue(engine.state.detected(self.target, ['package.json:"react"']))
        self.assertFalse(engine.state.detected(self.target, ['package.json:"vue"']))
        self.assertTrue(engine.state.detected(self.target, ['*.xcodeproj']))

    def test_detected_bundled_identity_does_not_register_pack(self):
        self.put(self.source, 'optional-stack-skills/catalog.json', json.dumps({'items': [{
            'id': 'bundled-tool', 'source_path': '.agents/skill-library/tool',
            'target_path': '.agents/skill-library/tool', 'detection_markers': ['.specify/']}]}))
        (self.target / '.specify').mkdir()
        packs, entries = engine.state.selections(self.source, self.target, {}, None, engine.INSTALL_SHIP_LIST, True, True)
        self.assertEqual(packs, [])
        self.assertEqual(entries, engine.INSTALL_SHIP_LIST)


if __name__ == '__main__': unittest.main(verbosity=2)
