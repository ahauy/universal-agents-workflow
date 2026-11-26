import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const scripts = path.resolve('.agents/scripts');
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'uaw-derived-'));
  t.after(() => fs.rmSync(root, {recursive:true, force:true}));
  put(root,'AGENTS.md','project');
  put(root,'.agents/skills/engineering/demo/SKILL.md','---\nname: demo\ndescription: Demo\n---\nv1');
  return root;
}
function put(root, rel, text) { fs.mkdirSync(path.dirname(path.join(root,rel)),{recursive:true}); fs.writeFileSync(path.join(root,rel),text); }
function run(script,root,...args) { return spawnSync(process.execPath,[path.join(scripts,script),'--target',root,...args],{encoding:'utf8'}); }
test('copy refresh preserves modified generated file and custom descendants twice',t=>{
 const root=fixture(t); assert.equal(run('sync-harnesses.mjs',root,'--harnesses','claude','--mode','copy').status,0);
 const skill='.claude/skills/demo/SKILL.md'; put(root,skill,'custom'); put(root,'.claude/skills/demo/custom.txt','mine');
 const pointer=fs.readFileSync(path.join(root,'CLAUDE.md'),'utf8')+'\ncustom'; put(root,'CLAUDE.md',pointer);
 const before=JSON.parse(fs.readFileSync(path.join(root,'.agents/harness-manifest.json')));
 for(const version of ['v2','v3']) { put(root,'.agents/skills/engineering/demo/SKILL.md',version); assert.equal(run('sync-harnesses.mjs',root,'--harnesses','claude','--mode','copy').status,0); }
 assert.equal(fs.readFileSync(path.join(root,skill),'utf8'),'custom'); assert.equal(fs.readFileSync(path.join(root,'CLAUDE.md'),'utf8'),pointer);
 assert.equal(fs.readFileSync(path.join(root,'.claude/skills/demo/custom.txt'),'utf8'),'mine');
 const after=JSON.parse(fs.readFileSync(path.join(root,'.agents/harness-manifest.json'))); assert.ok(before.outputs); assert.deepEqual(after.outputs[skill],before.outputs[skill]);
});
test('copy refresh advances verified files and clean retains unowned descendants',t=>{
 const root=fixture(t); run('sync-harnesses.mjs',root,'--harnesses','claude','--mode','copy');
 put(root,'.agents/skills/engineering/demo/SKILL.md','v2'); put(root,'.claude/skills/demo/custom.txt','mine');
 assert.equal(run('sync-harnesses.mjs',root,'--harnesses','claude','--mode','copy').status,0);
 assert.equal(fs.readFileSync(path.join(root,'.claude/skills/demo/SKILL.md'),'utf8'),'v2');
 assert.equal(run('sync-harnesses.mjs',root,'--clean').status,0); assert.equal(fs.readFileSync(path.join(root,'.claude/skills/demo/custom.txt'),'utf8'),'mine');
});
test('legacy marker and manifest grant no ownership; unsafe manifest fails before writes',t=>{
 const root=fixture(t); const custom='<!-- universal-agents-workflow sync-harnesses -->\ncustom'; put(root,'CLAUDE.md',custom);
 put(root,'.agents/harness-manifest.json',JSON.stringify({version:1,generated:['CLAUDE.md']}));
 run('sync-harnesses.mjs',root,'--clean'); assert.equal(fs.readFileSync(path.join(root,'CLAUDE.md'),'utf8'),custom);
 put(root,'.agents/harness-manifest.json',JSON.stringify({version:1,generated:['../outside']}));
 assert.notEqual(run('sync-harnesses.mjs',root,'--harnesses','claude').status,0); assert.equal(fs.existsSync(path.join(root,'.claude')),false);
});
test('retargeted and broken links survive clean and repeated refresh',t=>{
 const root=fixture(t); run('sync-harnesses.mjs',root,'--harnesses','claude'); const link=path.join(root,'.claude/skills/demo');
 fs.unlinkSync(link); fs.symlinkSync('custom-missing',link);
 for(let i=0;i<2;i++) run('sync-harnesses.mjs',root,'--harnesses','claude');
 run('sync-harnesses.mjs',root,'--clean'); assert.equal(fs.readlinkSync(link),'custom-missing');
});
test('hooks preserve settings and edited generated groups over two upgrades',t=>{
 const root=fixture(t); const source=command=>JSON.stringify({workflow:{PreToolUse:[{matcher:'run_command',command}]}});
 put(root,'.agents/hooks.json',source('node scripts/hooks/first.js')); put(root,'.claude/settings.json',JSON.stringify({theme:'mine',hooks:{Stop:[{hooks:[{type:'command',command:'my-hook'}]}]}}));
 assert.equal(run('install-hooks.js',root,'--harness','claude-code').status,0);
 const file=path.join(root,'.claude/settings.json'); const settings=JSON.parse(fs.readFileSync(file)); assert.ok(settings.hooks.PreToolUse);
 settings.hooks.PreToolUse[0].hooks[0].command+=' custom'; fs.writeFileSync(file,JSON.stringify(settings));
 for(const v of ['second','third']) { put(root,'.agents/hooks.json',source(`node scripts/hooks/${v}.js`)); assert.equal(run('install-hooks.js',root,'--harness','claude-code').status,0); }
 const after=JSON.parse(fs.readFileSync(file)); assert.equal(after.theme,'mine'); assert.deepEqual(after.hooks,settings.hooks);
});
test('index prune preserves differing and equivalent unowned same-name trees',t=>{
 const root=fixture(t); put(root,'.agents/skill-library/engineering/demo/SKILL.md','cold');
 const r=spawnSync(process.execPath,[path.join(scripts,'build-skill-index.mjs'),'--root',root,'--prune'],{encoding:'utf8'});
 assert.equal(fs.readFileSync(path.join(root,'.agents/skills/engineering/demo/SKILL.md'),'utf8').includes('v1'),true);
 assert.notEqual(r.status,null);
});
function indexFixture(t) {
 const root=fixture(t);
 fs.cpSync(path.resolve('.agents/skill-library'),path.join(root,'.agents/skill-library'),{recursive:true});
 return root;
}
function index(root,...args) {return spawnSync(process.execPath,[path.join(scripts,'build-skill-index.mjs'),'--root',root,...args],{encoding:'utf8'});}
test('index preserves custom content and does not adopt its hash twice',t=>{
 const root=indexFixture(t); put(root,'.agents/SKILLS.md','custom index');
 for(let i=0;i<2;i++) assert.equal(index(root).status,0);
 assert.equal(fs.readFileSync(path.join(root,'.agents/SKILLS.md'),'utf8'),'custom index');
 assert.equal(fs.existsSync(path.join(root,'.agents/derived-state-index.json')),false);
});
test('index refreshes recorded output and registry-proven initial output',async t=>{
 const {createHash}=await import('node:crypto');
 const root=indexFixture(t); put(root,'.agents/SKILLS.md','copied framework index');
 const digest=createHash('sha256').update('copied framework index').digest('hex');
 put(root,'.agents/workflow-source.json',JSON.stringify({schemaVersion:2,fileHashes:{'.agents/SKILLS.md':digest}}));
 assert.equal(index(root).status,0); const first=fs.readFileSync(path.join(root,'.agents/SKILLS.md'),'utf8'); assert.match(first,/Skill Catalog/);
 put(root,'.agents/skill-library/custom/SKILL.md','---\nname: custom\ndescription: Direct custom skill\n---\n');
 assert.equal(index(root).status,0); assert.match(fs.readFileSync(path.join(root,'.agents/SKILLS.md'),'utf8'),/Direct custom skill/);
});
test('only fully owned equivalent hot trees can be pruned; custom descendants prevent prune',async t=>{
 const {createHash}=await import('node:crypto'); const root=indexFixture(t);
 put(root,'.agents/skill-library/engineering/wizard/fixture-resource.txt','upstream resource');
 const cold=fs.readFileSync(path.join(root,'.agents/skill-library/engineering/wizard/SKILL.md'),'utf8');
 const rel='.agents/skills/engineering/wizard/SKILL.md'; put(root,rel,cold);
 put(root,'.agents/workflow-source.json',JSON.stringify({fileHashes:{[rel]:createHash('sha256').update(cold).digest('hex')}}));
 // A skill with extra upstream resources is not equivalent to a one-file hot tree.
 assert.equal(index(root,'--prune').status,0); assert.equal(fs.existsSync(path.join(root,rel)),true);
 fs.cpSync(path.join(root,'.agents/skill-library/engineering/wizard'),path.join(root,'.agents/skills/engineering/wizard'),{recursive:true});
 const all={}; const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).forEach(entry=>{const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else all[path.relative(root,full)]=createHash('sha256').update(fs.readFileSync(full)).digest('hex');}); walk(path.join(root,'.agents/skills/engineering/wizard'));
 put(root,'.agents/workflow-source.json',JSON.stringify({fileHashes:all}));
 put(root,'.agents/skills/engineering/wizard/custom.txt','mine');
 assert.equal(index(root,'--prune').status,0); assert.equal(fs.existsSync(path.join(root,rel)),true);
 fs.unlinkSync(path.join(root,'.agents/skills/engineering/wizard/custom.txt'));
 assert.equal(index(root,'--prune').status,0); assert.equal(fs.existsSync(path.join(root,rel)),false);
});
test('invalid state and symlink ancestor fail validation without writes',t=>{
 const root=fixture(t);
 for(const state of ['{}','{broken',JSON.stringify({version:2,outputs:{'CLAUDE.md':{kind:'file',source:'AGENTS.md',hash:'bad'}}})]) {
  put(root,'.agents/harness-manifest.json',state);
  assert.notEqual(run('sync-harnesses.mjs',root,'--validate-only').status,0);
  assert.equal(fs.existsSync(path.join(root,'CLAUDE.md')),false);
 }
 fs.unlinkSync(path.join(root,'.agents/harness-manifest.json'));
 const outside=fs.mkdtempSync(path.join(os.tmpdir(),'uaw-outside-')); t.after(()=>fs.rmSync(outside,{recursive:true,force:true}));
 fs.symlinkSync(outside,path.join(root,'.claude'));
 assert.notEqual(run('sync-harnesses.mjs',root,'--harnesses','claude').status,0);
 assert.deepEqual(fs.readdirSync(outside),[]);
});
test('adapter validate-only checks planned output parents before source sync',t=>{
 const root=fixture(t); const outside=fs.mkdtempSync(path.join(os.tmpdir(),'uaw-preflight-')); t.after(()=>fs.rmSync(outside,{recursive:true,force:true}));
 fs.symlinkSync(outside,path.join(root,'.cursor'));
 const before=fs.readFileSync(path.join(root,'AGENTS.md'),'utf8');
 const result=run('sync-harnesses.mjs',root,'--validate-only');
 assert.notEqual(result.status,0,result.stdout); assert.match(result.stderr,/Symlink path rejected/);
 assert.equal(fs.readFileSync(path.join(root,'AGENTS.md'),'utf8'),before);
 assert.equal(fs.existsSync(path.join(root,'.agents/harness-manifest.json')),false); assert.deepEqual(fs.readdirSync(outside),[]);
});
test('adapter and index registry paths stay POSIX when native joins use Windows syntax',t=>{
 const root=indexFixture(t); const toolRoot=fs.mkdtempSync(path.join(os.tmpdir(),'uaw-winpaths-')); t.after(()=>fs.rmSync(toolRoot,{recursive:true,force:true}));
 fs.copyFileSync(path.join(scripts,'derived-state.cjs'),path.join(toolRoot,'derived-state.cjs'));
 for(const script of ['sync-harnesses.mjs','build-skill-index.mjs']) {
  // Simulate Windows native joins in the entry point; helper filesystem joins stay native to the test host.
  const code=fs.readFileSync(path.join(scripts,script),'utf8').replaceAll('path.join(', 'path.win32.join(');
  fs.writeFileSync(path.join(toolRoot,script),code);
 }
 const adapter=spawnSync(process.execPath,[path.join(toolRoot,'sync-harnesses.mjs'),'--target',root,'--harnesses','claude','--mode','copy'],{encoding:'utf8'});
 assert.equal(adapter.status,0,adapter.stderr);
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'.agents/harness-manifest.json')));
 assert.ok(manifest.outputs['.claude/skills/demo/SKILL.md']);
 assert.ok(Object.entries(manifest.outputs).every(([key,value])=>!key.includes('\\')&&!value.source.includes('\\')));
 const built=spawnSync(process.execPath,[path.join(toolRoot,'build-skill-index.mjs'),'--root',root],{encoding:'utf8'});
 assert.equal(built.status,0,built.stderr);
 assert.match(fs.readFileSync(path.join(root,'.agents/SKILLS.md'),'utf8'),/\.agents\/skill-library\/engineering\/wizard\/SKILL\.md/);
});
