const SERVICE_NAME = 'MOKDA Inquiry';
const TIME_ZONE = 'Asia/Seoul';
const LEAD_SHEET_NAME = 'Sheet1';

const SCRIPT_PROPERTY_KEYS = {
  sheetId: 'SHEET_ID',
  chatWebhookUrl: 'CHAT_WEBHOOK_URL',
  notificationEmail: 'NOTIFICATION_EMAIL',
};

const REQUIRED_PAYLOAD_FIELDS = ['name', 'company', 'country', 'message'];

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
  'Role',
  'Interested Product',
  'Lead Status',
  'Qualified At',
  'Working At',
  'Converted At',
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
  'Section',
  'Visitor Daypart',
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
  'Approved',
  'Homepage Featured',
];
const DEMAND_COUNTRIES = {
  PE: 'Peru',
  MX: 'Mexico',
  CL: 'Chile',
  CO: 'Colombia',
  ES: 'Spain',
};
const FUNNEL_EVENT_NAMES = [
  'page_view',
  'product_section_view',
  'product_cta_click',
  'contact_cta_click',
  'contact_view',
  'form_start',
  'lead_submit',
  'generate_lead',
  'product_detail_view',
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
  'support_share',
  'hero_product_click',
  'section_view',
  'whatsapp_click',
  'b2b_cta_click',
  'b2b_form_start',
];

function doGet(event) {
  const mode = String((event && event.parameter && event.parameter.mode) || '').trim();
  if (mode === 'demand_support') {
    return jsonResponse(getDemandSupportFeed(event));
  }
  if (mode === 'update_dashboard') {
    return jsonResponse({ ok: true, result: updateCompleteWebsiteDashboard_() });
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
    const role = String(payload.role || '').trim();
    const product = String(payload.product || '').trim();
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
      role,
      product,
      'New',
      '',
      '',
      '',
    ]);

    const notification = notifyLead({
      receivedAt,
      language,
      source,
      company,
      name: payload.name,
      email: payload.email,
      whatsapp,
      role,
      product,
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
      false,
      false,
    ]);

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
  const featuredOnly = String((event && event.parameter && event.parameter.featured) || '') === '1';
  const limit = Math.min(Math.max(Math.round(requestedLimit) || 20, 1), 20);
  const offset = Math.max(Math.round(requestedOffset) || 0, 0);
  const totals = Object.keys(DEMAND_COUNTRIES).reduce((result, code) => {
    result[code] = 0;
    return result;
  }, {});
  const sheetId = getRequiredProperty(SCRIPT_PROPERTY_KEYS.sheetId);
  const spreadsheet = SpreadsheetApp.openById(sheetId);
  const sheet = spreadsheet.getSheetByName(DEMAND_SHEET_NAME);

  if (!sheet || sheet.getLastRow() <= 1) {
    return { ok: true, total: 0, publicTotal: 0, totals, supporters: [], hasMore: false };
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
  const selectedRows = featuredOnly
    ? publicRows.filter(
        (row) =>
          (row[14] === true || String(row[14]).toLowerCase() === 'true') &&
          (row[15] === true || String(row[15]).toLowerCase() === 'true') &&
          String(row[13] || '').trim()
      )
    : publicRows;
  const supporters = selectedRows
    .slice(offset, offset + limit)
    .map((row) => ({
      name: cleanAnalyticsValue(row[1], 40),
      countryCode: String(row[2] || '').trim().toUpperCase(),
      createdAt: row[0] instanceof Date ? row[0].toISOString() : String(row[0] || ''),
      message: cleanAnalyticsValue(row[13], 180),
      featured: featuredOnly && (row[15] === true || String(row[15]).toLowerCase() === 'true'),
    }));

  return {
    ok: true,
    total: eligibleRows.length,
    publicTotal: publicRows.length,
    featuredTotal: featuredOnly ? selectedRows.length : 0,
    totals,
    supporters,
    hasMore: offset + supporters.length < selectedRows.length,
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
      cleanAnalyticsValue(item.section, 80),
      cleanAnalyticsValue(item.visitorDaypart, 20),
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

  refreshDashboardIfNeeded_();
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

  const email = String(payload.email || '').trim();
  const whatsapp = String(payload.whatsapp || '').trim();
  if (!email && !whatsapp) {
    throw new Error('Email or WhatsApp is required');
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
    lead.role ? `직책/역할: ${lead.role}` : '',
    lead.product ? `관심 제품: ${lead.product}` : '',
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

  const statusColumn = SHEET_HEADERS.indexOf('Lead Status') + 1;
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['New', 'Qualified', 'Working', 'Converted', 'Disqualified'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, statusColumn, Math.max(sheet.getMaxRows() - 1, 1), 1).setDataValidation(statusRule);
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

function refreshDashboardIfNeeded_() {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'mokda_website_dashboard_refresh_v10';
  if (cache.get(cacheKey)) return;

  cache.put(cacheKey, '1', 120);
  try {
    updateCompleteWebsiteDashboard_();
  } catch (error) {
    console.error(`Support dashboard refresh failed: ${error.message || error}`);
  }
}

function updateDashboardSheetWithSupportFunnel() {
  const sheetId = getRequiredProperty(SCRIPT_PROPERTY_KEYS.sheetId);
  const spreadsheet = SpreadsheetApp.openById(sheetId);
  const dashboard = spreadsheet.getSheetByName('대시보드') || spreadsheet.getSheetByName('Dashboard');
  if (!dashboard) return { updated: false, reason: 'Dashboard sheet not found' };

  const eventSheet = spreadsheet.getSheetByName(FUNNEL_SHEET_NAME);
  const supportSheet = spreadsheet.getSheetByName(DEMAND_SHEET_NAME);
  const periodStart = dashboard.getRange('K3').getValue();
  const periodEnd = dashboard.getRange('L3').getValue();
  const start = periodStart instanceof Date ? periodStart : new Date(0);
  const end = periodEnd instanceof Date ? new Date(periodEnd) : new Date();
  end.setHours(23, 59, 59, 999);

  const inPeriod = (value) => {
    const date = value instanceof Date ? value : new Date(value);
    return !Number.isNaN(date.getTime()) && date >= start && date <= end;
  };
  const isVerification = (value) => String(value || '').trim().toLowerCase() === 'verification';
  const eventRows = eventSheet && eventSheet.getLastRow() > 1 ? eventSheet.getDataRange().getValues().slice(1) : [];
  const supportRows = supportSheet && supportSheet.getLastRow() > 1 ? supportSheet.getDataRange().getValues().slice(1) : [];
  const steps = ['support_page_view', 'support_country_select', 'support_form_start', 'support_submit'];
  const sessionsByStep = {};
  steps.forEach((step) => (sessionsByStep[step] = {}));

  eventRows.forEach((row) => {
    const eventName = String(row[1] || '').trim();
    if (steps.indexOf(eventName) === -1 || !inPeriod(row[0]) || isVerification(row[9])) return;
    const sessionKey = String(row[3] || row[2] || row[16] || '').trim();
    if (sessionKey) sessionsByStep[eventName][sessionKey] = true;
  });

  const supporters = {};
  const countryCounts = {};
  supportRows.forEach((row) => {
    if (!inPeriod(row[0]) || isVerification(row[8])) return;
    const supporterKey = String(row[5] || row[6] || '').trim();
    if (supporterKey) supporters[supporterKey] = true;
    const country = String(row[3] || row[2] || '').trim();
    if (country) countryCounts[country] = (countryCounts[country] || 0) + 1;
  });

  const counts = steps.map((step) => Object.keys(sessionsByStep[step]).length);
  const completed = Math.max(counts[3], Object.keys(supporters).length);
  counts[3] = completed;
  const percentage = (value, total) => (total ? Math.round((value / total) * 1000) / 10 : 0);
  const topCountry = Object.keys(countryCounts).sort((a, b) => countryCounts[b] - countryCounts[a])[0] || '-';
  const labels = ['지원 페이지 방문', '국가 선택', '폼 시작', '응원 완료'];
  const rows = [
    ['지원 퍼널', '', '', '', '', '', '', '', '', '', '', ''],
    ['기간', start, '–', end, '', '', '', '', '', '마지막 갱신', new Date(), ''],
    ['단계', '고유 세션', '방문 대비', '직전 단계 대비', '이탈 세션', '', '', '', '', '', '', ''],
  ];

  counts.forEach((count, index) => {
    const previous = index ? counts[index - 1] : count;
    rows.push([
      labels[index],
      count,
      percentage(count, counts[0]),
      index ? percentage(count, previous) : 100,
      index ? Math.max(previous - count, 0) : 0,
      '', '', '', '', '', '', '',
    ]);
  });

  rows.push(['핵심 진단', '응원 완료', completed, '국가 선택률', percentage(counts[1], counts[0]), '폼 시작률', percentage(counts[2], counts[0]), '완료율', percentage(completed, counts[0]), '', '', '', '']);
  rows.push(['상위 지원 국가', topCountry, countryCounts[topCountry] || 0, '실제 지원 데이터 기준', '', '', '', '', '', '', '', '']);
  rows.push(['해석', counts[0] ? (counts[1] ? '국가 선택 이후 단계의 전환을 확인하세요.' : '방문자는 있으나 국가 선택 전 이탈이 큽니다.') : '지원 페이지 유입 데이터가 쌓이면 퍼널이 표시됩니다.', '', '', '', '', '', '', '', '', '', '']);

  const target = dashboard.getRange(28, 1, 18, 12);
  target.clearContent();
  dashboard.getRange(28, 1, rows.length, 12).setValues(rows);
  dashboard.getRange(28, 1, 1, 12).setFontWeight('bold');
  dashboard.getRange(30, 1, 1, 12).setFontWeight('bold');
  dashboard.getRange(28, 1, rows.length, 12).setWrap(true);
  dashboard.getRange(29, 2, 1, 1).setNumberFormat('yyyy-mm-dd');
  dashboard.getRange(29, 4, 1, 1).setNumberFormat('yyyy-mm-dd');
  dashboard.getRange(29, 11, 1, 1).setNumberFormat('yyyy-mm-dd hh:mm');
  dashboard.getRange(31, 3, 4, 2).setNumberFormat('0.0"%"');

  return { updated: true, visits: counts[0], completed, topCountry };
}

function updateDashboardSheetWithSupportFunnelV2_() {
  const sheetId = getRequiredProperty(SCRIPT_PROPERTY_KEYS.sheetId);
  const spreadsheet = SpreadsheetApp.openById(sheetId);
  const dashboard = spreadsheet.getSheetByName('대시보드');
  const eventSheet = spreadsheet.getSheetByName(FUNNEL_SHEET_NAME);
  const supportSheet = spreadsheet.getSheetByName(DEMAND_SHEET_NAME);
  const leadSheet = spreadsheet.getSheetByName(LEAD_SHEET_NAME);
  if (!dashboard) throw new Error('대시보드 시트를 찾을 수 없습니다.');
  if (leadSheet) ensureSheetHeaders(leadSheet);

  const startValue = dashboard.getRange('K3').getValue();
  const endValue = dashboard.getRange('L3').getValue();
  const normalizeDate = (value) => {
    if (value instanceof Date) return new Date(value);
    if (typeof value === 'number' && value > 20000) return new Date((value - 25569) * 86400000);
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };
  const start = normalizeDate(startValue) || new Date(0);
  const end = normalizeDate(endValue) || new Date();
  end.setHours(23, 59, 59, 999);
  const funnelTrackingStart = new Date('2026-08-03T02:23:00.000Z');
  const inPeriod = (value) => {
    const date = normalizeDate(value);
    return date && date >= start && date <= end;
  };
  const isVerification = (value) => String(value || '').trim().toLowerCase() === 'verification';
  const stepNames = ['support_page_view', 'support_form_start', 'support_country_select', 'support_submit'];
  const sessionTimeline = {};

  if (eventSheet && eventSheet.getLastRow() > 1) {
    eventSheet.getDataRange().getValues().slice(1).forEach((row) => {
      const name = String(row[1] || '').trim();
      if (stepNames.indexOf(name) === -1 || !inPeriod(row[0]) || isVerification(row[9])) return;
      const key = String(row[3] || row[2] || row[16] || '').trim();
      const occurredAt = normalizeDate(row[0]);
      if (!key || !occurredAt || occurredAt < funnelTrackingStart) return;
      if (!sessionTimeline[key]) sessionTimeline[key] = {};
      const previous = sessionTimeline[key][name];
      if (!previous || occurredAt < previous) sessionTimeline[key][name] = occurredAt;
    });
  }

  const countryCodes = ['PE', 'MX', 'CL', 'CO'];
  const countryLabels = { PE: '페루', MX: '멕시코', CL: '칠레', CO: '콜롬비아' };
  const countryCounts = { PE: 0, MX: 0, CL: 0, CO: 0 };
  const supporterIds = {};
  if (supportSheet && supportSheet.getLastRow() > 1) {
    supportSheet.getDataRange().getValues().slice(1).forEach((row) => {
      if (!inPeriod(row[0]) || isVerification(row[8])) return;
      const code = String(row[2] || '').trim().toUpperCase();
      const supporter = String(row[5] || row[6] || '').trim();
      if (supporter) supporterIds[supporter] = true;
      if (countryCounts.hasOwnProperty(code)) countryCounts[code] += 1;
    });
  }

  const counts = [0, 0, 0, 0];
  Object.keys(sessionTimeline).forEach((key) => {
    const timeline = sessionTimeline[key];
    const viewed = timeline.support_page_view;
    const started = timeline.support_form_start;
    const selected = timeline.support_country_select;
    const submitted = timeline.support_submit;
    if (!viewed) return;
    counts[0] += 1;
    if (!started || started < viewed) return;
    counts[1] += 1;
    if (!selected || selected < started) return;
    counts[2] += 1;
    if (!submitted || submitted < selected) return;
    counts[3] += 1;
  });
  const totalSupport = Object.keys(supporterIds).length;
  const totalVisits = counts[0];
  const topCountry = countryCodes.slice().sort((a, b) => countryCounts[b] - countryCounts[a])[0];

  const area = dashboard.getRange('A28:L62');
  area.breakApart();
  area.clearContent();
  area.clearFormat();
  area.setNumberFormat('General');

  const merge = (row, column, width, value, options) => {
    const opts = options || {};
    const cell = dashboard.getRange(row, column, 1, width).merge();
    cell.setValue(value);
    cell.setHorizontalAlignment(opts.align || 'center');
    cell.setVerticalAlignment('middle');
    cell.setWrap(true);
    if (opts.background) cell.setBackground(opts.background);
    if (opts.color) cell.setFontColor(opts.color);
    if (opts.bold) cell.setFontWeight('bold');
    if (opts.size) cell.setFontSize(opts.size);
    if (opts.format) cell.setNumberFormat(opts.format);
    return cell;
  };

  const stepColors = ['#ef5f18', '#f39c1f', '#4f9b61', '#15372b'];
  const stepLabels = ['STEP 1', 'STEP 2', 'STEP 3', 'STEP 4'];
  const stepTitles = ['지원 페이지 방문', '폼 시작', '국가 선택', '응원 완료'];
  const stepCounts = counts;
  const stepSources = ['고유 세션', '방문 세션 중', '폼 시작 세션 중', '국가 선택 세션 중'];

  merge(28, 1, 12, '출시 응원 전환 퍼널', { background: '#15372b', color: '#ffffff', bold: true, size: 12, align: 'left' });
  for (let index = 0; index < 4; index += 1) {
    const column = index * 3 + 1;
    const previousCount = index === 0 ? stepCounts[0] : stepCounts[index - 1];
    const conversionRate = index === 0 ? (stepCounts[0] ? 1 : 0) : (previousCount ? stepCounts[index] / previousCount : 0);
    merge(29, column, 3, stepLabels[index], { background: stepColors[index], color: '#ffffff', bold: true });
    merge(30, column, 3, stepTitles[index], { background: '#fff6ed', color: '#15372b', bold: true });
    merge(31, column, 3, stepCounts[index], { background: '#ffffff', bold: true, size: 22 });
    merge(32, column, 3, stepSources[index], { background: '#ffffff', color: '#7a7a7a', size: 8 });
    merge(33, column, 3, conversionRate, { background: '#fffaf5', color: stepColors[index], bold: true, size: 14, format: '0.0%' });
    merge(34, column, 3, index === 0 ? '퍼널 기준값' : '직전 단계 전환율', { background: '#fffaf5', color: '#7a7a7a', size: 8 });
  }
  merge(35, 1, 12, '퍼널 측정 시작: 2026.08.03 11:23 KST · 같은 세션에서 순서대로 통과한 경우만 다음 단계로 집계 · verification 제외', { background: '#f5f7f6', color: '#5e6b63', size: 9, align: 'left' });

  const safeRate = (value, base) => base ? value / base : 0;
  const conversionLabels = ['방문 → 폼 시작', '폼 시작 → 국가 선택', '국가 선택 → 응원 완료', '방문 → 최종 완료'];
  const conversionValues = [
    safeRate(stepCounts[1], stepCounts[0]),
    safeRate(stepCounts[2], stepCounts[1]),
    safeRate(stepCounts[3], stepCounts[2]),
    safeRate(stepCounts[3], stepCounts[0]),
  ];
  const conversionSources = [
    `${stepCounts[1]} / ${stepCounts[0]} 세션`,
    `${stepCounts[2]} / ${stepCounts[1]} 세션`,
    `${stepCounts[3]} / ${stepCounts[2]} 세션`,
    `${stepCounts[3]} / ${stepCounts[0]} 세션`,
  ];
  const conversionNotes = ['첫 입력 시작률', '선택 단계 진행률', '제출 성공률', '전체 퍼널 전환율'];

  merge(37, 1, 12, '단계별 전환 분석', { background: '#ef5f18', color: '#ffffff', bold: true, size: 12, align: 'left' });
  for (let index = 0; index < 4; index += 1) {
    const column = index * 3 + 1;
    merge(38, column, 3, conversionLabels[index], { background: '#fff6ed', color: '#15372b', bold: true, size: 9 });
    merge(39, column, 3, conversionValues[index], { background: '#ffffff', color: stepColors[index], bold: true, size: 20, format: '0.0%' });
    merge(40, column, 3, conversionSources[index], { background: '#ffffff', color: '#5e6b63', bold: true, size: 9 });
    merge(41, column, 3, conversionNotes[index], { background: '#fffaf5', color: '#7a7a7a', size: 8 });
  }

  const dropCounts = [
    Math.max(stepCounts[0] - stepCounts[1], 0),
    Math.max(stepCounts[1] - stepCounts[2], 0),
    Math.max(stepCounts[2] - stepCounts[3], 0),
    stepCounts[3],
  ];
  const dropRates = [
    safeRate(dropCounts[0], stepCounts[0]),
    safeRate(dropCounts[1], stepCounts[1]),
    safeRate(dropCounts[2], stepCounts[2]),
    safeRate(stepCounts[3], stepCounts[0]),
  ];
  const dropLabels = ['방문 후 미시작', '폼 시작 후 미선택', '국가 선택 후 미완료', '최종 완료'];
  const dropNotes = ['폼 입력 전 이탈', '국가 선택 전 이탈', '제출 전 이탈', '전체 방문 중 완료'];

  merge(43, 1, 12, '단계별 이탈 진단', { background: '#37474f', color: '#ffffff', bold: true, size: 11, align: 'left' });
  for (let index = 0; index < 4; index += 1) {
    const column = index * 3 + 1;
    merge(44, column, 3, dropLabels[index], { background: '#eceff1', color: '#15372b', bold: true, size: 9 });
    merge(45, column, 3, dropCounts[index], { background: '#ffffff', color: index === 3 ? '#15372b' : '#c54432', bold: true, size: 18 });
    merge(46, column, 3, dropRates[index], { background: '#ffffff', color: index === 3 ? '#15372b' : '#c54432', bold: true, size: 12, format: '0.0%' });
    merge(47, column, 3, dropNotes[index], { background: '#ffffff', color: '#7a7a7a', size: 8 });
  }

  merge(49, 1, 12, '누적 출시 응원 현황', { background: '#ef5f18', color: '#ffffff', bold: true, size: 12, align: 'left' });
  const kpiLabels = ['기간 내 응원', '최다 응원 국가', '국가별 합계', '최종 갱신'];
  const kpiValues = [totalSupport, `${countryLabels[topCountry]} ${countryCounts[topCountry]}건`, countryCodes.map((code) => countryCounts[code]).reduce((sum, count) => sum + count, 0), Utilities.formatDate(new Date(), TIME_ZONE, 'yyyy-MM-dd HH:mm')];
  for (let index = 0; index < 4; index += 1) {
    const column = index * 3 + 1;
    merge(50, column, 3, kpiLabels[index], { background: '#fff6ed', color: '#5e4c43', bold: true, size: 9 });
    merge(51, column, 3, kpiValues[index], { background: '#ffffff', color: '#15372b', bold: true, size: index === 0 || index === 2 ? 20 : 13 });
    merge(52, column, 3, index === 0 ? 'Demand Support 기준' : index === 1 ? '기간 내 기준' : index === 2 ? '4개국 합계' : '자동 갱신', { background: '#ffffff', color: '#7a7a7a', size: 8 });
  }

  merge(54, 1, 12, '국가별 출시 응원', { background: '#37474f', color: '#ffffff', bold: true, size: 11, align: 'left' });
  countryCodes.forEach((code, index) => {
    const column = index * 3 + 1;
    merge(55, column, 3, countryLabels[code], { background: '#eceff1', color: '#15372b', bold: true });
    merge(56, column, 3, countryCounts[code], { background: '#ffffff', color: '#15372b', bold: true, size: 18 });
    merge(57, column, 3, '응원', { background: '#ffffff', color: '#7a7a7a', size: 8 });
  });
  merge(59, 1, 12, '기간 기준: ' + Utilities.formatDate(start, TIME_ZONE, 'yyyy-MM-dd') + ' ~ ' + Utilities.formatDate(end, TIME_ZONE, 'yyyy-MM-dd') + ' · verification 테스트 데이터 제외', { background: '#f5f7f6', color: '#7a7a7a', size: 8, align: 'left' });

  return { updated: true, visits: totalVisits, totalSupport, topCountry };
}

function updateCompleteWebsiteDashboard_() {
  const sheetId = getRequiredProperty(SCRIPT_PROPERTY_KEYS.sheetId);
  const spreadsheet = SpreadsheetApp.openById(sheetId);
  const dashboard = spreadsheet.getSheetByName('대시보드');
  const eventSheet = spreadsheet.getSheetByName(FUNNEL_SHEET_NAME);
  const supportSheet = spreadsheet.getSheetByName(DEMAND_SHEET_NAME);
  const leadSheet = spreadsheet.getSheetByName(LEAD_SHEET_NAME);
  if (!dashboard) throw new Error('대시보드 시트를 찾을 수 없습니다.');
  if (leadSheet) ensureSheetHeaders(leadSheet);

  const normalizeDate = (value) => {
    if (value instanceof Date) return new Date(value);
    if (typeof value === 'number' && value > 20000) return new Date((value - 25569) * 86400000);
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };
  const start = normalizeDate(dashboard.getRange('K3').getValue()) || new Date(0);
  const end = normalizeDate(dashboard.getRange('L3').getValue()) || new Date();
  end.setHours(23, 59, 59, 999);
  const funnelTrackingStart = new Date('2026-08-03T02:23:00.000Z');
  const inPeriod = (value) => {
    const date = normalizeDate(value);
    return date && date >= start && date <= end;
  };
  const isVerification = (value) => String(value || '').trim().toLowerCase() === 'verification';
  const safeRate = (value, base) => base ? value / base : 0;
  const earliest = (current, candidate) => !current || candidate < current ? candidate : current;
  const formatDuration = (seconds) => {
    const total = Math.max(Math.round(Number(seconds) || 0), 0);
    const minutes = Math.floor(total / 60);
    const remainder = total % 60;
    return minutes ? `${minutes}분 ${remainder}초` : `${remainder}초`;
  };

  const pageDefinitions = [
    { key: 'home', label: '홈' },
    { key: 'about', label: '브랜드 소개' },
    { key: 'products', label: '제품' },
    { key: 'qna', label: 'Q&A' },
    { key: 'contact', label: '문의' },
    { key: 'support', label: '출시 응원' },
    { key: 'coming-soon', label: '출시 예정' },
  ];
  const canonicalPage = (value) => {
    let path = String(value || '').split('?')[0].split('#')[0].trim().toLowerCase();
    if (!path) return 'other';
    if (path.charAt(0) !== '/') path = `/${path}`;
    path = path.replace(/\/+/g, '/').replace(/^\/(es|en|ko)(?=\/|$)/, '');
    if (!path || path === '/' || path === '/index.html') return 'home';
    const file = path.split('/').filter(Boolean).pop() || 'index.html';
    if (file === 'index.html') return 'home';
    if (file === 'about.html') return 'about';
    if (file === 'products.html') return 'products';
    if (file === 'qna.html') return 'qna';
    if (file === 'contact.html') return 'contact';
    if (file === 'support.html') return 'support';
    if (file === 'coming-soon.html') return 'coming-soon';
    return 'other';
  };

  const pageStats = {};
  pageDefinitions.forEach((page) => {
    pageStats[page.key] = {
      views: 0,
      sessions: {},
      engagedSessions: {},
      actionSessions: {},
      activeTotal: 0,
      activeInstances: 0,
    };
  });
  const sessionTimeline = {};
  const pageInstances = {};
  const sessionPageViews = {};
  const sessionActions = {};
  const productSessions = { Original: {}, 'Para Carnes': {}, 'Soy Sauce': {}, '제품 미지정': {} };
  const eventRows = eventSheet && eventSheet.getLastRow() > 1
    ? eventSheet.getDataRange().getValues().slice(1)
    : [];
  const keyActionNames = [
    'product_cta_click',
    'hero_product_click',
    'contact_cta_click',
    'whatsapp_click',
    'b2b_cta_click',
    'form_start',
    'b2b_form_start',
    'lead_submit',
    'generate_lead',
    'support_cta_click',
    'support_country_select',
    'support_form_start',
    'support_submit',
    'support_share',
  ];

  eventRows.forEach((row) => {
    if (!inPeriod(row[0]) || isVerification(row[9])) return;
    const occurredAt = normalizeDate(row[0]);
    const eventName = String(row[1] || '').trim();
    const sessionKey = String(row[3] || row[2] || row[16] || '').trim();
    const pageKey = canonicalPage(row[4]);
    if (!occurredAt || !eventName || !sessionKey) return;
    if (!sessionTimeline[sessionKey]) sessionTimeline[sessionKey] = {};
    const timeline = sessionTimeline[sessionKey];
    if (!timeline.language && row[5]) timeline.language = String(row[5]).trim().toUpperCase();
    if (!timeline.device && row[6]) timeline.device = String(row[6]).trim().toLowerCase();
    if (!timeline.referrer && row[7]) timeline.referrer = String(row[7]).trim();
    if (!timeline.source && row[8]) timeline.source = String(row[8]).trim();
    if (!timeline.medium && row[9]) timeline.medium = String(row[9]).trim();

    if (eventName === 'page_view') {
      timeline.siteView = earliest(timeline.siteView, occurredAt);
      sessionPageViews[sessionKey] = (sessionPageViews[sessionKey] || 0) + 1;
      if (pageStats[pageKey]) {
        pageStats[pageKey].views += 1;
        pageStats[pageKey].sessions[sessionKey] = true;
      }
      if (pageKey === 'contact') timeline.contactPage = earliest(timeline.contactPage, occurredAt);
    }
    if (eventName === 'product_section_view' || eventName === 'product_cta_click' || eventName === 'hero_product_click' || eventName === 'product_detail_view') {
      timeline.productInterest = earliest(timeline.productInterest, occurredAt);
      const rawProduct = String(row[12] || row[11] || '').toLowerCase();
      const product = rawProduct.indexOf('original') !== -1
        ? 'Original'
        : rawProduct.indexOf('carne') !== -1 || rawProduct.indexOf('ssam') !== -1
          ? 'Para Carnes'
          : rawProduct.indexOf('soy') !== -1 || rawProduct.indexOf('ganjang') !== -1
            ? 'Soy Sauce'
            : '제품 미지정';
      if (product === '제품 미지정') {
        if (!productSessions.Original[sessionKey] && !productSessions['Para Carnes'][sessionKey] && !productSessions['Soy Sauce'][sessionKey]) {
          productSessions[product][sessionKey] = true;
        }
      } else {
        productSessions[product][sessionKey] = true;
        delete productSessions['제품 미지정'][sessionKey];
      }
    }
    if (eventName === 'contact_cta_click' || eventName === 'b2b_cta_click' || eventName === 'whatsapp_click') {
      timeline.contactCta = earliest(timeline.contactCta, occurredAt);
      timeline.contactIntent = earliest(timeline.contactIntent, occurredAt);
    }
    if (eventName === 'contact_view') {
      timeline.contactView = earliest(timeline.contactView, occurredAt);
      timeline.contactIntent = earliest(timeline.contactIntent, occurredAt);
    }
    if ((eventName === 'form_start' || eventName === 'b2b_form_start') && pageKey === 'contact') {
      timeline.contactFormStart = earliest(timeline.contactFormStart, occurredAt);
    }
    if ((eventName === 'lead_submit' || eventName === 'generate_lead') && pageKey === 'contact') {
      timeline.leadSubmit = earliest(timeline.leadSubmit, occurredAt);
    }
    if (occurredAt >= funnelTrackingStart) {
      if (eventName === 'support_page_view') timeline.supportView = earliest(timeline.supportView, occurredAt);
      if (eventName === 'support_form_start') timeline.supportStart = earliest(timeline.supportStart, occurredAt);
      if (eventName === 'support_country_select') timeline.supportCountry = earliest(timeline.supportCountry, occurredAt);
      if (eventName === 'support_submit') timeline.supportSubmit = earliest(timeline.supportSubmit, occurredAt);
    }

    if (pageStats[pageKey] && keyActionNames.indexOf(eventName) !== -1) {
      pageStats[pageKey].actionSessions[sessionKey] = true;
      sessionActions[sessionKey] = true;
    }
    const activeSeconds = Number(row[18]) || 0;
    if (activeSeconds > 0 && pageStats[pageKey]) {
      const instanceKey = String(row[19] || `${sessionKey}|${row[4] || pageKey}`).trim();
      const previous = pageInstances[instanceKey];
      if (!previous || activeSeconds > previous.seconds) {
        pageInstances[instanceKey] = { seconds: activeSeconds, pageKey, sessionKey };
      }
    }
  });

  const engagedSessions = {};
  const activeBySession = {};
  Object.keys(pageInstances).forEach((instanceKey) => {
    const instance = pageInstances[instanceKey];
    if (pageStats[instance.pageKey]) {
      pageStats[instance.pageKey].activeTotal += instance.seconds;
      pageStats[instance.pageKey].activeInstances += 1;
    }
    activeBySession[instance.sessionKey] = (activeBySession[instance.sessionKey] || 0) + instance.seconds;
  });

  Object.keys(sessionTimeline).forEach((sessionKey) => {
    if ((activeBySession[sessionKey] || 0) >= 10 || sessionActions[sessionKey] || (sessionPageViews[sessionKey] || 0) >= 2) {
      engagedSessions[sessionKey] = true;
      pageDefinitions.forEach((page) => {
        if (pageStats[page.key].sessions[sessionKey]) pageStats[page.key].engagedSessions[sessionKey] = true;
      });
    }
  });

  const siteSessions = {};
  Object.keys(sessionTimeline).forEach((sessionKey) => {
    if (sessionTimeline[sessionKey].siteView) siteSessions[sessionKey] = true;
  });
  const totalSessions = Object.keys(siteSessions).length;
  const totalPageViews = pageDefinitions.reduce((sum, page) => sum + pageStats[page.key].views, 0);
  const totalEngagedSessions = Object.keys(engagedSessions).filter((key) => siteSessions[key]).length;
  const totalActiveSeconds = Object.keys(activeBySession)
    .filter((key) => siteSessions[key])
    .reduce((sum, key) => sum + activeBySession[key], 0);
  const averageActiveSeconds = totalSessions ? totalActiveSeconds / totalSessions : 0;

  const countBySessionProperty = (selector) => {
    const counts = {};
    Object.keys(siteSessions).forEach((sessionKey) => {
      const label = selector(sessionTimeline[sessionKey] || {}) || '미확인';
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  };
  const acquisitionCounts = countBySessionProperty((timeline) => {
    if (timeline.source) return `${timeline.source} / ${timeline.medium || '-'}`;
    if (timeline.referrer) return timeline.referrer;
    return 'Direct';
  });
  const languageCounts = countBySessionProperty((timeline) => ({ ES: '스페인어', EN: '영어', KR: '한국어' }[timeline.language] || timeline.language));
  const deviceCounts = countBySessionProperty((timeline) => ({ mobile: '모바일', desktop: '데스크톱', tablet: '태블릿' }[timeline.device] || timeline.device));

  const b2bCounts = [0, 0, 0, 0, 0];
  let contactPageCount = 0;
  let contactFormCount = 0;
  let contactSubmitCount = 0;
  const supportCounts = [0, 0, 0, 0];
  Object.keys(sessionTimeline).forEach((sessionKey) => {
    const timeline = sessionTimeline[sessionKey];
    if (timeline.siteView) {
      b2bCounts[0] += 1;
      if (timeline.productInterest && timeline.productInterest >= timeline.siteView) {
        b2bCounts[1] += 1;
        const contactEntry = [timeline.contactIntent, timeline.contactPage]
          .filter((date) => date && date >= timeline.productInterest)
          .sort((a, b) => a - b)[0];
        if (contactEntry && contactEntry >= timeline.productInterest) {
          b2bCounts[2] += 1;
          if (timeline.contactFormStart && timeline.contactFormStart >= contactEntry) {
            b2bCounts[3] += 1;
            if (timeline.leadSubmit && timeline.leadSubmit >= timeline.contactFormStart) b2bCounts[4] += 1;
          }
        }
      }

      if (timeline.contactPage && timeline.contactPage >= timeline.siteView) {
        contactPageCount += 1;
        if (timeline.contactFormStart && timeline.contactFormStart >= timeline.contactPage) {
          contactFormCount += 1;
          if (timeline.leadSubmit && timeline.leadSubmit >= timeline.contactFormStart) contactSubmitCount += 1;
        }
      }
    }

    if (timeline.supportView) {
      supportCounts[0] += 1;
      if (timeline.supportStart && timeline.supportStart >= timeline.supportView) {
        supportCounts[1] += 1;
        if (timeline.supportCountry && timeline.supportCountry >= timeline.supportStart) {
          supportCounts[2] += 1;
          if (timeline.supportSubmit && timeline.supportSubmit >= timeline.supportCountry) supportCounts[3] += 1;
        }
      }
    }
  });

  const countryCodes = ['PE', 'MX', 'CL', 'CO', 'ES', 'OTHER'];
  const countryLabels = { PE: '페루', MX: '멕시코', CL: '칠레', CO: '콜롬비아', ES: '스페인', OTHER: '기타' };
  const countryCounts = { PE: 0, MX: 0, CL: 0, CO: 0, ES: 0, OTHER: 0 };
  const supporterIds = {};
  if (supportSheet && supportSheet.getLastRow() > 1) {
    supportSheet.getDataRange().getValues().slice(1).forEach((row) => {
      if (!inPeriod(row[0]) || isVerification(row[8])) return;
      const code = String(row[2] || '').trim().toUpperCase();
      const supporter = String(row[5] || row[6] || '').trim();
      if (supporter) supporterIds[supporter] = true;
      if (Object.prototype.hasOwnProperty.call(countryCounts, code)) countryCounts[code] += 1;
      else if (code) countryCounts.OTHER += 1;
    });
  }
  const totalSupport = Object.keys(supporterIds).length;
  const totalCountrySupport = countryCodes.reduce((sum, code) => sum + countryCounts[code], 0);
  const topCountry = totalCountrySupport
    ? countryCodes.slice().sort((a, b) => countryCounts[b] - countryCounts[a])[0]
    : null;

  const pipelineCounts = [0, 0, 0, 0];
  if (leadSheet && leadSheet.getLastRow() > 1) {
    const leadData = leadSheet.getDataRange().getValues();
    const headers = leadData[0] || [];
    const receivedIndex = headers.indexOf('Received At');
    const statusIndex = headers.indexOf('Lead Status');
    const sourceIndex = headers.indexOf('Inquiry Source');
    const inquiryIndex = headers.indexOf('Inquiry Type');
    leadData.slice(1).forEach((row) => {
      if (receivedIndex < 0 || !inPeriod(row[receivedIndex])) return;
      const source = sourceIndex >= 0 ? String(row[sourceIndex] || '').toLowerCase() : '';
      const inquiry = inquiryIndex >= 0 ? String(row[inquiryIndex] || '').toLowerCase() : '';
      if (!/b2b/.test(source) && !/distribution|retail|horeca|restaurant|distribución|restaurante|유통|리테일|레스토랑/.test(inquiry)) return;
      pipelineCounts[0] += 1;
      const status = statusIndex >= 0 ? String(row[statusIndex] || '').trim().toLowerCase() : '';
      if (/qualified|유효|working|진행|converted|계약/.test(status)) pipelineCounts[1] += 1;
      if (/working|진행|converted|계약/.test(status)) pipelineCounts[2] += 1;
      if (/converted|계약/.test(status)) pipelineCounts[3] += 1;
    });
  }

  const area = dashboard.getRange('A5:L100');
  area.breakApart();
  area.clearContent();
  area.clearFormat();
  dashboard.getRange('A1').setValue('MOKDA 홈페이지 통합 대시보드');
  dashboard.getRange('A2').setValue('소비자 출시 수요와 B2B 바이어 전환을 분리해 봅니다. | 전체 페이지·언어·채널·제품 통합 · verification 제외');
  dashboard.setColumnWidths(1, 12, 88);

  const merge = (row, column, width, value, options) => {
    const opts = options || {};
    const cell = dashboard.getRange(row, column, 1, width).merge();
    cell.setValue(value);
    cell.setHorizontalAlignment(opts.align || 'center');
    cell.setVerticalAlignment('middle');
    cell.setWrap(true);
    if (opts.background) cell.setBackground(opts.background);
    if (opts.color) cell.setFontColor(opts.color);
    if (opts.bold) cell.setFontWeight('bold');
    if (opts.size) cell.setFontSize(opts.size);
    if (opts.format) cell.setNumberFormat(opts.format);
    return cell;
  };
  const section = (row, title, color) => merge(row, 1, 12, title, { background: color, color: '#ffffff', bold: true, size: 12, align: 'left' });
  const colors = ['#ef5f18', '#f39c1f', '#4f9b61', '#2f6f5e', '#15372b'];

  section(5, '전체 사이트 핵심 지표', '#15372b');
  const overviewLabels = ['방문 세션', '페이지뷰', 'GA4형 참여 세션', '참여율', '평균 활성시간', '페이지/세션'];
  const overviewValues = [
    totalSessions,
    totalPageViews,
    totalEngagedSessions,
    safeRate(totalEngagedSessions, totalSessions),
    formatDuration(averageActiveSeconds),
    safeRate(totalPageViews, totalSessions),
  ];
  const overviewNotes = ['고유 세션', '전체 페이지 합계', '10초+·전환·2뷰+', '방문 대비', '세션당 누적', '탐색 깊이'];
  for (let index = 0; index < 6; index += 1) {
    const column = index * 2 + 1;
    merge(6, column, 2, overviewLabels[index], { background: '#fff6ed', color: '#15372b', bold: true, size: 9 });
    merge(7, column, 2, overviewValues[index], { background: '#ffffff', color: index < 2 ? '#ef5f18' : '#15372b', bold: true, size: index === 4 ? 13 : 18, format: index === 3 ? '0.0%' : index === 5 ? '0.00' : index < 3 ? '#,##0' : null });
    merge(8, column, 2, overviewNotes[index], { background: '#ffffff', color: '#7a7a7a', size: 8 });
  }

  section(10, '페이지별 성과', '#ef5f18');
  const pageHeaders = ['페이지', '방문 세션', '페이지뷰', '참여율', '평균 활성시간', '전환 행동 세션'];
  for (let index = 0; index < 6; index += 1) {
    merge(11, index * 2 + 1, 2, pageHeaders[index], { background: '#eceff1', color: '#15372b', bold: true, size: 9 });
  }
  pageDefinitions.forEach((page, index) => {
    const row = 12 + index;
    const stats = pageStats[page.key];
    const sessions = Object.keys(stats.sessions).length;
    const engaged = Object.keys(stats.engagedSessions).length;
    const background = index % 2 ? '#fffaf5' : '#ffffff';
    const values = [
      page.label,
      sessions,
      stats.views,
      safeRate(engaged, sessions),
      formatDuration(stats.activeInstances ? stats.activeTotal / stats.activeInstances : 0),
      Object.keys(stats.actionSessions).length,
    ];
    values.forEach((value, valueIndex) => {
      merge(row, valueIndex * 2 + 1, 2, value, {
        background,
        color: valueIndex === 0 ? '#15372b' : '#333333',
        bold: valueIndex === 0 || valueIndex === 5,
        size: valueIndex === 0 ? 9 : 10,
        format: valueIndex === 3 ? '0.0%' : (valueIndex === 1 || valueIndex === 2 || valueIndex === 5) ? '#,##0' : null,
      });
    });
  });
  merge(19, 1, 12, '홈·소개·제품·Q&A·문의·출시 응원·출시 예정 페이지를 포함하며, 한국어·영어·스페인어 URL은 같은 페이지로 합산합니다.', { background: '#f5f7f6', color: '#5e6b63', size: 8, align: 'left' });

  section(21, 'B2B 바이어 퍼널 · 제품 경유 폐쇄형', '#15372b');
  const b2bLabels = ['사이트 방문', '제품 관심', '문의 CTA/도착', '폼 시작', '리드 생성'];
  const b2bDropNames = ['방문 → 제품 관심', '제품 관심 → 문의 진입', '문의 진입 → 폼 시작', '폼 시작 → 문의 완료'];
  const b2bDrops = b2bCounts.slice(0, 4).map((count, index) => Math.max(count - b2bCounts[index + 1], 0));
  let largestDropIndex = 0;
  b2bDrops.forEach((count, index) => {
    if (count > b2bDrops[largestDropIndex]) largestDropIndex = index;
  });
  for (let index = 0; index < 5; index += 1) {
    const column = index * 2 + 1;
    const previous = index ? b2bCounts[index - 1] : b2bCounts[0];
    merge(22, column, 2, b2bLabels[index], { background: colors[index], color: '#ffffff', bold: true, size: 9 });
    merge(23, column, 2, b2bCounts[index], { background: '#ffffff', color: '#15372b', bold: true, size: 18, format: '#,##0' });
    merge(24, column, 2, index ? safeRate(b2bCounts[index], previous) : (b2bCounts[0] ? 1 : 0), { background: '#fffaf5', color: colors[index], bold: true, size: 12, format: '0.0%' });
    merge(25, column, 2, index < 4 ? b2bDrops[index] : b2bCounts[4], { background: '#ffffff', color: index < 4 ? '#c54432' : '#15372b', bold: true, size: 11, format: '#,##0' });
    merge(26, column, 2, index < 4 ? '다음 단계 이탈' : '완료 세션', { background: '#ffffff', color: '#7a7a7a', size: 8 });
  }
  merge(22, 11, 2, '자동 진단', { background: '#37474f', color: '#ffffff', bold: true, size: 9 });
  merge(23, 11, 2, b2bCounts[0] ? b2bDropNames[largestDropIndex] : '데이터 수집 중', { background: '#ffffff', color: '#15372b', bold: true, size: 9 });
  merge(24, 11, 2, safeRate(b2bDrops[largestDropIndex], b2bCounts[largestDropIndex]), { background: '#fffaf5', color: '#c54432', bold: true, size: 12, format: '0.0%' });
  merge(25, 11, 2, '가장 큰 이탈 구간', { background: '#ffffff', color: '#7a7a7a', size: 8 });
  merge(26, 11, 2, '동일 세션·순차 통과', { background: '#ffffff', color: '#7a7a7a', size: 8 });

  section(28, 'B2B 바이어 퍼널 · 직접 진입 포함', '#37474f');
  const contactLabels = ['사이트 → 문의 페이지', '문의 페이지 → 폼 시작', '폼 시작 → 문의 완료', '사이트 → 문의 완료'];
  const contactValues = [
    safeRate(contactPageCount, totalSessions),
    safeRate(contactFormCount, contactPageCount),
    safeRate(contactSubmitCount, contactFormCount),
    safeRate(contactSubmitCount, totalSessions),
  ];
  const contactSources = [
    `${contactPageCount} / ${totalSessions} 세션`,
    `${contactFormCount} / ${contactPageCount} 세션`,
    `${contactSubmitCount} / ${contactFormCount} 세션`,
    `${contactSubmitCount} / ${totalSessions} 세션`,
  ];
  for (let index = 0; index < 4; index += 1) {
    const column = index * 3 + 1;
    merge(29, column, 3, contactLabels[index], { background: '#eceff1', color: '#15372b', bold: true, size: 9 });
    merge(30, column, 3, contactValues[index], { background: '#ffffff', color: colors[Math.min(index, 3)], bold: true, size: 18, format: '0.0%' });
    merge(31, column, 3, contactSources[index], { background: '#ffffff', color: '#5e6b63', bold: true, size: 9 });
    merge(32, column, 3, index === 3 ? '전체 B2B 전환율' : '직전 단계 기준', { background: '#fffaf5', color: '#7a7a7a', size: 8 });
  }

  section(34, '출시 응원 전환 퍼널', '#ef5f18');
  const supportLabels = ['출시 응원 방문', '폼 시작', '국가 선택', '응원 완료'];
  for (let index = 0; index < 4; index += 1) {
    const column = index * 3 + 1;
    const previous = index ? supportCounts[index - 1] : supportCounts[0];
    merge(35, column, 3, `STEP ${index + 1}`, { background: colors[index], color: '#ffffff', bold: true, size: 9 });
    merge(36, column, 3, supportLabels[index], { background: '#fff6ed', color: '#15372b', bold: true, size: 9 });
    merge(37, column, 3, supportCounts[index], { background: '#ffffff', color: '#15372b', bold: true, size: 18, format: '#,##0' });
    merge(38, column, 3, index ? safeRate(supportCounts[index], previous) : (supportCounts[0] ? 1 : 0), { background: '#fffaf5', color: colors[index], bold: true, size: 12, format: '0.0%' });
    merge(39, column, 3, index ? `${supportCounts[index]} / ${previous} 세션` : `${supportCounts[0]} 고유 세션`, { background: '#ffffff', color: '#5e6b63', size: 8 });
    merge(40, column, 3, index ? '직전 단계 전환율' : '퍼널 기준값', { background: '#ffffff', color: '#7a7a7a', size: 8 });
  }
  merge(41, 1, 12, '출시 응원 퍼널은 2026.08.03 11:23 KST 이후 동일 세션에서 순서대로 통과한 경우만 집계합니다.', { background: '#f5f7f6', color: '#5e6b63', size: 8, align: 'left' });

  section(43, '출시 응원 단계별 전환 분석', '#37474f');
  const supportConversionLabels = ['방문 → 폼 시작', '폼 시작 → 국가 선택', '국가 선택 → 응원 완료', '방문 → 최종 완료'];
  const supportConversionValues = [
    safeRate(supportCounts[1], supportCounts[0]),
    safeRate(supportCounts[2], supportCounts[1]),
    safeRate(supportCounts[3], supportCounts[2]),
    safeRate(supportCounts[3], supportCounts[0]),
  ];
  const supportConversionSources = [
    `${supportCounts[1]} / ${supportCounts[0]} 세션`,
    `${supportCounts[2]} / ${supportCounts[1]} 세션`,
    `${supportCounts[3]} / ${supportCounts[2]} 세션`,
    `${supportCounts[3]} / ${supportCounts[0]} 세션`,
  ];
  for (let index = 0; index < 4; index += 1) {
    const column = index * 3 + 1;
    merge(44, column, 3, supportConversionLabels[index], { background: '#eceff1', color: '#15372b', bold: true, size: 9 });
    merge(45, column, 3, supportConversionValues[index], { background: '#ffffff', color: colors[index], bold: true, size: 18, format: '0.0%' });
    merge(46, column, 3, supportConversionSources[index], { background: '#ffffff', color: '#5e6b63', bold: true, size: 9 });
    merge(47, column, 3, index === 3 ? '전체 응원 전환율' : '직전 단계 기준', { background: '#fffaf5', color: '#7a7a7a', size: 8 });
  }

  section(49, '누적 출시 응원 현황', '#ef5f18');
  const supportKpiLabels = ['기간 내 응원', '최다 응원 국가', '국가별 합계', '최종 갱신'];
  const supportKpiValues = [
    totalSupport,
    topCountry ? `${countryLabels[topCountry]} ${countryCounts[topCountry]}건` : '-',
    totalCountrySupport,
    Utilities.formatDate(new Date(), TIME_ZONE, 'yyyy-MM-dd HH:mm'),
  ];
  for (let index = 0; index < 4; index += 1) {
    const column = index * 3 + 1;
    merge(50, column, 3, supportKpiLabels[index], { background: '#fff6ed', color: '#5e4c43', bold: true, size: 9 });
    merge(51, column, 3, supportKpiValues[index], { background: '#ffffff', color: '#15372b', bold: true, size: index === 0 || index === 2 ? 18 : 12, format: index === 0 || index === 2 ? '#,##0' : null });
    merge(52, column, 3, index === 0 ? 'Demand Support 기준' : index === 1 ? '기간 내 기준' : index === 2 ? '전체 국가 합계' : '자동 갱신', { background: '#ffffff', color: '#7a7a7a', size: 8 });
  }

  section(54, '국가별 출시 응원', '#37474f');
  countryCodes.forEach((code, index) => {
    const column = index * 2 + 1;
    merge(55, column, 2, countryLabels[code], { background: '#eceff1', color: '#15372b', bold: true, size: 9 });
    merge(56, column, 2, countryCounts[code], { background: '#ffffff', color: '#15372b', bold: true, size: 18, format: '#,##0' });
    merge(57, column, 2, '응원', { background: '#ffffff', color: '#7a7a7a', size: 8 });
  });

  section(60, '유입·언어·기기 진단', '#15372b');
  merge(61, 1, 4, '유입 경로 TOP 3', { background: '#eceff1', color: '#15372b', bold: true, size: 9 });
  merge(61, 5, 4, '언어', { background: '#eceff1', color: '#15372b', bold: true, size: 9 });
  merge(61, 9, 4, '기기', { background: '#eceff1', color: '#15372b', bold: true, size: 9 });
  for (let index = 0; index < 3; index += 1) {
    const row = 62 + index;
    const source = acquisitionCounts[index] || ['-', 0];
    const languageItem = languageCounts[index] || ['-', 0];
    const deviceItem = deviceCounts[index] || ['-', 0];
    merge(row, 1, 3, source[0], { background: index % 2 ? '#fffaf5' : '#ffffff', color: '#333333', size: 9, align: 'left' });
    merge(row, 4, 1, source[1], { background: index % 2 ? '#fffaf5' : '#ffffff', color: '#15372b', bold: true, size: 10, format: '#,##0' });
    merge(row, 5, 3, languageItem[0], { background: index % 2 ? '#fffaf5' : '#ffffff', color: '#333333', size: 9, align: 'left' });
    merge(row, 8, 1, languageItem[1], { background: index % 2 ? '#fffaf5' : '#ffffff', color: '#15372b', bold: true, size: 10, format: '#,##0' });
    merge(row, 9, 3, deviceItem[0], { background: index % 2 ? '#fffaf5' : '#ffffff', color: '#333333', size: 9, align: 'left' });
    merge(row, 12, 1, deviceItem[1], { background: index % 2 ? '#fffaf5' : '#ffffff', color: '#15372b', bold: true, size: 10, format: '#,##0' });
  }

  section(66, '제품별 관심 세션', '#ef5f18');
  ['Original', 'Para Carnes', 'Soy Sauce', '제품 미지정'].forEach((product, index) => {
    const column = index * 3 + 1;
    const count = Object.keys(productSessions[product]).length;
    merge(67, column, 3, product, { background: '#fff6ed', color: '#15372b', bold: true, size: 9 });
    merge(68, column, 3, count, { background: '#ffffff', color: '#ef5f18', bold: true, size: 18, format: '#,##0' });
    merge(69, column, 3, safeRate(count, totalSessions), { background: '#fffaf5', color: '#15372b', bold: true, size: 11, format: '0.0%' });
    merge(70, column, 3, '전체 방문 대비', { background: '#ffffff', color: '#7a7a7a', size: 8 });
  });

  section(72, 'B2B 영업 파이프라인 · 문의 이후', '#37474f');
  ['리드 생성', '유효 리드', '상담·샘플 진행', '계약 전환'].forEach((label, index) => {
    const column = index * 3 + 1;
    merge(73, column, 3, label, { background: colors[index], color: '#ffffff', bold: true, size: 9 });
    merge(74, column, 3, pipelineCounts[index], { background: '#ffffff', color: '#15372b', bold: true, size: 18, format: '#,##0' });
    merge(75, column, 3, index ? safeRate(pipelineCounts[index], pipelineCounts[index - 1]) : (pipelineCounts[0] ? 1 : 0), { background: '#fffaf5', color: colors[index], bold: true, size: 12, format: '0.0%' });
    merge(76, column, 3, index ? '직전 단계 전환율' : 'Sheet1 문의 기준', { background: '#ffffff', color: '#7a7a7a', size: 8 });
  });
  merge(77, 1, 12, 'Sheet1의 Lead Status를 New → Qualified → Working → Converted로 갱신하면 영업 단계가 자동 반영됩니다.', { background: '#f5f7f6', color: '#5e6b63', size: 8, align: 'left' });

  section(79, '데이터 품질 체크', '#15372b');
  const qualityItems = [
    ['표본 상태', totalSessions < 30 ? '판단 보류' : totalSessions < 100 ? '방향 참고' : '추세 확인 가능'],
    ['참여 기준', '10초+ 또는 전환 또는 2뷰+'],
    ['퍼널 기준', '폐쇄형·직접 진입 분리'],
    ['테스트 제외', 'UTM medium = verification'],
  ];
  qualityItems.forEach((item, index) => {
    const column = index * 3 + 1;
    merge(80, column, 3, item[0], { background: '#eceff1', color: '#15372b', bold: true, size: 9 });
    merge(81, column, 3, item[1], { background: '#ffffff', color: '#15372b', bold: true, size: 10 });
  });
  merge(83, 1, 12, '기간 기준: ' + Utilities.formatDate(start, TIME_ZONE, 'yyyy-MM-dd') + ' ~ ' + Utilities.formatDate(end, TIME_ZONE, 'yyyy-MM-dd') + ' · verification 제외 · 고유 세션 기준 · 갱신 ' + Utilities.formatDate(new Date(), TIME_ZONE, 'yyyy-MM-dd HH:mm'), { background: '#f5f7f6', color: '#7a7a7a', size: 8, align: 'left' });

  dashboard.setRowHeights(5, 79, 24);
  [5, 10, 21, 28, 34, 43, 49, 54, 60, 66, 72, 79].forEach((row) => dashboard.setRowHeight(row, 28));
  return {
    updated: true,
    totalSessions,
    totalPageViews,
    b2bCounts,
    supportCounts,
    totalSupport,
  };
}
