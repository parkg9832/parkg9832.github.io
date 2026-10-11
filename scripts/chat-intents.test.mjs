import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(await fs.readFile(path.join(root, 'site-help-data.js'), 'utf8'), context);
vm.runInContext(await fs.readFile(path.join(root, 'site-chat-intents.js'), 'utf8'), context);
const match = context.window.MOKDA_CHAT_INTENTS.match;

let checks = 0;
const check = (query, lang, expected) => {
  assert.equal(match(query, lang), expected, `${lang}: ${query}`);
  checks += 1;
};

// Every visible question must route to its own public answer, without a second menu.
for (const [lang, data] of Object.entries(context.window.MOKDA_HELP_DATA)) {
  for (const category of data.categories) {
    for (const question of category.questions) check(question.question, lang, question.id);
  }
}

for (const [query, lang, expected] of [
  ['가격', 'KR', 'pricing'], ['최소 주문 수량?', 'KR', 'pricing'], ['샘플 있나요', 'KR', 'pricing'],
  ['보관', 'KR', 'storage'], ['유통기한이 언제까지예요?', 'KR', 'storage'], ['유통', 'KR', 'export'],
  ['수입하고 싶어요', 'KR', 'export'], ['이 소스 매워요?', 'KR', 'choose'], ['소스 추천해주세요', 'KR', 'choose'],
  ['알레르겐', 'KR', 'ingredients'], ['비건인가요?', 'KR', 'ingredients'], ['임산부가 먹어도 되나요?', 'KR', 'ingredients'],
  ['타코랑 먹어도 되나요?', 'KR', 'ingredients'], ['타코에 곁들이는 방법', 'KR', 'pairings'],
  ['MOKDA 가격은 얼마인가요?', 'KR', 'pricing'], ['MOKDA 소식 알려주세요', 'KR', 'news'],
  ['minimum order', 'EN', 'pricing'], ['MOQ', 'EN', 'pricing'], ['samples?', 'EN', 'pricing'],
  ['where can I buy?', 'EN', 'buy'], ['where is it sold?', 'EN', 'buy'], ['import', 'EN', 'export'],
  ['Is the sauce gluten-free?', 'EN', 'ingredients'], ['Is it halal certified?', 'EN', 'ingredients'],
  ['How do I refrigerate after opening?', 'EN', 'storage'], ['Is this spicy?', 'EN', 'choose'],
  ['I run my restaurant', 'EN', 'horeca'], ['MOKDA prices?', 'EN', 'pricing'],
  ['precio', 'ES', 'pricing'], ['pedido mínimo', 'ES', 'pricing'], ['muestras', 'ES', 'pricing'],
  ['distribuidor', 'ES', 'export'], ['importar', 'ES', 'export'], ['¿Dónde puedo comprar?', 'ES', 'buy'],
  ['¿Dónde se venden?', 'ES', 'buy'], ['alérgenos', 'ES', 'ingredients'], ['¿Es vegano?', 'ES', 'ingredients'],
  ['¿Cómo conservar las salsas?', 'ES', 'storage'], ['¿Es picante?', 'ES', 'choose'],
  ['Quiero usarlas en mi restaurante', 'ES', 'horeca'], ['Precio de MOKDA', 'ES', 'pricing'],
  ['¿Dónde veo los videos de creadores?', 'ES', 'creators'], ['KOTRA Lima', 'ES', 'news'],
  ['¿Qué es MOKDA?', 'ES', 'brand'], ['how did MOKDA start?', 'EN', 'history'],
  ['¿Cuál es el precio para un distribuidor?', 'ES', 'pricing'],
  ['What are MOKDA prices?', 'EN', 'pricing'], ['Soy distribuidor', 'ES', 'export'],
  ['우유가 들어있나요?', 'KR', 'ingredients'], ['Does it contain nuts?', 'EN', 'ingredients'],
  ['밀이 들어있나요?', 'KR', 'ingredients'], ['밀 함유인가요?', 'KR', 'ingredients'],
  ['I want a collaboration', 'EN', 'collaboration'], ['Quiero una colaboración', 'ES', 'collaboration'],
  ['얼마나 매워요?', 'KR', 'choose'], ['개봉 후 얼마나 보관할 수 있나요?', 'KR', 'storage'],
  ['얼마동안 보관할 수 있나요?', 'KR', 'storage'], ['얼마 동안 보관할 수 있나요?', 'KR', 'storage'],
  ['수출 견적을 받고 싶어요', 'KR', 'pricing'], ['prices for importing', 'EN', 'pricing'],
  ['I want to import MOKDA and get prices', 'EN', 'pricing'], ['Quiero importar MOKDA. ¿Cuáles son los precios?', 'ES', 'pricing'],
  ['크리에이터인데 협업 영상 만들고 싶어요', 'KR', 'collaboration'],
  ['Soy influencer y quiero hacer un video con MOKDA', 'ES', 'collaboration'],
  ['I am a creator and want to make a video with MOKDA', 'EN', 'collaboration'],
  ['크리에이터 협업 영상을 제안하고 싶어요', 'KR', 'collaboration'],
  ['I want a creator video collaboration', 'EN', 'collaboration'],
  ['크리에이터 협업 영상은 어디서 보나요?', 'KR', 'creators'],
  ['Where can I watch the creator videos?', 'EN', 'creators'], ['¿Dónde puedo ver videos de creadores?', 'ES', 'creators'],
  ['Expoalimentaria president visit', 'EN', 'news'], ['Historia', 'ES', 'history'],
  ['  가격' + ' '.repeat(496), 'KR', 'pricing'],
  // A visitor can type a different language from the current page.
  ['MOQ', 'KR', 'pricing'], ['가격', 'ES', 'pricing'], ['alérgenos', 'EN', 'ingredients'],
]) check(query, lang, expected);

for (const lang of ['KR', 'ES', 'EN']) {
  for (const query of [
    '', '  ', 'Tell me a joke', '오늘 날씨가 어때?', 'What is the capital of Peru?', 'MOKDA can you write Python?',
    'Bitcoin price', 'iPhone precio', '오늘 축구 뉴스', 'world news', 'MOKDA weather', 'MOKDA와 아무 관련 없는 얘기',
    'Tell me the history of ancient Egypt', 'historia de Francia', '나는 일찍 시작했어',
    '비밀이 있나요?', '밀라노에 뭐가 있나요?',
    'storage and prices', '보관 방법과 구매처 둘 다 알려주세요', 'precio y alérgenos', 'MOKDA history and news',
    '수출 절차와 가격을 알려주세요', '가격이 얼마인가요? 수입은 어떻게 진행하나요?',
    'What are your prices and how can I import MOKDA?', '¿Cuál es el precio y cómo puedo importar MOKDA?',
    'I want to make a video with MOKDA. Where can I watch creator videos?',
    '협업 영상을 만들고 싶어요. 크리에이터 영상은 어디서 볼 수 있나요?',
    'How much does the bottle weigh?', 'How much is the weight?', '중량은 얼마인가요?',
    '<img src=x onerror="window.__injected=true">', '<script>window.__injected=true</script>',
    '가격' + 'a'.repeat(500), 'a'.repeat(20000),
  ]) check(query, lang, null);
  for (const query of [null, undefined, 42, {}, ['가격']]) check(query, lang, null);
}
assert.equal(context.window.__injected, undefined);
assert.ok(Object.isFrozen(context.window.MOKDA_CHAT_INTENTS));
assert.ok(!/\b(?:fetch|XMLHttpRequest|WebSocket|localStorage|sessionStorage)\b/.test(await fs.readFile(path.join(root, 'site-chat-intents.js'), 'utf8')));
console.log(`Chat intent checks passed: ${checks}.`);
