"""Validated local update state and explicit source-to-destination mappings."""
import fnmatch
import json
import os
from pathlib import Path, PurePosixPath
import re
import tempfile


def relative(value):
    if not isinstance(value, str) or not value or '\\' in value or ':' in value or '\0' in value:
        raise ValueError('Expected a normalized relative path')
    path = PurePosixPath(value)
    if path.is_absolute() or any(p in ('', '.', '..') for p in value.split('/')):
        raise ValueError('Unsafe relative path: ' + value)
    return value


def contained(root, rel):
    relative(rel)
    path = root / rel
    if not path.resolve().is_relative_to(root.resolve()):
        raise ValueError('Path escapes root: ' + rel)
    # Even an in-root symlink is not evidence of ownership of its target.
    if any(p.is_symlink() for p in [path, *path.parents] if p != root and p.is_relative_to(root)):
        raise ValueError('Symlink mapping is not supported: ' + rel)
    return path


def excluded(rel):
    prefixes = ('.agents/handoffs/', '.agents/.cache/', '.specify/features/', '.specify/metrics/')
    names = {'workflow-source.json', 'harness-manifest.json', 'derived-state-index.json', 'derived-state-hooks.json'}
    return (rel.startswith(prefixes) or Path(rel).name in names
            or (rel.startswith('adr/') and rel != 'adr/adr-template.md'))


def load(target):
    path = contained(target, '.agents/workflow-source.json')
    if not path.exists():
        return {}
    try:
        data = json.loads(path.read_text(encoding='utf-8-sig'))
    except (ValueError, OSError) as exc:
        raise ValueError('Invalid workflow-source.json') from exc
    if not isinstance(data, dict) or data.get('schemaVersion', 2) != 2:
        raise ValueError('Unsupported workflow-source schema')
    for field in ('manifest', 'fileHashes'):
        hashes = data.get(field, {})
        if not isinstance(hashes, dict):
            raise ValueError('Invalid hash manifest')
        for key, value in hashes.items():
            if not isinstance(key, str) or not isinstance(value, str) or not re.fullmatch('[a-f0-9]{64}', value):
                raise ValueError('Invalid manifest hash')
            parts = key.split('=>')
            if len(parts) > 2: raise ValueError('Invalid mapping hash identity')
            for part in parts: relative(part)
            contained(target, parts[-1])
    protected = data.get('protectedPaths', [])
    if not isinstance(protected, list) or any(not isinstance(p, str) for p in protected):
        raise ValueError('Invalid protectedPaths')
    validate_packs(data.get('selectedPacks', []))
    for pack in data.get('selectedPacks', []): contained(target, pack['target_path'])
    return data


def save(target, data):
    path = contained(target, '.agents/workflow-source.json')
    path.parent.mkdir(parents=True, exist_ok=True)
    name = None
    try:
        with tempfile.NamedTemporaryFile(mode='w', encoding='utf-8', dir=path.parent, delete=False) as stream:
            name = stream.name
            json.dump(data, stream, indent=2, ensure_ascii=False)
            stream.write('\n')
        os.replace(name, path)
    finally:
        if name and os.path.exists(name): os.unlink(name)


def validate_packs(packs):
    if not isinstance(packs, list): raise ValueError('Invalid selectedPacks')
    ids, destinations = set(), []
    for pack in packs:
        if not isinstance(pack, dict) or not isinstance(pack.get('id'), str) or not pack['id']:
            raise ValueError('Invalid pack record')
        src, dest = relative(pack.get('source_path')), relative(pack.get('target_path'))
        if pack['id'] in ids:
            raise ValueError('Colliding selected packs')
        ids.add(pack['id'])
        destinations.append(dest)
    return packs


def catalog(source):
    path = contained(source, 'optional-stack-skills/catalog.json')
    if not path.exists(): return []
    data = json.loads(path.read_text())
    if not isinstance(data, dict) or not isinstance(data.get('items'), list):
        raise ValueError('Invalid pack catalog')
    items = [p for p in data['items'] if p.get('target_type') != 'mcp']
    validate_packs(items)
    return items


def bundled_identity(pack, defaults):
    source, target = pack['source_path'], pack['target_path']
    return source == target and any(source == entry or source.startswith(entry + '/') for entry in defaults)


def selections(source, target, data, ship, defaults, detect=False, yes=False, prompt=None):
    packs = list(data.get('selectedPacks', []))
    available = catalog(source)
    if detect:
        matches = [p for p in available if detected(target, p.get('detection_markers', []))]
        if matches and (yes or prompt('Install detected packs [Y/n]? ').lower() not in ('n', 'no')):
            known = {p['id'] for p in packs}
            packs += [{k: p[k] for k in ('id', 'source_path', 'target_path')} for p in matches if p['id'] not in known and not p.get('already_in_core') and not p.get('included_in_core') and not bundled_identity(p, defaults)]
    for entry in ship or []:
        if entry in defaults: continue
        src, sep, dest = entry.partition('=')
        record = next((p for p in available if p['source_path'] == src and p['target_path'] == (dest if sep else src)), None)
        pack = {k: record[k] for k in ('id', 'source_path', 'target_path')} if record else {'id': 'explicit:' + entry, 'source_path': src, 'target_path': dest if sep else src}
        if not bundled_identity(pack, defaults) and pack not in packs: packs.append(pack)
    validate_packs(packs)
    entries = list(defaults if ship is None else [e for e in ship if e in defaults])
    entries += [p['source_path'] + '=' + p['target_path'] for p in packs]
    return packs, entries


def detected(target, markers):
    for marker in markers:
        if not isinstance(marker, str): raise ValueError('Invalid detection marker')
        name, sep, word = marker.partition(':')
        if not sep and name.endswith('/'):
            name = name[:-1]
        relative(name)
        path = contained(target, name)
        if sep and path.is_file() and word.strip().strip('\"\'') in path.read_text(errors='replace'): return True
        if not sep and path.exists(): return True
        if not sep and '*' in name:
            for root, dirs, files in os.walk(target, followlinks=False):
                dirs[:] = [d for d in dirs if d not in {'.git', '.agents', 'node_modules', 'DerivedData', '.build'} and not (Path(root) / d).is_symlink()]
                if any(fnmatch.fnmatch(entry, name) for entry in dirs + files if not (Path(root) / entry).is_symlink()):
                    return True
    return False
