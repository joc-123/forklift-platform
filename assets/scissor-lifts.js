'use strict';
(function (root) {
  const text = value => typeof value === 'string' && value.trim().length > 0;
  const https = value => {
    try { return new URL(value).protocol === 'https:'; } catch { return false; }
  };
  function validate(data) {
    if (!data || data.version !== 1 || !Array.isArray(data.sources) || !Array.isArray(data.models)) throw new Error('Invalid catalogue');
    const sources = new Set();
    for (const s of data.sources) {
      if (!s || !text(s.id) || sources.has(s.id) || !text(s.title) || !https(s.url) || !text(s.locator) || !text(s.scope) || !/^\d{4}-\d{2}-\d{2}$/.test(s.retrievedOn) || s.documentDate !== null) throw new Error('Invalid source');
      sources.add(s.id);
    }
    const ids = new Set();
    const identities = new Set();
    for (const m of data.models) {
      if (!m || !text(m.id) || ids.has(m.id) || !text(m.brand) || !text(m.model) || !sources.has(m.identitySource)) throw new Error('Invalid model');
      const identity = m.brand.toLowerCase() + '\0' + m.model.toLowerCase();
      if (identities.has(identity)) throw new Error('Duplicate model');
      // Version 1 verifies identities only. Future specifications/year rules require
      // a new schema with field-level evidence and applicability, not filled blanks.
      for (const key of ['productionStartYear', 'productionEndYear', 'manufactureDate', 'platformHeight', 'workingHeight']) {
        if (m[key] !== null) throw new Error('Unsupported specification or date');
      }
      identities.add(identity); ids.add(m.id);
    }
    return data;
  }
  function validateDiscovery(data) {
    if (!data || !Array.isArray(data.rows)) throw new Error('Invalid directory');
    const brands = new Set();
    for (const row of data.rows) {
      if (!row || !text(row.brand) || brands.has(row.brand) || !text(row.identity_classification) || !text(row.verified_examples) || !text(row.year_identification_evidence) || !https(row.official_source_url) || (row.supporting_source_url && !https(row.supporting_source_url))) throw new Error('Invalid directory entry');
      brands.add(row.brand);
    }
    return data.rows.slice().sort((a, b) => a.brand.localeCompare(b.brand));
  }
  function filter(models, brand, query) {
    const q = query.trim().toLowerCase();
    return models.filter(m => (!brand || m.brand === brand) && (!q || (m.brand + ' ' + m.model).toLowerCase().includes(q)))
      .slice().sort((a, b) => (a.brand + ' ' + a.model).localeCompare(b.brand + ' ' + b.model));
  }
  function validateEvidence(data) {
    if (!data || data.schema_version !== 1 || !Array.isArray(data.records)) throw new Error('Invalid identification evidence');
    const ids = new Set();
    for (const r of data.records) {
      if (!r || !text(r.id) || ids.has(r.id) || !text(r.manufacturer) || !Array.isArray(r.models) || !r.models.length || !r.models.every(text) || !https(r.source_url) || (r.pdf_url && !https(r.pdf_url)) || !text(r.document) || !text(r.revision) || !text(r.document_date) || r.automatic_manufacture_year_decode_allowed !== false || !Array.isArray(r.pages) || !r.pages.length || !r.pages.every(p => Number.isInteger(p.pdf_page_1_based) && p.pdf_page_1_based > 0) || !Array.isArray(r.ambiguities) || !r.ambiguities.every(text) || !text(r.supported_output || r.supported_use)) throw new Error('Invalid identification record');
      if (!Array.isArray(r.document_serial_scope || r.serial_applicability)) throw new Error('Missing document scope');
      ids.add(r.id);
    }
    return data.records;
  }
  function guidanceFor(records, model) {
    return records.filter(r => r.manufacturer === model.brand && r.models.includes(model.model));
  }
  function mount(doc, fetcher) {
    const get = id => doc.getElementById(id);
    let catalogue = null, discovery = [], evidence = [], generation = 0, controller;
    const node = (tag, value) => { const n = doc.createElement(tag); if (value !== undefined) n.textContent = value; return n; };
    const link = (label, url) => { const a = node('a', label); a.href = url; a.rel = 'noopener noreferrer'; return a; };
    function render() {
      if (!catalogue) return;
      get('results').replaceChildren(); get('directory').replaceChildren();
      const visible = filter(catalogue.models, get('brand').value, get('search').value);
      for (const model of visible) {
        const source = catalogue.sources.find(s => s.id === model.identitySource);
        const card = node('article'); card.append(node('p', model.brand), node('h2', model.model));
        const dl = node('dl');
        for (const label of ['Model production years', 'Machine manufacture date', 'Platform height', 'Working height']) dl.append(node('dt', label), node('dd', 'Not established'));
        card.append(dl, link(source.title, source.url), node('p', source.scope), node('p', 'Identity evidence: ' + source.locator), node('p', 'Source checked: ' + source.retrievedOn + (guidanceFor(evidence, model).length ? ' · Document revision and date: see identification guidance.' : ' · Document date: not established')));
        for (const r of guidanceFor(evidence, model)) {
          const guide = node('details');
          guide.append(node('summary', 'Year identification guidance' + (r.period_label ? ' — ' + r.period_label : '')));
          guide.append(node('p', r.supported_output || r.supported_use));
          if (r.plate_location) guide.append(node('p', 'Plate location: ' + r.plate_location));
          if (r.manufacture_date_evidence) guide.append(node('p', r.manufacture_date_evidence));
          for (const item of r.evidence || []) guide.append(node('p', item.field_label + ': ' + item.location));
          guide.append(node('p', 'Document: ' + r.document + ', revision ' + r.revision + ', dated ' + r.document_date + '. This is a document date, not this machine’s year.'));
          for (const page of r.pages) guide.append(node('p'), link('PDF page ' + page.pdf_page_1_based + (page.printed_page ? ' (printed ' + page.printed_page + ')' : ''), (r.pdf_url || r.source_url) + '#page=' + page.pdf_page_1_based));
          guide.append(node('p', 'Document serial scope — match your exact model and serial before using this guidance:'));
          for (const scope of r.document_serial_scope || r.serial_applicability) {
            const description = Array.isArray(scope) ? scope.join(' through ') : (scope.models ? scope.models.join(', ') + ': ' : (scope.country || '') + ': ') + scope.from + ' through ' + (scope.through || scope.to_raw || scope.printed_scope || 'not established');
            guide.append(node('p', description));
          }
          if (r.serial_scope_note) guide.append(node('p', r.serial_scope_note));
          for (const note of r.ambiguities) guide.append(node('p', note));
          guide.append(node('p', 'No machine date is determined by this reference. Read the actual plate or obtain manufacturer records.'));
          card.append(guide);
        }
        get('results').append(card);
      }
      const q = get('search').value.trim().toLowerCase();
      const rows = discovery.filter(r => (!get('brand').value || r.brand === get('brand').value) && (!q || (r.brand + ' ' + r.verified_examples).toLowerCase().includes(q)));
      for (const row of rows) {
        const item = node('details'); item.append(node('summary', row.brand + ' — ' + row.identity_classification));
        item.append(node('p', 'Research model examples: ' + row.verified_examples), node('p', 'Year evidence lead: ' + row.year_identification_evidence), link('Source reference', row.official_source_url));
        if (row.supporting_source_url) item.append(node('p'), link('Supporting reference', row.supporting_source_url));
        item.append(node('p', 'Production years: not established. Discovery reference only; not a serial-year decoder.'));
        get('directory').append(item);
      }
      get('status').textContent = visible.length + ' verified model identities · ' + rows.length + ' brand/group discovery entries. ' + (visible.length ? 'Years remain unknown.' : 'No verified model matches. Try another search or check the discovery references below.');
    }
    async function load() {
      const version = ++generation;
      if (controller) controller.abort();
      controller = new AbortController();
      const requestController = controller;
      const timer = setTimeout(() => requestController.abort(), 15000);
      catalogue = null; get('brand').disabled = true; get('search').disabled = true;
      get('results').replaceChildren(); get('directory').replaceChildren(); get('status').textContent = 'Loading catalogue…';
      try {
        const responses = await Promise.all(['data/scissor-lifts.json', 'data/scissor-discovery.json', 'data/scissor-year-evidence.json'].map(url => fetcher(url, {signal: requestController.signal})));
        if (responses.some(r => !r.ok)) throw new Error('Request failed');
        const [data, directory, identification] = await Promise.all(responses.map(r => r.json()));
        if (version !== generation) return;
        catalogue = validate(data); discovery = validateDiscovery(directory); evidence = validateEvidence(identification);
        const selected = get('brand').value;
        const all = node('option', 'All brands'); all.value = '';
        get('brand').replaceChildren(all);
        const brands = [...new Set([...catalogue.models.map(m => m.brand), ...discovery.map(r => r.brand)])].sort((a, b) => a.localeCompare(b));
        for (const brand of brands) { const option = node('option', brand); option.value = brand; get('brand').append(option); }
        get('brand').value = brands.includes(selected) ? selected : '';
        get('brand').disabled = false; get('search').disabled = false; render();
      } catch {
        if (version !== generation) return;
        catalogue = null; get('status').textContent = 'Catalogue unavailable. Reload to try again.';
      } finally { clearTimeout(timer); }
    }
    get('brand').addEventListener('change', render);
    get('search').addEventListener('input', render);
    get('retry').addEventListener('click', load);
    return {load, render};
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = {validate, validateDiscovery, validateEvidence, guidanceFor, filter, mount};
  else mount(root.document, root.fetch.bind(root)).load();
})(typeof window !== 'undefined' ? window : globalThis);
