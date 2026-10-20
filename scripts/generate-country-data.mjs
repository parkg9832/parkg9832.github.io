import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const data = JSON.parse(await readFile(new URL('data/countries.json', root), 'utf8'));
if (data.records.length < 240 || new Set(data.records.map(x => x.code)).size !== data.records.length) throw new Error('Invalid country source');
const source = `/* Generated from data/countries.json. Country/region choices, not sales availability. */
(() => {
  const records = ${JSON.stringify(data.records)};
  const clean = text => String(text || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').normalize('NFC').toLowerCase();
  const byCode = new Map(records.map(item => [item.code, item]));
  const knownNames = new Set(records.map(item => item.name));
  const label = (code, language = 'ES') => byCode.get(code)?.names[language] || byCode.get(code)?.name || '';
  const options = (language = 'ES', query = '') => records.filter(item => !query || clean([item.code, item.name, ...Object.values(item.names)].join(' ')).includes(clean(query))).map(item => ({ code: item.code, name: item.name, label: label(item.code, language) })).sort((a, b) => a.label.localeCompare(b.label, {KR:'ko',ES:'es',EN:'en'}[language]));
  window.MOKDA_COUNTRIES = Object.freeze({ records: Object.freeze(records), label, options, known: code => byCode.has(code), isKnownName: name => knownNames.has(name), name: code => byCode.get(code)?.name || '', code: name => records.find(item => item.name === name || item.code === name || Object.values(item.names).includes(name))?.code || '' });
})();
`;
await writeFile(new URL('site-country-data.js', root), source);
// Keep the receiving allowlist in sync without trusting arbitrary visitor text.
const path = new URL('apps-script/b2b-lead-automation.gs', root);
let gs = await readFile(path, 'utf8');
const block = `// BEGIN GENERATED ANALYTICS MARKETS\nconst ANALYTICS_MARKETS = ${JSON.stringify([...data.records.map(x => x.name), 'Other'])};\n// END GENERATED ANALYTICS MARKETS`;
if (gs.includes('// BEGIN GENERATED ANALYTICS MARKETS')) gs = gs.replace(/\/\/ BEGIN GENERATED ANALYTICS MARKETS[\s\S]*?\/\/ END GENERATED ANALYTICS MARKETS/, block);
else gs = block + '\n' + gs;
gs = gs.replace(/\['Peru','Mexico','Chile','Colombia','Argentina','Korea','USA','Brazil','Ecuador','Bolivia','Uruguay','Paraguay','Panama','Costa Rica','Guatemala','Venezuela','Dominican Republic','El Salvador','Honduras','Nicaragua','Cuba','Puerto Rico','Spain','Canada','Germany','Japan','UK'\]\.indexOf\(item\.market\)/g, 'ANALYTICS_MARKETS.indexOf(item.market)');
await writeFile(path, gs);
console.log(`Generated ${data.records.length} country/region choices and the matching analytics allowlist.`);
