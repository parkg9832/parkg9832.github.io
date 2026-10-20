import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const scope=vm.createContext({window:{}});
for(const name of ['site-company-knowledge.js','site-help-data.js','site-chat-intents.js','site-chat-engine.js'])vm.runInContext(fs.readFileSync(new URL('../'+name,import.meta.url),'utf8'),scope,{filename:name});
const engine=scope.window.MOKDA_CHAT_ENGINE;
const scenarios={
 KR:{start:'샘플을 받고 싶어요',heat:'K-PEÑO는 얼마나 매워요?',details:'페루 수입사입니다',both:'두 제품 모두 관심 있어요',samplePolicy:'샘플 제공 조건이 궁금해요',freight:'그럼 배송비는요?',sweet:'그건 달아요?',other:'그럼 다른 소스는요?',consumer:'사업이 아니라 개인적으로 한 병 구매하려고 해요',countryCorrection:'페루가 아니라 멕시코',quantity:'100병 말고 10병',storage:'개봉 후에는 어떻게 보관하나요?',safety:'우유 알레르기가 있는데 K-PEÑO를 안전하게 먹어도 되나요?'},
 ES:{start:'Quiero solicitar muestras',heat:'¿Qué tan picante es K-PEÑO?',details:'Somos una importadora en Perú',both:'Me interesan ambas salsas',samplePolicy:'¿Ofrecen muestras gratis?',freight:'¿Y el envío?',sweet:'¿Es dulce?',other:'¿Y la otra?',consumer:'No es para un negocio. Quiero una botella para consumo personal',countryCorrection:'México, no Perú',quantity:'10 bottles instead of 100 bottles',storage:'¿Cómo se conserva después de abrir?',safety:'Tengo alergia a la leche, ¿es seguro comer K-PEÑO?'},
 EN:{start:'I would like to request samples',heat:'How spicy is K-PEÑO?',details:'We are an importer in Peru',both:'Both sauces please',samplePolicy:'Do you offer free samples?',freight:'And who pays for shipping?',sweet:'Is it sweet?',other:'And the other one?',consumer:'It is for personal use, not for a business',countryCorrection:'Mexico, not Peru',quantity:'100 bottles, actually 10 bottles',storage:'How should I store it after opening?',safety:'I have a milk allergy. Is K-PEÑO safe to eat?'},
};
const traces=[];let checks=0;
for(const[language,q]of Object.entries(scenarios)){
 let context={};const turns=[];
 const ask=question=>{const r=engine.reply(question,{language,context});context=r.context;turns.push({question,text:r.text,decision:r.decision,context:r.context,quickReplies:r.quickReplies});assert(r.text.trim());return r;};
 let r=ask(q.start);assert.equal(r.decision.stage,'business_context');assert.equal(r.handoff,false);
 r=ask(q.heat);assert.equal(r.category,'product');assert.equal(r.handoff,false);assert.equal(context.requestPurpose,'pricing');
 const resume=r.quickReplies.find(x=>/이어|retomar|continue/i.test(x.label));assert(resume,'Product detours retain a visible way back to the business inquiry');
 assert.deepEqual(engine.reply('',{language,context}).quickReplies,r.quickReplies,'Restoring a product detour preserves the same questions');checks++;
 r=ask(q.details);assert.equal(r.handoff,true,'Known product plus country and role completes the original sample request');assert.equal(context.country,'Peru');assert.equal(context.businessType,'importer');
 assert.match(r.handoffSummary,/샘플|muestras|samples/,'The original sample request survives a heat detour');assert(r.quickReplies.length,'Business qualification does not end self-service questions');
 const qualificationText=r.text;r=ask(q.samplePolicy);assert.equal(r.handoff,true);assert(!r.text.includes(qualificationText),'A qualified visitor gets the sample answer without a repeated handoff paragraph');checks++;
 r=ask(q.both);assert.equal(r.handoff,true);assert.equal(context.product,'both');
 r=ask(q.countryCorrection);assert.equal(context.country,'Mexico');assert.doesNotMatch(r.handoffSummary,/Peru|Perú|페루/);
 r=ask(q.quantity);assert.match(context.quantity,/^10(?:\D|$)/);assert.doesNotMatch(r.handoffSummary,/100(?:\s|병)/);
 r=ask(q.consumer);assert.equal(context.audience,'B2C');assert.equal(context.requestPurpose,undefined);assert.equal(context.requestQuestion,undefined);assert.equal(r.handoff,false);
 assert.match(r.text,/직접 판매|no vendemos directamente|not yet selling directly/i,'A consumer never inherits a business quote path');
 context={};r=ask(q.samplePolicy);r=ask(q.freight);assert.equal(r.decision.reason,'company_guidance');assert.match(r.text,/바이어|comprador|buyer/);assert.equal(r.handoff,false);assert.equal(context.audience,undefined);
 assert.deepEqual(engine.reply('',{language,context}).quickReplies,r.quickReplies,'Restoring a company answer preserves contextual questions');checks++;
 context={};r=ask('K-PEÑO');r=ask(q.sweet);assert.match(r.text,/알룰로스|alulosa|allulose/);assert.equal(context.product,'kpeno');assert.equal(r.handoff,false);
 r=ask(q.other);assert.equal(context.product,'para_carnes');assert.match(r.text,/참깨|sésamo|sesame/,'The other sauce receives its own flavor description');
 r=ask(q.storage);assert(!r.quickReplies.some(x=>/보관|After opening|Después de abrir/.test(x.label)),'The just-answered storage question is not immediately offered again');
 r=ask(q.safety);assert.equal(r.aiTextAllowed,false);assert.equal(r.handoff,false);assert.match(r.text,/우유|milk|leche/i);
 // Follow every visible, non-qualification suggestion from several entry points.
 // This catches dead ends caused by translated button text, not just intent IDs.
 for(const seed of ['K-PEÑO',q.samplePolicy,q.storage]){
  const first=engine.reply(seed,{language});
  for(const next of first.quickReplies){const reply=engine.reply(next.question,{language,context:first.context});assert.notEqual(reply.decision.reason,'clarify_unknown',`${language}: dead-end suggestion ${next.label}`);assert(reply.quickReplies.length<=3);checks++;}
 }
 // Restoring a conversation preserves the same contextual suggestions.
 const restored=engine.reply('',{language,context:r.context});assert.equal(restored.context.product,r.context.product);assert.equal(restored.handoff,r.handoff);
 traces.push({language,turns});checks+=20;
}
if(process.env.MOKDA_CHAT_TRACE_OUTPUT)fs.writeFileSync(process.env.MOKDA_CHAT_TRACE_OUTPUT,JSON.stringify(traces,null,2));
console.log(`Conversation continuity passed: ${checks} semantic checks in Korean, Spanish and English, interrupted qualification, corrected handoff details, consumer switch, dependent sample freight, product flavor and contextual suggestions.`);
