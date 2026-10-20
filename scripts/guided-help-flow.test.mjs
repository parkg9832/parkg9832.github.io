import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const scope=vm.createContext({window:{}});for(const f of ['site-company-knowledge.js','site-help-data.js','site-country-data.js','site-help-flow.js'])vm.runInContext(fs.readFileSync(new URL('../'+f,import.meta.url),'utf8'),scope);
const f=scope.window.MOKDA_HELP_FLOW,c=scope.window.MOKDA_COUNTRIES;let checks=0;const traces=[];
for(const lang of ['KR','ES','EN']){
 for(const branch of ['products','business','other']){
  let state=f.transition(f.initial(),'branch',branch);if(branch==='business')state=f.transition(state,'details',{countryCode:'FR',businessType:'importer',product:'both'});
  const questions=f.view(state,lang).choices.filter(x=>x.type==='faq');for(const q of questions){const answered=f.transition(state,'faq',q.value),v=f.view(answered,lang);assert(v.message.length>30);assert(!v.handoff);assert(v.choices.some(x=>x.type==='topics'));const final=f.transition(answered,'contact');const prepared=f.transition(final,'prepare',{countryCode:'FR',product:'both',extra:'Please confirm my specific inquiry.'});assert(prepared);assert(f.view(prepared,lang).handoff);assert(f.summary(prepared,lang).includes('Please confirm'));traces.push({language:lang,topic:q.value,answer:v.message,summary:f.summary(prepared,lang)});checks++;}
 }
 for(const country of c.records){let state=f.transition(f.initial('kpeno'),'branch','business');state=f.transition(state,'details',{countryCode:country.code,businessType:'retail',product:'kpeno'});assert(state,'Every listed country can continue the business flow');state=f.transition(state,'contact');state=f.transition(state,'prepare',{});assert(f.view(state,lang).handoff);assert(f.summary(state,lang).includes(country.names[lang]));checks++;}
 let invalid=f.transition(f.initial(),'branch','business');assert.equal(f.transition(invalid,'details',{countryCode:'XX',businessType:'importer',product:'kpeno'}),null);assert.equal(f.transition(invalid,'details',{countryCode:'FR',businessType:'admin',product:'kpeno'}),null);
 const raw=f.restore({stage:'prepared',branch:'products',countryCode:'XX',extra:'hi'});assert.notEqual(raw.stage,'prepared');checks+=3;
}
assert.equal(c.records.length,249);assert(c.options('KR','호주').some(x=>x.code==='AU'));assert(c.options('KR','한국').some(x=>x.code==='KR'));checks+=3;
if(process.env.MOKDA_GUIDE_TRACE)fs.writeFileSync(process.env.MOKDA_GUIDE_TRACE,JSON.stringify(traces,null,2)+'\n');
console.log(`Guided FAQ flow passed: ${checks} multilingual answer, global-country, validation and reviewed-inquiry checks.`);
