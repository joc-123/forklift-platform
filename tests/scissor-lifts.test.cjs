const {test} = require('node:test');
const assert = require('node:assert/strict');
const {validate, validateDiscovery, validateEvidence, guidanceFor, filter, mount} = require('../assets/scissor-lifts.js');
const data = require('../data/scissor-lifts.json');
const directory = require('../data/scissor-discovery.json');
const evidence = require('../data/scissor-year-evidence.json');
const copy = x => JSON.parse(JSON.stringify(x));
class Element {
  constructor() { this.children = []; this.value = ''; this.textContent = ''; this.events = {}; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  addEventListener(name, cb) { this.events[name] = cb; }
}
function ui(fetcher) {
  const nodes = Object.fromEntries(['brand','search','retry','status','results','directory'].map(id => [id, new Element()]));
  const doc = {getElementById: id => nodes[id], createElement: () => new Element()};
  return {nodes, ...mount(doc, fetcher)};
}
const response = data => ({ok: true, json: async () => copy(data)});
const success = async url => response(url.endsWith('scissor-lifts.json') ? data : url.endsWith('scissor-year-evidence.json') ? evidence : directory);
test('seed contains forty-one individually verified identities and forty discovery groups', () => {
  assert.equal(validate(data).models.length, 41);
  assert.equal(validateDiscovery(directory).length, 40);
});
test('unknown years and heights cannot silently become factual claims', () => {
  for (const key of ['productionStartYear','productionEndYear','manufactureDate','platformHeight','workingHeight']) {
    const x = copy(data); x.models[0][key] = 2016; assert.throws(() => validate(x));
  }
});
test('reject malformed, duplicate and orphaned identities and unsafe source URLs', () => {
  for (const x of [null, [], {}, {...data, models: null}]) assert.throws(() => validate(x));
  for (const mutate of [x => x.models.push(x.models[0]), x => x.models[0].identitySource = 'missing', x => x.sources[0].url = 'javascript:alert(1)', x => x.models[0].model = '']) {
    const x = copy(data); mutate(x); assert.throws(() => validate(x));
  }
});
test('document date cannot be substituted for a machine year', () => {
  const x = copy(data); x.sources[0].documentDate = '2026-01-01'; assert.throws(() => validate(x));
});
test('search retains distinct suffix identities and respects brand', () => {
  assert.deepEqual(filter(data.models,'Skyjack','SJ4740 E').map(m => m.model), ['SJ4740 E']);
  assert.equal(filter(data.models,'Skyjack','SJ4740').length, 2);
  assert.equal(filter(data.models,'Genie','SJ4740').length, 0);
  assert.deepEqual(filter(data.models,'Genie','GS-1932m').map(m => m.model), ['GS-1932m','GS-1932m Lite','GS-1932m XH']);
  assert.equal(filter(data.models,'JLG','ES1932i').length, 0);
});
test('mount loads only static files, renders unknowns and filters through actual events', async () => {
  const urls = []; const view = ui(async url => {urls.push(url); return success(url);});
  await view.load(); assert.deepEqual(urls, ['data/scissor-lifts.json','data/scissor-discovery.json','data/scissor-year-evidence.json']);
  assert.equal(view.nodes.results.children.length, 41);
  assert.equal(view.nodes.directory.children.length, 40);
  assert.equal(view.nodes.brand.disabled, false);
  const dl = view.nodes.results.children[0].children[2];
  assert.equal(dl.children.filter(n => n.textContent === 'Not established').length, 4);
  view.nodes.search.value = 'SJ4740 E'; view.nodes.search.events.input();
  assert.equal(view.nodes.results.children.length, 1);
  view.nodes.search.value = 'nonexistent'; view.nodes.search.events.input();
  assert.match(view.nodes.status.textContent, /No verified model matches/);
});
test('HTTP, JSON and malformed catalogue failures disable controls and permit retry', async () => {
  for (const bad of [async () => ({ok:false}), async () => ({ok:true,json:async()=>{throw Error();}}), async()=>response(null)]) {
    let fail = true; const view = ui(url => fail ? bad() : success(url));
    await view.load(); assert.equal(view.nodes.brand.disabled, true); assert.equal(view.nodes.results.children.length, 0);
    assert.match(view.nodes.status.textContent, /unavailable/);
    fail = false; await view.nodes.retry.events.click(); assert.equal(view.nodes.results.children.length, 41);
  }
});
test('stale reload responses cannot replace the newest results', async () => {
  const pending = []; let first = true;
  const view = ui(url => first ? new Promise(resolve => pending.push(resolve)) : success(url));
  const old = view.load(); first = false; await view.load();
  for (const resolve of pending) resolve(response(null)); await old;
  assert.equal(view.nodes.results.children.length, 41); assert.equal(view.nodes.brand.disabled, false);
});
test('directory rejects unsafe URLs and duplicate groups', () => {
  const x = copy(directory); x.rows[0].official_source_url = 'javascript:alert(1)'; assert.throws(() => validateDiscovery(x));
  const y = copy(directory); y.rows.push(y.rows[0]); assert.throws(() => validateDiscovery(y));
});
test('identification guidance uses exact brand/model and never implies a date decoder', () => {
  const records = validateEvidence(evidence);
  assert.equal(records.length, 6);
  assert.equal(guidanceFor(records, {brand:'Genie',model:'GS-3384'}).length, 2);
  assert.equal(guidanceFor(records, {brand:'Genie',model:'GS-1932 E-Drive'}).length, 0);
  assert.equal(guidanceFor(records, {brand:'JLG',model:'ES1932'}).length, 0);
  assert.equal(guidanceFor(records, {brand:'JLG',model:'1930ES'}).length, 1);
  for (const mutate of [x=>x.records[0].automatic_manufacture_year_decode_allowed=true, x=>x.records[0].source_url='javascript:alert(1)', x=>x.records[0].pages[0].pdf_page_1_based=0]) {
    const x=copy(evidence); mutate(x); assert.throws(()=>validateEvidence(x));
  }
});
test('rendered guidance separates document dates from unknown manufacture dates', async () => {
  const view = ui(success); await view.load();
  view.nodes.brand.value = 'Skyjack'; view.nodes.search.value = 'SJ3219 E'; view.nodes.search.events.input();
  const flatten = n => [n.textContent, ...n.children.map(flatten)].flat().join(' ');
  const result = flatten(view.nodes.results);
  assert.match(result, /Manufactured MM\/YYYY/);
  assert.match(result, /Model year/);
  assert.match(result, /A100040000 through A100999999/);
  assert.match(result, /document date, not this machine’s year/);
  assert.match(result, /Machine manufacture date Not established/);
});
