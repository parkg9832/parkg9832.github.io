import { createRequire } from 'node:module';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const root = join(import.meta.dirname, '..');
const photoPath = join(root, 'assets', 'images', 'salsa-coreana-support-campaign-2026.webp');
const outputDirectory = join(root, 'assets', 'images');

const campaigns = {
  es: {
    eyebrow: 'PROYECTO DE LANZAMIENTO · 2026',
    title: ['Ayúdanos a lanzar', 'Salsa Coreana.'],
    body: [
      'Queremos llevar MOKDA a Perú y México.',
      'Tu apoyo convierte este sueño en demanda real.',
    ],
    action: 'QUIERO APOYAR',
    note: 'Nombre o apodo · Elige un país · 10 segundos',
  },
  ko: {
    eyebrow: '첫 출시 응원 프로젝트 · 2026',
    title: ['Salsa Coreana의 출시를', '도와주세요!'],
    body: [
      '페루와 멕시코에서 MOKDA를 선보이고 싶습니다.',
      '당신의 응원이 이 꿈을 실제 수요로 바꿉니다.',
    ],
    action: '출시 응원하기',
    note: '이름 또는 닉네임 · 국가 선택 · 10초면 완료',
  },
  en: {
    eyebrow: 'FIRST LAUNCH PROJECT · 2026',
    title: ['Help us launch', 'Salsa Coreana.'],
    body: [
      'We want to bring MOKDA to Peru and Mexico.',
      'Your support turns this dream into real demand.',
    ],
    action: 'SUPPORT THE LAUNCH',
    note: 'Name or nickname · Choose a country · 10 seconds',
  },
};

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function textLines(lines, { x, y, size, lineHeight, weight = 700, fill = '#fffaf2' }) {
  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * lineHeight}" fill="${fill}" font-size="${size}" font-weight="${weight}">${escapeXml(line)}</text>`,
    )
    .join('');
}

function desktopSvg(copy) {
  return `
    <svg width="1200" height="720" viewBox="0 0 1200 720" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#0b3023" stop-opacity="0.98"/>
          <stop offset="46%" stop-color="#0b3023" stop-opacity="0.91"/>
          <stop offset="76%" stop-color="#0b3023" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="#0b3023" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="55%" stop-color="#071d16" stop-opacity="0"/>
          <stop offset="100%" stop-color="#071d16" stop-opacity="0.48"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="720" fill="url(#shade)"/>
      <rect width="1200" height="720" fill="url(#bottom)"/>
      <g font-family="'Noto Sans KR', 'Arial', sans-serif">
        <text x="72" y="68" fill="#fffaf2" font-size="22" font-weight="900" letter-spacing="5">MOKDA</text>
        <rect x="72" y="103" width="300" height="38" rx="19" fill="#ef5f18"/>
        <text x="93" y="129" fill="#fffaf2" font-size="14" font-weight="800" letter-spacing="1.3">${escapeXml(copy.eyebrow)}</text>
        ${textLines(copy.title, { x: 72, y: 238, size: 62, lineHeight: 72, weight: 900 })}
        ${textLines(copy.body, { x: 76, y: 403, size: 23, lineHeight: 37, weight: 600, fill: '#f8ede0' })}
        <rect x="72" y="520" width="420" height="78" rx="8" fill="#fffaf2"/>
        <text x="101" y="570" fill="#123d2e" font-size="22" font-weight="900" letter-spacing="0.3">${escapeXml(copy.action)}</text>
        <text x="450" y="571" fill="#ef5f18" font-size="32" font-weight="700" text-anchor="end">→</text>
        <text x="74" y="638" fill="#fffaf2" font-size="14" font-weight="650">${escapeXml(copy.note)}</text>
        <text x="1128" y="670" fill="#fffaf2" font-size="14" font-weight="800" text-anchor="end" letter-spacing="1.6">PERÚ · MÉXICO</text>
      </g>
    </svg>`;
}

function mobileSvg(copy) {
  return `
    <svg width="780" height="1040" viewBox="0 0 780 1040" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shadeMobile" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0b3023" stop-opacity="0.18"/>
          <stop offset="34%" stop-color="#0b3023" stop-opacity="0.26"/>
          <stop offset="65%" stop-color="#0b3023" stop-opacity="0.89"/>
          <stop offset="100%" stop-color="#0b3023" stop-opacity="0.99"/>
        </linearGradient>
      </defs>
      <rect width="780" height="1040" fill="url(#shadeMobile)"/>
      <g font-family="'Noto Sans KR', 'Arial', sans-serif">
        <text x="54" y="67" fill="#fffaf2" font-size="21" font-weight="900" letter-spacing="4.5">MOKDA</text>
        <rect x="52" y="522" width="330" height="42" rx="21" fill="#ef5f18"/>
        <text x="75" y="550" fill="#fffaf2" font-size="15" font-weight="800" letter-spacing="1">${escapeXml(copy.eyebrow)}</text>
        ${textLines(copy.title, { x: 52, y: 647, size: 55, lineHeight: 66, weight: 900 })}
        ${textLines(copy.body, { x: 55, y: 793, size: 21, lineHeight: 34, weight: 600, fill: '#f8ede0' })}
        <rect x="52" y="886" width="676" height="82" rx="10" fill="#fffaf2"/>
        <text x="82" y="939" fill="#123d2e" font-size="23" font-weight="900">${escapeXml(copy.action)}</text>
        <text x="690" y="941" fill="#ef5f18" font-size="34" font-weight="700" text-anchor="end">→</text>
        <text x="54" y="1005" fill="#fffaf2" font-size="14" font-weight="650">${escapeXml(copy.note)}</text>
      </g>
    </svg>`;
}

for (const [language, copy] of Object.entries(campaigns)) {
  await sharp(photoPath)
    .resize(1200, 720, { fit: 'cover', position: 'north' })
    .composite([{ input: Buffer.from(desktopSvg(copy)) }])
    .webp({ quality: 90, smartSubsample: true })
    .toFile(join(outputDirectory, `support-popup-${language}-2026.webp`));

  await sharp(photoPath)
    .resize(780, 1040, { fit: 'cover', position: 'centre' })
    .composite([{ input: Buffer.from(mobileSvg(copy)) }])
    .webp({ quality: 90, smartSubsample: true })
    .toFile(join(outputDirectory, `support-popup-${language}-2026-mobile.webp`));
}

console.log('Rendered 6 support campaign poster assets.');
