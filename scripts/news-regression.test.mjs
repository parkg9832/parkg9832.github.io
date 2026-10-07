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
 assert.equal(d.querySelectorAll('[data-news-card]').length,w.MOKDA_NEWS.stories.length);
 assert.equal(d.querySelectorAll('[data-news-video]').length,0,'Archive contains stories rather than a promotional video section');
 assert.equal(d.querySelectorAll('.news-feature').length,0);
 assert.equal(d.querySelectorAll('video').length,0);
 for(const category of ['events','news','collaborations','all']){
  d.querySelector(`[data-news-filter="${category}"]`).click();const expected=w.MOKDA_NEWS.stories.filter(s=>category==='all'||s.category===category).length;
  assert.equal(d.querySelector('[data-news-filter][aria-current]').dataset.newsFilter,category);
  assert.match(d.querySelector('.news-result-status').textContent,new RegExp('^'+expected));
  assert.equal(d.querySelectorAll('[data-news-card]:not([hidden])').length,Math.min(9,expected));
  assert.equal(new URL(w.location.href).searchParams.get('utm_source'),'partner');
 }
 const input=d.getElementById('newsSearch');input.value='KOTRA';d.querySelector('[data-search-news]').click();assert.equal(d.querySelectorAll('[data-news-card]:not([hidden])').length,2);assert.equal(new URL(w.location.href).searchParams.get('q'),'KOTRA');
 input.value='nothing-match-fixture';d.querySelector('[data-search-news]').click();assert.equal(d.getElementById('newsEmpty').hidden,false);d.querySelector('[data-reset-news]').click();assert.equal(new URL(w.location.href).searchParams.has('q'),false);
 w.history.replaceState(null,'','?category=news');w.dispatchEvent(new w.PopStateEvent('popstate'));assert.equal(d.querySelector('[aria-current][data-news-filter]').dataset.newsFilter,'news');
 dom.window.close();
 const direct=start(lang,'news','?category=collaborations');assert.equal(direct.window.document.querySelectorAll('[data-news-card]:not([hidden])').length,1);direct.window.close();
 const creators=start(lang,'news-creators'),c=creators.window.document;
 assert.equal(c.querySelectorAll('[data-news-video]').length,5);
 assert.equal(c.querySelectorAll('.news-video-card > p').length,0,'Remove repetitive mini headlines');
 assert(!/처음 만나는 Salsa Coreana|식탁에서 만난 Salsa Coreana|La primera presentación|Salsa Coreana en la mesa/.test(c.body.textContent));
 for(const button of c.querySelectorAll('[data-news-video]')){button.focus();button.click();const wrapper=button.nextElementSibling,video=wrapper.querySelector('video');assert(wrapper.classList.contains('news-inline-player'));assert.equal(button.hidden,true);assert.equal(c.querySelectorAll('video').length,1);assert(statSync(new URL(video.getAttribute('src').slice(1),root)).size>10000);wrapper.querySelector('.news-inline-close').click();assert.equal(video.hasAttribute('src'),false);assert.equal(c.querySelectorAll('video').length,0);assert.equal(button.hidden,false);assert.equal(c.activeElement,button);}
 const buttons=c.querySelectorAll('[data-news-video]');buttons[0].click();const previous=c.querySelector('video');buttons[1].click();assert.equal(previous.hasAttribute('src'),false);assert.equal(c.querySelectorAll('video').length,1);assert.equal(buttons[0].hidden,false);c.querySelector('video').dispatchEvent(new creators.window.Event('error'));assert.equal(c.querySelector('.news-inline-error').hidden,false);c.dispatchEvent(new creators.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(c.querySelectorAll('video').length,0);assert.equal(c.activeElement,buttons[1]);
 assert.equal(c.querySelectorAll('dialog').length,0);const toggle=c.querySelector('[data-conveyor="toggle"]');toggle.click();assert.equal(toggle.getAttribute('aria-pressed'),'true');toggle.click();assert.equal(toggle.getAttribute('aria-pressed'),'false');creators.window.close();
 const home=new JSDOM(read(`${lang}/index.html`));assert.equal(home.window.document.querySelectorAll('#home-news [data-home-feature]').length,1);assert.equal(home.window.document.querySelectorAll('#home-news .home-news-grid .news-card').length,2);assert.equal(home.window.document.querySelectorAll('#home-news [data-news-video]').length,0);home.window.close();
}
const growing=start('en','news','?utm_source=partner',data=>{
 const example=data.stories[0];for(let i=0;i<20;i++)data.stories.push({...JSON.parse(JSON.stringify(example)),id:'fixture-'+i,category:'news',publishedDate:'2027-09-'+String(i+1).padStart(2,'0'),homeFeatured:false});
});
const gd=growing.window.document,gw=growing.window;
assert.equal(gd.querySelectorAll('[data-news-card]:not([hidden])').length,9);
assert.equal(gd.querySelector('[data-news-card]:not([hidden])').dataset.newsCard,'fixture-19');
gd.querySelector('[data-news-page="2"]').click();assert.equal(gd.querySelectorAll('[data-news-card]:not([hidden])').length,9);assert.equal(new URL(gw.location.href).searchParams.get('utm_source'),'partner');
gd.querySelector('[data-news-page="3"]').click();assert.equal(gd.querySelectorAll('[data-news-card]:not([hidden])').length,8);
gd.querySelector('[data-news-filter="events"]').click();assert.equal(new URL(gw.location.href).searchParams.has('page'),false);assert.equal(gd.querySelectorAll('[data-news-card]:not([hidden])').length,2);
const model=gw.MOKDA_NEWS_MODEL;assert.equal(model.archive(gw.MOKDA_NEWS,{language:'ES',query:'Peru'}).total,25);assert.equal(model.archive(gw.MOKDA_NEWS,{page:999}).page,3);
growing.window.close();
console.log('News regressions passed: growing archive/search/history, 3-language home selections, 5 inline players, single playback/cleanup/focus/error fallback and conveyor controls.');
