import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../support-preview-data.js', import.meta.url), 'utf8');
const fixedNow = new Date('2026-09-01T12:00:00+09:00').getTime();
class FixedDate extends Date {
  constructor(value) {
    super(value === undefined ? fixedNow : value);
  }

  static now() {
    return fixedNow;
  }
}

const context = {
  window: {
    location: {
      hostname: 'localhost',
      search: '?support_preview=200',
    },
  },
  URLSearchParams,
  Date: FixedDate,
  Math,
  Object,
  Array,
  Set,
};
vm.createContext(context);
vm.runInContext(source, context);

const preview = context.window.MOKDA_SUPPORT_PREVIEW;
assert.equal(preview.isEnabled(), true);
assert.equal(preview.isTestMode(), true);
const data = preview.create('ES');
assert.equal(data.total, 200);
assert.deepEqual({ ...data.totals }, { PE: 120, MX: 60, CL: 10, CO: 10 });

const countryCounts = { PE: 0, MX: 0, CL: 0, CO: 0 };
const genderCounts = { female: 0, male: 0 };
const createdAtValues = new Set();
const names = new Set();
const nameComponentCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };
const start = new Date(data.campaignCreatedAt).getTime();

data.entries.forEach((entry) => {
  countryCounts[entry.countryCode] += 1;
  genderCounts[entry.gender] += 1;
  assert.match(entry.name, /^\S+(?:\s+\S+){0,3}$/);
  assert.ok(entry.name.length <= 40);
  nameComponentCounts[entry.name.split(/\s+/).length] += 1;
  assert.equal(entry.message, `¡Quiero encontrar Salsa Coreana en ${{ PE: 'Perú', MX: 'México', CL: 'Chile', CO: 'Colombia' }[entry.countryCode]}!`);
  const timestamp = new Date(entry.createdAt).getTime();
  assert.ok(timestamp >= start && timestamp <= fixedNow);
  createdAtValues.add(entry.createdAt);
  names.add(entry.name);
});

assert.deepEqual(countryCounts, { PE: 120, MX: 60, CL: 10, CO: 10 });
assert.deepEqual(genderCounts, { female: 160, male: 40 });
assert.deepEqual(nameComponentCounts, { 1: 20, 2: 90, 3: 60, 4: 30 });
assert.equal(createdAtValues.size, 200);
assert.equal(names.size, 200);

context.window.location.hostname = 'www.mokda.kr';
assert.equal(preview.isEnabled(), true);
context.window.location.search = '';
assert.equal(preview.isEnabled(), true);
assert.equal(preview.isTestMode(), false);
context.window.location.hostname = 'example.com';
assert.equal(preview.isEnabled(), false);

console.log('Support preview fixture checks passed.');
