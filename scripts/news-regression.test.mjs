import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {JSDOM} from 'jsdom';
const root=new URL('../',import.meta.url),read=name=>readFileSync(new URL(name,root),'utf8');
const source=[read('site-news-data.js'),read('site-news-model.js'),read('site-news.js')];
function start(lang,page,query='',extend,configure){
 const dom=new JSDOM(read(`${lang}/${page}.html`),{url:`https://www.mokda.kr/${lang}/${page}.html${query}`,runScripts:'outside-only'}),w=dom.window;
 w.MOKDA_I18N={getLanguage:()=>({es:'ES',ko:'KR',en:'EN'}[lang]),syncLanguageButtons(){},bindLanguageButtons(){}};
 w.HTMLElement.prototype.scrollIntoView=function(){};
 w.HTMLMediaElement.prototype.play=async function(){};w.HTMLMediaElement.prototype.pause=w.HTMLMediaElement.prototype.load=function(){};
 if(configure)configure(w);
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
 const language={es:'ES',ko:'KR',en:'EN'}[lang],labels={es:{press:'En medios',news:'Novedades'},ko:{press:'언론사 보도자료',news:'소식'},en:{press:'Press coverage',news:'Updates'}}[lang];
 assert.deepEqual([...new Set([...d.querySelectorAll('[data-news-card] .news-kicker')].map(node=>node.textContent.trim()))].sort(),Object.values(labels).sort(),'Only the two public classifications are displayed');
 for(const story of w.MOKDA_NEWS.stories.filter(story=>story.archiveVisible!==false)){
  const item=d.querySelector(`[data-news-card="${story.id}"]`);
  assert.equal(item.dataset.category,story.category);
  assert.equal(item.querySelector('.news-kicker').textContent.trim(),labels[story.category]);
  const detail=start(lang,'news-'+story.id),dd=detail.window.document;
  assert.equal(dd.querySelectorAll('.news-related,.news-next').length,0,'Article details have no next-story section');
  assert(dd.querySelector('.news-article-heading .news-kicker').textContent.startsWith(labels[story.category]),'Article classification matches the archive');
  assert.equal(dd.querySelectorAll('.news-article-cover').length,1,'One cover is displayed above the article');
  assert.equal(dd.querySelectorAll('.news-article-cover [data-news-photo],.news-cover-photo').length,0,'The main photo is displayed without an enlargement action');
  assert.equal(dd.querySelectorAll('.news-article-cover > picture').length,story.videoAsCover?0:1,'A video cover is not duplicated as a photo');
  const photos=[...new Set(story.gallery)].filter(name=>name!==story.image),items=[...dd.querySelectorAll('.news-gallery-rail > .news-gallery-item')],videoCount=Number(Boolean(story.video&&!story.videoAsCover));
  assert.equal(dd.querySelectorAll('.news-photo-thumb').length,photos.length,'Each supporting photo appears once');
  assert.equal(items.length,photos.length+videoCount,'Photos and supporting footage share the same horizontal gallery');
  assert.equal(dd.querySelectorAll('.news-event-video,.news-gallery-grid,.news-gallery-group').length,0,'Supporting media do not create extra vertical sections');
  assert.equal(dd.querySelectorAll('.news-gallery figcaption,.news-gallery header p').length,0,'The gallery removes repetitive visible descriptions and enlargement instructions');
  if(items.length){
   assert.equal(dd.getElementById('newsGalleryTitle').textContent,{es:'Galería del evento',ko:'행사 현장 갤러리',en:'Event gallery'}[lang]);
   assert.equal(dd.getElementById('newsGalleryRail').getAttribute('role'),'region');
   assert.equal(dd.getElementById('newsGalleryRail').getAttribute('tabindex'),'0');
   assert.equal(dd.querySelector('.news-gallery-controls').hidden,items.length<2,'A single gallery item needs no navigation controls');
  }
  detail.window.close();
 }
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
 verifyPhotoViewer(lang,language,false);
 verifyPhotoViewer(lang,language,true);
 verifyGalleryNavigation(lang,false);
 verifyGalleryNavigation(lang,true);
}
function verifyPhotoViewer(lang,language,native){
 const nativeCalls={open:0,close:0},dom=start(lang,'news-expoalimentaria-2026','?utm_medium=verification',undefined,native?w=>{
  w.HTMLDialogElement.prototype.showModal=function(){assert.equal(this.open,false,'A native dialog opens only once');this.open=true;nativeCalls.open++;};
  w.HTMLDialogElement.prototype.close=function(){this.open=false;nativeCalls.close++;this.dispatchEvent(new w.Event('close'));};
 }:undefined),w=dom.window,d=w.document,data=w.MOKDA_NEWS,story=data.stories.find(story=>story.id==='expoalimentaria-2026'),album=[...new Set(story.gallery.filter(name=>name!==story.image))];
 const thumbs=[...d.querySelectorAll('.news-photo-thumb')],first=thumbs[0];
 assert.equal(d.querySelectorAll('.news-photo-dialog').length,0,'The photo viewer is created only when a photo is selected');
 assert.equal(d.querySelector('.news-article-cover [data-news-photo]'),null,'The cover does not participate in the photo viewer');
 const expectedCaption=name=>data.imageCaptions?.[name]?.[language]||(name===story.image?story[language].imageCaption:'')||data.imageDescriptions?.[name]?.[language]||story[language].imageAlt;
 first.focus();first.click();
 const dialog=d.querySelector('.news-photo-dialog'),image=dialog.querySelector('img'),caption=dialog.querySelector('.news-photo-caption'),count=dialog.querySelector('.news-photo-count'),error=dialog.querySelector('.news-photo-error'),close=dialog.querySelector('.news-photo-close'),previous=dialog.querySelector('[data-photo-nav="previous"]'),next=dialog.querySelector('[data-photo-nav="next"]');
 const key=(value,options={})=>{const event=new w.KeyboardEvent('keydown',{key:value,bubbles:true,cancelable:true,...options});dialog.dispatchEvent(event);return event;};
 const checkPhoto=index=>{
  assert.equal(image.getAttribute('src'),`/assets/images/news/${album[index]}.webp`,'Viewer uses the full image, not its small thumbnail');
  assert.equal(caption.textContent,expectedCaption(album[index]),'Caption follows the selected photo and language');
  assert.equal(count.textContent,`${index+1} / ${album.length}`);
  assert.equal(previous.disabled,index===0);assert.equal(next.disabled,index===album.length-1);
 };
 assert.equal(dialog.open,true);assert.equal(d.body.classList.contains('news-photo-open'),true);assert.equal(d.activeElement,close);
 assert.equal(dialog.getAttribute('aria-labelledby'),'newsPhotoTitle');assert.equal(dialog.getAttribute('aria-describedby'),'newsPhotoCaption');
 assert(caption.classList.contains('news-visually-hidden'),'Photo descriptions remain accessible without cluttering the viewer');
 checkPhoto(0);key('ArrowLeft');checkPhoto(0);key('ArrowRight');checkPhoto(1);previous.click();checkPhoto(0);next.click();checkPhoto(1);
 for(let i=1;i<album.length;i++)key('ArrowRight');checkPhoto(album.length-1);key('ArrowRight');checkPhoto(album.length-1);
 previous.focus();assert.equal(key('Tab').defaultPrevented,true);assert.equal(d.activeElement,close,'Tab wraps from the last enabled control');
 assert.equal(key('Tab',{shiftKey:true}).defaultPrevented,true);assert.equal(d.activeElement,previous,'Shift+Tab wraps from the first control');
 image.dispatchEvent(new w.Event('error'));assert.equal(image.hidden,true);assert.equal(error.hidden,false);assert.equal(error.querySelector('a').getAttribute('href'),`/assets/images/news/${album.at(-1)}.webp`,'An image failure offers the selected original');
 key('ArrowLeft');checkPhoto(album.length-2);assert.equal(image.hidden,false);assert.equal(error.hidden,true,'Selecting another photo clears the failure state');
 key('Escape');assert.equal(dialog.open,false);assert.equal(image.hasAttribute('src'),false);assert.equal(d.body.classList.contains('news-photo-open'),false);assert.equal(d.activeElement,first,'Escape returns focus to the selected gallery photo');
 first.focus();first.click();checkPhoto(0);assert.equal(d.querySelectorAll('.news-photo-dialog').length,1,'Reopening reuses the existing viewer');close.click();assert.equal(d.activeElement,first,'Close returns focus to the selected supporting photo');
 thumbs.at(-1).focus();thumbs.at(-1).click();checkPhoto(album.length-1);
 const cancel=new w.Event('cancel',{cancelable:true});dialog.dispatchEvent(cancel);assert.equal(cancel.defaultPrevented,true);assert.equal(dialog.open,false);assert.equal(d.activeElement,thumbs.at(-1),'Native cancel restores the triggering thumbnail');
 first.click();dialog.getBoundingClientRect=()=>({left:20,top:20,right:220,bottom:220});
 dialog.dispatchEvent(new w.MouseEvent('click',{bubbles:true,clientX:100,clientY:100}));assert.equal(dialog.open,true,'Clicks inside the dialog do not close it');
 image.dispatchEvent(new w.MouseEvent('click',{bubbles:true,clientX:0,clientY:0}));assert.equal(dialog.open,true,'Clicks on a photo do not count as backdrop clicks');
 dialog.dispatchEvent(new w.MouseEvent('click',{bubbles:true,clientX:0,clientY:0}));assert.equal(dialog.open,false);assert.equal(d.activeElement,first,'Backdrop closes the photo viewer and restores focus');
 const videoTrigger=d.querySelector('[data-news-video]');videoTrigger.click();const activeVideo=d.querySelector('video');
 first.focus();first.click();key('Escape');assert.equal(dialog.open,false);assert.equal(d.querySelector('video'),activeVideo,'Escape in the photo viewer leaves the inline video in place');assert.equal(activeVideo.hasAttribute('src'),true);assert.equal(d.activeElement,first,'Closing a photo preserves its own focus target while a video is playing');
 d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));assert.equal(d.querySelector('video'),null,'Escape outside the photo viewer still closes the inline video');
 first.click();w.dispatchEvent(new w.Event('pagehide'));assert.equal(dialog.open,false);assert.equal(image.hasAttribute('src'),false);assert.equal(d.body.classList.contains('news-photo-open'),false);assert.notEqual(d.activeElement,first,'Page exit releases media without moving focus back into the departing page');
 image.dispatchEvent(new w.Event('error'));assert.equal(error.hidden,true,'A stale error after closing is ignored');
 if(native){assert.equal(nativeCalls.open,6);assert.equal(nativeCalls.close,6);}else assert.equal(dialog.getAttribute('aria-modal'),'true','The fallback viewer retains modal semantics');
 dom.window.close();
}
function verifyGalleryNavigation(lang,reducedMotion){
 let width=700,observed,disconnected=false;const moves=[];
 const dom=start(lang,'news-expoalimentaria-2026','?utm_medium=verification',()=>{},w=>{
  w.matchMedia=()=>({matches:reducedMotion,addEventListener(){},removeEventListener(){}});
  Object.defineProperty(w.HTMLElement.prototype,'clientWidth',{configurable:true,get(){return this.classList.contains('news-gallery-rail')?width:0;}});
  Object.defineProperty(w.HTMLElement.prototype,'scrollWidth',{configurable:true,get(){return this.classList.contains('news-gallery-rail')?1630:0;}});
  const rect=w.HTMLElement.prototype.getBoundingClientRect;
  w.HTMLElement.prototype.getBoundingClientRect=function(){return this.classList.contains('news-gallery-item')?{width:300,height:200,left:0,right:300,top:0,bottom:200}:rect.call(this);};
  const computed=w.getComputedStyle.bind(w);w.getComputedStyle=node=>node.classList.contains('news-gallery-rail')?{gap:'20px'}:computed(node);
  w.HTMLElement.prototype.scrollBy=function(options){moves.push({...options,kind:'by'});this.scrollLeft=Math.max(0,Math.min(this.scrollWidth-this.clientWidth,this.scrollLeft+options.left));this.dispatchEvent(new w.Event('scroll'));};
  w.HTMLElement.prototype.scrollTo=function(options){moves.push({...options,kind:'to'});this.scrollLeft=Math.max(0,Math.min(this.scrollWidth-this.clientWidth,options.left));this.dispatchEvent(new w.Event('scroll'));};
  w.ResizeObserver=class{constructor(callback){this.callback=callback;observed=this;}observe(target){this.target=target;}disconnect(){disconnected=true;}};
 }),w=dom.window,d=w.document,rail=d.getElementById('newsGalleryRail'),previous=d.querySelector('[data-gallery-nav="previous"]'),next=d.querySelector('[data-gallery-nav="next"]');
 const key=(target,value)=>{const event=new w.KeyboardEvent('keydown',{key:value,bubbles:true,cancelable:true});target.dispatchEvent(event);return event;};
 assert.equal(observed.target,rail,'Gallery navigation observes its own available width');
 assert.equal(previous.disabled,true);assert.equal(next.disabled,false);
 next.click();assert.equal(rail.scrollLeft,320,'Next advances by one photo and its spacing');assert.deepEqual(moves.at(-1),{left:320,behavior:reducedMotion?'instant':'smooth',kind:'by'});
 assert.equal(key(rail,'ArrowRight').defaultPrevented,true);assert.equal(rail.scrollLeft,640);
 assert.equal(key(rail,'ArrowLeft').defaultPrevented,true);assert.equal(rail.scrollLeft,320);
 previous.click();assert.equal(rail.scrollLeft,0);assert.equal(previous.disabled,true);
 assert.equal(key(rail,'End').defaultPrevented,true);assert.equal(rail.scrollLeft,930);assert.equal(next.disabled,true);assert.equal(previous.disabled,false);
 assert.equal(key(rail,'Home').defaultPrevented,true);assert.equal(rail.scrollLeft,0);assert.equal(previous.disabled,true);assert.equal(next.disabled,false);
 const movementCount=moves.length,thumbnail=d.querySelector('.news-photo-thumb'),videoTrigger=rail.querySelector('[data-news-video]');
 assert.equal(key(thumbnail,'ArrowRight').defaultPrevented,false,'Arrow keys on a gallery photo are not captured by its parent rail');
 videoTrigger.click();const player=rail.querySelector('video');assert(player,'The event video plays inside its gallery card');
 assert.equal(key(player,'ArrowLeft').defaultPrevented,false,'Native video arrow controls remain available');assert.equal(moves.length,movementCount);
 rail.querySelector('.news-inline-close').click();assert.equal(d.activeElement,videoTrigger,'Closing a gallery video restores its trigger focus');
 width=1630;w.dispatchEvent(new w.Event('resize'));assert.equal(previous.disabled,true);assert.equal(next.disabled,true,'Both controls disable when every item fits');
 width=700;observed.callback();assert.equal(next.disabled,false,'Navigation adapts when the gallery becomes narrower');
 w.dispatchEvent(new w.Event('pagehide'));assert.equal(disconnected,true,'Page exit disconnects gallery size observation');
 rail.scrollLeft=930;rail.dispatchEvent(new w.Event('scroll'));assert.equal(previous.disabled,true);assert.equal(next.disabled,false,'Page exit removes the gallery scroll listener');
 width=1630;w.dispatchEvent(new w.Event('resize'));assert.equal(next.disabled,false,'Page exit removes the window resize listener');
 dom.window.close();
 const videoOnly=start(lang,'news-kpop-style','?utm_medium=verification',data=>{data.stories.find(story=>story.id==='kpop-style').gallery=[];});
 const vd=videoOnly.window.document;
 assert.equal(vd.querySelectorAll('.news-gallery-rail > .news-gallery-item').length,1,'An article with only supporting footage still has one gallery card');
 assert.equal(vd.querySelectorAll('.news-photo-thumb').length,0);assert.equal(vd.querySelector('.news-gallery-controls').hidden,true);
 vd.querySelector('.news-gallery-rail [data-news-video]').click();assert.equal(vd.querySelectorAll('.news-gallery-rail video').length,1);assert.equal(vd.querySelectorAll('.news-photo-dialog').length,0);
 videoOnly.window.close();
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
console.log('News regressions passed: growing archive/search/history, two classifications, static covers and 3-language horizontal media galleries, reduced-motion/keyboard/bounds/resize cleanup, native/fallback photo viewer navigation/focus/cleanup/error handling, 5 inline players and conveyor controls.');
