import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { JSDOM, VirtualConsole } from 'jsdom';

const root = new URL('../', import.meta.url);
const read = name => readFileSync(new URL(name, root), 'utf8');
const code = read('home-hero-photos.js');
const settle = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };
const routes = { KR: 'ko', ES: 'es', EN: 'en' };
const expected = {
  KR: { title: '한국을 더 가까이', cta: '소스 라인업 보기' },
  ES: { title: 'Corea, más cerca de ti', cta: 'Conoce nuestras salsas' },
  EN: { title: 'Korea, closer to you', cta: 'Explore our sauces' },
};

function start({ language = 'EN', width = 1440, reduced = false, saveData = false, hidden = false, observer = true, legacyQuery = false, decode = true, run = true, productionOnly = false } = {}) {
  const errors = [], vc = new VirtualConsole();
  vc.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(read(`${routes[language]}/index.html`), {
    url: `https://www.mokda.kr/${routes[language]}/`, runScripts: 'outside-only', virtualConsole: vc,
  });
  const w = dom.window, d = w.document, hero = d.getElementById('top');
  const media = hero.querySelector('[data-hero-photos]');
  const published = [...hero.querySelectorAll('[data-hero-photo]')];
  assert.equal(published.length, 1, 'Production uses only the official Expoalimentaria booth photo');
  // Preserve generic controller lifecycle coverage with optional in-memory layers only.
  // These fixtures are never written to the website or fetched in production.
  if (!productionOnly) for (let i = 1; i < 3; i++) {
    const photo = published[0].cloneNode(true), image = photo.querySelector('img'), source = photo.querySelector('source');
    photo.classList.remove('is-active');
    image.dataset.src = image.getAttribute('src'); image.dataset.srcset = image.getAttribute('srcset');
    image.removeAttribute('src'); image.removeAttribute('srcset'); image.removeAttribute('fetchpriority');
    source.dataset.srcset = source.getAttribute('srcset'); source.removeAttribute('srcset'); media.append(photo);
  }
  const photos = [...media.querySelectorAll('[data-hero-photo]')];
  const toggle = hero.querySelector('[data-hero-photos-toggle]');
  assert(media && photos.length === (productionOnly ? 1 : 3));
  assert.equal(toggle, null, 'The photo playback button is removed');
  assert.equal(media.getAttribute('aria-hidden'), 'true');
  assert.equal(hero.querySelectorAll('[data-hero-slide]').length, 1, 'Photo layers never become campaign-carousel slides');
  assert.equal(hero.querySelectorAll('video').length, 0);
  assert.equal(hero.dataset.heroPhotosBound, undefined, 'Build rendering never binds the browser-only controller');
  assert.equal(hero.querySelectorAll('img[src]').length, 1, 'Only the first photo has a browser-loadable source at generation time');
  assert.equal(hero.querySelectorAll('source[srcset]').length, 1);
  assert.equal(photos[0].querySelector('img').getAttribute('fetchpriority'), 'high');
  for (const photo of photos) {
    const image = photo.querySelector('img'), source = photo.querySelector('source');
    assert.equal(image.getAttribute('alt'), '');
    assert.equal(source.getAttribute('media'), '(max-width: 767px)');
    const desktop = image.getAttribute('src') || image.dataset.src;
    const mobile = source.getAttribute('srcset') || source.dataset.srcset;
    assert.match(desktop, /\/hero\/booth-demo-desktop-20261016\.webp$/);
    assert.match(mobile, /\/hero\/booth-demo-mobile-20261016\.webp$/);
    for (const asset of [desktop, mobile]) assert(statSync(new URL(asset.slice(1), root)).size > 0, 'Every declared photo is an existing asset');
  }
  const title = hero.querySelector('[data-hero-title]'), cta = hero.querySelector('[data-hero-link]');
  const text = [...title.querySelectorAll('.hero-title-line')].map(node => node.textContent).join(' ');
  assert.equal(text, expected[language].title);
  assert.equal(cta.textContent, expected[language].cta);
  const titleNode = title.firstChild, ctaHref = cta.getAttribute('href');
  let isHidden = hidden, now = 0, timerId = 0, rect = { top: 0, bottom: 760, left: 0, right: width };
  const timers = new Map(), decodes = [], observers = [], animationFrames = [];
  Object.defineProperty(d, 'hidden', { get: () => isHidden });
  w.innerWidth = width; w.innerHeight = 900;
  hero.getBoundingClientRect = () => rect;
  w.setTimeout = (callback, delay) => { timers.set(++timerId, { callback, time: now + delay }); return timerId; };
  w.clearTimeout = id => timers.delete(id);
  const query = matches => {
    const listeners = [];
    const value = { matches, change(next) { value.matches = next; for (const listener of listeners) listener({ matches: next }); } };
    if (legacyQuery) value.addListener = listener => listeners.push(listener);
    else value.addEventListener = (_event, listener) => listeners.push(listener);
    return value;
  };
  const motion = query(reduced);
  w.matchMedia = () => motion;
  const connection = new w.EventTarget(); connection.saveData = saveData;
  Object.defineProperty(w.navigator, 'connection', { value: connection });
  w.MOKDA_I18N = { getLanguage: () => language };
  w.requestAnimationFrame = callback => { animationFrames.push(callback); return animationFrames.length; };
  if (observer) {
    w.IntersectionObserver = class {
      constructor(callback) { this.callback = callback; observers.push(this); }
      observe(target) { this.target = target; }
    };
  }
  if (decode) w.HTMLImageElement.prototype.decode = function () {
    let resolve, reject;
    const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
    decodes.push({ resolve, reject, image: this, index: photos.findIndex(photo => photo.contains(this)) });
    return promise;
  };
  if (run) w.eval(code);
  const setRect = value => { rect = value ? { top: 0, bottom: 760, left: 0, right: width } : { top: -800, bottom: -40, left: 0, right: width }; };
  return {
    dom, w, d, hero, media, photos, toggle, motion, connection, timers, decodes, observers,
    active() { const active = photos.map((photo, i) => photo.classList.contains('is-active') ? i : -1).filter(i => i >= 0); assert.equal(active.length, 1); return active[0]; },
    enter(value) { setRect(value); observers[0].callback([{ target: hero, isIntersecting: value }]); },
    async advance(ms) {
      const end = now + ms;
      while (true) {
        const next = [...timers.entries()].sort((a, b) => a[1].time - b[1].time)[0];
        if (!next || next[1].time > end) break;
        timers.delete(next[0]); now = next[1].time; next[1].callback(); await settle();
      }
      now = end; await settle();
    },
    async finish(index = decodes.length - 1) { decodes[index].resolve(); await settle(); },
    setHidden(value) { isHidden = value; d.dispatchEvent(new w.Event('visibilitychange')); },
    saveData(value) { connection.saveData = value; connection.dispatchEvent(new w.Event('change')); },
    scroll(value) { setRect(value); w.dispatchEvent(new w.Event('scroll')); while (animationFrames.length) animationFrames.shift()(); },
    verifyCopy() { assert.equal(title.firstChild, titleNode); assert.equal(cta.getAttribute('href'), ctaHref); assert.equal(cta.textContent, expected[language].cta); },
    close() { assert.deepEqual(errors, []); dom.window.close(); },
  };
}

let checks = 0;
for (const language of ['KR', 'ES', 'EN']) for (const width of [390, 768, 1440]) {
  const f = start({ language, width, productionOnly: true });
  assert.equal(f.active(), 0); assert.equal(f.timers.size, 0);
  assert.equal(f.observers.length, 0); assert.equal(f.decodes.length, 0);
  assert.equal(f.hero.dataset.heroPhotosBound, undefined, 'A single photo never binds slideshow work');
  f.w.dispatchEvent(new f.w.Event('pageshow')); f.setHidden(true); f.setHidden(false);
  await f.advance(60000); assert.equal(f.timers.size, 0); assert.equal(f.decodes.length, 0);
  f.verifyCopy(); f.close(); checks++;
}
for (const language of ['KR', 'ES', 'EN']) for (const width of [390, 768, 1440]) {
  const f = start({ language, width });
  assert.equal(f.active(), 0); assert.equal(f.timers.size, 0);
  f.enter(true); assert.equal(f.timers.size, 1); assert.equal(f.decodes.length, 0);
  await f.advance(4499); assert.equal(f.decodes.length, 0);
  assert.equal(f.photos[1].querySelector('img').hasAttribute('src'), false, 'The next photo is not eagerly fetched');
  await f.advance(1); assert.equal(f.decodes.length, 1); assert.equal(f.decodes[0].index, 1);
  assert.equal(f.active(), 0, 'The first photo remains visible until the next photo is decoded');
  assert.match(f.photos[1].querySelector('source').getAttribute('srcset'), /booth-demo-mobile-/);
  await f.finish(); assert.equal(f.active(), 1);
  await f.advance(5299); assert.equal(f.decodes.length, 1, 'Each next photo receives 800ms to fade in, then 4500ms to remain still');
  await f.advance(1); assert.equal(f.decodes[1].index, 2); await f.finish(); assert.equal(f.active(), 2);
  await f.advance(5300); assert.equal(f.decodes[2].index, 0); await f.finish(); assert.equal(f.active(), 0);
  await f.advance(5300); assert.equal(f.decodes.length, 3); assert.equal(f.active(), 1, 'All three photos loop using cached readiness');
  f.enter(false); assert.equal(f.timers.size, 0);
  f.enter(true); assert.equal(f.timers.size, 1);
  f.setHidden(true); assert.equal(f.timers.size, 0);
  f.setHidden(false); assert.equal(f.timers.size, 1);
  f.w.dispatchEvent(new f.w.Event('pagehide')); f.w.dispatchEvent(new f.w.Event('pageshow'));
  assert.equal(f.timers.size, 1, 'Returning to an active visible page resumes the slideshow');
  f.w.eval(code); assert.equal(f.timers.size, 1); assert.equal(f.observers.length, 1, 'Controller binding is idempotent');
  f.verifyCopy(); f.close(); checks++;
}

const noScript = start({ run: false });
assert.equal(noScript.active(), 0); assert.equal(noScript.decodes.length, 0);
noScript.close(); checks++;

for (const options of [{ reduced: true }, { saveData: true }, { reduced: true, saveData: true }, { hidden: true }]) {
  const f = start(options); f.enter(true); await f.advance(20000);
  assert.equal(f.timers.size, 0); assert.equal(f.decodes.length, 0); assert.equal(f.active(), 0);
  assert.equal(f.photos[1].querySelector('img').hasAttribute('src'), false);
  f.close(); checks++;
}

for (const gate of ['hidden', 'offscreen', 'reduced', 'saveData', 'pagehide']) {
  const f = start(); f.enter(true); await f.advance(4500);
  if (gate === 'hidden') f.setHidden(true);
  if (gate === 'offscreen') f.enter(false);
  if (gate === 'reduced') f.motion.change(true);
  if (gate === 'saveData') f.saveData(true);
  if (gate === 'pagehide') f.w.dispatchEvent(new f.w.Event('pagehide'));
  await f.finish();
  assert.equal(f.active(), 0, `A late decode cannot reveal a photo after ${gate}`);
  assert.equal(f.timers.size, 0); assert.equal(f.media.dataset.photosRunning, 'false');
  await f.advance(20000); assert.equal(f.decodes.length, 1);
  f.close(); checks++;
}

const raced = start(); raced.enter(true); await raced.advance(4500);
raced.setHidden(true); raced.setHidden(false); await raced.advance(4500);
assert.equal(raced.decodes.length, 1, 'A resumed attempt shares the pending image readiness promise');
await raced.finish(); assert.equal(raced.active(), 1); assert.equal(raced.timers.size, 1);
raced.close(); checks++;

const changed = start({ legacyQuery: true }); changed.enter(true); await changed.advance(4500); await changed.finish();
assert.equal(changed.active(), 1); changed.motion.change(true);
assert.equal(changed.active(), 0); assert.equal(changed.timers.size, 0); assert.equal(changed.media.dataset.photosRunning, 'false');
changed.motion.change(false); await changed.advance(4500); await settle(); assert.equal(changed.active(), 1);
changed.saveData(true); assert.equal(changed.active(), 0); assert.equal(changed.timers.size, 0);
changed.saveData(false); assert.equal(changed.timers.size, 1);
changed.close(); checks++;

const broken = start(); broken.enter(true); await broken.advance(4500);
broken.decodes[0].reject(new Error('Missing optional photo')); await settle();
assert.equal(broken.active(), 0, 'An unavailable optional photo leaves the first image visible');
assert.equal(broken.timers.size, 0);
broken.enter(false); broken.enter(true); await broken.advance(20000); assert.equal(broken.decodes.length, 1);
broken.close(); checks++;

const fallback = start({ observer: false, decode: false });
assert.equal(fallback.timers.size, 1); await fallback.advance(4500);
assert.equal(fallback.active(), 0); fallback.photos[1].querySelector('img').dispatchEvent(new fallback.w.Event('load')); await settle();
assert.equal(fallback.active(), 1); fallback.scroll(false); assert.equal(fallback.timers.size, 0);
fallback.scroll(true); assert.equal(fallback.timers.size, 1);
fallback.close(); checks++;

const css = read('styles/home-experience.css');
assert.match(css, /\[data-photos-running='true'\] \.hero-photo-layer \{ transition:opacity 800ms ease-in-out; \}/);
assert.match(css, /\.hero-photo-layer\.is-active \{ opacity:1; \}/, 'The first photo is visible without JavaScript');
assert(!/hero-photo[^{}]*\{[^}]*\b(?:transform|animation)\s*:/.test(css), 'Hero photos only crossfade, with no zoom, slide or parallax');
assert(!read('scripts/prerender-content.mjs').split('const renderScripts = new Set(')[1].split(');')[0].includes('home-hero-photos.js'));

console.log(`Hero photo regression passed: ${checks} cases covering three languages, one static official photograph with no slideshow work, optional controller fixtures, fallback preferences and lifecycle/decode races.`);
