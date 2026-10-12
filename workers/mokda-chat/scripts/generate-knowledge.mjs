import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import { createHash } from 'node:crypto';
import { JSDOM } from 'jsdom';

// Only published, local website files are read. No private documents or credentials.
const root = fileURLToPath(new URL('../../../', import.meta.url));
const output = fileURLToPath(new URL('../src/knowledge.json', import.meta.url));
const COMPANY_TOPICS = ['moq', 'samples', 'pricing', 'leadTime', 'packing', 'bulk', 'documents', 'certifications', 'namedCertifications', 'support', 'oem', 'exclusive', 'brand', 'specifications'];
const clean = value => String(value || '').replace(/\s+/g, ' ').trim();

export function validateCompanyKnowledge(value) {
  const invalid = () => { throw new Error('Invalid public company knowledge'); };
  const record = (item, keys) => {
    if (!item || typeof item !== 'object' || Array.isArray(item) || Object.keys(item).sort().join('|') !== [...keys].sort().join('|')) invalid();
  };
  const equals = (item, expected) => { if (item !== expected) invalid(); };
  const integer = item => { if (!Number.isSafeInteger(item) || item < 1 || item > 10000000) invalid(); };
  const list = (item, expected) => { if (!Array.isArray(item) || JSON.stringify(item) !== JSON.stringify(expected)) invalid(); };
  record(value, ['schemaVersion', 'updatedAt', 'source', 'facts', 'answers']);
  equals(value.schemaVersion, 1);
  const date = typeof value.updatedAt === 'string' ? new Date(`${value.updatedAt}T00:00:00Z`) : null;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(value.updatedAt) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value.updatedAt) invalid();
  if (typeof value.source !== 'string' || !value.source.trim() || value.source.length > 160) invalid();
  const facts = value.facts;
  record(facts, ['minimumOrderUnits', 'minimumOrderMixPolicy', 'sampleQuantityExclusiveUpperBound', 'sampleFreeProvisionCount', 'sampleRequiresAgreement', 'sampleInternationalShippingPaidBy', 'standardProductGrams', 'unitsPerCase', 'publishedShelfLifeMonths', 'countryOfOrigin', 'bulkB2BAvailable', 'bulkCapacityPolicy', 'pricingPolicy', 'dispatchPolicy', 'buyerDocuments', 'humanSupport', 'certifications', 'oemPolicy', 'exclusiveDistributionPolicy', 'brand', 'sales']);
  for (const key of ['minimumOrderUnits', 'sampleQuantityExclusiveUpperBound', 'sampleFreeProvisionCount', 'standardProductGrams', 'unitsPerCase', 'publishedShelfLifeMonths']) integer(facts[key]);
  for (const [key, expected] of Object.entries({ minimumOrderMixPolicy: 'negotiated_per_transaction', sampleRequiresAgreement: true, sampleInternationalShippingPaidBy: 'buyer', countryOfOrigin: 'South Korea', bulkB2BAvailable: true, bulkCapacityPolicy: 'negotiated', pricingPolicy: 'individual_quote_by_country_and_quantity', dispatchPolicy: 'negotiated_per_order', oemPolicy: 'separate_review', exclusiveDistributionPolicy: 'proposals_accepted_subject_to_agreement' })) equals(facts[key], expected);
  record(facts.buyerDocuments, ['availableTypes', 'salesMaterialLanguages', 'otherDocumentLanguages']);
  list(facts.buyerDocuments.availableTypes, ['product_presentation', 'catalog', 'ingredients', 'nutrition', 'test_reports']);
  list(facts.buyerDocuments.salesMaterialLanguages, ['ES']);
  list(facts.buyerDocuments.otherDocumentLanguages, ['EN']);
  record(facts.humanSupport, ['languages', 'inquiriesAcceptedAnytime', 'immediateReplyGuaranteed', 'reasonForDelay']);
  list(facts.humanSupport.languages, ['KR', 'ES']);
  equals(facts.humanSupport.inquiriesAcceptedAnytime, true);
  equals(facts.humanSupport.immediateReplyGuaranteed, false);
  equals(facts.humanSupport.reasonForDelay, 'time_difference_with_South_Korea');
  record(facts.certifications, ['generalExistenceOwnerReported', 'names', 'scope', 'validity', 'specificCertificationMustBeConfirmedByTeam']);
  equals(facts.certifications.generalExistenceOwnerReported, true);
  list(facts.certifications.names, []);
  equals(facts.certifications.scope, null);
  equals(facts.certifications.validity, null);
  equals(facts.certifications.specificCertificationMustBeConfirmedByTeam, true);
  record(facts.brand, ['targetMarket', 'coDevelopedWithLatinAmericanChefs', 'repeatedSensoryEvaluationsWithLatinAmericanConsumers', 'marketUniquenessVerified']);
  equals(facts.brand.targetMarket, 'Latin America');
  equals(facts.brand.coDevelopedWithLatinAmericanChefs, true);
  equals(facts.brand.repeatedSensoryEvaluationsWithLatinAmericanConsumers, true);
  equals(facts.brand.marketUniquenessVerified, false);
  record(facts.sales, ['consumerSalesInSouthKorea', 'directConsumerSalesInLatinAmerica', 'individualInternationalShippingInLatinAmerica', 'seekingImportersAndDistributorsInLatinAmerica']);
  for (const [key, expected] of Object.entries({ consumerSalesInSouthKorea: true, directConsumerSalesInLatinAmerica: false, individualInternationalShippingInLatinAmerica: false, seekingImportersAndDistributorsInLatinAmerica: true })) equals(facts.sales[key], expected);
  record(value.answers, ['KR', 'ES', 'EN']);
  for (const answers of Object.values(value.answers)) {
    record(answers, COMPANY_TOPICS);
    for (const text of Object.values(answers)) if (typeof text !== 'string' || !text.trim() || text.length > 1200 || /https?:\/\/|www\.|<[^>]+>|[\u0000-\u0008\u000b\u000c\u000e-\u001f]/i.test(text)) invalid();
  }
  // Copy only the validated public contract, never arbitrary VM state.
  return JSON.parse(JSON.stringify(value));
}

export function extractPublicDocument(html, path, maxLength = 4200) {
  const dom = new JSDOM(html);
  try {
    const main = dom.window.document.querySelector('main');
    if (!main) throw new Error(`Missing public main: ${path}`);
    main.querySelectorAll('script, style, form, nav, button, [hidden], .image-sr-only').forEach(node => node.remove());
    const title = clean(main.querySelector('h1')?.textContent || dom.window.document.title);
    const lines = [];
    for (const node of main.querySelectorAll('h1,h2,h3,p,li,dt')) {
      // A definition is kept as one labeled line; truncation never separates dt/dd.
      if (node.tagName === 'DT') {
        const values = [];
        for (let sibling = node.nextElementSibling; sibling?.tagName === 'DD'; sibling = sibling.nextElementSibling) values.push(clean(sibling.textContent));
        if (values.length) lines.push(`${clean(node.textContent)}: ${values.join('; ')}`);
      } else if (!node.closest('dl')) {
        const text = clean(node.textContent);
        if (text) lines.push(text);
      }
    }
    const selected = [];
    let length = 0;
    for (const line of lines) {
      if (length + line.length + (selected.length ? 1 : 0) > maxLength) break;
      selected.push(line);
      length += line.length + (selected.length > 1 ? 1 : 0);
    }
    return { title, text: selected.join('\n') };
  } finally { dom.window.close(); }
}

export async function generateKnowledge() {
const helpSource = await readFile(resolve(root, 'site-help-data.js'), 'utf8');
const newsSource = await readFile(resolve(root, 'site-news-data.js'), 'utf8');
const companySource = await readFile(resolve(root, 'site-company-knowledge.js'), 'utf8');
const sandbox = { window: {} };
runInNewContext(companySource, sandbox, { timeout: 1000 });
runInNewContext(helpSource, sandbox, { timeout: 1000 });
runInNewContext(newsSource, sandbox, { timeout: 1000 });
const data = sandbox.window.MOKDA_HELP_DATA;
const news = sandbox.window.MOKDA_NEWS;
const company = validateCompanyKnowledge(sandbox.window.MOKDA_COMPANY_KNOWLEDGE);
const languages = { KR: 'ko', ES: 'es', EN: 'en' };
const knowledge = {};
const hashes = {};

for (const [language, locale] of Object.entries(languages)) {
  const faqs = data[language].categories.flatMap(category => category.questions.map(question => ({
    id: question.id,
    topic: category.id,
    question: question.question,
    text: question.answer,
    label: question.link.label,
    path: `/${locale}/${question.link.path}`,
  })));
  const docs = [];
  for (const page of ['about.html', 'products.html', 'kpeno.html', 'para-carnes.html', 'qna.html']) {
    const html = await readFile(resolve(root, locale, page), 'utf8');
    hashes[`${locale}/${page}`] = createHash('sha256').update(html).digest('hex');
    const { title, text } = extractPublicDocument(html, `${locale}/${page}`);
    // Keep products complete and brand/history bounded; never collect DOM form values.
    docs.push({ id: page.replace('.html', ''), title, text, path: `/${locale}/${page}` });
  }
  for (const story of news.stories) {
    if (!/^[a-z0-9-]+$/.test(story.id) || !story[language]) throw new Error('Invalid public story');
    const page = `news-${story.id}.html`;
    await readFile(resolve(root, locale, page), 'utf8');
    const copy = story[language];
    docs.push({
      id: `news-${story.id}`,
      title: clean(copy.title),
      text: clean([copy.title, copy.summary, story.eventDate ? `Event date: ${story.eventDate}${story.eventEndDate ? ` – ${story.eventEndDate}` : ''}` : '', story.publishedDate ? `Published: ${story.publishedDate}` : '', ...(copy.sections || []).flat()].join('\n')).slice(0, 3500),
      path: `/${locale}/${page}`,
    });
  }
  for (const source of [...faqs, ...docs]) {
    if (!new RegExp(`^/${locale}/[a-z0-9-]+\\.html(?:\\?(?:purpose=(?:distribution|collaboration)))?(?:#history)?$`).test(source.path)) throw new Error(`Unsafe public source: ${source.path}`);
    await readFile(resolve(root, source.path.replace(/^\//, '').split(/[?#]/)[0]), 'utf8');
  }
  knowledge[language] = { faqs, docs };
}

const payload = {
  generatedAt: company.updatedAt,
  sourceHashes: {
    'site-help-data.js': createHash('sha256').update(helpSource).digest('hex'),
    'site-news-data.js': createHash('sha256').update(newsSource).digest('hex'),
    'site-company-knowledge.js': createHash('sha256').update(companySource).digest('hex'),
    ...hashes,
  },
  languages: knowledge,
  company,
};
await writeFile(output, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`Generated public chatbot knowledge: ${Object.keys(knowledge).length} languages, ${knowledge.KR.docs.length} public documents, ${knowledge.KR.faqs.length} verified answers.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await generateKnowledge();
