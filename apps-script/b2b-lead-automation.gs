const SHEET_HEADERS = [
  'Received At',
  'Page Language',
  'Company',
  'Contact',
  'Business Email',
  'Market',
  'Inquiry Type',
  'Inquiry Type ES',
  'Partnership Details',
  'Partnership Details ES',
  'Page URL',
  'User Agent',
];

function doGet() {
  return jsonResponse({
    ok: true,
    service: 'MOKDA B2B lead automation',
    message: 'Ready to receive B2B inquiries.',
  });
}

function doPost(event) {
  try {
    const payload = parsePayload(event);

    if (payload.website) {
      return jsonResponse({ ok: true, skipped: true });
    }

    validatePayload(payload);

    const language = String(payload.language || 'ES').toUpperCase();
    const sourceLanguage = getSourceLanguage(language);
    const inquiryTypeEs = translateToSpanish(payload.purpose, sourceLanguage);
    const messageEs = translateToSpanish(payload.message, sourceLanguage);
    const receivedAt = new Date();

    appendLead([
      receivedAt,
      language,
      payload.company,
      payload.name,
      payload.email,
      payload.country,
      payload.purpose,
      inquiryTypeEs,
      payload.message,
      messageEs,
      payload.pageUrl || '',
      payload.userAgent || '',
    ]);

    notifyGoogleChat({
      receivedAt,
      language,
      company: payload.company,
      name: payload.name,
      email: payload.email,
      country: payload.country,
      purpose: payload.purpose,
      purposeEs: inquiryTypeEs,
      message: payload.message,
      messageEs,
      pageUrl: payload.pageUrl || '',
    });

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: String(error.message || error) });
  }
}

function parsePayload(event) {
  if (!event || !event.postData || !event.postData.contents) {
    throw new Error('Missing request body');
  }

  return JSON.parse(event.postData.contents);
}

function validatePayload(payload) {
  const requiredFields = ['company', 'name', 'email', 'country', 'purpose', 'message'];
  const missing = requiredFields.filter((field) => !String(payload[field] || '').trim());

  if (missing.length) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email))) {
    throw new Error('Invalid email');
  }
}

function appendLead(row) {
  const sheetId = getRequiredProperty('SHEET_ID');
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadsheet.getSheets()[0];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(SHEET_HEADERS);
      sheet.setFrozenRows(1);
    }

    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }
}

function notifyGoogleChat(lead) {
  const webhookUrl = getRequiredProperty('CHAT_WEBHOOK_URL');
  const timestamp = Utilities.formatDate(lead.receivedAt, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
  const text = [
    '📩 MOKDA B2B 문의 접수',
    '',
    `시간: ${timestamp} KST`,
    `회사: ${lead.company}`,
    `담당자: ${lead.name}`,
    `이메일: ${lead.email}`,
    `시장: ${lead.country}`,
    `문의 유형: ${lead.purposeEs}`,
    '',
    '스페인어 번역:',
    lead.messageEs,
    '',
    `원문 언어: ${lead.language}`,
    `원문: ${lead.message}`,
    lead.pageUrl ? `페이지: ${lead.pageUrl}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  UrlFetchApp.fetch(webhookUrl, {
    method: 'post',
    contentType: 'application/json; charset=utf-8',
    payload: JSON.stringify({ text }),
    muteHttpExceptions: true,
  });
}

function translateToSpanish(value, sourceLanguage) {
  const text = String(value || '').trim();

  if (!text || sourceLanguage === 'es') {
    return text;
  }

  return LanguageApp.translate(text, sourceLanguage, 'es');
}

function getSourceLanguage(language) {
  if (language === 'KR') return 'ko';
  if (language === 'EN') return 'en';
  return 'es';
}

function getRequiredProperty(key) {
  const value = PropertiesService.getScriptProperties().getProperty(key);

  if (!value) {
    throw new Error(`Missing script property: ${key}`);
  }

  return value;
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
