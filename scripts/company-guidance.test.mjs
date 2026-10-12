import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
function fixture(withKnowledge = true) {
  const sandbox = { window: {} }; vm.createContext(sandbox);
  for (const file of [...(withKnowledge ? ['site-company-knowledge.js'] : []), 'site-help-data.js', 'site-chat-intents.js', 'site-chat-engine.js']) {
    vm.runInContext(readFileSync(new URL(file, root), 'utf8'), sandbox, { filename: file });
  }
  return sandbox.window;
}
const w = fixture(), engine = w.MOKDA_CHAT_ENGINE, knowledge = w.MOKDA_COMPANY_KNOWLEDGE;
let checks = 0;
const cases = {
  KR: {
    moq: '최소 주문수량은 몇 개인가요?', samples: '샘플 제공 조건은 어떻게 되나요?', pricing: '가격은 어떻게 안내하나요?', leadTime: '주문 후 출고까지 얼마나 걸리나요?', packing: '한 박스에 몇 개 들어가나요?', bulk: '대용량 제품도 있나요?', documents: '카탈로그와 시험성적서 제공 가능한가요?', certifications: '식품 인증이 있나요?', support: '상담 가능한 시간과 언어가 궁금해요', oem: 'OEM 가능한가요?', exclusive: '독점 유통 제안도 가능한가요?', brand: 'MOKDA의 제품 강점은 무엇인가요?', specifications: '제품 용량은 몇 그램인가요?',
    request: '샘플을 받고 싶어요', country: '페루 수입사입니다', product: '두 제품 모두 관심 있어요', documentRequest: '카탈로그 보내주세요', named: '할랄 인증이 있나요?', unique: '유일한 한국 소스 브랜드인가요?', productQuestion: 'K-PEÑO의 맵기가 궁금해요', mixed: '가격과 개봉 후 보관이 궁금해요', quote: '거래 가격과 샘플 조건을 문의하고 싶어요',
  },
  ES: {
    moq: '¿Cuál es el pedido mínimo?', samples: '¿Ofrecen muestras gratis?', pricing: '¿Cómo consulto los precios?', leadTime: '¿Cuál es el plazo de entrega?', packing: '¿Cuántas unidades por caja?', bulk: '¿Tienen formatos grandes?', documents: '¿Tienen catálogo y ficha técnica?', certifications: '¿Tienen certificaciones?', support: '¿Cuál es el horario y los idiomas de atención?', oem: '¿Ofrecen OEM o marca propia?', exclusive: '¿Reciben propuestas de distribución exclusiva?', brand: '¿Las desarrollaron con chefs latinoamericanos?', specifications: '¿Cuál es el peso neto?',
    request: 'Quiero solicitar muestras', country: 'Somos una importadora en Perú', product: 'Me interesan ambas salsas', documentRequest: 'Envíame el catálogo', named: '¿Tienen certificación halal?', unique: '¿Es una salsa coreana única para Latinoamérica?', productQuestion: '¿Qué tan picante es K-PEÑO?', mixed: '¿Cuáles son los precios y cómo se conserva después de abrir?', quote: 'Quiero consultar precios comerciales y muestras',
  },
  EN: {
    moq: 'What is the minimum order?', samples: 'Do you offer free samples?', pricing: 'How do you provide prices?', leadTime: 'What is the lead time?', packing: 'How many bottles per carton?', bulk: 'Do you offer bulk formats?', documents: 'Can you provide a catalog and test reports?', certifications: 'Do you have food certifications?', support: 'What are your support hours and contact languages?', oem: 'Do you offer OEM or private label?', exclusive: 'Do you accept exclusive distribution proposals?', brand: 'Were the sauces developed with Latin American chefs?', specifications: 'What is the bottle weight?',
    request: 'I would like to request samples', country: 'We are an importer in Peru', product: 'I am interested in both sauces', documentRequest: 'Please send the catalog', named: 'Are the sauces halal certified?', unique: 'Are you the only Korean sauce for Latin America?', productQuestion: 'How spicy is K-PEÑO?', mixed: 'How do prices work and how do I store it after opening?', quote: 'I would like to discuss business pricing and samples',
  },
};
for (const [language, queries] of Object.entries(cases)) {
  const answers = knowledge.answers[language];
  for (const topic of ['moq', 'samples', 'pricing', 'leadTime', 'packing', 'bulk', 'documents', 'certifications', 'support', 'oem', 'exclusive', 'brand', 'specifications']) {
    const result = engine.reply(queries[topic], { language });
    assert(result.text.includes(answers[topic]), `${language}/${topic}: ${result.text}`);
    assert.equal(result.handoff, false, `${language}/${topic}: Basic factual answers do not immediately hand off`);
    assert.equal(result.aiTextAllowed, false, 'Company policy cannot be replaced with model-generated text');
    checks++;
  }
  const first = engine.reply(queries.request, { language });
  assert(first.text.includes(answers.samples)); assert.equal(first.handoff, false); assert.equal(first.context.audience, 'B2B');
  const second = engine.reply(queries.country, { language, context: first.context });
  assert.equal(second.handoff, false); assert.equal(second.decision.stage, 'product'); assert(second.text.includes(answers.samples));
  const third = engine.reply(queries.product, { language, context: second.context });
  assert.equal(third.handoff, true); assert.equal(third.decision.missingFields.length, 0); assert(third.text.includes(answers.samples));
  assert.match(third.handoffSummary, /Peru/); assert.match(third.handoffSummary, /K-PEÑO.*Para Carnes/);
  const restored = engine.reply('', { language, context: third.context }); assert.equal(restored.handoff, true);
  const product = engine.reply(queries.productQuestion, { language, context: third.context }); assert.equal(product.handoff, false);
  assert.equal(product.context.companyTopic, undefined, 'Product follow-ups clear a previous transaction topic');
  const quote = engine.reply(queries.quote, { language }); assert.equal(quote.context.audience, 'B2B'); assert.equal(quote.decision.stage, 'business_context');
  const complete = engine.reply(`${queries.request}. ${queries.country}. ${queries.product}`, { language }); assert.equal(complete.handoff, true);
  const document = engine.reply(queries.documentRequest, { language }); assert.equal(document.handoff, true); assert(document.text.includes(answers.documents)); assert.equal(document.decision.reason, 'document_request');
  const named = engine.reply(queries.named, { language }); assert.equal(named.handoff, true); assert(named.text.includes(answers.namedCertifications)); assert.equal(named.decision.reason, 'specific_certification_review');
  assert(!named.text.includes(answers.certifications), 'Generic certification existence cannot imply a specific certificate');
  const unique = engine.reply(queries.unique, { language }); assert(unique.text.includes(answers.brand)); assert.equal(unique.aiTextAllowed, false);
  const interpreted = engine.reply('Additional commercial policy question', { language, interpretation: { intent: 'pricing', companyTopic: 'moq', handoff: true } });
  assert(interpreted.text.includes(answers.moq)); assert.equal(interpreted.handoff, false);
  const invalid = engine.reply('zzzzzz', { language, interpretation: { companyTopic: 'fakePolicy', handoff: true } }); assert.equal(invalid.handoff, false); assert(!invalid.text.includes(answers.moq));
  const mixed = engine.reply(queries.mixed, { language }); assert(mixed.text.includes(answers.pricing)); assert.match(mixed.text, /냉장|refrig[eé]r/i); assert.equal(mixed.handoff, false);
  checks += 13;
}
assert.equal(knowledge.facts.minimumOrderUnits, 1000); assert.equal(knowledge.facts.sampleQuantityExclusiveUpperBound, 50);
assert.equal(knowledge.facts.sampleFreeProvisionCount, 1); assert.equal(knowledge.facts.unitsPerCase, 12);
assert.equal(knowledge.facts.sampleInternationalShippingPaidBy, 'buyer'); assert.equal(knowledge.facts.brand.marketUniquenessVerified, false);
for (const [language, answers] of Object.entries(knowledge.answers)) {
  const pricing = w.MOKDA_HELP_DATA[language].categories.flatMap(category => category.questions).find(q => q.id === 'pricing');
  assert(pricing.answer.includes(answers.moq)); assert(pricing.answer.includes(answers.samples)); assert(pricing.answer.includes(answers.pricing));
  assert.doesNotMatch(pricing.answer, /1,008|1008/); checks++;
}
const old = fixture(false).MOKDA_CHAT_ENGINE.reply('MOQ', { language: 'EN' }); assert.equal(old.handoff, false); assert(old.text.length > 10); checks++;
for (const [language, question, availability] of [
  ['KR', '페루에서 개인적으로 한 병 구매하고 싶어요. 가격도 궁금해요', /중남미.*직접 판매/],
  ['ES', 'Quiero comprar para consumo personal en Perú. ¿Cuál es el precio?', /no vendemos directamente.*Latinoam[eé]rica/i],
  ['EN', 'I want to buy one bottle for personal use in Peru. What is the price?', /not yet selling directly.*Latin America/i],
]) {
  const result = engine.reply(question, { language }); assert.match(result.text, availability); assert.equal(result.handoff, false);
  assert.doesNotMatch(result.text, /individual quote|cotizaci[oó]n individual|개별 견적/); checks++;
}
for (const language of ['KR', 'ES', 'EN']) {
  const questions = w.MOKDA_HELP_DATA[language].categories.flatMap(category => category.questions);
  for (const id of ['ingredients', 'storage']) assert.doesNotMatch(questions.find(q => q.id === id).answer, /제품 소개 자료|자료에 따르면|presentation|presentaci[oó]n/i);
  assert.doesNotMatch(knowledge.answers[language].specifications, /공개.*자료|informaci[oó]n publicada|published product/i);
  checks++;
}
const allergen = engine.reply('Does K-PEÑO contain milk?', { language: 'EN', interpretation: { intent: 'ingredients', companyTopic: 'documents' } });
assert.match(allergen.text, /contains milk/i); assert.equal(allergen.handoff, false); assert.equal(allergen.category, 'product'); checks++;
for (const [language, query] of [['KR', '소비기한은 얼마나 되나요?'], ['ES', '¿Cuál es la vida útil?'], ['EN', 'What is the shelf life?']]) {
  const result = engine.reply(query, { language }); assert(result.text.includes(knowledge.answers[language].specifications)); assert.equal(result.handoff, false); checks++;
}
console.log(`Company guidance passed: ${checks} multilingual policy and funnel checks.`);
