const SERVICE_NAME = 'MOKDA Inquiry';
const TIME_ZONE = 'Asia/Seoul';
const LEAD_SHEET_NAME = 'Sheet1';

const SCRIPT_PROPERTY_KEYS = {
  sheetId: 'SHEET_ID',
  chatWebhookUrl: 'CHAT_WEBHOOK_URL',
  notificationEmail: 'NOTIFICATION_EMAIL',
};

const REQUIRED_PAYLOAD_FIELDS = ['name', 'email', 'country', 'purpose', 'message'];

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
  'Inquiry Type KO',
  'Partnership Details KO',
  'Inquiry Source',
  'WhatsApp',
];

const FUNNEL_SHEET_NAME = 'Funnel Events';
const FUNNEL_HEADERS = [
  'Received At',
  'Event Name',
  'Anonymous Visitor ID',
  'Session ID',
  'Page Path',
  'Page Language',
  'Device',
  'Referrer Host',
  'UTM Source',
  'UTM Medium',
  'UTM Campaign',
  'Element',
  'Product',
  'Scroll Depth',
  'Browser Locale',
  'Time Zone',
  'Event ID',
  'Page URL',
  'Active Seconds',
  'Page Instance ID',
];
const DEMAND_SHEET_NAME = 'Demand Support';
const DEMAND_HEADERS = [
  'Received At',
  'Supporter Name',
  'Country Code',
  'Country',
  'Page Language',
  'Anonymous Visitor ID',
  'Event ID',
  'UTM Source',
  'UTM Medium',
  'UTM Campaign',
  'Referrer Host',
  'Page URL',
  'Public Feed Opt-in',
  'Support Message',
];
const DEMAND_COUNTRIES = {
  PE: 'Peru',
  MX: 'Mexico',
  CL: 'Chile',
  CO: 'Colombia',
  AR: 'Argentina',
};
const FUNNEL_EVENT_NAMES = [
  'page_view',
  'product_section_view',
  'product_cta_click',
  'contact_cta_click',
  'contact_view',
  'form_start',
  'lead_submit',
  'social_click',
  'language_switch',
  'scroll_depth',
  'engagement_update',
  'tracking_test',
  'support_popup_view',
  'support_popup_cta',
  'support_popup_hide_day',
  'support_page_view',
  'support_cta_click',
  'support_form_start',
  'support_submit',
];

function doGet(event) {
  const mode = String((event && event.parameter && event.parameter.mode) || '').trim();
  if (mode === 'demand_support') {
    return jsonResponse(getDemandSupportFeed(event));
  }

  const chatWebhookUrl = getOptionalProperty(SCRIPT_PROPERTY_KEYS.chatWebhookUrl);

  return jsonResponse({
    ok: true,
    service: `${SERVICE_NAME} lead automation`,
    message: 'Ready to receive MOKDA inquiries.',
    notification: {
      hasChatWebhookUrl: Boolean(chatWebhookUrl),
      chatWebhookUrlLooksValid: isGoogleChatWebhookUrl(chatWebhookUrl),
      hasNotificationEmail: Boolean(getOptionalProperty(SCRIPT_PROPERTY_KEYS.notificationEmail)),
    },
    sheet: getSheetStatus(),
  });
}

function testEmailNotification() {
  const notificationEmail = getRequiredProperty(SCRIPT_PROPERTY_KEYS.notificationEmail);

  MailApp.sendEmail({
    to: notificationEmail,
    subject: `[${SERVICE_NAME}] Email notification test`,
    body: `${SERVICE_NAME} email notification is working.`,
    name: SERVICE_NAME,
  });

  return `Sent test email to ${notificationEmail}`;
}

function doPost(event) {
  try {
    const payload = parsePayload(event);

    if (isDemandSupportPayload(payload)) {
      return jsonResponse(appendDemandSupport(payload));
    }

    if (isFunnelPayload(payload)) {
      const result = appendFunnelEvents(payload);
      return jsonResponse({ ok: true, analytics: true, saved: result.saved });
    }

    if (payload && typeof payload === 'object' && !Array.isArray(payload) && payload.website) {
      return jsonResponse({ ok: true, skipped: true });
    }

    validatePayload(payload);

    const language = String(payload.language || 'ES').toUpperCase();
    const source = String(payload.source || 'website').trim();
    const company = String(payload.company || '').trim();
    const whatsapp = String(payload.whatsapp || '').trim();
    const sourceLanguage = getSourceLanguage(language);
    const inquiryTypeEs = translateToSpanish(payload.purpose, sourceLanguage);
    const messageEs = translateToSpanish(payload.message, sourceLanguage);
    const inquiryTypeKo = translateToKorean(payload.purpose, sourceLanguage);
    const messageKo = translateToKorean(payload.message, sourceLanguage);
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
      inquiryTypeKo,
      messageKo,
      source,
      whatsapp,
    ]);

    const notification = notifyLead({
      receivedAt,
      language,
      source,
      company,
      name: payload.name,
      email: payload.email,
      whatsapp,
      country: payload.country,
      purpose: payload.purpose,
      purposeEs: inquiryTypeEs,
      purposeKo: inquiryTypeKo,
      message: payload.message,
      messageEs,
      messageKo,
      pageUrl: payload.pageUrl || '',
    });

    return jsonResponse({ ok: notification.ok, saved: true, notification });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: String(error.message || error) });
  }
}

function isDemandSupportPayload(payload) {
  return Boolean(
    payload &&
      typeof payload === 'object' &&
      !Array.isArray(payload) &&
      payload.type === 'demand_support'
  );
}

function appendDemandSupport(payload) {
  const name = cleanAnalyticsValue(payload.name, 40);
  const countryCode = String(payload.country || '').trim().toUpperCase();
  const visitorId = cleanAnalyticsValue(payload.visitorId, 100);
  const eventId = cleanAnalyticsValue(payload.eventId, 100);
  const publicFeed = payload.publicFeed === true;
  const message = cleanAnalyticsValue(payload.message, 180);

  if (!name) throw new Error('Supporter name is required');
  if (!DEMAND_COUNTRIES[countryCode]) throw new Error('Unsupported country');
  if (!visitorId) throw new Error('Anonymous visitor ID is required');
  if (!eventId) throw new Error('Event ID is required');

  if (payload.verification === true) {
    return { ok: true, saved: false, verification: true, message };
  }

  const sheetId = getRequiredProperty(SCRIPT_PROPERTY_KEYS.sheetId);
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    let sheet = spreadsheet.getSheetByName(DEMAND_SHEET_NAME);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(DEMAND_SHEET_NAME);
    }

    ensureDemandHeaders(sheet);

    if (sheet.getLastRow() > 1) {
      const existingVisitor = sheet
        .getRange(2, 6, sheet.getLastRow() - 1, 1)
        .createTextFinder(visitorId)
        .matchEntireCell(true)
        .findNext();

      if (existingVisitor) {
        if (publicFeed) {
          sheet.getRange(existingVisitor.getRow(), 2).setValue(name);
          sheet.getRange(existingVisitor.getRow(), 3).setValue(countryCode);
          sheet.getRange(existingVisitor.getRow(), 4).setValue(DEMAND_COUNTRIES[countryCode]);
          sheet.getRange(existingVisitor.getRow(), 13).setValue(true);
          sheet.getRange(existingVisitor.getRow(), 14).setValue(message);
        }
        return { ok: true, saved: false, duplicate: true };
      }
    }

    sheet.appendRow([
      new Date(),
      name,
      countryCode,
      DEMAND_COUNTRIES[countryCode],
      cleanAnalyticsValue(payload.language, 20),
      visitorId,
      eventId,
      cleanAnalyticsValue(payload.utmSource, 100),
      cleanAnalyticsValue(payload.utmMedium, 100),
      cleanAnalyticsValue(payload.utmCampaign, 150),
      cleanAnalyticsValue(payload.referrerHost, 150),
      cleanAnalyticsValue(payload.pageUrl, 500),
      publicFeed,
      message,
    ]);

    return { ok: true, saved: true, duplicate: false };
  } finally {
    lock.releaseLock();
  }
}

function ensureDemandHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, DEMAND_HEADERS.length).setValues([DEMAND_HEADERS]);
    sheet.setFrozenRows(1);
    return;
  }

  const currentHeaders = sheet.getRange(1, 1, 1, DEMAND_HEADERS.length).getValues()[0];
  const needsUpdate = DEMAND_HEADERS.some((header, index) => currentHeaders[index] !== header);

  if (needsUpdate) {
    sheet.getRange(1, 1, 1, DEMAND_HEADERS.length).setValues([DEMAND_HEADERS]);
    sheet.setFrozenRows(1);
  }
}

function getDemandSupportFeed(event) {
  const requestedLimit = Number((event && event.parameter && event.parameter.limit) || 24);
  const limit = Math.min(Math.max(Math.round(requestedLimit) || 24, 1), 50);
  const totals = Object.keys(DEMAND_COUNTRIES).reduce((result, code) => {
    result[code] = 0;
    return result;
  }, {});
  const sheetId = getRequiredProperty(SCRIPT_PROPERTY_KEYS.sheetId);
  const spreadsheet = SpreadsheetApp.openById(sheetId);
  const sheet = spreadsheet.getSheetByName(DEMAND_SHEET_NAME);

  if (!sheet || sheet.getLastRow() <= 1) {
    return { ok: true, total: 0, totals, supporters: [] };
  }

  ensureDemandHeaders(sheet);
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, DEMAND_HEADERS.length).getValues();
  rows.forEach((row) => {
    const countryCode = String(row[2] || '').trim().toUpperCase();
    if (Object.prototype.hasOwnProperty.call(totals, countryCode)) totals[countryCode] += 1;
  });

  const supporters = rows
    .filter((row) => row[12] === true || String(row[12]).toLowerCase() === 'true')
    .slice(-limit)
    .reverse()
    .map((row) => ({
      name: cleanAnalyticsValue(row[1], 40),
      countryCode: String(row[2] || '').trim().toUpperCase(),
      createdAt: row[0] instanceof Date ? row[0].toISOString() : String(row[0] || ''),
      message: cleanAnalyticsValue(row[13], 180),
    }));

  return {
    ok: true,
    total: rows.length,
    totals,
    supporters,
  };
}

function isFunnelPayload(payload) {
  return Boolean(
    payload &&
      typeof payload === 'object' &&
      !Array.isArray(payload) &&
      payload.type === 'analytics' &&
      Array.isArray(payload.events)
  );
}

function appendFunnelEvents(payload) {
  const events = payload.events.slice(0, 20);
  const validEvents = events.filter((item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return false;
    return FUNNEL_EVENT_NAMES.indexOf(String(item.name || '')) !== -1;
  });

  if (!validEvents.length) {
    return { saved: 0 };
  }

  const sheetId = getRequiredProperty(SCRIPT_PROPERTY_KEYS.sheetId);
  const spreadsheet = SpreadsheetApp.openById(sheetId);
  let sheet = spreadsheet.getSheetByName(FUNNEL_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(FUNNEL_SHEET_NAME);
  }

  ensureFunnelHeaders(sheet);

  const now = new Date();
  const rows = [];
  const cache = CacheService.getScriptCache();

  validEvents.forEach((item) => {
    const eventId = cleanAnalyticsValue(item.eventId, 100);
    if (!eventId || cache.get(`funnel:${eventId}`)) return;

    cache.put(`funnel:${eventId}`, '1', 21600);
    rows.push([
      now,
      cleanAnalyticsValue(item.name, 50),
      cleanAnalyticsValue(payload.visitorId, 100),
      cleanAnalyticsValue(payload.sessionId, 100),
      cleanAnalyticsValue(item.pagePath, 300),
      cleanAnalyticsValue(item.language, 20),
      cleanAnalyticsValue(item.device, 20),
      cleanAnalyticsValue(item.referrerHost, 150),
      cleanAnalyticsValue(item.utmSource, 100),
      cleanAnalyticsValue(item.utmMedium, 100),
      cleanAnalyticsValue(item.utmCampaign, 150),
      cleanAnalyticsValue(item.element, 150),
      cleanAnalyticsValue(item.product, 80),
      cleanAnalyticsValue(item.scrollDepth, 20),
      cleanAnalyticsValue(item.browserLocale, 30),
      cleanAnalyticsValue(item.timeZone, 80),
      eventId,
      cleanAnalyticsValue(item.pageUrl, 500),
      cleanAnalyticsNumber(item.activeSeconds, 0, 86400),
      cleanAnalyticsValue(item.pageInstanceId, 100),
    ]);
  });

  if (!rows.length) {
    return { saved: 0 };
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, FUNNEL_HEADERS.length).setValues(rows);
  } finally {
    lock.releaseLock();
  }

  return { saved: rows.length };
}

function ensureFunnelHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, FUNNEL_HEADERS.length).setValues([FUNNEL_HEADERS]);
    sheet.setFrozenRows(1);
    return;
  }

  const currentHeaders = sheet.getRange(1, 1, 1, FUNNEL_HEADERS.length).getValues()[0];
  const needsUpdate = FUNNEL_HEADERS.some((header, index) => currentHeaders[index] !== header);

  if (needsUpdate) {
    sheet.getRange(1, 1, 1, FUNNEL_HEADERS.length).setValues([FUNNEL_HEADERS]);
    sheet.setFrozenRows(1);
  }
}

function cleanAnalyticsValue(value, maxLength) {
  const cleaned = String(value == null ? '' : value)
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .trim()
    .slice(0, maxLength);

  return /^[=+\-@]/.test(cleaned) ? `'${cleaned}` : cleaned;
}

function cleanAnalyticsNumber(value, min, max) {
  if (value === '' || value == null) return '';

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return '';

  return Math.min(max, Math.max(min, Math.floor(parsed)));
}

function parsePayload(event) {
  if (!event || !event.postData || !event.postData.contents) {
    throw new Error('Missing request body');
  }

  try {
    return JSON.parse(event.postData.contents);
  } catch (error) {
    throw new Error('Invalid JSON request body');
  }
}

function validatePayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Request body must be a JSON object');
  }

  const missing = REQUIRED_PAYLOAD_FIELDS.filter((field) => !String(payload[field] || '').trim());

  if (missing.length) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email))) {
    throw new Error('Invalid email');
  }
}

function appendLead(row) {
  const sheetId = getRequiredProperty(SCRIPT_PROPERTY_KEYS.sheetId);
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    let sheet = spreadsheet.getSheetByName(LEAD_SHEET_NAME);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(LEAD_SHEET_NAME);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(SHEET_HEADERS);
      sheet.setFrozenRows(1);
    } else {
      ensureSheetHeaders(sheet);
    }

    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }
}

function getSheetStatus() {
  try {
    const sheetId = getRequiredProperty(SCRIPT_PROPERTY_KEYS.sheetId);
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadsheet.getSheetByName(LEAD_SHEET_NAME);

    if (!sheet) {
      throw new Error(`Lead sheet not found: ${LEAD_SHEET_NAME}`);
    }

    return {
      ok: true,
      name: sheet.getName(),
      lastRow: sheet.getLastRow(),
      lastColumn: sheet.getLastColumn(),
    };
  } catch (error) {
    return {
      ok: false,
      error: String(error.message || error),
    };
  }
}

function notifyLead(lead) {
  const webhookUrl = getOptionalProperty(SCRIPT_PROPERTY_KEYS.chatWebhookUrl);
  const notificationEmail = getOptionalProperty(SCRIPT_PROPERTY_KEYS.notificationEmail);

  try {
    if (isGoogleChatWebhookUrl(webhookUrl)) {
      notifyGoogleChatWebhook(lead, webhookUrl);
      return { channel: 'google_chat', ok: true };
    }

    if (webhookUrl) {
      console.warn('CHAT_WEBHOOK_URL is not a Google Chat incoming webhook URL. Falling back to email if configured.');
    }

    if (notificationEmail) {
      return tryNotifyEmail(lead, notificationEmail);
    }

    console.warn('No notification channel configured. Add CHAT_WEBHOOK_URL or NOTIFICATION_EMAIL.');
    return { channel: 'none', ok: false, error: 'Missing NOTIFICATION_EMAIL and valid CHAT_WEBHOOK_URL' };
  } catch (error) {
    console.error(`Notification failed: ${error.message || error}`);

    if (notificationEmail) {
      return tryNotifyEmail(lead, notificationEmail);
    }

    return { channel: 'none', ok: false, error: String(error.message || error) };
  }
}

function tryNotifyEmail(lead, email) {
  try {
    notifyEmail(lead, email);
    return { channel: 'email', ok: true };
  } catch (error) {
    console.error(`Email notification failed: ${error.message || error}`);
    return { channel: 'email', ok: false, error: String(error.message || error) };
  }
}

function notifyGoogleChatWebhook(lead, webhookUrl) {
  const timestamp = Utilities.formatDate(lead.receivedAt, TIME_ZONE, 'yyyy-MM-dd HH:mm:ss');
  const body = formatLeadNotification(lead, timestamp);

  const response = UrlFetchApp.fetch(webhookUrl, {
    method: 'post',
    contentType: 'application/json; charset=utf-8',
    payload: JSON.stringify({ text: body }),
    muteHttpExceptions: true,
  });

  const statusCode = response.getResponseCode();
  if (statusCode < 200 || statusCode >= 300) {
    throw new Error(`Google Chat webhook returned HTTP ${statusCode}: ${response.getContentText()}`);
  }
}

function notifyEmail(lead, email) {
  const timestamp = Utilities.formatDate(lead.receivedAt, TIME_ZONE, 'yyyy-MM-dd HH:mm:ss');
  const inquiryLabel = getInquiryLabel(lead.source);
  const senderLabel = lead.company || lead.name;
  const subject = `[MOKDA ${inquiryLabel}] ${senderLabel} - ${lead.country}`;
  const body = formatLeadNotification(lead, timestamp);

  MailApp.sendEmail({
    to: email,
    subject,
    body,
    name: SERVICE_NAME,
  });
}

function formatLeadNotification(lead, timestamp) {
  return [
    `MOKDA ${getInquiryLabel(lead.source)}가 접수되었습니다.`,
    '',
    `접수 시간: ${timestamp} KST`,
    `문의 구분: ${getInquiryLabel(lead.source)}`,
    lead.company ? `회사: ${lead.company}` : '',
    `이름: ${lead.name}`,
    `이메일: ${lead.email}`,
    lead.whatsapp ? `WhatsApp: ${lead.whatsapp}` : '',
    `희망 시장: ${lead.country}`,
    `문의 유형: ${lead.purposeKo}`,
    '',
    '[한국어 번역]',
    lead.messageKo,
    '',
    '[스페인어 번역]',
    lead.messageEs,
    '',
    `[원문 - ${lead.language}]`,
    lead.message,
    '',
    lead.pageUrl ? `제출 페이지: ${lead.pageUrl}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function getInquiryLabel(source) {
  return source === 'contact-page' ? '일반 문의' : 'B2B 문의';
}

function ensureSheetHeaders(sheet) {
  const currentHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), SHEET_HEADERS.length)).getValues()[0];
  const needsUpdate = SHEET_HEADERS.some((header, index) => currentHeaders[index] !== header);

  if (needsUpdate) {
    sheet.getRange(1, 1, 1, SHEET_HEADERS.length).setValues([SHEET_HEADERS]);
  }
}

function isGoogleChatWebhookUrl(value) {
  return /^https:\/\/chat\.googleapis\.com\/v1\/spaces\/[^/]+\/messages\?/.test(String(value || ''));
}

function translateToSpanish(value, sourceLanguage) {
  return safeTranslate(value, sourceLanguage, 'es');
}

function translateToKorean(value, sourceLanguage) {
  return safeTranslate(value, sourceLanguage, 'ko');
}

function safeTranslate(value, sourceLanguage, targetLanguage) {
  const text = String(value || '').trim();

  if (!text || sourceLanguage === targetLanguage) {
    return text;
  }

  try {
    return LanguageApp.translate(text, sourceLanguage, targetLanguage);
  } catch (error) {
    console.warn(`Translation failed (${sourceLanguage} -> ${targetLanguage}): ${error.message || error}`);
    return text;
  }
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

function getOptionalProperty(key) {
  return String(PropertiesService.getScriptProperties().getProperty(key) || '').trim();
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
