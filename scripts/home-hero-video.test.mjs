import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM, VirtualConsole } from 'jsdom';

const root = new URL('../', import.meta.url);
const read = name => readFileSync(new URL(name, root), 'utf8');
const code = read('home-hero-video.js');
const settle = async () => { for (let i = 0; i < 6; i++) await Promise.resolve(); };
const routes = { KR: 'ko', ES: 'es', EN: 'en' };
const expected = {
  KR: { title: '한국을 더 가까이', cta: '소스 라인업 보기', pause: '영상 일시정지', play: '영상 재생' },
  ES: { title: 'Corea, más cerca de ti', cta: 'Conoce nuestras salsas', pause: 'Pausar video', play: 'Reproducir video' },
  EN: { title: 'Korea, closer to you', cta: 'Explore our sauces', pause: 'Pause video', play: 'Play video' },
};

function start({ language = 'EN', width = 1440, reduced = false, saveData = false, hidden = false, observer = true, legacyQuery = false } = {}) {
  const errors = [], vc = new VirtualConsole();
  vc.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(read(`${routes[language]}/index.html`), {
    url: `https://www.mokda.kr/${routes[language]}/`, runScripts: 'outside-only', virtualConsole: vc,
  });
  const w = dom.window, d = w.document;
  const hero = d.getElementById('top'), video = hero.querySelector('[data-hero-video]');
  const media = hero.querySelector('[data-hero-media]'), toggle = hero.querySelector('[data-hero-video-toggle]');
  assert(video && media && toggle, 'Generated homepages retain the source-free montage and its control');
  const title = hero.querySelector('[data-hero-title]'), cta = hero.querySelector('[data-hero-link]');
  const text = [...title.querySelectorAll('.hero-title-line')].map(node => node.textContent).join(' ');
  assert.equal(text, expected[language].title, 'Existing localized hero heading remains unchanged');
  assert.equal(cta.textContent, expected[language].cta, 'Existing localized CTA remains unchanged');
  const titleNode = title.firstChild, ctaHref = cta.getAttribute('href');
  let isHidden = hidden, paused = true, rect = { top: 0, bottom: 760, left: 0, right: width };
  const attempts = [], loads = [], observers = [], animationFrames = [];
  let pauses = 0;
  Object.defineProperty(d, 'hidden', { get: () => isHidden });
  Object.defineProperty(video, 'paused', { get: () => paused });
  w.innerWidth = width; w.innerHeight = 900;
  hero.getBoundingClientRect = () => rect;
  const query = matches => {
    const listeners = [];
    const value = { matches, change(next) { value.matches = next; for (const listener of listeners) listener({ matches: next }); } };
    if (legacyQuery) value.addListener = listener => listeners.push(listener);
    else value.addEventListener = (_event, listener) => listeners.push(listener);
    return value;
  };
  const motion = query(reduced), compact = query(width <= 767);
  w.matchMedia = name => name.includes('reduced-motion') ? motion : compact;
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
  video.load = () => { loads.push(video.getAttribute('src')); paused = true; };
  video.pause = () => {
    pauses++;
    const changed = !paused;
    paused = true;
    if (changed) video.dispatchEvent(new w.Event('pause'));
  };
  video.play = () => {
    let resolve, reject;
    const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
    attempts.push({ resolve, reject, source: video.getAttribute('src') });
    return promise;
  };
  w.eval(code);
  const enter = value => observers[0].callback([{ target: hero, isIntersecting: value }]);
  const finish = async (index = attempts.length - 1, event = true) => {
    paused = false;
    if (event) video.dispatchEvent(new w.Event('playing'));
    attempts[index].resolve();
    await settle();
  };
  return {
    dom, w, d, hero, video, media, toggle, motion, compact, connection, attempts, loads, errors, enter, finish,
    get pauses() { return pauses; },
    setHidden(value) { isHidden = value; d.dispatchEvent(new w.Event('visibilitychange')); },
    saveData(value) { connection.saveData = value; connection.dispatchEvent(new w.Event('change')); },
    scrollOut() { rect = { top: -800, bottom: -40, left: 0, right: width }; w.dispatchEvent(new w.Event('scroll')); while (animationFrames.length) animationFrames.shift()(); },
    scrollIn() { rect = { top: 0, bottom: 760, left: 0, right: width }; w.dispatchEvent(new w.Event('scroll')); while (animationFrames.length) animationFrames.shift()(); },
    verifyCopy() { assert.equal(title.firstChild, titleNode); assert.equal(cta.getAttribute('href'), ctaHref); assert.equal(cta.textContent, expected[language].cta); },
    close() { assert.deepEqual(errors, []); dom.window.close(); },
  };
}

let checks = 0;
for (const language of ['KR', 'ES', 'EN']) for (const width of [390, 1440]) {
  const f = start({ language, width });
  assert(!f.video.hasAttribute('src')); assert.equal(f.loads.length, 0); assert.equal(f.attempts.length, 0);
  assert.equal(f.video.getAttribute('preload'), 'none'); assert(f.video.hasAttribute('muted')); assert(f.video.hasAttribute('playsinline')); assert(f.video.hasAttribute('loop'));
  assert.equal(f.media.dataset.videoState, 'poster');
  f.enter(true);
  assert.equal(f.attempts.length, 1);
  assert.match(f.video.getAttribute('src'), width < 768 ? /mobile-20261014-v3\.mp4$/ : /desktop-20261014-v3\.mp4$/);
  assert.equal(f.video.muted, true); assert.equal(f.video.playsInline, true);
  assert.equal(f.toggle.textContent, expected[language].pause);
  assert.equal(f.media.dataset.videoState, 'poster', 'The poster remains until playback is confirmed');
  await f.finish(); assert.equal(f.media.dataset.videoState, 'playing');
  f.enter(false); assert.equal(f.video.paused, true);
  f.enter(true); await f.finish();
  f.toggle.click(); assert.equal(f.video.paused, true); assert.equal(f.toggle.textContent, expected[language].play);
  const plays = f.attempts.length;
  f.enter(false); f.enter(true); f.setHidden(true); f.setHidden(false);
  assert.equal(f.attempts.length, plays, 'Automatic visibility changes never override the user pause');
  f.toggle.click(); await f.finish();
  f.w.eval(code); assert.equal(f.attempts.length, plays + 1, 'Rebinding does not create a second controller');
  f.verifyCopy(); f.close(); checks++;
}

for (const options of [{ reduced: true }, { saveData: true }, { reduced: true, saveData: true }, { hidden: true }]) {
  const f = start(options); f.enter(true);
  assert.equal(f.loads.length, 0); assert.equal(f.attempts.length, 0); assert(!f.video.hasAttribute('src'));
  assert.equal(f.media.dataset.videoState, 'poster');
  if (options.reduced || options.saveData) assert.equal(f.toggle.hidden, true);
  f.close(); checks++;
}

for (const gate of ['hidden', 'offscreen', 'user', 'reduced', 'saveData', 'pagehide']) {
  const f = start(); f.enter(true);
  if (gate === 'hidden') f.setHidden(true);
  if (gate === 'offscreen') f.enter(false);
  if (gate === 'user') f.toggle.click();
  if (gate === 'reduced') f.motion.change(true);
  if (gate === 'saveData') f.saveData(true);
  if (gate === 'pagehide') f.w.dispatchEvent(new f.w.Event('pagehide'));
  await f.finish(0);
  assert.equal(f.video.paused, true, `Late playback cannot bypass the ${gate} gate`);
  assert.equal(f.media.dataset.videoState, 'poster');
  f.close(); checks++;
}

const switched = start(); switched.enter(true); switched.compact.change(true);
assert.equal(switched.attempts.length, 2); assert.match(switched.attempts[1].source, /mobile-/);
await switched.finish(1);
switched.attempts[0].reject(new Error('Old source aborted')); await settle();
assert.equal(switched.media.dataset.videoState, 'playing', 'A stale source rejection cannot stop the replacement source');
assert.equal(switched.video.paused, false);
switched.close(); checks++;

const raced = start(); raced.enter(true); raced.setHidden(true); raced.setHidden(false);
await raced.finish(1);
await raced.finish(0, false);
assert.equal(raced.video.paused, false, 'An older completion does not pause a newer eligible playback');
assert.equal(raced.media.dataset.videoState, 'playing'); raced.close(); checks++;

const rejected = start(); rejected.enter(true);
rejected.attempts[0].reject(new Error('Autoplay is unavailable')); await settle();
assert.equal(rejected.media.dataset.videoState, 'poster'); assert.equal(rejected.toggle.textContent, 'Play video');
rejected.enter(false); rejected.enter(true); assert.equal(rejected.attempts.length, 1, 'Autoplay rejection is not retried on every scroll');
rejected.toggle.click(); await rejected.finish(); assert.equal(rejected.media.dataset.videoState, 'playing');
rejected.close(); checks++;

const broken = start(); broken.enter(true); broken.video.dispatchEvent(new broken.w.Event('error'));
assert(!broken.video.hasAttribute('src')); assert.equal(broken.toggle.hidden, true);
await broken.finish(0); assert.equal(broken.video.paused, true); assert.equal(broken.media.dataset.videoState, 'poster');
broken.close(); checks++;

const changed = start({ legacyQuery: true }); changed.enter(true); await changed.finish();
changed.motion.change(true); assert(!changed.video.hasAttribute('src')); assert.equal(changed.media.dataset.videoState, 'poster');
changed.motion.change(false); await changed.finish();
changed.saveData(true); assert(!changed.video.hasAttribute('src')); assert.equal(changed.video.paused, true);
changed.saveData(false); await changed.finish();
changed.w.dispatchEvent(new changed.w.Event('pagehide')); assert.equal(changed.video.paused, true);
changed.w.dispatchEvent(new changed.w.Event('pageshow')); await changed.finish();
assert.equal(changed.media.dataset.videoState, 'playing'); changed.close(); checks++;

const fallback = start({ observer: false });
assert.equal(fallback.attempts.length, 1); await fallback.finish();
fallback.scrollOut(); assert.equal(fallback.video.paused, true);
fallback.scrollIn(); await fallback.finish(); assert.equal(fallback.video.paused, false);
fallback.close(); checks++;

console.log(`Hero video regression passed: ${checks} cases covering localized copy, responsive sources, poster fallbacks, lifecycle suspension and asynchronous playback races.`);
