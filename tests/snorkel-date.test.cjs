const {test} = require('node:test');
const assert = require('node:assert/strict');
const {interpretSnorkel, mount} = require('../assets/snorkel-date.js');
test('manufacturer example gives March 2017 as a qualified format interpretation', () => {
  const r = interpretSnorkel('S3370RT-07-170300298');
  assert.equal(r.status,'format_interpretation');
  assert.equal(r.manufactureYear,2017); assert.equal(r.manufactureMonth,3);
  assert.match(r.reason,/not an independently verified machine date/);
});
test('valid months in the supported year retain month precision', () => {
  for (const month of ['01','12']) assert.equal(interpretSnorkel('S3370RT-07-17'+month+'00298').manufactureMonth,Number(month));
});
test('unsupported years, layouts, models, plants, missing digits and invalid months stay unknown', () => {
  for (const serial of [null,'','170300298','S3370RT-07-170000298','S3370RT-07-171300298','S3370RT-07-180300298','S3370RT-07-990300298','S3370RT-11-170300298','S3970RT-07-170300298','S3370RT-07-17-0300298','S3370RT-07-17030298',' S3370RT-07-170300298','S3370RT-07-170300298\n','s3370rt-07-170300298']) {
    const r=interpretSnorkel(serial); assert.equal(r.status,'unknown',JSON.stringify(serial)); assert.equal(r.manufactureYear,null); assert.equal(r.manufactureMonth,null);
  }
});
test('UI invalidates an old interpretation when serial changes', () => {
  const nodes=Object.fromEntries(['snorkel-serial','snorkel-result','snorkel-check'].map(id=>[id,{events:{},value:'',textContent:'',addEventListener(name,fn){this.events[name]=fn;}}]));
  mount({getElementById:id=>nodes[id]}); nodes['snorkel-serial'].value='S3370RT-07-170300298'; nodes['snorkel-check'].events.click();
  assert.match(nodes['snorkel-result'].textContent,/2017-03/);
  nodes['snorkel-serial'].value='unknown';nodes['snorkel-serial'].events.input(); assert.doesNotMatch(nodes['snorkel-result'].textContent,/2017/);
  nodes['snorkel-check'].events.click(); assert.match(nodes['snorkel-result'].textContent,/Year not yet verified/);
});
