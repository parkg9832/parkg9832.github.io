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
  'support_country_select',
  'support_form_start',
  'support_submit',
];

function doGet(event) {
  const mode = String((event && event.parameter && event.parameter.mode) || '').trim();
  if (mode === 'demand_support') {
    return jsonResponse(getDemandSupportFeed(event));
  }
  if (mode === 'update_dashboard') {
    return jsonResponse({ ok: true, result: updateDashboardSheetWithSupportFunnel() });
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
  const name = cleanAnalyticsValue(payload.name, 24);
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
        refreshDashboardIfNeeded_();
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

    try {
      const cache = CacheService.getScriptCache();
      cache.remove('demand_support_feed_v3_0_20');
    } catch (e) {}

    refreshDashboardIfNeeded_();
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
  const requestedLimit = Number((event && event.parameter && event.parameter.limit) || 20);
  const requestedOffset = Number((event && event.parameter && event.parameter.offset) || 0);
  const limit = Math.min(Math.max(Math.round(requestedLimit) || 20, 1), 20);
  const offset = Math.max(Math.round(requestedOffset) || 0, 0);
  const cacheKey = `demand_support_feed_v3_${offset}_${limit}`;
  const shouldCache = offset === 0;
  const cache = CacheService.getScriptCache();
  if (shouldCache) {
    try {
      const cachedJson = cache.get(cacheKey);
      if (cachedJson) {
        return JSON.parse(cachedJson);
      }
    } catch (e) {}
  }

  const totals = Object.keys(DEMAND_COUNTRIES).reduce((result, code) => {
    result[code] = 0;
    return result;
  }, {});
  const sheetId = getRequiredProperty(SCRIPT_PROPERTY_KEYS.sheetId);
  const spreadsheet = SpreadsheetApp.openById(sheetId);
  const sheet = spreadsheet.getSheetByName(DEMAND_SHEET_NAME);

  if (!sheet || sheet.getLastRow() <= 1) {
    const emptyResult = { ok: true, total: 0, publicTotal: 0, totals, supporters: [], hasMore: false };
    if (shouldCache) {
      try { cache.put(cacheKey, JSON.stringify(emptyResult), 45); } catch (e) {}
    }
    return emptyResult;
  }

  ensureDemandHeaders(sheet);
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, DEMAND_HEADERS.length).getValues();
  const eligibleRows = rows.filter((row) => {
    const countryCode = String(row[2] || '').trim().toUpperCase();
    return Object.prototype.hasOwnProperty.call(DEMAND_COUNTRIES, countryCode);
  });

  eligibleRows.forEach((row) => {
    const countryCode = String(row[2] || '').trim().toUpperCase();
    totals[countryCode] += 1;
  });

  const publicRows = eligibleRows
    .filter((row) => row[12] === true || String(row[12]).toLowerCase() === 'true')
    .reverse();
  const supporters = publicRows
    .slice(offset, offset + limit)
    .map((row) => ({
      name: cleanAnalyticsValue(row[1], 40),
      countryCode: String(row[2] || '').trim().toUpperCase(),
      createdAt: row[0] instanceof Date ? row[0].toISOString() : String(row[0] || ''),
      message: cleanAnalyticsValue(row[13], 180),
    }));

  const payload = {
    ok: true,
    total: eligibleRows.length,
    publicTotal: publicRows.length,
    totals,
    supporters,
    hasMore: offset + supporters.length < publicRows.length,
  };

  if (shouldCache) {
    try {
      cache.put(cacheKey, JSON.stringify(payload), 45);
    } catch (e) {}
  }

  return payload;
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

  const dashboardEvents = new Set([
    'contact_cta_click',
    'form_start',
    'lead_submit',
    'support_page_view',
    'support_country_select',
    'support_form_start',
    'support_submit',
  ]);
  if (validEvents.some((item) => dashboardEvents.has(String(item.name || '')))) {
    refreshDashboardIfNeeded_();
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

/**
 * 대시보드에 출시 응원 곁가지 퍼널을 메인 퍼널과 동일한 디자인으로 구축합니다.
 *
 * 퍼널 3단계: 전체 방문(=A7 참조) → 응원 방문 → 응원 완료
 * 포함: 누적 전환율, 다음 단계 이탈률, 이탈 세션, 자동 진단, 유입/이탈 분석, 퍼널 비교
 */
function updateDashboardSheetWithSupportFunnelLegacy_() {
  var sheetId = getRequiredProperty(SCRIPT_PROPERTY_KEYS.sheetId);
  var ss = SpreadsheetApp.openById(sheetId);
  var dashboard = ss.getSheetByName('MOKDA 홈페이지 대시보드') || ss.getSheetByName('대시보드');
  var funnelSheet = ss.getSheetByName('Funnel Events');
  var supportSheet = ss.getSheetByName('Demand Support');

  if (!dashboard || !funnelSheet) {
    throw new Error('필수 시트(대시보드/Funnel Events)를 찾을 수 없습니다.');
  }

  // ════════════════════════════
  //  1. 데이터 수집 & 집계
  // ════════════════════════════
  var allData = funnelSheet.getDataRange().getValues();
  var hdr = allData[0];
  var ci = function(name) { return hdr.indexOf(name); };
  var iEv = ci('Event Name'), iSid = ci('Session ID');
  var iPath = ci('Page Path'), iRef = ci('Referrer Host');
  var iElem = ci('Element'), iTime = ci('Received At');
  var rows = allData.slice(1);

  // 고유 세션 집합 반환
  function sessFor(evName, elemFilter) {
    var s = {};
    rows.forEach(function(r) {
      if (r[iEv] === evName && r[iSid]) {
        if (!elemFilter || r[iElem] === elemFilter) {
          s[String(r[iSid])] = true;
        }
      }
    });
    return Object.keys(s);
  }

  var supView  = sessFor('support_page_view');
  var supSubmitEv = sessFor('support_submit');

  // 응원 완료: Funnel Events 이벤트 수 vs Demand Support 시트 행 수 중 큰 값
  var nComplete = supSubmitEv.length;
  if (supportSheet) {
    var sheetRows = Math.max(0, supportSheet.getLastRow() - 1);
    if (sheetRows > nComplete) nComplete = sheetRows;
  }

  var nSupView = supView.length;
  var nSupSubmit = nComplete;

  // ── 유입 경로 분석 (세션 기준 중복 제거) ──
  var refBySession = {};
  rows.forEach(function(r) {
    if (r[iEv] === 'support_page_view' && r[iSid]) {
      var sid = String(r[iSid]);
      if (!refBySession[sid]) {
        var ref = String(r[iRef] || '').trim();
        refBySession[sid] = ref || '직접 방문';
      }
    }
  });
  var refCnt = {};
  Object.keys(refBySession).forEach(function(k) {
    var v = refBySession[k];
    refCnt[v] = (refCnt[v] || 0) + 1;
  });
  var topRef = Object.entries(refCnt).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 3);
  while (topRef.length < 3) topRef.push(['—', 0]);

  // ── 이탈 행동 분석 ──
  var timeline = {};
  rows.forEach(function(r) {
    var sid = String(r[iSid] || '');
    if (!sid) return;
    if (!timeline[sid]) timeline[sid] = [];
    timeline[sid].push({ ev: r[iEv], pg: String(r[iPath] || ''), t: r[iTime] });
  });

  var exitCnt = {};
  supView.forEach(function(sid) {
    var tl = (timeline[sid] || []).sort(function(a, b) { return new Date(a.t) - new Date(b.t); });
    var last = tl[tl.length - 1];
    var lbl;
    if (!last) {
      lbl = '알 수 없음';
    } else if (last.ev === 'support_submit') {
      lbl = '응원 완료 후 이탈';
    } else if (last.ev === 'support_page_view' || last.ev === 'scroll_milestone') {
      lbl = '응원 페이지에서 이탈';
    } else {
      var pg = (last.pg || last.ev).replace(/\.html$/i, '').replace(/^\/?(es|en|ko)\//i, '/');
      lbl = pg || last.ev;
    }
    exitCnt[lbl] = (exitCnt[lbl] || 0) + 1;
  });
  var topExit = Object.entries(exitCnt).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 3);
  while (topExit.length < 3) topExit.push(['—', 0]);

  // ── 최다 응원 국가 ──
  var topCountry = 'N/A';
  if (supportSheet && supportSheet.getLastRow() > 1) {
    var cData = supportSheet.getRange(2, 3, supportSheet.getLastRow() - 1).getValues();
    var cc = {};
    cData.forEach(function(row) {
      var c = row[0];
      if (c) cc[c] = (cc[c] || 0) + 1;
    });
    var cSorted = Object.entries(cc).sort(function(a, b) { return b[1] - a[1]; });
    if (cSorted.length) topCountry = cSorted[0][0];
  }

  // ════════════════════════════════════════════════
  //  2. 대시보드 작성 (메인 퍼널 디자인 동일)
  // ════════════════════════════════════════════════

  // 기존 영역 초기화 (Row 28~55)
  dashboard.getRange('A28:L55').breakApart().clearContent().clearFormat();

  var R = 28; // 시작 행

  // ── 셀 병합 + 포맷 헬퍼 ──
  function m(row, col, cols, val, o) {
    o = o || {};
    var r = dashboard.getRange(row, col, 1, cols).merge();
    if (typeof val === 'string' && val.length > 0 && val.charAt(0) === '=') {
      r.setFormula(val);
    } else {
      r.setValue(val);
    }
    if (o.b) r.setFontWeight('bold');
    if (o.s) r.setFontSize(o.s);
    if (o.c) r.setFontColor(o.c);
    if (o.bg) r.setBackground(o.bg);
    if (o.a) r.setHorizontalAlignment(o.a);
    if (o.f) r.setNumberFormat(o.f);
    if (o.it) r.setFontStyle('italic');
    return r;
  }

  // ────────────────────────────────────────
  //  섹션: 곁가지 퍼널 — 출시 응원
  // ────────────────────────────────────────

  // Row 28: 타이틀 바
  m(R, 1, 12, '곁가지 퍼널 — 출시 응원 (Support Campaign)', { b: 1, c: '#ffffff', bg: '#ef5f18', a: 'left' });

  // Row 29: STEP 라벨 (색상 그라데이션)
  var stepColors = ['#ef5f18', '#ff9800', '#4caf50'];
  var stepLabels = ['STEP 1 →', 'STEP 2 →', 'STEP 3'];
  for (var i = 0; i < 3; i++) {
    m(R + 1, i * 2 + 1, 2, stepLabels[i], { b: 1, c: '#ffffff', bg: stepColors[i], a: 'center' });
  }
  m(R + 1, 7, 6, '자동 진단', { b: 1, c: '#ffffff', bg: '#c62828', a: 'center' });

  // Row 30: 단계 이름
  var stepNames = ['전체 방문', '응원 방문', '응원 완료'];
  for (var i = 0; i < 3; i++) {
    m(R + 2, i * 2 + 1, 2, stepNames[i], { b: 1, bg: '#fff3e0', a: 'center' });
  }
  m(R + 2, 7, 2, '가장 큰 이탈 구간', { s: 9, c: '#666666', a: 'right' });
  m(R + 2, 9, 4, '', { a: 'left' });

  // Row 31: 세션 수
  // STEP 1 = 메인 대시보드 A7 참조! (79세션과 100% 동일)
  m(R + 3, 1, 2, '=A7', { b: 1, s: 22, a: 'center' });
  m(R + 3, 3, 2, nSupView, { b: 1, s: 22, a: 'center' });
  m(R + 3, 5, 2, nSupSubmit, { b: 1, s: 22, a: 'center' });
  m(R + 3, 7, 6, '=IF((1 - C31/A31) >= (1 - E31/C31), "전체 방문 → 응원 방문", "응원 방문 → 응원 완료")', { b: 1, c: '#c62828', a: 'center', s: 11 });

  // Row 32: "세션" 라벨 + 최대 이탈률 라벨
  for (var i = 0; i < 3; i++) {
    m(R + 4, i * 2 + 1, 2, '세션', { s: 8, c: '#999999', a: 'center' });
  }
  m(R + 4, 7, 2, '최대 이탈률', { s: 9, c: '#666666', a: 'right' });
  m(R + 4, 9, 4, '', { a: 'center' });

  // Row 33: 누적 전환율 + 최대 이탈률 값
  m(R + 5, 1, 2, 1, { b: 1, s: 16, c: '#2e7d32', a: 'center', f: '0.0%' });
  m(R + 5, 3, 2, '=IF(A31>0, C31/A31, 0)', { b: 1, s: 16, c: '#f57f17', a: 'center', f: '0.0%' });
  m(R + 5, 5, 2, '=IF(A31>0, E31/A31, 0)', { b: 1, s: 16, c: '#2e7d32', a: 'center', f: '0.0%' });
  m(R + 5, 7, 2, '', {});
  m(R + 5, 9, 4, '=MAX(1 - C31/A31, 1 - E31/C31)', { b: 1, s: 20, c: '#c62828', a: 'center', f: '0.0%' });

  // Row 34: "누적 전환율" 라벨 + 우선 개선 영역
  for (var i = 0; i < 3; i++) {
    m(R + 6, i * 2 + 1, 2, '누적 전환율', { s: 8, c: '#999999', a: 'center' });
  }
  m(R + 6, 7, 2, '우선 개선 영역', { s: 9, c: '#666666', a: 'right' });
  m(R + 6, 9, 4, '', { a: 'center' });

  // Row 35: 다음 단계 이탈률 + 우선 개선 텍스트
  m(R + 7, 1, 2, '=IF(A31>0, (A31-C31)/A31, 0)', { b: 1, s: 14, c: '#f57f17', a: 'center', f: '0.0%' });
  m(R + 7, 3, 2, '=IF(C31>0, (C31-E31)/C31, 0)', { b: 1, s: 14, c: '#f57f17', a: 'center', f: '0.0%' });
  m(R + 7, 5, 2, 0, { b: 1, s: 14, c: '#2e7d32', a: 'center', f: '0.0%' });
  m(R + 7, 7, 6, '=IF(I33>0.8, "이탈률 심각 — 즉시 개선", IF(I33>0.5, "이탈률 주의 — 개선 검토", "양호"))', { b: 1, c: '#c62828', a: 'center' });

  // Row 36: "다음 단계 이탈률" 라벨 + 직전 단계 전환율
  for (var i = 0; i < 3; i++) {
    m(R + 8, i * 2 + 1, 2, '다음 단계 이탈률', { s: 8, c: '#999999', a: 'center' });
  }
  m(R + 8, 7, 2, '직전 단계 전환율', { s: 9, c: '#666666', a: 'right' });
  m(R + 8, 9, 4, '', { a: 'center' });

  // Row 37: 이탈 세션 + 직전 전환율 값
  m(R + 9, 1, 2, '=A31-C31', { b: 1, s: 14, a: 'center' });
  m(R + 9, 3, 2, '=C31-E31', { b: 1, s: 14, a: 'center' });
  m(R + 9, 5, 2, '=E31', { b: 1, s: 14, a: 'center' });
  m(R + 9, 7, 2, '', {});
  m(R + 9, 9, 4, '=IF(C31>0, E31/C31, 0)', { b: 1, s: 16, c: '#2e7d32', a: 'center', f: '0.0%' });

  // Row 38: "이탈 세션" / "완료 세션" 라벨 + 최다 국가
  m(R + 10, 1, 2, '이탈 세션', { s: 8, c: '#999999', a: 'center' });
  m(R + 10, 3, 2, '이탈 세션', { s: 8, c: '#999999', a: 'center' });
  m(R + 10, 5, 2, '완료 세션', { s: 8, c: '#999999', a: 'center' });
  m(R + 10, 7, 2, '최다 응원 국가', { s: 9, c: '#666666', a: 'right' });
  m(R + 10, 9, 4, topCountry, { b: 1, a: 'center', s: 12 });

  // Row 39: 안내 문구
  m(R + 11, 1, 12, '선택 기간의 고유 세션 기준입니다. (STEP 1 전체 방문 = 메인 대시보드 A7 셀 동기화)', { s: 8, c: '#999999', it: 1 });

  // ────────────────────────────────────────
  //  섹션: 유입 경로 / 이탈 행동 분석
  // ────────────────────────────────────────

  var TR = R + 12; // Row 40

  // Row 40: 타이틀
  m(TR, 1, 12, '유입 경로 / 이탈 행동 분석', { b: 1, c: '#ffffff', bg: '#37474f', a: 'left' });

  // Row 41: 헤더
  m(TR + 1, 1, 2, '유입 경로', { b: 1, bg: '#eceff1', a: 'center' });
  m(TR + 1, 3, 2, '세션 수', { b: 1, bg: '#eceff1', a: 'center' });
  m(TR + 1, 5, 2, '비율', { b: 1, bg: '#eceff1', a: 'center' });
  m(TR + 1, 7, 2, '이탈 행동', { b: 1, bg: '#eceff1', a: 'center' });
  m(TR + 1, 9, 2, '세션 수', { b: 1, bg: '#eceff1', a: 'center' });
  m(TR + 1, 11, 2, '비율', { b: 1, bg: '#eceff1', a: 'center' });

  // Rows 42-44: 데이터 (Top 3)
  for (var i = 0; i < 3; i++) {
    var dr = TR + 2 + i;
    var rowBg = i % 2 === 0 ? '#ffffff' : '#fafafa';
    m(dr, 1, 2, topRef[i][0], { a: 'left', bg: rowBg });
    m(dr, 3, 2, topRef[i][1], { a: 'center', bg: rowBg, b: 1 });
    m(dr, 5, 2, nSupView > 0 ? topRef[i][1] / nSupView : 0, { a: 'center', f: '0.0%', bg: rowBg });
    m(dr, 7, 2, topExit[i][0], { a: 'left', bg: rowBg });
    m(dr, 9, 2, topExit[i][1], { a: 'center', bg: rowBg, b: 1 });
    m(dr, 11, 2, nSupView > 0 ? topExit[i][1] / nSupView : 0, { a: 'center', f: '0.0%', bg: rowBg });
  }

  // ────────────────────────────────────────
  //  섹션: 퍼널 비교 (B2B 문의 vs 출시 응원)
  // ────────────────────────────────────────

  var CR = R + 18; // Row 46

  // Row 46: 타이틀
  m(CR, 1, 12, '퍼널 단계별 비교 (B2B 문의 vs 출시 응원)', { b: 1, c: '#ffffff', bg: '#321506', a: 'left' });

  // Row 47: 헤더
  var cHeaders = ['퍼널 구분', '1단계 (관심)', '2단계 (폼 시작)', '3단계 (완료)', '최종 전환율', '비고'];
  for (var i = 0; i < 6; i++) {
    m(CR + 1, i * 2 + 1, 2, cHeaders[i], { b: 1, bg: '#f3f4f6', a: 'center' });
  }

  // Row 48: B2B 문의 퍼널 (기존 대시보드 셀 참조: E7=문의 관심, G7=폼 시작, I7=문의 완료)
  m(CR + 2, 1, 2, 'B2B 문의 퍼널', { a: 'left' });
  m(CR + 2, 3, 2, '=E7', { a: 'center' });
  m(CR + 2, 5, 2, '=G7', { a: 'center' });
  m(CR + 2, 7, 2, '=I7', { a: 'center' });
  m(CR + 2, 9, 2, '=IF(E7>0, I7/E7, 0)', { a: 'center', f: '0.0%' });
  m(CR + 2, 11, 2, 'B2B 바이어/파트너', { a: 'left' });

  // Row 49: 출시 응원 퍼널
  m(CR + 3, 1, 2, '출시 응원 퍼널', { a: 'left' });
  m(CR + 3, 3, 2, '=C31', { a: 'center' });
  m(CR + 3, 5, 2, '—', { a: 'center', c: '#999999' });
  m(CR + 3, 7, 2, '=E31', { a: 'center' });
  m(CR + 3, 9, 2, '=IF(C31>0, E31/C31, 0)', { a: 'center', f: '0.0%' });
  m(CR + 3, 11, 2, '라틴아메리카 현지 유저', { a: 'left' });

  return JSON.stringify({
    ok: true,
    message: '출시 응원 퍼널이 메인 대시보드(=A7)와 완벽히 동기화되어 재구축되었습니다.',
    stats: { 응원방문: nSupView, 응원완료: nSupSubmit, 최다국가: topCountry },
    유입TOP3: topRef,
    이탈TOP3: topExit,
  });
}

function refreshDashboardIfNeeded_() {
  const cache = CacheService.getScriptCache();
  const refreshKey = 'support_dashboard_refresh_lock_v1';

  try {
    if (cache.get(refreshKey)) return { refreshed: false, reason: 'throttled' };
    cache.put(refreshKey, '1', 120);
    updateDashboardSheetWithSupportFunnel();
    return { refreshed: true };
  } catch (error) {
    console.warn(`Dashboard refresh failed: ${error.message || error}`);
    return { refreshed: false, reason: 'error' };
  }
}

function updateDashboardSheetWithSupportFunnel() {
  const sheetId = getRequiredProperty(SCRIPT_PROPERTY_KEYS.sheetId);
  const spreadsheet = SpreadsheetApp.openById(sheetId);
  const dashboard = spreadsheet.getSheetByName('대시보드');
  const funnelSheet = spreadsheet.getSheetByName(FUNNEL_SHEET_NAME);
  const supportSheet = spreadsheet.getSheetByName(DEMAND_SHEET_NAME);

  if (!dashboard || !funnelSheet) {
    throw new Error('대시보드 또는 Funnel Events 시트를 찾을 수 없습니다.');
  }

  const startDate = dashboard.getRange('K3').getValue();
  const endDate = dashboard.getRange('L3').getValue();
  const start = startDate instanceof Date ? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()) : null;
  const end = endDate instanceof Date ? new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 999) : null;
  const inSelectedPeriod = (value) => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return false;
    return (!start || date >= start) && (!end || date <= end);
  };

  const funnelData = funnelSheet.getDataRange().getValues();
  const funnelHeaders = funnelData[0] || [];
  const column = (name) => funnelHeaders.indexOf(name);
  const iReceivedAt = column('Received At');
  const iEvent = column('Event Name');
  const iSession = column('Session ID');
  const iReferrer = column('Referrer Host');
  const iPath = column('Page Path');
  const iMedium = column('UTM Medium');

  if ([iReceivedAt, iEvent, iSession, iReferrer, iPath, iMedium].some((index) => index < 0)) {
    throw new Error('Funnel Events 헤더가 현재 대시보드 구조와 맞지 않습니다.');
  }

  const events = funnelData.slice(1).filter((row) => {
    return inSelectedPeriod(row[iReceivedAt]) && String(row[iMedium] || '').trim().toLowerCase() !== 'verification';
  });

  let supportRows = [];
  if (supportSheet && supportSheet.getLastRow() > 1) {
    const supportData = supportSheet.getDataRange().getValues();
    const supportHeaders = supportData[0] || [];
    const supportReceivedAt = supportHeaders.indexOf('Received At');
    const supportMedium = supportHeaders.indexOf('UTM Medium');
    supportRows = supportData.slice(1).filter((row) => {
      const isVerification = supportMedium >= 0 && String(row[supportMedium] || '').trim().toLowerCase() === 'verification';
      return !isVerification && supportReceivedAt >= 0 && inSelectedPeriod(row[supportReceivedAt]);
    });
  }

  const sessionsFor = (eventName) => {
    const sessions = {};
    events.forEach((row) => {
      if (row[iEvent] === eventName && row[iSession]) sessions[String(row[iSession])] = true;
    });
    return Object.keys(sessions);
  };

  const supportVisits = sessionsFor('support_page_view');
  const countrySelections = sessionsFor('support_country_select');
  const supportFormStarts = sessionsFor('support_form_start');
  const supportSubmitSessions = sessionsFor('support_submit');
  const supportCompletions = Math.max(supportSubmitSessions.length, supportRows.length);

  const topCountryCounts = {};
  supportRows.forEach((row) => {
    const country = String(row[2] || '').trim().toUpperCase();
    if (country) topCountryCounts[country] = (topCountryCounts[country] || 0) + 1;
  });
  const topCountry = Object.entries(topCountryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  const referrerBySession = {};
  events.forEach((row) => {
    if (row[iEvent] !== 'support_page_view' || !row[iSession]) return;
    const sessionId = String(row[iSession]);
    if (!referrerBySession[sessionId]) referrerBySession[sessionId] = String(row[iReferrer] || '').trim() || '직접 방문';
  });
  const referrerCounts = {};
  Object.values(referrerBySession).forEach((referrer) => {
    referrerCounts[referrer] = (referrerCounts[referrer] || 0) + 1;
  });

  const timeline = {};
  events.forEach((row) => {
    if (!row[iSession]) return;
    const sessionId = String(row[iSession]);
    if (!timeline[sessionId]) timeline[sessionId] = [];
    timeline[sessionId].push({ event: String(row[iEvent] || ''), path: String(row[iPath] || ''), at: row[iReceivedAt] });
  });
  const exitCounts = {};
  supportVisits.forEach((sessionId) => {
    const sessionEvents = (timeline[sessionId] || []).sort((a, b) => new Date(a.at) - new Date(b.at));
    const last = sessionEvents[sessionEvents.length - 1];
    let label = '기타';
    if (last?.event === 'support_submit') label = '응원 완료 후 종료';
    else if (last?.event === 'support_country_select') label = '국가 선택 후 이탈';
    else if (last?.event === 'support_form_start') label = '폼 작성 중 이탈';
    else if (last?.event === 'support_page_view') label = '지원 페이지에서 이탈';
    else if (last?.path) label = last.path.replace(/^\/(es|en|ko)\//i, '/');
    exitCounts[label] = (exitCounts[label] || 0) + 1;
  });

  const topThree = (counts) => {
    const items = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3);
    while (items.length < 3) items.push(['—', 0]);
    return items;
  };
  const topReferrers = topThree(referrerCounts);
  const topExits = topThree(exitCounts);
  const stages = [supportVisits.length, countrySelections.length, supportFormStarts.length, supportCompletions];
  const stageNames = ['지원 페이지 방문', '국가 선택', '폼 시작', '응원 완료'];
  const transitionRates = [
    stages[0] ? stages[1] / stages[0] : 0,
    stages[1] ? stages[2] / stages[1] : 0,
    stages[2] ? stages[3] / stages[2] : 0,
  ];
  const dropLabels = ['방문 → 국가 선택', '국가 선택 → 폼 시작', '폼 시작 → 응원 완료'];
  const weakestIndex = transitionRates.reduce((worst, rate, index, array) => rate < array[worst] ? index : worst, 0);
  const lastUpdated = Utilities.formatDate(new Date(), TIME_ZONE, 'yyyy-MM-dd HH:mm');

  const section = dashboard.getRange('A28:L50');
  section.breakApart();
  section.clearContent().clearFormat();

  const cell = (row, col, width, value, options) => {
    const range = dashboard.getRange(row, col, 1, width).merge();
    const settings = options || {};
    if (typeof value === 'string' && value.charAt(0) === '=') range.setFormula(value);
    else range.setValue(value);
    range.setVerticalAlignment('middle');
    if (settings.bold) range.setFontWeight('bold');
    if (settings.size) range.setFontSize(settings.size);
    if (settings.color) range.setFontColor(settings.color);
    if (settings.background) range.setBackground(settings.background);
    if (settings.align) range.setHorizontalAlignment(settings.align);
    if (settings.format) range.setNumberFormat(settings.format);
    if (settings.italic) range.setFontStyle('italic');
    return range;
  };
  const percent = (value) => Number.isFinite(value) ? value : 0;

  cell(28, 1, 12, '출시 응원 퍼널 — 실제 수요 검증', { bold: true, color: '#ffffff', background: '#ef5f18', align: 'left', size: 12 });
  ['STEP 1', 'STEP 2', 'STEP 3', 'STEP 4'].forEach((label, index) => {
    cell(29, index * 2 + 1, 2, label, { bold: true, color: '#ffffff', background: ['#ef5f18', '#d95a1c', '#287356', '#123d2e'][index], align: 'center' });
    cell(30, index * 2 + 1, 2, stageNames[index], { bold: true, background: '#fff3e8', align: 'center' });
    cell(31, index * 2 + 1, 2, stages[index], { bold: true, size: 20, align: 'center' });
    cell(32, index * 2 + 1, 2, '세션', { color: '#8a8f8c', size: 8, align: 'center' });
    cell(33, index * 2 + 1, 2, index === 0 ? 1 : percent(stages[index] / stages[0]), { bold: true, color: '#287356', size: 14, align: 'center', format: '0.0%' });
    cell(34, index * 2 + 1, 2, '누적 전환율', { color: '#8a8f8c', size: 8, align: 'center' });
    cell(35, index * 2 + 1, 2, index < 3 ? percent(1 - transitionRates[index]) : 0, { bold: true, color: index < 3 ? '#c64a13' : '#287356', size: 13, align: 'center', format: '0.0%' });
    cell(36, index * 2 + 1, 2, index < 3 ? '다음 단계 이탈률' : '완료', { color: '#8a8f8c', size: 8, align: 'center' });
    cell(37, index * 2 + 1, 2, index < 3 ? Math.max(0, stages[index] - stages[index + 1]) : stages[index], { bold: true, size: 13, align: 'center' });
    cell(38, index * 2 + 1, 2, index < 3 ? '이탈 세션' : '완료 세션', { color: '#8a8f8c', size: 8, align: 'center' });
  });
  cell(29, 9, 4, '자동 진단', { bold: true, color: '#ffffff', background: '#37474f', align: 'center' });
  cell(30, 9, 4, '우선 개선 구간', { color: '#666666', size: 9, align: 'center' });
  cell(31, 9, 4, dropLabels[weakestIndex], { bold: true, color: '#c64a13', align: 'center', size: 12 });
  cell(32, 9, 4, '직전 단계 전환율', { color: '#666666', size: 9, align: 'center' });
  cell(33, 9, 4, transitionRates[weakestIndex], { bold: true, color: '#c64a13', align: 'center', size: 18, format: '0.0%' });
  cell(34, 9, 4, '최다 응원 국가', { color: '#666666', size: 9, align: 'center' });
  cell(35, 9, 4, topCountry, { bold: true, color: '#123d2e', align: 'center', size: 14 });
  cell(36, 9, 4, '대시보드 갱신', { color: '#666666', size: 9, align: 'center' });
  cell(37, 9, 4, lastUpdated, { bold: true, color: '#123d2e', align: 'center', size: 10 });
  cell(38, 9, 4, '검증 데이터는 자동 제외', { color: '#8a8f8c', size: 8, align: 'center' });
  cell(39, 1, 12, '지원 퍼널은 지원 페이지 방문을 시작점으로 계산합니다. 전체 홈페이지 방문은 유입 경로 표에서만 확인하세요.', { color: '#8a8f8c', size: 8, italic: true });

  cell(41, 1, 6, '유입 경로', { bold: true, color: '#ffffff', background: '#37474f', align: 'left' });
  cell(41, 7, 6, '마지막 행동', { bold: true, color: '#ffffff', background: '#37474f', align: 'left' });
  for (let index = 0; index < 3; index += 1) {
    const row = 42 + index;
    const background = index % 2 === 0 ? '#ffffff' : '#fafafa';
    cell(row, 1, 3, topReferrers[index][0], { background, align: 'left' });
    cell(row, 4, 3, `${topReferrers[index][1]} 세션 · ${supportVisits.length ? (topReferrers[index][1] / supportVisits.length * 100).toFixed(1) : '0.0'}%`, { background, bold: true, align: 'center' });
    cell(row, 7, 3, topExits[index][0], { background, align: 'left' });
    cell(row, 10, 3, `${topExits[index][1]} 세션 · ${supportVisits.length ? (topExits[index][1] / supportVisits.length * 100).toFixed(1) : '0.0'}%`, { background, bold: true, align: 'center' });
  }
  cell(46, 1, 12, '데이터 기준: 선택 기간 · 고유 세션 · verification 제외 · 응원 완료는 Demand Support 실데이터와 교차 확인', { color: '#8a8f8c', background: '#fff8ef', size: 8, italic: true });

  return {
    ok: true,
    lastUpdated,
    stats: {
      supportVisits: stages[0],
      countrySelections: stages[1],
      supportFormStarts: stages[2],
      supportCompletions: stages[3],
      topCountry,
    },
  };
}

