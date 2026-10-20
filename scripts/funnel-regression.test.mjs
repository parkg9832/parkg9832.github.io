import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {JSDOM} from 'jsdom';
import {fixture} from './guided-help-fixture.mjs';
const read=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
for(const lang of ['KR','ES','EN']){
 const f=fixture(lang,{product:'kpeno',prepare:false});f.d.querySelector('[data-chat-intent]').click();f.settle();f.details('FR','importer','kpeno');
 assert(f.d.querySelector('.help-contact').hidden);assert.equal(f.events.filter(x=>x.name==='chat_qualified').length,1);
 f.act('contact');f.submit();assert(!f.d.querySelector('.help-contact').hidden);const url=new URL(f.d.querySelector('.help-contact').href);assert.match(url.searchParams.get('text'),/K-PEÑO/);assert.match(url.searchParams.get('text'),/France|Francia|프랑스/);
 f.d.querySelector('.help-form-link').dispatchEvent(new f.w.MouseEvent('click',{bubbles:true,cancelable:true,ctrlKey:true}));assert.equal(JSON.parse(f.w.sessionStorage.getItem('mokdaChatInquiryContext')).country,'France');
 assert.equal(f.requests(),0);f.dom.window.close();
}
// The editable selection, rather than a stale entry URL, is what reaches the receiver.
const contact=new JSDOM(read('contact.html'),{url:'https://www.mokda.kr/es/contact.html?purpose=distribution&product=original',runScripts:'outside-only'});
const cw=contact.window;cw.matchMedia=()=>({matches:false});cw.IntersectionObserver=class{observe(){}unobserve(){}};
cw.eval(read('site-i18n.js'));cw.eval(read('site-footer.js'));cw.eval(read('site-country-data.js'));
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
aw.eval(read('site-country-data.js'));
aw.MOKDA_ANALYTICS.track('chat_intent_select',{audience:'B2B',market:'France',funnel_stage:'qualified'});
assert.equal(aw.MOKDA_ANALYTICS.getDebugEvents().at(-1).market,'France');
aw.MOKDA_ANALYTICS.track('chat_open',{audience:'email@example.com',market:'PRIVATE_TEXT',funnel_stage:'PRIVATE_TEXT'});
const last=aw.MOKDA_ANALYTICS.getDebugEvents().at(-1);assert.equal(last.market,'');assert.equal(last.audience,'');assert.equal(last.funnel_stage,'');
analytics.window.close();

const backend={console};vm.createContext(backend);vm.runInContext(read('apps-script/b2b-lead-automation.gs'),backend);
for(const event of ['chat_open','chat_intent_select','chat_qualified','whatsapp_click'])assert(vm.runInContext('FUNNEL_EVENT_NAMES',backend).includes(event));
assert.deepEqual(Array.from(vm.runInContext('FUNNEL_HEADERS.slice(-3)',backend)),['Chat Audience','Chat Stage','Market']);
let columnCount=26,expanded=false,storedHeaders;
backend.ensureFunnelHeaders({getMaxColumns:()=>columnCount,insertColumnsAfter:(last,count)=>{assert.equal(last,26);columnCount+=count;expanded=true;},getLastRow:()=>0,getRange:(row,col,height,width)=>{assert(width<=columnCount);return {setValues:rows=>{storedHeaders=rows[0];}};},setFrozenRows:()=>{}});
assert(expanded);assert.equal(storedHeaders.length,29,'Existing 26-column collectors expand before writing new headers');

// The receiver preserves known global countries while rejecting free-text metadata.
let receivedRows;
backend.getRequiredProperty=()=> 'test-sheet';backend.ensureFunnelHeaders=()=>{};backend.refreshDashboardIfNeeded_=()=>{};
backend.SpreadsheetApp={openById:()=>({getSheetByName:()=>({getLastRow:()=>1,getRange:()=>({setValues:rows=>{receivedRows=rows;}})})})};
backend.CacheService={getScriptCache:()=>({get:()=>null,put(){}})};backend.LockService={getScriptLock:()=>({waitLock(){},releaseLock(){}})};
backend.appendFunnelEvents({events:[{name:'chat_qualified',eventId:'global-france',market:'France'},{name:'chat_qualified',eventId:'private-rejected',market:'PRIVATE_TEXT'},{name:'chat_qualified',eventId:'custom-region',market:'Other'}]});
assert.equal(receivedRows[0][28],'France');assert.equal(receivedRows[1][28],'');assert.equal(receivedRows[2][28],'Other');
console.log('Guided funnel regressions passed: 3-language short B2B paths, product context, gated handoff, draft continuity, language notice, specific answers, B2C updates and private-data-free events.');
