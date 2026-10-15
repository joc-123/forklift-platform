const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

// Exercise the page's actual event handlers with a small DOM and mocked service.
// No credentials, network access, database writes or third-party packages needed.
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
class Element {
  constructor() { this.children = []; this.value = ''; this.dataset = {}; this.listeners = {}; this.attributes = {}; }
  replaceChildren() { this.children = []; this.value = ''; this.textContent = ''; }
  appendChild(child) { this.children.push(child); if (this.children.length === 1 && child.tag === 'option') this.value = child.value; return child; }
  setAttribute(name, value) { this.attributes[name] = value; }
  addEventListener(name, fn) { (this.listeners[name] ??= []).push(fn); }
  async fire(name) { await Promise.all((this.listeners[name] || []).map(fn => fn())); }
}
async function page(respond = () => undefined) {
  const elements = Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(([, id]) => [id, new Element()]));
  let initialize;
  const calls = [];
  const document = {
    getElementById: id => elements[id],
    createElement: tag => Object.assign(new Element(), { tag }),
    addEventListener: (_, fn) => { initialize = fn; },
  };
  const fetch = async (url, options) => {
    const name = url.split('/').pop();
    calls.push(name);
    let data = await respond(name, JSON.parse(options.body));
    if (data === undefined) data = ({ get_manufacturers: ['Toyota'], get_models: ['8FBCU25'], get_battery_manufacturers: ['Example'] })[name];
    return { ok: true, json: async () => data };
  };
  vm.runInNewContext(script, { document, fetch, AbortController, setTimeout, clearTimeout });
  await initialize();
  return { elements, calls };
}

for (const invalid of [null, {}, [''], [42]]) {
  test(`malformed models fail closed: ${JSON.stringify(invalid)}`, async () => {
    const { elements: e, calls } = await page(name => name === 'get_models' ? invalid : undefined);
    assert.equal(e.year_result.dataset.state, 'error');
    assert.equal(e.btn_year.disabled, true);
    assert.equal(e.model_manual.disabled, true);
    await e.btn_year.fire('click');
    assert.equal(calls.includes('decode_forklift'), false);
  });
}
test('a valid empty model catalogue still permits manual plate input', async () => {
  const { elements: e } = await page(name => name === 'get_models' ? [] : undefined);
  assert.equal(e.btn_year.disabled, false);
  assert.equal(e.model_manual.disabled, false);
  assert.equal(e.year_result.dataset.state, 'info');
});
test('reload recovers from a malformed catalogue', async () => {
  let failed = true;
  const { elements: e } = await page(name => name === 'get_models' && failed ? null : undefined);
  failed = false;
  await e.retry_forklift.fire('click');
  assert.equal(e.btn_year.disabled, false);
  assert.equal(e.model.value, '8FBCU25');
});
for (const [response, state] of [
  [{ manufacture_year: null }, 'unknown'],
  [{ supported: false, manufacture_year: 2020 }, 'unsupported'],
  [{ candidate_years: [1990, 2020], manufacture_year: 2020 }, 'ambiguous'],
  [{ manufacture_year: 2020 }, 'unverified'],
  [{ manufacture_year: 9999 }, 'error'],
]) {
  test(`decoder preserves ${state} status`, async () => {
    const { elements: e } = await page(name => name === 'decode_forklift' ? response : undefined);
    e.serial.value = 'TEST';
    await e.btn_year.fire('click');
    assert.equal(e.year_result.dataset.state, state);
    assert.equal(e.year_result.attributes['aria-busy'], 'false');
    const rows = e.year_result.children[0].children.map(row => row.textContent);
    assert.equal(rows.some(text => text.startsWith('Reported year:')), state === 'unverified');
  });
}
test('an input change prevents a pending result from appearing for a different serial', async () => {
  let finish;
  const pending = new Promise(resolve => { finish = resolve; });
  const { elements: e } = await page(name => name === 'decode_forklift' ? pending : undefined);
  e.serial.value = 'OLD';
  const request = e.btn_year.fire('click');
  e.serial.value = 'NEW';
  await e.serial.fire('input');
  finish({ manufacture_year: 2020 });
  await request;
  assert.equal(e.year_result.dataset.state, 'info');
  assert.match(e.year_result.children[0].textContent, /Inputs changed/);
  assert.equal(e.btn_year.disabled, false);
});

for (const response of [null, [], '2020', { manufacture_year: false }, { manufacture_year: '20xx' }]) {
  test(`malformed decoder response fails closed: ${JSON.stringify(response)}`, async () => {
    const { elements: e } = await page(name => name === 'decode_forklift' ? response : undefined);
    e.serial.value = 'TEST';
    await e.btn_year.fire('click');
    assert.equal(e.year_result.dataset.state, 'error');
    assert.equal(e.year_result.attributes['aria-busy'], 'false');
    assert.equal(e.btn_year.disabled, false);
  });
}

for (const response of [{}, { manufacture_year: '' }, { found: false, manufacture_year: 2020 }]) {
  test(`unknown year is never presented as a date: ${JSON.stringify(response)}`, async () => {
    const { elements: e } = await page(name => name === 'decode_battery' ? response : undefined);
    e.battery_serial.value = 'TEST';
    await e.btn_batt_date.fire('click');
    assert.equal(e.battery_date_result.dataset.state, 'unknown');
    assert.equal(e.battery_date_result.children[0].children.some(row => /year:/i.test(row.textContent)), false);
  });
}

for (const stale of [['OLD'], null]) {
  test(`stale model response cannot replace the current catalogue: ${JSON.stringify(stale)}`, async () => {
    let finish;
    const pending = new Promise(resolve => { finish = resolve; });
    const { elements: e } = await page((name, body) => {
      if (name === 'get_models' && body.manufacturer_input === 'Old') return pending;
      if (name === 'get_models' && body.manufacturer_input === 'New') return ['NEW'];
    });
    e.manufacturer.value = 'Old';
    const request = e.manufacturer.fire('change');
    e.manufacturer.value = 'New';
    await e.manufacturer.fire('change');
    finish(stale);
    await request;
    assert.equal(e.model.value, 'NEW');
    assert.equal(e.btn_year.disabled, false);
    assert.equal(e.year_result.dataset.state, 'info');
  });
}
