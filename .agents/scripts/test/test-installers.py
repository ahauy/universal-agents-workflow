"""Offline installer regressions. Run with python3; pwsh cases need PowerShell."""
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[3]


class InstallerSafety(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.source, self.target, self.bin = [Path(self.tmp.name) / n for n in ("source", "target", "bin")]
        for p in (self.source / ".agents/scripts", self.target, self.bin):
            p.mkdir(parents=True)
        for name in ("install.sh", "install.ps1", ".agents/scripts/update-engine.py", ".agents/scripts/update-state.py", "version.json", "AGENTS.md"):
            shutil.copy2(ROOT / name, self.source / name)
        for name in ("dirname", "mkdir", "cp", "date", "grep", "sed", "head", "cat", "touch", "basename"):
            os.symlink(shutil.which(name), self.bin / name)
        self.env = {**os.environ, "PATH": str(self.bin)}
        self.saved = "user instructions\n"
        (self.target / "AGENTS.md").write_text(self.saved)

    def run_installer(self, powershell=False, update=False):
        if powershell:
            if not shutil.which("pwsh"):
                self.skipTest("pwsh is not installed")
            cmd = [shutil.which("pwsh"), "-NoProfile", "-File", str(self.source / "install.ps1"), "-Target", str(self.target), "-Mode", "team", "-Yes"]
            cmd += ["-Update"] if update else []
        else:
            cmd = ["/bin/bash", str(self.source / "install.sh"), "--target", str(self.target), "--mode", "team", "-y"]
            cmd += ["--update"] if update else []
        return subprocess.run(cmd, env=self.env, capture_output=True, text=True, timeout=30)

    def check_missing_python(self, powershell=False):
        result = self.run_installer(powershell)
        self.assertNotEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual((self.target / "AGENTS.md").read_text(), self.saved)
        self.assertFalse((self.target / ".agents").exists())

    def check_reinstall(self, powershell=False):
        os.symlink(sys.executable, self.bin / "python3")
        metadata = self.target / ".agents/workflow-source.json"
        metadata.parent.mkdir()
        metadata.write_text(json.dumps({"installedAt": "original-date", "manifest": {"custom": "a" * 64}}))
        (self.target / "CONTEXT.md").write_text("user domain terms\n")
        result = self.run_installer(powershell)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual((self.target / "AGENTS.md").read_text(), self.saved)
        self.assertEqual((self.target / "CONTEXT.md").read_text(), "user domain terms\n")
        data = json.loads(metadata.read_text(encoding="utf-8-sig"))
        self.assertEqual(data["manifest"]["custom"], "a" * 64)
        self.assertEqual(data["installedAt"], "original-date")
        self.assertEqual(data["version"], json.loads((ROOT / "version.json").read_text())["version"])

    def test_bash_fresh_install(self):
        (self.target / "AGENTS.md").unlink()
        os.symlink(sys.executable, self.bin / "python3")
        result = self.run_installer()
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual((self.target / "AGENTS.md").read_bytes(), (ROOT / "AGENTS.md").read_bytes())
        self.assertIn("Refresh status: partial", result.stdout)
        self.assertNotIn("derived refresh finished", result.stdout)
        self.assertNotIn("Source sync finished", result.stdout)
        self.assertNotIn("hoàn tất thành công", result.stdout)


    def test_download_distribution_does_not_ship_uaw_mcp(self):
        self.assertFalse((ROOT / "packages/mcp-server").exists())
        os.symlink(sys.executable, self.bin / "python3")
        for name in ("CONTEXT.md", ".agents/SKILLS.md", ".agents/skills/engineering/intake-classifier/SKILL.md", ".agents/skill-library/engineering/spec-validator/SKILL.md"):
            source = self.source / name
            source.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(ROOT / name, source)
        (self.target / "AGENTS.md").unlink()
        result = self.run_installer()
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        for name in ("CONTEXT.md", ".agents/SKILLS.md", ".agents/skills/engineering/intake-classifier/SKILL.md", ".agents/skill-library/engineering/spec-validator/SKILL.md"):
            self.assertEqual((self.target / name).read_bytes(), (ROOT / name).read_bytes())
        self.assertFalse((self.target / "packages/mcp-server").exists())

    def test_bash_missing_engine(self):
        os.symlink(sys.executable, self.bin / "python3")
        (self.source / ".agents/scripts/update-engine.py").unlink()
        self.check_missing_python()

    def test_bash_preserves_existing_stack_pack(self):
        os.symlink(sys.executable, self.bin / "python3")
        (self.source / "optional-stack-skills").mkdir()
        pack = {"source_path": "optional-stack-skills/pack", "target_path": ".agents/custom-pack", "name": "Pack", "id": "pack", "detection_markers": ["marker"]}
        (self.source / "optional-stack-skills/catalog.json").write_text(json.dumps({"items": [pack]}))
        (self.source / pack["source_path"]).mkdir()
        (self.source / pack["source_path"] / "SKILL.md").write_text("upstream")
        dest = self.target / pack["target_path"]
        dest.mkdir(parents=True)
        (dest / "SKILL.md").write_text("user skill")
        (self.target / "marker").touch()
        result = self.run_installer()
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual((dest / "SKILL.md").read_text(), "user skill")

    def test_bash_rejects_symlink_ignore_before_copy(self):
        os.symlink(sys.executable, self.bin / "python3")
        outside = self.source / "outside-ignore"
        outside.write_text("outside")
        (self.target / ".gitignore").symlink_to(outside)
        result = self.run_installer()
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(outside.read_text(), "outside")
        self.assertFalse((self.target / ".agents").exists())

    def check_failed_update(self, powershell=False):
        os.symlink(sys.executable, self.bin / "python3")
        (self.source / ".agents/scripts/update-engine.py").write_text("raise SystemExit(7)\n")
        result = self.run_installer(powershell, update=True)
        self.assertNotEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual((self.target / "AGENTS.md").read_text(), self.saved)
        self.assertFalse((self.target / ".agents").exists())

    def test_bash_missing_python(self): self.check_missing_python()
    def test_bash_reinstall(self): self.check_reinstall()
    def test_bash_failed_update(self): self.check_failed_update()
    def test_powershell_missing_python(self): self.check_missing_python(True)
    def test_powershell_reinstall(self): self.check_reinstall(True)
    def test_powershell_failed_update(self): self.check_failed_update(True)


class FullSourceInstaller(unittest.TestCase):
    def test_bash_detected_go_fresh_and_reinstall(self):
        if not shutil.which('node'):
            self.skipTest('Node.js required for full derived installer fixture')
        with tempfile.TemporaryDirectory(prefix='uaw-installer-go-') as name:
            target = Path(name)
            (target / 'go.mod').write_text('module example.com/local\n\ngo 1.23\n')
            (target / 'CONTEXT.md').write_text('custom domain\n')
            command = ['/bin/bash', str(ROOT / 'install.sh'), '--target', str(target),
                       '--mode', 'team', '--yes']
            selected = None
            for stage in ('fresh', 'reinstall'):
                with self.subTest(stage=stage):
                    result = subprocess.run(command, capture_output=True, text=True, timeout=120)
                    self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
                    data = json.loads((target / '.agents/workflow-source.json').read_text())
                    self.assertEqual([p['id'] for p in data['selectedPacks']],
                                     ['go-patterns', 'go-rules', 'go-depguard', 'go-agents'])
                    self.assertEqual(data['lastSync']['files']['unavailable'], [])
                    if selected is not None:
                        self.assertEqual(data['selectedPacks'], selected)
                    selected = data['selectedPacks']
                    self.assertEqual((target / 'CONTEXT.md').read_text(), 'custom domain\n')
                    self.assertTrue((target / '.agents/skill-library/engineering/go-patterns/SKILL.md').is_file())
                    self.assertIn('go-patterns', (target / '.agents/SKILLS.md').read_text())
                    self.assertTrue((target / '.claude/skills').is_dir())
                    self.assertTrue((target / '.claude/agents/go-reviewer.md').is_file())
                    self.assertTrue((target / '.claude/agents/code-reviewer.md').is_file())
                    skills = {p.parent.name for base in ('.agents/skills', '.agents/skill-library')
                              for p in (target / base).glob('*/*/SKILL.md')}
                    self.assertIn('wait-what', skills)
                    self.assertFalse(any(name.startswith('speckit-') for name in skills))
                    self.assertFalse(skills.intersection({'route', 'frontend-design', 'ui-taste-pro',
                                                         'ponytail-audit', 'ponytail-help', 'ponytail-gain',
                                                         'setup-workspace', 'writing-for-agents', 'ponytail-debt',
                                                         'user-guide-with-screenshots'}))
                    self.assertIn('user-guide', skills)
                    for template in ('operations-template.md', 'release-template.md'):
                        self.assertTrue((target / '.specify/templates' / template).is_file())
                    self.assertFalse((target / 'docs/OPERATIONS.md').exists())
                    self.assertFalse((target / 'docs/releases').exists())


if __name__ == "__main__":
    unittest.main(verbosity=2)
