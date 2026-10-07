(() => {
  'use strict';
  const data=window.MOKDA_NEWS,model=window.MOKDA_NEWS_MODEL;
  if(!data||!model||!window.MOKDA_I18N)return;
  const language=window.MOKDA_I18N.getLanguage(),copy=data.copy[language]||data.copy.ES;
  const prefix={ES:'es',KR:'ko',EN:'en'}[language];
  const motionCopy={KR:{previous:'이전 영상',next:'다음 영상',pause:'자동 이동 멈추기',resume:'자동 이동 켜기'},ES:{previous:'Video anterior',next:'Siguiente video',pause:'Pausar desplazamiento',resume:'Activar desplazamiento'},EN:{previous:'Previous video',next:'Next video',pause:'Pause movement',resume:'Start movement'}}[language];
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const path=page=>`/${prefix}/${page}`,storyPath=story=>path(`news-${story.id}.html`);
  const media=name=>`/assets/images/news/${name}.webp`,videoPath=name=>`/assets/videos/news/${name}.mp4`;
  const storyCopy=story=>story[language]||story.ES,typography=language==='KR'?'news-display news-korean':'news-display';
  const date=value=>new Intl.DateTimeFormat({ES:'es-419',KR:'ko-KR',EN:'en'}[language],{year:'numeric',month:'short',day:'numeric',timeZone:'UTC'}).format(new Date(value+'T12:00:00Z'));
  const picture=(name,alt,extra='')=>`<picture><source media="(max-width:639px)" srcset="${media(name+'-640')}"><img src="${media(name)}" alt="${esc(alt)}" width="1200" height="900" decoding="async" ${extra}></picture>`;
  const cover=(story,extra='')=>story.id==='creators'?`<div class="news-cover-collage">${data.creators.slice(0,3).map(c=>`<img src="${media(c.image+'-640')}" alt="${esc(c.name)}" width="360" height="640" loading="lazy" decoding="async">`).join('')}</div>`:picture(story.image,storyCopy(story).imageAlt,extra);
  const tag=story=>`<p class="news-kicker">${esc(copy[story.category])}${story.location?' <span aria-hidden="true">/</span> '+esc(story.location):''}</p>`;
  function card(story,home=false){
    const text=storyCopy(story),published=model.published(data,story);
    const title=home===true?(story.cardTitles?.[language]||text.title):text.title;
    const visual=home&&story.videoAsCover&&story.videoPoster?picture(story.videoPoster,text.imageAlt,'loading="lazy"'):cover(story,'loading="lazy"');
    return `<article class="news-card" data-news-card="${story.id}" data-category="${story.category}"><a class="news-card-link" href="${storyPath(story)}" aria-label="${esc(text.title)}"><div class="news-card-image">${visual}</div><div class="news-card-copy"><div class="news-card-meta"><p class="news-kicker">${esc(copy[story.category])}</p>${home?'':`<time datetime="${published}">${esc(date(published))}</time>`}</div><h3>${esc(title)}</h3></div></a></article>`;
  }
  function creators(){return `<section class="news-creators" id="creators" aria-labelledby="newsCreatorsTitle"><div class="news-creators-heading"><div><p class="news-kicker">${esc(copy.collaborations)}</p><h2 id="newsCreatorsTitle" class="${typography}">${esc(copy.creatorsTitle)}</h2>${document.body.dataset.newsStory==='creators'?'':`<p>${esc(copy.creatorsIntro)}</p>`}</div><div class="news-creators-actions">${document.body.dataset.newsStory!=='creators'?`<a class="news-text-link" href="${path('news-creators.html')}">${esc(copy.read)} ↗</a>`:''}<div class="news-conveyor-controls"><button type="button" data-conveyor="previous" aria-controls="newsCreatorRail" aria-label="${esc(motionCopy.previous)}">←</button><button type="button" data-conveyor="toggle" aria-controls="newsCreatorRail" aria-label="${esc(motionCopy.pause)}" aria-pressed="false">Ⅱ</button><button type="button" data-conveyor="next" aria-controls="newsCreatorRail" aria-label="${esc(motionCopy.next)}">→</button></div></div></div><div class="news-video-grid" id="newsCreatorRail" tabindex="0" aria-label="${esc(copy.creatorsTitle)}">${data.creators.map(c=>`<article class="news-video-card"><button type="button" class="news-video-preview" data-news-video="${c.video}" data-video-title="${esc('MOKDA × '+c.name)}" data-video-summary="${esc(copy.creatorVideo)}" aria-label="${esc(copy.watch+' · '+c.name)}"><img src="${media(c.image+'-640')}" alt="${esc('MOKDA × '+c.name)}" width="360" height="640" loading="lazy" decoding="async"><span class="news-video-duration">${esc(c.duration)}</span><span class="news-play" aria-hidden="true">▶</span></button><h3>${esc(c.name)}</h3></article>`).join('')}</div></section>`;}
  function videoPreview(story) {
    const text=storyCopy(story),portrait=story.video==='expo-visit';
    return `<button type="button" class="news-video-preview ${portrait?'news-portrait-video':'news-landscape-video'}" data-news-video="${story.video}" data-video-title="${esc(text.title)}" aria-label="${esc(copy.watch+' · '+text.title)}">${picture(story.videoPoster||story.image,story.videoDescriptions?.[language]||text.imageAlt,'loading="lazy"')}<span class="news-play" aria-hidden="true">▶</span><span class="news-video-action">${esc(copy.watch)}</span></button>`;
  }
  const proof=document.getElementById('proof');
  if(proof){
    const featured=model.featured(data).slice(0,3);
    let section=document.getElementById('home-news');
    if(!section&&featured.length){
      section=document.createElement('section');section.id='home-news';section.className='home-news';section.setAttribute('aria-labelledby','homeNewsTitle');
      section.innerHTML=`<div class="news-container"><div class="home-news-heading"><h2 id="homeNewsTitle" class="${typography}">${esc(copy.homeTitle)}</h2><a class="news-text-link home-news-more" href="${path('news.html')}">${esc(copy.viewAll)} <span aria-hidden="true">↗</span></a></div><div class="home-news-grid" tabindex="0" aria-label="${esc(copy.title)}">${featured.map(story=>card(story,true)).join('')}</div></div>`;
    }
    if(section)(document.getElementById('faq')||proof).before(section);
  }
  const main=document.getElementById('newsContent');
  if(main){const story=data.stories.find(s=>s.id===document.body.dataset.newsStory);
    if(!main.children.length){if(story){

        const text=storyCopy(story),collection=story.id==='creators';
        const nextLabel={KR:'다음 소식',ES:'Más de MOKDA',EN:'More from MOKDA'}[language];
        const heading=`<header class="news-article-heading${collection?' is-video-collection':''}">${tag(story)}<h1 class="${typography}">${esc(text.title)}</h1><p class="news-article-lead">${esc(text.summary)}</p><div class="news-meta"><span>${esc(copy.date)} <time datetime="${model.published(data,story)}">${esc(date(model.published(data,story)))}</time></span>${story.eventDate?`<span>${esc(copy.event)} <time datetime="${story.eventDate}">${esc(date(story.eventDate))}</time>${story.eventEndDate?' – '+esc(date(story.eventEndDate)):''}</span>`:''}</div></header>`;
        const visual=collection?'':`<figure class="news-article-cover${story.videoAsCover?' is-video-cover':''}">${story.videoAsCover?videoPreview(story):cover(story,'fetchpriority="high"')}${text.imageCaption?`<figcaption class="news-cover-caption">${esc(text.imageCaption)}</figcaption>`:''}</figure>`;
        const body=collection?'':`<div class="news-article-body">${text.sections.map(([,body])=>`<p>${esc(body)}</p>`).join('')}${story.sources?.length?`<section class="news-sources"><h2>${esc(copy.sources)}</h2><div>${story.sources.map(source=>`<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.labels?.[language]||source.label)} ↗</a>`).join('')}</div></section>`:''}</div>`;
        const footage=story.video&&!story.videoAsCover?`<section class="news-event-video${story.video==='expo-visit'?' is-portrait':''}"><h2 class="${typography}">${esc(copy.footage)}</h2>${videoPreview(story)}</section>`:'';
        const gallery=story.gallery.length?`<section class="news-gallery"><h2 class="${typography}">${esc(copy.photos)}</h2><div>${story.gallery.map(name=>{const description=data.imageDescriptions?.[name]?.[language]||text.imageAlt;return `<figure>${picture(name,description,'loading="lazy"')}<figcaption>${esc(data.imageCaptions?.[name]?.[language]||description)}</figcaption></figure>`;}).join('')}</div></section>`:'';
        const related=story.related.map(id=>data.stories.find(item=>item.id===id)).filter(Boolean);
        const next=related.length?`<section class="news-related"><h2>${esc(nextLabel)}</h2><div class="news-next-grid">${related.map(item=>`<a class="news-next-link" href="${storyPath(item)}" aria-label="${esc(storyCopy(item).title)}"><div class="news-next-image">${cover(item,'loading="lazy"')}</div><div class="news-next-copy"><p class="news-kicker">${esc(copy[item.category])}</p><h3>${esc(item.cardTitles?.[language]||storyCopy(item).title)}</h3></div><span class="news-next-arrow" aria-hidden="true">↗</span></a>`).join('')}</div></section>`:'';
        main.innerHTML=`<div class="news-container news-detail"><a class="news-back" href="${path('news.html')}">← ${esc(copy.back)}</a><div class="news-story-hero${collection?' is-collection':''}">${heading}${visual}</div>${body}${footage}${gallery}${collection?creators():''}${next}</div>`;

    }else{main.innerHTML=`<div class="news-container news-listing"><div class="news-listing-head"><header class="news-page-heading"><p class="news-kicker">MOKDA / ${esc(copy.archiveLabel)}</p><h1 class="${typography}">${esc(copy.title)}</h1><p>${esc(copy.intro)}</p></header><div class="news-archive-tools"><div class="news-search" role="search"><label class="news-visually-hidden" for="newsSearch">${esc(copy.search)}</label><input type="search" id="newsSearch" maxlength="150" placeholder="${esc(copy.searchPlaceholder)}"><button type="button" data-search-news aria-label="${esc(copy.search)}">⌕</button></div></div></div><div class="news-archive-meta"><p class="news-result-status" role="status" aria-live="polite"></p><button type="button" class="news-text-link" data-clear-search hidden>${esc(copy.clearSearch)} ×</button></div><section class="news-stories" aria-labelledby="newsMoreTitle"><h2 id="newsMoreTitle" class="news-visually-hidden">${esc(copy.archiveLabel)}</h2><div class="news-stories-grid" id="newsStories">${model.ordered(data).map(story=>card(story)).join('')}</div><div id="newsEmpty" class="news-empty" hidden><p>${esc(copy.noResults)}</p><button type="button" class="news-button" data-reset-news>${esc(copy.all)}</button></div></section><nav class="news-pagination" aria-label="${esc(copy.pagination)}"></nav></div>`;}}
    window.MOKDA_FOOTER?.render(language);window.MOKDA_I18N.syncLanguageButtons(language);window.MOKDA_I18N.bindLanguageButtons(()=>{});
    if(!story){const input=document.getElementById('newsSearch');
      const initialUrl=new URL(location.href);if(initialUrl.searchParams.has('category')){initialUrl.searchParams.delete('category');history.replaceState(null,'',initialUrl);}
      function apply(){const params=new URLSearchParams(location.search),state=model.archive(data,{language,query:params.get('q')||'',page:params.get('page')});input.value=state.query;
        const ids=new Set(state.visible.map(s=>s.id));main.querySelectorAll('[data-news-card]').forEach(card=>{card.hidden=!ids.has(card.dataset.newsCard);});
        main.querySelector('.news-result-status').textContent=`${state.total}${language==='KR'?'':' '}${copy.results}`;main.querySelector('[data-clear-search]').hidden=!state.query;document.getElementById('newsEmpty').hidden=state.total>0;
        const pagination=main.querySelector('.news-pagination');pagination.hidden=state.pages<2;
        const urlForPage=page=>{const url=new URL(location.href);if(page===1)url.searchParams.delete('page');else url.searchParams.set('page',page);return url.pathname+url.search;};
        const pages=[...new Set([1,state.page-1,state.page,state.page+1,state.pages].filter(p=>p>0&&p<=state.pages))].sort((a,b)=>a-b);
        pagination.innerHTML=`${state.page>1?`<a href="${esc(urlForPage(state.page-1))}" data-news-page="${state.page-1}" class="news-page-prev">← ${esc(copy.previous)}</a>`:'<span></span>'}<div>${pages.map((p,i)=>`${i&&p-pages[i-1]>1?'<span aria-hidden="true">…</span>':''}<a href="${esc(urlForPage(p))}" data-news-page="${p}"${p===state.page?' aria-current="page"':''}>${p}</a>`).join('')}</div>${state.page<state.pages?`<a href="${esc(urlForPage(state.page+1))}" data-news-page="${state.page+1}" class="news-page-next">${esc(copy.next)} →</a>`:'<span></span>'}`;
      }
      function change(updates,replace=false){const url=new URL(location.href);Object.entries(updates).forEach(([key,value])=>{if(!value||value==='all'||(key==='page'&&Number(value)===1))url.searchParams.delete(key);else url.searchParams.set(key,value);});history[replace?'replaceState':'pushState'](null,'',url);apply();}
      apply();main.addEventListener('click',event=>{const link=event.target.closest('[data-news-page]');if(!link||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0)return;event.preventDefault();{change({page:link.dataset.newsPage});main.querySelector('.news-archive-tools').scrollIntoView({block:'start',behavior:'instant'});}});
      let timer;input.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>change({q:input.value.trim(),page:1},true),250);});input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();clearTimeout(timer);change({q:input.value.trim(),page:1});}});
      main.querySelector('[data-search-news]').addEventListener('click',()=>{clearTimeout(timer);change({q:input.value.trim(),page:1});});main.querySelector('[data-clear-search]').addEventListener('click',()=>{change({q:'',page:1});input.focus();});main.querySelector('[data-reset-news]').addEventListener('click',()=>change({q:'',page:1}));window.addEventListener('popstate',apply);
    }
    main.querySelector('[data-copy-news]')?.addEventListener('click',async()=>{const status=main.querySelector('.news-share-status');try{await navigator.clipboard.writeText(location.href);status.textContent=copy.copied;}catch{status.textContent=copy.copyError;}});
  }
  // The requested video replaces its thumbnail in place. Only one player exists.
  let active;
  function closeVideo(restoreFocus=true) {
    if(!active)return;
    const {button,wrapper,player}=active;
    player.pause();player.removeAttribute('src');player.removeAttribute('poster');player.load();
    wrapper.remove();button.hidden=false;active=null;
    if(restoreFocus)button.focus({preventScroll:true});
  }
  function openVideo(button) {
    closeVideo(false);
    const wrapper=document.createElement('div');
    wrapper.className='news-inline-player'+(button.classList.contains('news-landscape-video')?' news-inline-landscape':'');
    wrapper.innerHTML=`<video controls playsinline preload="none" tabindex="0" aria-label="${esc(button.dataset.videoTitle)}"></video><button type="button" class="news-inline-close" aria-label="${esc(copy.close)}">×</button><div class="news-inline-error" role="status" hidden><p>${esc(copy.videoError)}</p><a target="_blank" rel="noopener noreferrer">${esc(copy.openVideo)} ↗</a></div>`;
    const player=wrapper.querySelector('video');
    player.poster = button.querySelector('img')?.src || '';
    player.src = videoPath(button.dataset.newsVideo);
    wrapper.querySelector('a').href=player.src;
    wrapper.querySelector('.news-inline-close').addEventListener('click',()=>closeVideo());
    player.addEventListener('error',()=>{if(player.hasAttribute('src'))wrapper.querySelector('.news-inline-error').hidden=false;});
    button.hidden=true;button.after(wrapper);active={button,wrapper,player};
    player.focus({preventScroll:true});
    player.play().catch(() => { /* Native controls remain available if autoplay is denied. */ });
  }
  document.querySelectorAll('[data-news-video]').forEach(button => button.addEventListener('click', () => openVideo(button)));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&active&&!document.fullscreenElement){event.preventDefault();closeVideo();}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)active?.player.pause();});
  window.addEventListener('pagehide',()=>closeVideo(false));

  document.querySelectorAll('.news-creators').forEach(section=>{
    const rail=section.querySelector('.news-video-grid'),toggle=section.querySelector('[data-conveyor="toggle"]');
    const reduced=window.MOKDA_MOTION_PREFERENCE||(window.MOKDA_MOTION_PREFERENCE=window.matchMedia?.('(prefers-reduced-motion: reduce)'));
    let paused=!!reduced?.matches,visible=false,hover=false,manualUntil=0,direction=1,position=rail.scrollLeft,last=0,frame=0;
    function syncToggle(){toggle.setAttribute('aria-pressed',String(paused));toggle.setAttribute('aria-label',paused?motionCopy.resume:motionCopy.pause);toggle.textContent=paused?'▶':'Ⅱ';}
    syncToggle();
    function tick(now){
      frame=0;
      if(!visible||document.hidden)return;
      const elapsed=last?Math.min(now-last,50):0;last=now;
      const held=paused||document.body.classList.contains('home-story-paused')||hover||rail.contains(document.activeElement)||section.querySelector('.news-inline-player')||now<manualUntil;
      if(!held){
        const max=rail.scrollWidth-rail.clientWidth;
        if(max>1){position=Math.max(0,Math.min(max,position+direction*elapsed*.022));rail.scrollLeft=position;if(position>=max)direction=-1;else if(position<=0)direction=1;}
      }else position=rail.scrollLeft;
      frame=window.requestAnimationFrame(tick);
    }
    function run(){last=0;if(visible&&!document.hidden&&!frame)frame=window.requestAnimationFrame(tick);}
    function manual(){manualUntil=performance.now()+8000;position=rail.scrollLeft;}
    section.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')hover=true;});
    section.addEventListener('pointerleave',()=>{hover=false;});
    rail.addEventListener('pointerdown',manual);rail.addEventListener('wheel',manual,{passive:true});rail.addEventListener('keydown',manual);
    rail.addEventListener('scroll',()=>{if(performance.now()<manualUntil)position=rail.scrollLeft;},{passive:true});
    section.querySelectorAll('[data-conveyor]').forEach(button=>button.addEventListener('click',()=>{
      if(button.dataset.conveyor==='toggle'){paused=!paused;syncToggle();}
      else{manual();const step=rail.querySelector('.news-video-card').getBoundingClientRect().width+parseFloat(getComputedStyle(rail).gap||0);rail.scrollBy({left:button.dataset.conveyor==='next'?step:-step,behavior:reduced?.matches?'instant':'smooth'});}
    }));
    reduced?.addEventListener('change',event=>{paused=event.matches;syncToggle();});
    if(!rail.clientWidth)return; // Build rendering has no layout and starts no motion.
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)run();else{window.cancelAnimationFrame(frame);frame=0;last=0;active?.button.closest('.news-creators')===section&&active.player.pause();}},{threshold:.08});
    observer.observe(section);
    document.addEventListener('visibilitychange',()=>{if(document.hidden){window.cancelAnimationFrame(frame);frame=0;}else run();});
    window.addEventListener('pagehide',()=>{observer.disconnect();window.cancelAnimationFrame(frame);});
  });
})();
