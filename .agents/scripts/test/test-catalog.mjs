import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const root=process.cwd();
const authority=path.join(root,'optional-stack-skills/catalog.json');
const runtime=path.join(root,'.agents/catalog.json');
test('runtime catalog is byte-identical to its authority',()=>assert.ok(fs.readFileSync(runtime).equals(fs.readFileSync(authority))));
test('removed diagram tool has no selectable catalog owner',()=>{
 const items=JSON.parse(fs.readFileSync(authority)).items;
 assert.equal(items.some(item=>item.id==='archify'),false);
});
test('catalog maintenance command detects stale mirror and regenerates exact bytes',t=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'uaw-catalog-')); t.after(()=>fs.rmSync(temp,{recursive:true,force:true}));
 fs.mkdirSync(path.join(temp,'optional-stack-skills'),{recursive:true}); fs.writeFileSync(path.join(temp,'optional-stack-skills/catalog.json'),'{"items":[]}\n');
 fs.mkdirSync(path.join(temp,'.agents')); fs.writeFileSync(path.join(temp,'.agents/catalog.json'),'custom');
 const run=flag=>spawnSync(process.execPath,[path.join(root,'.agents/scripts/build-skill-index.mjs'),'--root',temp,flag],{encoding:'utf8'});
 assert.equal(run('--catalog-check').status,1); assert.equal(run('--catalog-write').status,0); assert.equal(run('--catalog-check').status,0);
 assert.equal(fs.readFileSync(path.join(temp,'.agents/catalog.json'),'utf8'),'{"items":[]}\n');
});
