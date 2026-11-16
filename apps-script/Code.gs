/**
 * OmanEvents guest-list intake — Google Apps Script web app.
 * Paste this file into Extensions > Apps Script on:
 * https://docs.google.com/spreadsheets/d/18X0vy8MyJUC0OngZsu4dOlOYJu2v-6b2ROxhrlYI1yQ/edit
 *
 * Deploy as a web app: Execute as Me, Who has access: Anyone.
 * Appends to a "Signups" tab only. Does not write to Guest List or other tabs.
 */

var SPREADSHEET_ID = '18X0vy8MyJUC0OngZsu4dOlOYJu2v-6b2ROxhrlYI1yQ';
var TAB_NAME = 'Signups';
var MIN_ELAPSED_MS = 2500;
var TZ = 'Asia/Muscat';
var REF_RE = /^OE-[A-Z0-9]{4,8}$/;
var PHONE_RE = /^\+968[0-9]{8}$/;

var ALLOWED_DATES = {
  '2026-11-19': true,
  '2026-11-26': true,
  '2026-12-03': true,
  '2026-12-10': true,
  '2026-12-17': true,
  '2026-12-24': true,
  '2026-12-31': true
};

var ALLOWED_HEAR = {
  'Instagram': true,
  'WhatsApp group': true,
  'Friend': true,
  'Promoter': true,
  'Venue': true,
  'Event listing': true,
  'Other': true
};

var ALLOWED_INTEREST = {
  'Thursday club nights': true,
  'Afro': true,
  'Hip-hop / R&B': true,
  'International': true,
  'This Thursday only': true,
  'Not sure yet': true
};

var ALLOWED_TIER = {
  'Guest list': true,
  'Table': true,
  'Walk-in': true
};

var SOURCE_RE = /^(DESK|IG-BIO|WA-STORY|REF|ADMIN-\d{2}|PROMO-\d{2}|VENUE-\d{2}|LIST-\d{2}|POST-\d{2})$/;

/**
 * Guest List A–R headers (exact live names), then referral / debug columns.
 * "Referred By" is the exact name required by the referrals team.
 * "Status (Pending/Confirmed/Arrived/No-show)" is the live sheet header.
 */
var HEADERS = [
  'Timestamp (GST)',
  'Event date',
  'Full name',
  'WhatsApp number (+968 format)',
  'Consent to WhatsApp messages (Yes/No)',
  'Consent wording version',
  'Opt-in source (source code e.g. ADMIN-01)',
  'How did you hear',
  'Event interest',
  'Entry tier (Guest list / Table / Walk-in)',
  'Party size (1-20)',
  'Preferred language (EN/AR)',
  'Instagram handle (optional)',
  'Age confirmed 21+ (Yes/No)',
  'Status (Pending/Confirmed/Arrived/No-show)',
  'Last contacted',
  'Opted out (Yes/No)',
  'Notes',
  'Referred By',
  'Ref raw',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'Consent text version',
  'User agent',
  'Page URL'
];

function doGet() {
  return json_({ ok: true, service: 'omanevents-guestlist' });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    return handlePost_(e);
  } catch (err) {
    return json_({
      ok: false,
      error: 'server_error',
      message: 'Something went wrong. Please try again.'
    });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

function handlePost_(e) {
  var data = {};
  try {
    var rawBody = (e && e.postData && e.postData.contents) ? e.postData.contents : '';
    data = rawBody ? JSON.parse(rawBody) : {};
  } catch (err) {
    return json_({ ok: false, error: 'invalid_json', message: 'Invalid request.' });
  }

  // Honeypot: pretend success, do not write.
  if (string_(data.website) || string_(data.honeypot) || string_(data.company)) {
    return json_({ ok: true });
  }

  var elapsed = Number(data.elapsedMs);
  if (!isFinite(elapsed) || elapsed < MIN_ELAPSED_MS) {
    return json_({
      ok: false,
      error: 'too_fast',
      message: 'Please take a moment and try again.'
    });
  }

  var name = string_(data.name || data.fullName);
  if (name.length < 2 || name.length > 80) {
    return json_({ ok: false, error: 'invalid_name', message: 'Please enter your full name.' });
  }

  var phone = normalizePhone_(data.phone || data.whatsapp);
  if (!phone) {
    return json_({
      ok: false,
      error: 'invalid_phone',
      message: 'Use +968 then 8 digits, no spaces. Example: +96897773122'
    });
  }

  var eventDate = string_(data.eventDate);
  if (!ALLOWED_DATES[eventDate]) {
    return json_({ ok: false, error: 'invalid_event_date', message: 'Please choose a valid event date.' });
  }

  var hear = string_(data.howHeard || data.howDidYouHear);
  if (!ALLOWED_HEAR[hear]) {
    return json_({ ok: false, error: 'invalid_hear', message: 'Please tell us how you heard about us.' });
  }

  var interest = string_(data.eventInterest);
  if (!ALLOWED_INTEREST[interest]) {
    return json_({ ok: false, error: 'invalid_interest', message: 'Please choose an event interest.' });
  }

  var tier = string_(data.entryTier);
  if (!ALLOWED_TIER[tier]) {
    return json_({ ok: false, error: 'invalid_tier', message: 'Please choose an entry tier.' });
  }

  var party = parseInt(data.partySize || data.groupSize, 10);
  if (!isFinite(party) || party < 1 || party > 20) {
    return json_({ ok: false, error: 'invalid_party', message: 'Party size must be between 1 and 20.' });
  }

  var lang = string_(data.language || data.preferredLanguage).toUpperCase();
  if (lang !== 'AR') lang = 'EN';

  var ig = normalizeInstagram_(data.instagram);
  if (ig === false) {
    return json_({ ok: false, error: 'invalid_instagram', message: 'Please enter a valid Instagram handle.' });
  }

  var ageYes = isYes_(data.ageConfirmed);
  if (!ageYes) {
    return json_({
      ok: false,
      error: 'age_required',
      message: 'You must confirm you are 21 or older.'
    });
  }

  var waYes = isYes_(data.whatsappConsent);
  var consentWording = lang === 'AR' ? 'v1-AR' : 'v1';
  var consentTextVersion = string_(data.consentVersion || data.consentTextVersion).slice(0, 80);

  // Referral: never block the signup. Invalid or missing → Referred By blank.
  var refInfo = normalizeRef_(data.ref);
  var refRaw = string_(data.refRaw != null ? data.refRaw : data.ref).slice(0, 80);

  var utmSource = cleanUtm_(data.utm_source);
  var utmMedium = cleanUtm_(data.utm_medium);
  var utmCampaign = cleanUtm_(data.utm_campaign);

  var userAgent = string_(data.userAgent).slice(0, 512);
  var pageUrl = string_(data.pageUrl).slice(0, 500);
  var source = normalizeSource_(data.optInSource || data.source);

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = getOrCreateSignups_(ss);
  var map = headerMap_(sheet);

  if (isDuplicate_(sheet, map, phone, eventDate)) {
    return json_({
      ok: true,
      duplicate: true,
      message: 'You are already on the guest list for this night.'
    });
  }

  var now = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm:ss');

  var values = {};
  values['Timestamp (GST)'] = now;
  values['Event date'] = eventDate;
  values['Full name'] = name;
  values['WhatsApp number (+968 format)'] = phone;
  values['Consent to WhatsApp messages (Yes/No)'] = waYes ? 'Yes' : 'No';
  values['Consent wording version'] = consentWording;
  values['Opt-in source (source code e.g. ADMIN-01)'] = source;
  values['How did you hear'] = hear;
  values['Event interest'] = interest;
  values['Entry tier (Guest list / Table / Walk-in)'] = tier;
  values['Party size (1-20)'] = party;
  values['Preferred language (EN/AR)'] = lang;
  values['Instagram handle (optional)'] = ig || '';
  values['Age confirmed 21+ (Yes/No)'] = 'Yes';
  // Live workflow (form-spec + referrals handoff): row lands as Pending.
  // Door staff later set this to Arrived (the only status that counts as a referral).
  values['Status (Pending/Confirmed/Arrived/No-show)'] = 'Pending';
  values['Status'] = 'Pending';
  values['Last contacted'] = '';
  values['Opted out (Yes/No)'] = 'No';
  values['Notes'] = '';
  values['Referred By'] = refInfo.valid ? refInfo.normalized : '';
  values['Ref raw'] = refRaw;
  values['utm_source'] = utmSource;
  values['utm_medium'] = utmMedium;
  values['utm_campaign'] = utmCampaign;
  values['Consent text version'] = consentTextVersion;
  values['User agent'] = userAgent;
  values['Page URL'] = pageUrl;

  var lastCol = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var row = [];
  for (var i = 0; i < headers.length; i++) {
    var h = String(headers[i] || '').trim();
    row.push(h && values.hasOwnProperty(h) ? values[h] : '');
  }
  sheet.appendRow(row);

  return json_({ ok: true });
}

function getOrCreateSignups_(ss) {
  var sheet = ss.getSheetByName(TAB_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(TAB_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    return sheet;
  }
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow < 1 || lastCol < 1) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    return sheet;
  }
  var existing = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) {
    return String(h || '').trim();
  });
  var toAdd = [];
  for (var i = 0; i < HEADERS.length; i++) {
    if (existing.indexOf(HEADERS[i]) === -1) toAdd.push(HEADERS[i]);
  }
  if (toAdd.length) {
    sheet.getRange(1, lastCol + 1, 1, toAdd.length).setValues([toAdd]);
  }
  return sheet;
}

function headerMap_(sheet) {
  var lastCol = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var map = {};
  for (var i = 0; i < headers.length; i++) {
    var h = String(headers[i] || '').trim();
    if (h) map[h] = i;
  }
  return map;
}

function isDuplicate_(sheet, map, phone, eventDate) {
  var phoneCol = firstPresent_(map, [
    'WhatsApp number (+968 format)',
    'WhatsApp number',
    'Phone'
  ]);
  var dateCol = firstPresent_(map, ['Event date']);
  if (phoneCol == null || dateCol == null) return false;
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;
  var width = Math.max(phoneCol, dateCol) + 1;
  var values = sheet.getRange(2, 1, lastRow - 1, width).getValues();
  for (var i = 0; i < values.length; i++) {
    var rowPhone = normalizePhone_(values[i][phoneCol]);
    var rowDate = normalizeDate_(values[i][dateCol]);
    if (rowPhone && rowPhone === phone && rowDate === eventDate) return true;
  }
  return false;
}

function firstPresent_(map, names) {
  for (var i = 0; i < names.length; i++) {
    if (map.hasOwnProperty(names[i])) return map[names[i]];
  }
  return null;
}

function normalizeDate_(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, TZ, 'yyyy-MM-dd');
  }
  return string_(value);
}

function normalizePhone_(raw) {
  var d = String(raw == null ? '' : raw).replace(/[^\d+]/g, '');
  if (d.indexOf('00') === 0) d = '+' + d.slice(2);
  if (/^968\d{8}$/.test(d)) d = '+' + d;
  if (/^\d{8}$/.test(d)) d = '+968' + d;
  if (PHONE_RE.test(d)) return d;
  return '';
}

/**
 * Trim, uppercase, then test ^OE-[A-Z0-9]{4,8}$.
 * Invalid or missing codes do not fail the request.
 */
function normalizeRef_(raw) {
  var original = raw == null ? '' : String(raw);
  var normalized = original.trim().toUpperCase();
  if (!normalized) return { valid: false, normalized: '' };
  if (REF_RE.test(normalized)) return { valid: true, normalized: normalized };
  return { valid: false, normalized: '' };
}

function normalizeInstagram_(raw) {
  var s = string_(raw);
  if (!s) return '';
  s = s.replace(/^@+/, '');
  if (!/^[A-Za-z0-9._]{1,30}$/.test(s)) return false;
  return '@' + s;
}

function normalizeSource_(raw) {
  var s = string_(raw).toUpperCase();
  if (!s) return '';
  return SOURCE_RE.test(s) ? s : '';
}

function cleanUtm_(raw) {
  return string_(raw).slice(0, 100);
}

function isYes_(value) {
  if (value === true) return true;
  var s = string_(value).toLowerCase();
  return s === 'yes' || s === 'true' || s === '1' || s === 'on';
}

function string_(value) {
  return value == null ? '' : String(value).trim();
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
