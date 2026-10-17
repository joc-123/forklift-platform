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
test('seed contains 233 individually verified identities and forty discovery groups', () => {
  assert.equal(validate(data).models.length, 233);
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
  assert.equal(view.nodes.results.children.length, 233);
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
    fail = false; await view.nodes.retry.events.click(); assert.equal(view.nodes.results.children.length, 233);
  }
});
test('stale reload responses cannot replace the newest results', async () => {
  const pending = []; let first = true;
  const view = ui(url => first ? new Promise(resolve => pending.push(resolve)) : success(url));
  const old = view.load(); first = false; await view.load();
  for (const resolve of pending) resolve(response(null)); await old;
  assert.equal(view.nodes.results.children.length, 233); assert.equal(view.nodes.brand.disabled, false);
});
test('directory rejects unsafe URLs and duplicate groups', () => {
  const x = copy(directory); x.rows[0].official_source_url = 'javascript:alert(1)'; assert.throws(() => validateDiscovery(x));
  const y = copy(directory); y.rows.push(y.rows[0]); assert.throws(() => validateDiscovery(y));
});
test('identification guidance uses exact brand/model and never implies a date decoder', () => {
  const records = validateEvidence(evidence);
  assert.equal(records.length, 71);
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
test('exact-unit anchor and conflicting examples cannot populate model dates', () => {
  const deep = require('../data/genie-deep-evidence.json');
  const anchors = deep.records.filter(r => r.kind === 'exact_unit_manufacture_year');
  assert.equal(anchors.length, 1);
  assert.equal(anchors[0].serial, 'GS90F-54033');
  assert.equal(anchors[0].manufacture_year, 2017);
  assert.equal(deep.records.find(r => r.kind === 'source_conflict_hold').manufacture_year, null);
  assert.ok(deep.records.filter(r => r.kind === 'exact_unit_listing_year_only').every(r => r.manufacture_year === null));
  assert.ok(data.models.every(m => m.manufactureDate === null && m.productionStartYear === null && m.productionEndYear === null));
  const guidance = guidanceFor(validateEvidence(evidence), {brand:'Genie',model:'GS-5390'});
  const anchor = guidance.find(r => r.id === anchors[0].id);
  assert.deepEqual(anchor.document_serial_scope, [['GS90F-54033','GS90F-54033']]);
  assert.equal(guidanceFor(validateEvidence(evidence), {brand:'Genie',model:'GS-4390'}).some(r=>r.id===anchor.id), false);
});
test('JLG observed lifecycle dates never become manufacture years; citation is corrected', () => {
  const jlg = require('../data/jlg-year-evidence.json');
  assert.equal(jlg.unit_observations.length, 4);
  assert.ok(jlg.unit_observations.every(r => r.manufacture_year === null && r.manufacture_date === null));
  const source = jlg.sources.find(s => s.id === 'jlg-es-3121656-h');
  assert.equal(new URL(source.url).hostname, 'csapps.jlg.com');
  assert.ok(source.original_incorrect_url.includes('skyjack'));
  assert.equal(data.models.some(m => m.model === '1230ES'), false);
});
test('MEC narrower scopes and UpRight conflict survive reconciliation', () => {
  const mec = evidence.records.find(r=>r.id==='MEC-SE-01');
  assert.equal(mec.serial_applicability.find(s=>s.models.includes('4555SE')).from,'16800001');
  assert.equal(evidence.records.find(r=>r.id==='MEC-NANO-01').serial_applicability[0].from,'18000019');
  const upright=evidence.records.find(r=>r.id==='UPR-X26N-01');
  assert.match(JSON.stringify(upright),/5119/);assert.match(JSON.stringify(upright),/51119/);
  assert.equal(upright.automatic_manufacture_year_decode_allowed,false);
});
test('Holland Lift acquisition does not become a confirmed production restart', () => {
  const r=directory.rows.find(r=>r.brand==='Holland Lift');
  assert.match(r.identity_classification,/acquired by Sinoboom/);
  assert.match(r.status_evidence,/Actual resumed production has not been verified/);
  assert.equal(r.production_start_year,null);assert.equal(r.production_end_year,null);
});
test('Skyjack variants retain distinct fields and exact supported serial boundaries',()=>{
 const records=evidence.records.filter(r=>r.id.startsWith('skyjack-sj3013-label-variants'));
 assert.equal(records.length,2);assert.match(records[0].supported_output,/model year/);assert.match(records[1].supported_output,/date of production/);
 for(const r of records){assert.equal(r.document_serial_scope[0].through,'M09301244');assert.match(r.ambiguities.join(' '),/236613AEA/);}
 const rt=evidence.records.find(r=>r.id.startsWith('skyjack-large-rt'));assert.equal(rt.document_serial_scope[0].through,'A202999999');
});
test('new manufacturer evidence preserves region, generation, VIN prefix and year semantics',()=>{
 const j=evidence.records.find(r=>r.id==='jcb-electric-drive');assert.match(j.supported_output,/Only for markets/);assert.match(j.document_serial_scope[0].from,/RAJA0151/);
 assert.equal(filter(data.models,'JCB','S2632E').length,2);
 const l=evidence.records.filter(r=>r.manufacturer==='LGMG');assert.equal(l.flatMap(r=>r.models).length,6);for(const r of l){assert.match(r.serial_scope_note,/AS\/NZS/);assert.match(r.supported_output,/Manufacturing Year/);}
 const s=evidence.records.find(r=>r.id==='sinoboom-1932me-poland-ansi-csa');assert.match(s.plate_location,/not transferred/);assert.equal(s.document_serial_scope[0].from,'PL0105600100');
 assert.equal(data.models.some(m=>m.model==='0932ME'),false);
});
test('BoSS safety notice gives only an exclusive date bound for four exact batches',()=>{
 const records=evidence.records.filter(r=>r.manufacturer==='BoSS');assert.equal(records.length,4);
 assert.deepEqual(records.map(r=>[r.models[0],r.document_serial_scope[0].from,r.document_serial_scope[0].through]),[['X2','YMG 21000','YMG 21228'],['X3','YMG 11001','YMG 11918'],['X3X','YMG 31001','YMG 31238'],['X3X','YMG 32001','YMG 32158']]);
 for(const r of records){assert.equal(r.production_date_upper_bound_exclusive,'2012-11-01');assert.equal(r.production_date_lower_bound,null);assert.equal(r.exact_manufacture_year,null);assert.match(r.supported_output,/does not establish upgrade completion, safe condition/);}
});
test('Aichi ambiguous boundary and manufacturer-authored mirror provenance remain explicit',()=>{
 const a=evidence.records.find(r=>r.manufacturer==='Aichi');assert.match(a.document_serial_scope[0][0],/after 779462/);assert.match(a.ambiguities.join(' '),/inclusion.*unresolved/);
 const m=evidence.records.find(r=>r.id==='manitou-se-52779009');assert.match(m.serial_scope_note,/EUROPEAN UNION/);assert.match(m.serial_scope_note,/third-party host/i);
 const els=evidence.records.find(r=>r.id==='els-s-series-plate-year');assert.match(els.serial_scope_note,/distributor Kunze/);
});
test('European evidence keeps provisional records held and parts overlaps unresolved',()=>{
 assert.equal(evidence.records.some(r=>r.id==='EUYEAR-AIRO-XL'),false);assert.equal(evidence.records.some(r=>r.id==='EUYEAR-PB-S151'),false);
 assert.equal(data.models.some(m=>m.model==='XL17 E'||m.model==='PB S151-16 E'),false);
 const pb=evidence.records.find(r=>r.id==='EUYEAR-PB-S131');assert.match(pb.ambiguities.join(' '),/S131-13 E/);assert.match(pb.ambiguities.join(' '),/48\/14\/1115/);
 const ps=evidence.records.find(r=>r.id==='EUYEAR-AXCS-PS');assert.match(ps.ambiguities.join(' '),/PS14-50861 and PS14-50862/);assert.match(ps.serial_scope_note,/operation-manual and parts-index scopes separate/);
 const hb=evidence.records.find(r=>r.id==='EUYEAR-HYBRID-S2');assert.match(hb.document_serial_scope.find(s=>s.models[0]==='HB-1230').from,/D08-20043; D08-20046/);
});
test('four-brand evidence preserves exact models and prohibits unsupported dates',()=>{
 const raw=require('../data/four-brand-scissor-evidence.json');assert.equal(raw.sources.length,28);
 for(const key of ['approved_decoding_rules','approved_dated_serial_ranges','approved_serial_year_observations'])assert.deepEqual(raw[key],[]);
 assert.equal(filter(data.models,'Zoomlion Access','ZS1008').length,1);
 assert.equal(data.models.some(m=>m.model==='SC1930E Li'||m.model==='XG0807FA'),false);
 const noble=evidence.records.find(r=>r.id==='four-brand-NOBLE-03');for(const part of ['602047520022','602047520004','602047520007'])assert.ok(noble.ambiguities.join(' ').includes(part));
 const x=evidence.records.find(r=>r.id==='four-brand-xcmg-xg0807dcw-manual-date-field');assert.match(x.ambiguities.join(' '),/not itself a populated nameplate/);
 const s=raw.sources.find(s=>s.id==='sany-gcp-serial-binding');assert.match(s.limitations.join(' '),/Binding Time, not manufacture date/);
 assert.equal(evidence.records.some(r=>r.id.includes('photo-lead')),false);
});
