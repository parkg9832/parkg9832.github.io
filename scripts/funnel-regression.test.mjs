import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';

const read = name => readFileSync(new URL('../' + name, import.meta.url), 'utf8');
const scripts = ['site-contact-config.js','site-company-knowledge.js','site-help-data.js','site-chat-intents.js','site-chat-engine.js','site-help.js'];
const KEY = 'mokdaChatSessionV2';
const langs = { KR:'ko', ES:'es', EN:'en' };
function fixture(lang = 'ES', { product = '', saved } = {}) {
  const dom = new JSDOM('<html><body><a href="contact.html" data-chat-intent="business" data-product="K-PEÑO">Business</a></body></html>', {url:`https://www.mokda.kr/${langs[lang]}/${product ? product + '.html' : ''}`,runScripts:'outside-only'});
  const w=dom.window,d=w.document,timers=new Map(),events=[]; let id=0;
  d.documentElement.dataset.routeLanguage=lang; if(product)d.body.dataset.productDetail=product;
  w.innerWidth=390;w.matchMedia=()=>({matches:false});w.scrollTo=()=>{};
  w.setTimeout=(run)=>{timers.set(++id,run);return id;};w.clearTimeout=i=>timers.delete(i);
  const seen=new Set();w.MOKDA_ANALYTICS={track:(name,details)=>events.push({name,details}),trackOncePerSession:(key,name,details)=>{if(!seen.has(key)){seen.add(key);events.push({name,details});}}};
  w.fetch=()=>{throw Error('Unexpected external request');};
  Object.assign(w.HTMLDialogElement.prototype,{show(){this.open=true;},showModal(){this.open=true;},close(){this.open=false;this.dispatchEvent(new w.Event('close'));}});
  if(saved)w.sessionStorage.setItem(KEY,saved);
  scripts.forEach(s=>w.eval(read(s)));
  const flush=()=>{for(const [i,run]of [...timers]){timers.delete(i);run();}};
  const settle=()=>{for(let i=0;i<4;i++)flush();};
  const selectBusiness=(country='Peru',role='importer')=>{for(const [name,value]of [['businessCountry',country],['businessType',role]]){const e=d.querySelector(`[name="${name}"]`);e.value=value;e.dispatchEvent(new w.Event('change'));}d.querySelector('.help-business-form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));settle();};
  return {dom,w,d,events,settle,selectBusiness};
}

for(const lang of Object.keys(langs)) {
  const f=fixture(lang,{product:'kpeno'});
  f.d.querySelector('[data-chat-intent]').click(); f.settle();
  assert(f.d.querySelector('dialog').open);
  assert(f.d.querySelector('.help-business-form'));
  assert(f.d.querySelector('.help-contact').hidden,'No early WhatsApp prompt');
  f.selectBusiness();
  assert(!f.d.querySelector('.help-contact').hidden,'A known product needs only business details');
  const url=new URL(f.d.querySelector('.help-contact').href);
  assert.equal(url.pathname,'/821022127815');
  assert.match(url.searchParams.get('text'),/K-PEÑO/);assert.match(url.searchParams.get('text'),/Peru/);
  assert.equal(f.events.filter(x=>x.name==='chat_qualified').length,1);
  assert(f.events.some(x=>x.name==='chat_open'));
  assert(f.events.filter(x=>x.name==='chat_intent_select').length>=2);
  assert(!JSON.stringify(f.events).includes('Quiero importar'),'Event metadata never contains the conversation');
  f.d.querySelector('.help-form-link').dispatchEvent(new f.w.MouseEvent('click',{bubbles:true,cancelable:true,ctrlKey:true}));
  const carry=JSON.parse(f.w.sessionStorage.getItem('mokdaChatInquiryContext'));
  assert.equal(carry.country,'Peru');assert.equal(carry.product,'kpeno');assert.equal(carry.businessType,'importer');
  const saved=f.w.sessionStorage.getItem(KEY);f.dom.window.close();
  const next=fixture(lang==='ES'?'KR':'ES',{saved});
  assert(next.d.querySelector('.help-language-note'),'Real history remains with an explicit language-change notice');
  assert(next.d.querySelectorAll('.help-message').length>1);next.dom.window.close();

  const home=fixture(lang);home.w.MOKDA_HELP_UI.open();home.settle();
  home.d.querySelectorAll('.help-choice')[2].click();home.settle();home.selectBusiness();
  assert(home.d.querySelector('.help-contact').hidden);
  assert.equal(home.d.querySelectorAll('.help-choice').length,3,'The third step offers both products');
  home.d.querySelectorAll('.help-choice')[2].click();home.settle();
  assert(!home.d.querySelector('.help-contact').hidden,'Three interactions qualify the homepage business flow');
  assert.match(new URL(home.d.querySelector('.help-contact').href).searchParams.get('text'),/K-PEÑO \+ Para Carnes/);
  home.dom.window.close();
}

const engineContext={window:{}};vm.createContext(engineContext);
scripts.filter(s=>!['site-help.js','site-contact-config.js'].includes(s)).forEach(s=>vm.runInContext(read(s),engineContext));
const engine=engineContext.window.MOKDA_CHAT_ENGINE;
const intro=engine.reply('Quiero conocer el sabor y los usos de las salsas',{language:'ES'});
const heat=engine.reply('¿Qué tan picantes son las salsas?',{language:'ES',context:intro.context});
assert.equal(heat.aiTextAllowed,false,'Verified heat descriptions cannot be replaced by generic model text');assert.notEqual(heat.text,intro.text);assert.match(heat.text,/medio/);assert.match(heat.text,/suave/);assert.match(heat.text,/escala/);
const packing=engine.reply('¿Cuál es el pedido mínimo y cuántas botellas hay por caja?',{language:'ES'});
assert.match(packing.text,/1,000/);assert.match(packing.text,/12/);
for(const lang of Object.keys(langs)) {
  const q={KR:'페루에서 개인적으로 구매하고 싶어요',ES:'Quiero comprar para consumo personal en Perú',EN:'I want to buy for personal use in Peru'}[lang];
  const r=engine.reply(q,{language:lang});assert.equal(r.handoff,false);
  assert(r.sources.some(s=>s.url==='https://www.instagram.com/mokda_official/'));
}

// The editable selection, rather than a stale entry URL, is what reaches the receiver.
const contact=new JSDOM(read('contact.html'),{url:'https://www.mokda.kr/es/contact.html?purpose=distribution&product=original',runScripts:'outside-only'});
const cw=contact.window;cw.matchMedia=()=>({matches:false});cw.IntersectionObserver=class{observe(){}unobserve(){}};
cw.eval(read('site-i18n.js'));cw.eval(read('site-footer.js'));
let submitted;cw.MOKDA_B2B_WEB_APP_URL='https://example.invalid/inquiry';cw.MOKDA_TURNSTILE={token:async()=> 'test-only-token'};
cw.fetch=async(url,options)=>{submitted=JSON.parse(options.body);return {ok:true,json:async()=>({saved:false})};};
for(const script of contact.window.document.querySelectorAll('script:not([src])'))if(script.type!=='application/ld+json')cw.eval(script.textContent);
const cd=cw.document;assert.equal(cd.querySelector('#productSelect').value,'original');
for(const [id,value]of [['nameInput','Test buyer'],['countrySelect','Peru'],['emailInput','test@example.invalid'],['messageInput','Please quote the selected sauce.'],['productSelect','para-carnes']])cd.getElementById(id).value=value;
cd.querySelector('#b2bForm').dispatchEvent(new cw.Event('submit',{bubbles:true,cancelable:true}));
for(let i=0;i<12;i++)await Promise.resolve();
assert(submitted);assert.equal(submitted.product,'para-carnes');contact.window.close();

// Exercise real event classification without sending a request or loading GA.
const analytics=new JSDOM('<html><body><a href="/es/kpeno.html">Product</a><a href="https://wa.me/821022127815?text=PRIVATE_TEXT">WhatsApp</a></body></html>',{url:'https://www.mokda.kr/es/kpeno.html?analytics_debug=1&utm_medium=verification',runScripts:'outside-only'});
const aw=analytics.window,ga=[];aw.matchMedia=()=>({matches:false});aw.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}};aw.setTimeout=aw.setInterval=()=>0;aw.fetch=()=>Promise.resolve({});aw.gtag=(...args)=>ga.push(args);
aw.eval(read('site-analytics.js'));
aw.document.querySelectorAll('a').forEach(a=>a.dispatchEvent(new aw.MouseEvent('click',{bubbles:true,cancelable:true,ctrlKey:true})));
const events=aw.MOKDA_ANALYTICS.getDebugEvents();
assert(events.some(e=>e.name==='product_detail_view'&&e.product==='K-Peño'));
assert(events.some(e=>e.name==='product_cta_click'&&e.product==='K-Peño'));
assert(events.some(e=>e.name==='whatsapp_click'));
assert(!JSON.stringify(events).includes('PRIVATE_TEXT'));
aw.MOKDA_ANALYTICS.track('chat_open',{audience:'email@example.com',market:'PRIVATE_TEXT',funnel_stage:'PRIVATE_TEXT'});
const last=aw.MOKDA_ANALYTICS.getDebugEvents().at(-1);assert.equal(last.market,'');assert.equal(last.audience,'');assert.equal(last.funnel_stage,'');
analytics.window.close();

const backend={console};vm.createContext(backend);vm.runInContext(read('apps-script/b2b-lead-automation.gs'),backend);
for(const event of ['chat_open','chat_intent_select','chat_qualified','whatsapp_click'])assert(vm.runInContext('FUNNEL_EVENT_NAMES',backend).includes(event));
assert.deepEqual(Array.from(vm.runInContext('FUNNEL_HEADERS.slice(-3)',backend)),['Chat Audience','Chat Stage','Market']);
let columnCount=26,expanded=false,storedHeaders;
backend.ensureFunnelHeaders({getMaxColumns:()=>columnCount,insertColumnsAfter:(last,count)=>{assert.equal(last,26);columnCount+=count;expanded=true;},getLastRow:()=>0,getRange:(row,col,height,width)=>{assert(width<=columnCount);return {setValues:rows=>{storedHeaders=rows[0];}};},setFrozenRows:()=>{}});
assert(expanded);assert.equal(storedHeaders.length,29,'Existing 26-column collectors expand before writing new headers');
console.log('Funnel regressions passed: 3-language short B2B paths, product context, gated handoff, draft continuity, language notice, specific answers, B2C updates and private-data-free events.');
