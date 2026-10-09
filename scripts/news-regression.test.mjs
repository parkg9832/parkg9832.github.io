import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {JSDOM} from 'jsdom';
const root=new URL('../',import.meta.url),read=name=>readFileSync(new URL(name,root),'utf8');
const source=[read('site-news-data.js'),read('site-news-model.js'),read('site-news.js')];
function start(lang,page,query='',extend){
 const dom=new JSDOM(read(`${lang}/${page}.html`),{url:`https://www.mokda.kr/${lang}/${page}.html${query}`,runScripts:'outside-only'}),w=dom.window;
 w.MOKDA_I18N={getLanguage:()=>({es:'ES',ko:'KR',en:'EN'}[lang]),syncLanguageButtons(){},bindLanguageButtons(){}};
 w.HTMLElement.prototype.scrollIntoView=function(){};
 w.HTMLMediaElement.prototype.play=async function(){};w.HTMLMediaElement.prototype.pause=w.HTMLMediaElement.prototype.load=function(){};
 w.eval(source[0]);if(extend){extend(w.MOKDA_NEWS);w.document.getElementById('newsContent').replaceChildren();}w.eval(source[1]);w.eval(source[2]);return dom;
}
for(const lang of ['es','ko','en']){
 const dom=start(lang,'news','?utm_source=partner'),w=dom.window,d=w.document;
 assert.equal(d.querySelectorAll('[data-news-card]').length,7);
 assert.equal(d.querySelector('[data-news-card="creators"]'),null,'Creator collection is excluded from the archive');
 assert.equal(d.querySelector('[data-news-card="kotra-interview"] time').dateTime,'2026-10-06');
 assert.equal(d.querySelector('[data-news-card="kpop-style"] time').dateTime,'2026-09-27');
 assert.deepEqual([...d.querySelectorAll('[data-news-card="expoalimentaria-2026"] time')].map(t=>t.dateTime),['2026-09-23','2026-09-25']);
 assert.equal(d.querySelector('[data-news-card="congreso"] time').dateTime,'2026-09-23');
 assert.equal(d.querySelector('[data-news-card="kotra-lima"] time'),null,'Do not substitute an upload date for an unconfirmed meeting date');
 assert.equal(d.querySelector('[data-news-card]').dataset.newsCard,'kotra-interview','Order the archive by actual event or source dates');
 assert.equal(d.querySelectorAll('[data-news-video]').length,0,'Archive contains stories rather than a promotional video section');
 assert.equal(d.querySelectorAll('.news-feature').length,0);
 assert.equal(d.querySelectorAll('video').length,0);
 assert.equal(d.querySelectorAll('[data-news-filter],.news-filters').length,0,'Search-only archive');
 assert.equal(new URL(w.location.href).searchParams.get('utm_source'),'partner');
 const input=d.getElementById('newsSearch');input.value='KOTRA';d.querySelector('[data-search-news]').click();assert.equal(d.querySelectorAll('[data-news-card]:not([hidden])').length,3);assert.equal(new URL(w.location.href).searchParams.get('q'),'KOTRA');
 input.value='nothing-match-fixture';d.querySelector('[data-search-news]').click();assert.equal(d.getElementById('newsEmpty').hidden,false);d.querySelector('[data-reset-news]').click();assert.equal(new URL(w.location.href).searchParams.has('q'),false);
 w.history.replaceState(null,'','?q=KOTRA');w.dispatchEvent(new w.PopStateEvent('popstate'));assert.equal(d.querySelectorAll('[data-news-card]:not([hidden])').length,3);assert.equal(input.value,'KOTRA');
 dom.window.close();
 const direct=start(lang,'news','?category=collaborations&utm_source=partner');assert.equal(direct.window.document.querySelectorAll('[data-news-card]:not([hidden])').length,7);assert.equal(new URL(direct.window.location.href).searchParams.has('category'),false);assert.equal(new URL(direct.window.location.href).searchParams.get('utm_source'),'partner');direct.window.close();
 for(const id of ['gimje-hint','gimje-youth-day']){const detail=start(lang,'news-'+id);assert(detail.window.document.querySelector('h1').textContent.trim());detail.window.close();}
 const creators=start(lang,'news-creators'),c=creators.window.document;
 assert.equal(c.querySelectorAll('[data-news-video]').length,5);
 assert.equal(c.querySelectorAll('.news-video-card > p').length,0,'Remove repetitive mini headlines');
 assert(!/처음 만나는 Salsa Coreana|식탁에서 만난 Salsa Coreana|La primera presentación|Salsa Coreana en la mesa/.test(c.body.textContent));
 for(const button of c.querySelectorAll('[data-news-video]')){button.focus();button.click();const wrapper=button.nextElementSibling,video=wrapper.querySelector('video');assert(wrapper.classList.contains('news-inline-player'));assert.equal(button.hidden,true);assert.equal(c.querySelectorAll('video').length,1);assert(statSync(new URL(video.getAttribute('src').slice(1),root)).size>10000);wrapper.querySelector('.news-inline-close').click();assert.equal(video.hasAttribute('src'),false);assert.equal(c.querySelectorAll('video').length,0);assert.equal(button.hidden,false);assert.equal(c.activeElement,button);}
 const buttons=c.querySelectorAll('[data-news-video]');buttons[0].click();const previous=c.querySelector('video');buttons[1].click();assert.equal(previous.hasAttribute('src'),false);assert.equal(c.querySelectorAll('video').length,1);assert.equal(buttons[0].hidden,false);c.querySelector('video').dispatchEvent(new creators.window.Event('error'));assert.equal(c.querySelector('.news-inline-error').hidden,false);c.dispatchEvent(new creators.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(c.querySelectorAll('video').length,0);assert.equal(c.activeElement,buttons[1]);
 assert.equal(c.querySelectorAll('dialog').length,0);const toggle=c.querySelector('[data-conveyor="toggle"]');toggle.click();assert.equal(toggle.getAttribute('aria-pressed'),'true');toggle.click();assert.equal(toggle.getAttribute('aria-pressed'),'false');creators.window.close();
 const home=new JSDOM(read(`${lang}/index.html`));assert.equal(home.window.document.querySelectorAll('#home-news .home-news-grid .news-card').length,3);assert.equal(home.window.document.querySelectorAll('#home-news .news-feature,#home-news .news-card-summary,#home-news .news-card-read').length,0);assert.equal(home.window.document.querySelectorAll('#home-news a').length,4);assert.equal(home.window.document.querySelectorAll('#home-news [data-news-video]').length,0);home.window.close();
}
const growing=start('en','news','?utm_source=partner',data=>{
 const example=data.stories[0];for(let i=0;i<20;i++)data.stories.push({...JSON.parse(JSON.stringify(example)),id:'fixture-'+i,category:'news',publishedDate:'2027-09-'+String(i+1).padStart(2,'0'),homeFeatured:false});
});
const gd=growing.window.document,gw=growing.window;
assert.equal(gd.querySelectorAll('[data-news-card]:not([hidden])').length,9);
assert.equal(gd.querySelector('[data-news-card]:not([hidden])').dataset.newsCard,'fixture-19');
gd.querySelector('[data-news-page="2"]').click();assert.equal(gd.querySelectorAll('[data-news-card]:not([hidden])').length,9);assert.equal(new URL(gw.location.href).searchParams.get('utm_source'),'partner');
gd.querySelector('[data-news-page="3"]').click();assert.equal(gd.querySelectorAll('[data-news-card]:not([hidden])').length,9);
gd.getElementById('newsSearch').value='KPOP';gd.querySelector('[data-search-news]').click();assert.equal(new URL(gw.location.href).searchParams.has('page'),false);assert.equal(gd.querySelectorAll('[data-news-card]:not([hidden])').length,1);
const model=gw.MOKDA_NEWS_MODEL;assert.equal(model.archive(gw.MOKDA_NEWS,{language:'ES',query:'Peru'}).total,25);assert.equal(model.archive(gw.MOKDA_NEWS,{page:999}).page,3);assert.equal(model.archive(gw.MOKDA_NEWS,{language:'ES',query:'creadores'}).total,0,'Search excludes the removed collection');
growing.window.close();
console.log('News regressions passed: growing archive/search/history, 3-language home selections, 5 inline players, single playback/cleanup/focus/error fallback and conveyor controls.');
