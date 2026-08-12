import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = (path) => fs.readFileSync(new URL(path, root), 'utf8');
const appsScriptSource = read('apps-script/b2b-lead-automation.gs');
const analyticsSource = read('site-analytics.js');
const supportSource = read('support-campaign.js');
const contactSource = read('contact.html');

const context = vm.createContext({ console, Date, Number, String, Array, Object, RegExp, Math, JSON });
vm.runInContext(appsScriptSource, context);

const at = (name, sequence, extra = {}) => ({
  name,
  time: new Date(`2026-08-10T10:00:${String(sequence).padStart(2, '0')}.000Z`),
  sequence,
  schemaVersion: '2',
  ...extra,
});
const evaluate = context.evaluateOrderedAnalyticsFunnel_;
const b2bClosedSteps = [
  'page_view',
  ['product_section_view', 'product_cta_click', 'hero_product_click', 'product_detail_view'],
  ['contact_cta_click', 'b2b_cta_click', 'whatsapp_click', 'contact_page_view'],
  'b2b_form_start',
  'generate_lead',
];
const b2bDirectSteps = ['page_view', 'contact_page_view', 'b2b_form_start', 'generate_lead'];
const supportSteps = ['support_page_view', 'support_form_start', 'support_country_select', 'support_submit'];
const minimumDate = new Date('2026-08-10T09:00:00.000Z');

// TEST 1: home visit only.
assert.equal(evaluate([at('page_view', 1)], b2bClosedSteps, minimumDate).length, 1);

// TEST 2: product-led B2B flow stops at meaningful form start without a lead.
assert.equal(
  evaluate([
    at('page_view', 1),
    at('product_detail_view', 2),
    at('contact_page_view', 3),
    at('b2b_form_start', 4),
  ], b2bClosedSteps, minimumDate).length,
  4,
);

// TEST 3: direct inquiry completes only the direct-entry funnel.
const directSuccess = [at('page_view', 1), at('contact_page_view', 2), at('b2b_form_start', 3), at('generate_lead', 4)];
assert.equal(evaluate(directSuccess, b2bDirectSteps, minimumDate).length, 4);
assert.equal(evaluate(directSuccess, b2bClosedSteps, minimumDate).length, 1);

// TEST 4: failed submit has no generate_lead.
assert.equal(
  evaluate([at('page_view', 1), at('contact_page_view', 2), at('b2b_form_start', 3)], b2bDirectSteps, minimumDate).length,
  3,
);

// TEST 5: form start is bound to non-empty input, not focus.
assert.doesNotMatch(analyticsSource, /form\.addEventListener\(\s*['"]focusin['"]/);
assert.match(analyticsSource, /\['name', 'company', 'email', 'whatsapp', 'message'\]/);

// TEST 6: all scroll milestones are configured once per page view.
for (const depth of [25, 50, 75, 90]) assert.match(analyticsSource, new RegExp(`\\[25, 50, 75, 90\\]`));
assert.match(analyticsSource, /trackOnce\(`scroll_\$\{depth\}`/);

// TEST 7: section view requires 50% visibility and a one-second hold.
assert.match(analyticsSource, /const viewableHeight = Math\.min\(entry\.boundingClientRect\.height, viewportHeight\)/);
assert.match(analyticsSource, /visibleRatio < 0\.5/);
assert.match(analyticsSource, /}, 1000\);/);

// TEST 8: only production hosts are allowed.
assert.match(analyticsSource, /new Set\(\['mokda\.kr', 'www\.mokda\.kr'\]\)/);
assert.match(analyticsSource, /verification: verificationMode/);
assert.match(appsScriptSource, /payload\.verification === true/);
assert.match(appsScriptSource, /utm_medium=verification/);

// TEST 9: support completion remains separate from B2B lead completion.
const supportSuccess = [at('support_page_view', 1), at('support_form_start', 2), at('support_country_select', 3), at('support_submit', 4)];
assert.equal(evaluate(supportSuccess, supportSteps, minimumDate).length, 4);
assert.equal(evaluate(supportSuccess, b2bDirectSteps, minimumDate).length, 0);
assert.match(supportSource, /if \(result\.saved === true\)/);
assert.match(contactSource, /result\.saved !== true/);

// TEST 10: an internal browser opts out before any analytics queue is created.
assert.match(analyticsSource, /mokda_analytics_internal_opt_out_v1/);
assert.match(analyticsSource, /internalCommand === '1'/);
assert.match(analyticsSource, /MOKDA_ANALYTICS_STATUS\.reason = 'internal_visitor'/);
assert.ok(
  analyticsSource.indexOf("MOKDA_ANALYTICS_STATUS.reason = 'internal_visitor'") <
    analyticsSource.indexOf('const queue = []'),
);

assert.equal(context.normalizeDashboardProduct_('K-Peño', '2'), 'K-Peño');
assert.equal(context.normalizeDashboardProduct_('Para Carnes', '2'), 'Para Carnes');
assert.equal(context.normalizeDashboardProduct_('Original', 'legacy'), 'Legacy Product');
assert.equal(context.normalizeDashboardProduct_('Soy Sauce', '2'), '제품 미지정');

console.log('analytics regression tests passed (10 scenarios)');
