import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const source = readFileSync(new URL('../site-turnstile.js', import.meta.url), 'utf8');
const sitekey = '0x' + 'a'.repeat(24);
const settle = async () => { for (let index = 0; index < 6; index++) await Promise.resolve(); };
let checks = 0;
function fixture({ key = sitekey, preloaded = true } = {}) {
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    url: 'https://www.mokda.kr/en/', runScripts: 'outside-only',
  });
  const w = dom.window, timers = new Map(), widgets = [], removals = [];
  const state = { renderError: false, removeError: false, synchronous: null };
  let id = 0;
  w.MOKDA_BOT_PROTECTION = { sitekey: key };
  w.setTimeout = (action, delay) => { timers.set(++id, { action, delay }); return id; };
  w.clearTimeout = value => timers.delete(value);
  w.fetch = () => { throw new Error('No remote fetch is allowed in this suite'); };
  const api = {
    render(box, options) {
      if (state.renderError) throw new Error('Provider rendering failed');
      const widget = { id: widgets.length, box, options };
      widgets.push(widget);
      if (state.synchronous !== null) options.callback(state.synchronous);
      return widget.id;
    },
    remove(value) {
      removals.push(value);
      if (state.removeError) throw new Error('Provider cleanup failed');
    },
  };
  if (preloaded) w.turnstile = api;
  w.eval(source);
  const begin = (action = 'mokda_chat', options = {}) => {
    // Attach rejection immediately so intentionally failed provider callbacks never
    // become unhandled rejections while the fixture inspects cleanup.
    const promise = w.MOKDA_TURNSTILE.token(action, options).then(value => ({ value }), error => ({ error: error.message }));
    return promise;
  };
  const clean = () => {
    assert.equal(w.document.querySelector('#mokda-visitor-verification'), null);
    assert.equal(w.localStorage.length, 0, 'Verification tokens never enter localStorage');
    assert.equal(w.sessionStorage.length, 0, 'Verification tokens never enter sessionStorage');
  };
  return { dom, w, api, state, timers, widgets, removals, begin, clean };
}

{
  const f = fixture({ preloaded: false });
  assert.equal(f.w.document.querySelectorAll('script').length, 0, 'Loading the helper alone never requests the provider');
  assert.equal(f.widgets.length, 0); assert.equal(f.timers.size, 0); f.clean();
  const result = f.begin('mokda_inquiry', { language: 'KR' });
  await settle();
  const script = f.w.document.querySelector('script');
  assert.equal(script.src, 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit');
  assert.equal(f.w.document.querySelectorAll('script').length, 1);
  assert.equal([...f.timers.values()][0].delay, 12000);
  f.w.turnstile = f.api; script.onload(); await settle();
  assert.equal(f.widgets[0].options.action, 'mokda_inquiry');
  assert.equal(f.widgets[0].options.language, 'ko');
  f.widgets[0].options.callback('one-time-token');
  assert.equal((await result).value, 'one-time-token');
  assert.equal(f.timers.size, 0); f.clean(); f.dom.window.close(); checks++;
}
for (const key of [undefined, null, '', '1x00000000000000000000AA', '0xshort', 'https://evil.example/key', '0x' + 'a'.repeat(81)]) {
  const f = fixture({ key: key === undefined ? null : key, preloaded: false });
  assert.match((await f.begin()).error, /verification/);
  assert.equal(f.w.document.querySelectorAll('script').length, 0);
  assert.equal(f.timers.size, 0); f.clean(); f.dom.window.close(); checks++;
}
{
  const f = fixture({ preloaded: false });
  assert.match((await f.begin('arbitrary_action')).error, /verification/);
  const caller = new f.w.AbortController(); caller.abort();
  assert.match((await f.begin('mokda_chat', { signal: caller.signal })).error, /verification/);
  assert.equal(f.w.document.querySelectorAll('script').length, 0); f.clean(); f.dom.window.close(); checks++;
}
{
  const f = fixture();
  for (const [language, expected] of [['KR', 'ko'], ['ES', 'es'], ['EN', 'en'], ['unknown', 'auto']]) {
    const result = f.begin('mokda_chat', { language }); await settle();
    const widget = f.widgets.at(-1);
    assert.equal(widget.options.language, expected);
    assert.equal(widget.options.sitekey, sitekey);
    assert.equal(widget.options.appearance, 'interaction-only');
    assert.equal(widget.options['response-field'], false);
    assert.equal(widget.box.isConnected, true);
    widget.options.callback('fresh-' + language);
    assert.equal((await result).value, 'fresh-' + language);
    f.clean();
    assert.equal(f.timers.size, 0);
  }
  assert.equal(f.widgets.length, 4, 'Each invocation creates a fresh widget, never a cached token');
  assert.deepEqual(f.removals, [0, 1, 2, 3], 'Every settled widget is removed once');
  f.dom.window.close(); checks++;
}
for (const outcome of ['error-callback', 'expired-callback', 'timeout-callback', 'abort', 'deadline', 'render-throws']) {
  const f = fixture();
  const caller = new f.w.AbortController();
  if (outcome === 'render-throws') f.state.renderError = true;
  const result = f.begin('mokda_chat', { signal: caller.signal }); await settle();
  if (outcome === 'abort') caller.abort();
  else if (outcome === 'deadline') { const timer = [...f.timers.values()][0]; assert.equal(timer.delay, 60000); timer.action(); }
  else if (outcome !== 'render-throws') f.widgets[0].options[outcome]();
  assert.match((await result).error, /verification/);
  assert.equal(f.timers.size, 0); f.clean();
  f.state.renderError = false;
  const retry = f.begin('mokda_inquiry'); await settle();
  f.widgets.at(-1).options.callback('retry-token');
  assert.equal((await retry).value, 'retry-token', 'Every failure releases the busy state');
  f.clean(); f.dom.window.close(); checks++;
}
for (const value of [null, undefined, '', 1, {}, 'x'.repeat(2049)]) {
  const f = fixture();
  const result = f.begin(); await settle();
  f.widgets[0].options.callback(value);
  assert.match((await result).error, /verification/); f.clean();
  assert.equal(f.timers.size, 0); f.dom.window.close(); checks++;
}
{
  const f = fixture();
  const result = f.begin(); await settle();
  assert.match((await f.begin('mokda_inquiry')).error, /verification/, 'Simultaneous challenges do not overlap');
  assert.equal(f.widgets.length, 1);
  f.widgets[0].options.callback('x'.repeat(2048));
  assert.equal((await result).value.length, 2048);
  f.widgets[0].options['expired-callback']();
  assert.deepEqual(f.removals, [0], 'Late callbacks cannot settle or remove a widget twice');
  f.clean(); f.dom.window.close(); checks++;
}
{
  const f = fixture(); f.state.synchronous = 'synchronous-test-token';
  assert.equal((await f.begin()).value, 'synchronous-test-token');
  assert.deepEqual(f.removals, [0]); assert.equal(f.timers.size, 0); f.clean(); f.dom.window.close(); checks++;
}
for (const failure of ['onerror', 'deadline', 'missing-api']) {
  const f = fixture({ preloaded: false });
  const result = f.begin(); await settle();
  const script = f.w.document.querySelector('script');
  if (failure === 'deadline') [...f.timers.values()][0].action();
  else script[failure === 'missing-api' ? 'onload' : 'onerror']();
  assert.match((await result).error, /verification/);
  assert.equal(f.w.document.querySelectorAll('script').length, 0);
  assert.equal(f.timers.size, 0); f.clean();
  const retry = f.begin(); await settle();
  f.w.turnstile = f.api; f.w.document.querySelector('script').onload(); await settle();
  f.widgets[0].options.callback('retry-provider-token');
  assert.equal((await retry).value, 'retry-provider-token');
  f.clean(); f.dom.window.close(); checks++;
}
{
  const f = fixture(); f.state.removeError = true;
  const result = f.begin(); await settle();
  assert.doesNotThrow(() => f.widgets[0].options.callback('cleanup-despite-provider-error'));
  assert.equal((await result).value, 'cleanup-despite-provider-error');
  assert.equal(f.timers.size, 0); f.clean();
  f.state.removeError = false;
  const retry = f.begin(); await settle(); f.widgets.at(-1).options.callback('next-token');
  assert.equal((await retry).value, 'next-token'); f.clean(); f.dom.window.close(); checks++;
}
{
  const f = fixture({ preloaded: false });
  const caller = new f.w.AbortController();
  const result = f.begin('mokda_chat', { signal: caller.signal });
  let cancelled = false; result.then(() => { cancelled = true; });
  await settle(); caller.abort(); await settle();
  assert.equal(cancelled, true, 'Abort during provider loading settles immediately');
  assert.match((await result).error, /verification/); f.clean();
  const retry = f.begin(); await settle();
  assert.equal(f.w.document.querySelectorAll('script').length, 1, 'Retry reuses an existing in-flight provider load');
  f.w.turnstile = f.api; f.w.document.querySelector('script').onload(); await settle();
  f.widgets[0].options.callback('token-after-load-cancellation');
  assert.equal((await retry).value, 'token-after-load-cancellation');
  assert.equal(f.timers.size, 0); f.clean(); f.dom.window.close(); checks++;
}
{
  const f = fixture();
  const dialog = f.w.document.createElement('dialog');
  dialog.id = 'mokda-help-dialog'; dialog.open = true; f.w.document.body.append(dialog);
  const result = f.begin(); await settle();
  assert.equal(f.widgets[0].box.parentElement, dialog, 'Managed verification stays inside the native mobile modal top layer');
  assert.equal(f.widgets[0].box.style.position, 'absolute');
  f.widgets[0].options.callback('modal-token');
  assert.equal((await result).value, 'modal-token'); f.clean();
  const inquiry = f.begin('mokda_inquiry'); await settle();
  assert.equal(f.widgets.at(-1).box.parentElement, f.w.document.body, 'The inquiry form keeps its independent verification position');
  f.widgets.at(-1).options.callback('inquiry-token'); await inquiry; f.clean();
  dialog.open = false;
  const closed = f.begin(); await settle();
  assert.equal(f.widgets.at(-1).box.parentElement, f.w.document.body, 'A closed chat cannot conceal verification');
  f.widgets.at(-1).options.callback('closed-token'); await closed; f.clean(); f.dom.window.close(); checks++;
}
{
  const f = fixture(); f.w.innerWidth = 320;
  const result = f.begin(); await settle();
  assert.equal(f.widgets[0].options.size, 'compact', 'Narrow screens use the compact provider widget');
  f.widgets[0].options.callback('compact-token'); await result; f.clean(); f.dom.window.close(); checks++;
}
assert.doesNotMatch(source, /(?:localStorage|sessionStorage|cookie|TURNSTILE_SECRET|secretkey)/i, 'Helper does not store tokens or receive a secret');
console.log(`Turnstile client checks passed: ${checks} lazy-load, fresh-token, host-key validation, language, cancellation, failure cleanup and retry scenarios. No remote requests were made.`);
