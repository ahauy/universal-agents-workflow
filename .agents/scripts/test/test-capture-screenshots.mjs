import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const script = fileURLToPath(new URL('../../skill-library/engineering/user-guide-with-screenshots/scripts/capture-screenshots.mjs', import.meta.url));

function capture(actions, failure = '', screenshot = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'uaw-capture-'));
  try {
    fs.copyFileSync(script, path.join(root, 'capture.mjs'));
    const moduleDir = path.join(root, 'node_modules/playwright');
    fs.mkdirSync(moduleDir, { recursive: true });
    fs.writeFileSync(path.join(moduleDir, 'package.json'), JSON.stringify({ type: 'module', exports: './index.js' }));
    fs.writeFileSync(path.join(moduleDir, 'index.js'), `
      import fs from 'node:fs';
      async function call(name) {
        fs.appendFileSync('events.jsonl', JSON.stringify(name) + '\\n');
        if (process.env.CAPTURE_FAILURE === name) throw new Error('fixture ' + name + ' failure');
      }
      const page = Object.fromEntries(['goto', 'click', 'fill', 'hover', 'waitForSelector', 'waitForTimeout', 'screenshot'].map(name => [name, () => call(name)]));
      page.locator = () => ({ screenshot: () => call('elementScreenshot') });
      export const chromium = { launch: async () => ({
        newContext: async () => { await call('newContext'); return { newPage: async () => page }; },
        close: () => call('close')
      }) };
    `);
    fs.writeFileSync(path.join(root, 'plan.json'), JSON.stringify({
      baseUrl: 'http://localhost:4321', outDir: 'images',
      steps: [{ name: 'step-01', url: '/example', actions, screenshot }],
    }));
    const result = spawnSync(process.execPath, ['capture.mjs', 'plan.json'], {
      cwd: root, encoding: 'utf8', env: { ...process.env, CAPTURE_FAILURE: failure },
    });
    const events = fs.readFileSync(path.join(root, 'events.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
    return { ...result, events };
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

for (const [label, actions, failure] of [
  ['failed action', [{ type: 'click', selector: '#missing' }], 'click'],
  ['unknown action', [{ type: 'invented' }], ''],
  ['navigation failure', [], 'goto'],
  ['capture failure', [], 'screenshot'],
  ['context failure', [], 'newContext'],
]) {
  test(`${label} exits nonzero and closes browser without success`, () => {
    const result = capture(actions, failure);
    assert.notEqual(result.status, 0);
    assert.equal(result.events.at(-1), 'close');
    assert.doesNotMatch(result.stdout, /Saved:|Done!/);
    if (failure !== 'screenshot') assert.ok(!result.events.includes('screenshot'));
  });
}

test('successful supported actions capture and close', () => {
  const result = capture(['click', 'fill', 'hover', 'waitForSelector', 'wait'].map(type => ({ type, selector: '#target', value: 'text', ms: 1 })));
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.events, ['newContext', 'goto', 'click', 'fill', 'hover', 'waitForSelector', 'waitForTimeout', 'screenshot', 'close']);
  assert.match(result.stdout, /Done!/);
});

test('element screenshot uses the requested selector', () => {
  const result = capture([], '', { selector: '#target' });
  assert.equal(result.status, 0, result.stderr);
  assert.ok(result.events.includes('elementScreenshot'));
  assert.equal(result.events.at(-1), 'close');
});
