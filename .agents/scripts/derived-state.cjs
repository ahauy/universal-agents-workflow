'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const object = value => value && typeof value === 'object' && !Array.isArray(value);
function relative(rel) {
  if (typeof rel !== 'string' || !rel || rel.includes('\\') || rel.includes('\0') || path.posix.isAbsolute(rel)
      || /^[A-Za-z]:/.test(rel) || path.posix.normalize(rel) !== rel || rel.split('/').includes('..') || rel === '.') {
    throw new Error(`Unsafe relative path: ${rel}`);
  }
  return rel;
}
function resolve(root, rel, leaf = true) {
  relative(rel);
  const parts = rel.split('/');
  let current = root;
  for (let i = 0; i < parts.length - (leaf ? 0 : 1); i++) {
    current = path.join(current, parts[i]);
    if (fs.existsSync(current) || exists(current)) {
      if (fs.lstatSync(current).isSymbolicLink()) throw new Error(`Symlink path rejected: ${rel}`);
    }
  }
  return path.join(root, rel);
}
function exists(file) { try { fs.lstatSync(file); return true; } catch (error) { if (error.code === 'ENOENT') return false; throw error; } }
function atomic(file, content) {
  fs.mkdirSync(path.dirname(file), {recursive:true});
  const temp = `${file}.${process.pid}.${crypto.randomBytes(4).toString('hex')}.tmp`;
  try { fs.writeFileSync(temp,content,{flag:'wx'}); fs.renameSync(temp,file); }
  finally { if (exists(temp)) fs.unlinkSync(temp); }
}
function validateRecord(rel, record) {
  relative(rel);
  if (!object(record) || !['file','symlink'].includes(record.kind) || typeof record.source !== 'string') throw new Error(`Invalid ownership entry: ${rel}`);
  relative(record.source);
  if (record.kind === 'file' && !/^[a-f0-9]{64}$/.test(record.hash)) throw new Error(`Invalid hash: ${rel}`);
  if (record.kind === 'symlink' && (typeof record.linkTarget !== 'string' || !record.linkTarget || path.isAbsolute(record.linkTarget))) throw new Error(`Invalid link: ${rel}`);
}
function load(root, stateRel, allowed = () => true, legacy = false) {
  const file = resolve(root,stateRel);
  const previous = exists(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : {};
  if (!object(previous)) throw new Error(`Invalid state: ${stateRel}`);
  if (exists(file) && previous.version !== 2 && !(legacy && previous.version === 1)) throw new Error(`Unsupported state: ${stateRel}`);
  if (previous.generated !== undefined && (!Array.isArray(previous.generated) || previous.generated.some(rel => { relative(rel); return !allowed(rel); }))) throw new Error('Invalid generated paths');
  if (previous.outputs !== undefined && !object(previous.outputs)) throw new Error('Invalid outputs');
  for (const [rel, record] of Object.entries(previous.outputs || {})) {
    validateRecord(rel,record);
    if (!allowed(rel)) throw new Error(`Invalid output path: ${rel}`);
    resolve(root,rel,false);
    if (record.kind === 'symlink') {
      const target = path.resolve(path.dirname(path.join(root,rel)),record.linkTarget);
      if (!target.startsWith(root + path.sep)) throw new Error(`Unsafe link ownership: ${rel}`);
    }
  }
  return { ...previous, version:2, outputs:{...(previous.outputs || {})} };
}
function matches(root, rel, record) {
  const file = resolve(root,rel,false);
  if (!exists(file) || !record) return false;
  const stat=fs.lstatSync(file);
  if (record.kind === 'symlink') return stat.isSymbolicLink() && fs.readlinkSync(file) === record.linkTarget;
  return stat.isFile() && hash(fs.readFileSync(file)) === record.hash;
}
function store(root, stateRel, state) { atomic(resolve(root,stateRel),JSON.stringify(state,null,2)+'\n'); }
function write(root, rel, content, source, state, dryRun = false) {
  const dest=resolve(root,rel,false); relative(source);
  if (exists(dest) && (!matches(root,rel,state.outputs[rel]) || state.outputs[rel]?.source !== source)) return false;
  if (!dryRun) {
    atomic(dest,content);
    state.outputs = {...state.outputs,[rel]:{kind:'file',source,hash:hash(content)}};
  }
  return true;
}
function summary(phase, updated, conflicts, failed = 0) {
  console.log(JSON.stringify({phase,status:failed?'failed':conflicts?'partial':'complete',updated,kept:conflicts,conflicts,failed}));
}
module.exports={hash,object,relative,resolve,exists,atomic,load,matches,store,write,summary,validateRecord};
