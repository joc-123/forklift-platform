const {test}=require('node:test');
const assert=require('node:assert/strict');
const {interpretGenie,mount}=require('../assets/genie-model-year.js');
test('supported model years remain separate from manufacture date',()=>{
 for (const [model,serial,year] of [['GS-1930','GS3016P-151487',2016],['GS-1930','GS3016P-160599',2016],['GS-4047','GS4716P-101',2016],['GS-2632','GS3205-75407',2005],['GS-1530','GS3011A-109999',2011]]) {
  const r=interpretGenie(model,serial);assert.equal(r.modelYear,year,serial);assert.equal(r.manufactureYear,null);assert.equal(r.manufactureDate,null);assert.match(r.source,/manuals.genielift.com/);
 }
});
test('disputed boundaries, illustrative examples, wrong models and malformed serials fail closed',()=>{
 for (const [model,serial] of [['GS-1930','GS3016P-151486'],['GS-1930','GS3016P-160600'],['GS-1930','GS3016D-607'],['GS-1930','GS3016D-6079'],['GS-1930','GS3016P-123456'],['GS-1930','GS3005A-12345'],['GS-2632','GS3016P-151487'],['GS-1930','GS3015P-151487'],['GS-1930','GS3016F-151487'],['GS-1930','GS3016P-151487\n'],['GS-1930',' GS3016P-151487'],['GS-1930','GS3016P-0151487'],['GS-1930',null],['GS-1930','GS3099P-151487'],['GS-1930','GS3016A-151487']])assert.equal(interpretGenie(model,serial).modelYear,null,serial);
});
test('newer supported formats explicitly have no year segment',()=>{
 const r=interpretGenie('GS-1930','GS30P-160600');assert.equal(r.status,'yearless_format');assert.equal(r.modelYear,null);assert.equal(r.manufactureYear,null);
 assert.equal(interpretGenie('GS-1930','GS30P-200101').status,'unknown');
});
test('editing either input invalidates the displayed year',()=>{
 const nodes=Object.fromEntries(['genie-model','genie-serial','genie-result','genie-check'].map(id=>[id,{value:'',textContent:'',events:{},addEventListener(n,f){this.events[n]=f;},append(){}}]));
 mount({getElementById:id=>nodes[id],createElement:()=>({})});nodes['genie-model'].value='GS-1930';nodes['genie-serial'].value='GS3016P-151487';
 for(const field of ['genie-model','genie-serial']){nodes['genie-check'].events.click();assert.match(nodes['genie-result'].textContent,/Model year: 2016.*Manufacture date: unknown/);nodes[field].events.input();assert.doesNotMatch(nodes['genie-result'].textContent,/2016/);}
});
