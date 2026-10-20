import {readFileSync} from 'node:fs';
import {JSDOM,VirtualConsole} from 'jsdom';
export const read=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
export const KEY='mokdaGuidedHelpV3';
export function fixture(language='ES',{product='',saved,legacy,width=1440,number,blocked=false,prepare=true,reduced=false}={}){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM('<html><body><main><button id="outside">Outside</button><a href="contact.html" data-chat-intent="business" data-product="K-PEÑO">Business</a></main></body></html>',{url:`https://www.mokda.kr/${{KR:'ko',ES:'es',EN:'en'}[language]}/${product?product+'.html':''}`,runScripts:'outside-only',virtualConsole:vc});
 const w=dom.window,d=w.document,timers=new Map(),events=[];let id=0,requests=0;
 d.documentElement.dataset.routeLanguage=language;if(product)d.body.dataset.productDetail=product;
 w.innerWidth=width;w.matchMedia=()=>({matches:reduced});w.scrollTo=()=>{};
 w.setTimeout=(fn,delay=0)=>{timers.set(++id,{fn,delay});return id;};w.clearTimeout=i=>timers.delete(i);
 const seen=new Set();w.MOKDA_ANALYTICS={track:(name,details)=>events.push({name,details}),trackOncePerSession:(key,name,details)=>{if(!seen.has(key)){seen.add(key);events.push({name,details});}}};
 w.fetch=()=>{requests++;throw Error('Guide must not call the network');};w.navigator.sendBeacon=w.fetch;
 Object.defineProperty(w,'MOKDA_CHAT_AI_CLIENT',{get(){throw Error('Guide must not use AI');}});
 Object.assign(w.HTMLDialogElement.prototype,{show(){this.open=true;},showModal(){this.open=true;},close(){this.open=false;this.dispatchEvent(new w.Event('close'));}});
 if(saved)w.sessionStorage.setItem(KEY,saved);if(legacy)w.sessionStorage.setItem('mokdaChatSessionV2',legacy);
 if(blocked)Object.defineProperty(w,'sessionStorage',{get(){throw Error('Storage blocked');}});
 for(const file of ['site-contact-config.js','site-company-knowledge.js','site-help-data.js','site-country-data.js','site-help-flow.js','site-help.js']){w.eval(read(file));if(file==='site-contact-config.js'&&number!==undefined)w.MOKDA_CONTACT.whatsappNumber=number;}
 const flush=()=>{for(const[i,{fn}]of [...timers]){timers.delete(i);fn();}};const settle=()=>{for(let n=0;n<4;n++)flush();};
 const act=(type,value='')=>{const button=[...d.querySelectorAll('[data-help-action]')].find(x=>x.dataset.helpAction===type&&x.dataset.helpValue===value);if(!button)throw Error('Missing visible choice: '+type+':'+value);button.click();settle();};
 const set=(name,value)=>{const field=d.querySelector(`[name="${name}"]`);if(!field)throw Error('Missing field '+name);field.value=value;field.dispatchEvent(new w.Event(field.tagName==='SELECT'?'change':'input',{bubbles:true}));return field;};
 const submit=()=>{d.querySelector('.help-business-form,.help-inquiry-form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));settle();};
 const details=(country='PE',role='importer',sauce='both')=>{set('businessCountry',country);set('businessType',role);set('businessProduct',sauce);submit();};
 const extra=(value,country='PE')=>{set('businessCountry',country);set('additionalQuestion',value);submit();};
 const last=()=>[...d.querySelectorAll('.help-message-bot')].at(-1)?.textContent||'';
 if(prepare){w.MOKDA_HELP_UI.open();settle();}
 return{dom,w,d,events,errors,timers,flush,settle,act,set,submit,details,extra,last,requests:()=>requests};
}
