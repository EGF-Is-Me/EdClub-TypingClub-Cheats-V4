// ==============================================================
//  EdClub TypingClub Cheat Suite v4.0
//  By EGF
//  github.com/EGF/typingclub-cheat
//  Run in console under coreclassictyping.edclub.app context
// ==============================================================

(async () => {

const CONFIG = {
  wpm: 80,
  variation: 8,
  humanJitter: () => Math.floor(Math.random() * 20) + 8,
  autoAdvance: true,
  advanceDelay: 2200,
  tutorialScanInterval: 400,
  debug: false
};

const log = (...a) => CONFIG.debug && console.log('[TC-CHEAT]', ...a);

// ── WPM prompt ───────────────────────────────────────────────
const inputWpm = parseInt(prompt("🦆 EdClub Cheat Suite v4.0 — By EGF\n\nHow many WPM? (recommended: 60-120)"));
if (isNaN(inputWpm) || inputWpm <= 0) return alert("Invalid WPM. Exiting.");
if (inputWpm > 200 && !confirm("Above 200 WPM is very detectable. Continue?")) return;
CONFIG.wpm = inputWpm;

alert("✅ EdClub Cheat Suite started!\n\n• Auto-types all lessons\n• Handles tutorials, hold-keys, videos, games\n• Auto-advances to next lesson forever\n\nLeave the tab open and do nothing.");

// ── Helpers ──────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));

function getDoc() {
  try {
    const f = document.querySelector('iframe');
    if (f?.contentDocument) return f.contentDocument;
    if (f?.contentWindow?.document) return f.contentWindow.document;
  } catch(e) {}
  return document;
}

function getWin() {
  try {
    const f = document.querySelector('iframe');
    if (f?.contentWindow) return f.contentWindow;
  } catch(e) {}
  return window;
}

function getCore() {
  try {
    const w = getWin();
    return w.core || w.Core || null;
  } catch(e) { return null; }
}

// ── Fire keyboard event ──────────────────────────────────────
function fireKey(char, target) {
  const doc = getDoc();
  const win = getWin();
  target = target || doc.activeElement || doc.body;

  const isSpecial = ['Enter','Backspace','Shift','Tab','CapsLock','Space'].includes(char);
  const code = char === ' ' || char === 'Space' ? 'Space'
    : char === 'Enter' ? 'Enter'
    : char === 'Backspace' ? 'Backspace'
    : char === 'Tab' ? 'Tab'
    : char === 'Shift' ? 'ShiftLeft'
    : 'Key' + char.toUpperCase();

  const keyCode = char === 'Enter' ? 13
    : char === 'Backspace' ? 8
    : char === 'Tab' ? 9
    : char === ' ' || char === 'Space' ? 32
    : char === 'Shift' ? 16
    : char.charCodeAt(0);

  const opts = {
    key: char === 'Space' ? ' ' : char,
    code,
    charCode: keyCode,
    keyCode,
    which: keyCode,
    bubbles: true,
    cancelable: true,
    view: win
  };

  ['keydown','keypress','keyup'].forEach(type =>
    target.dispatchEvent(new KeyboardEvent(type, opts))
  );

  try {
    target.dispatchEvent(new InputEvent('input', {
      data: isSpecial ? null : char,
      inputType: 'insertText',
      bubbles: true,
      cancelable: true
    }));
  } catch(e) {}

  try {
    const c = getCore();
    if (c?.bound_keypress_handler) c.bound_keypress_handler({ key: char });
    else if (c?.keypress) c.keypress({ key: char });
  } catch(e) {}

  log('key fired:', JSON.stringify(char));
}

// ── Hold key ─────────────────────────────────────────────────
async function doHoldKey(key, ms) {
  ms = ms || 2800;
  const doc = getDoc();
  const win = getWin();
  const target = doc.activeElement || doc.body;
  log('holding:', key, ms + 'ms');

  const opts = {
    key, code: 'Key' + key.toUpperCase(),
    keyCode: key.charCodeAt(0), which: key.charCodeAt(0),
    bubbles: true, cancelable: true, view: win
  };

  target.dispatchEvent(new KeyboardEvent('keydown', { ...opts, repeat: false }));
  const ri = setInterval(() =>
    target.dispatchEvent(new KeyboardEvent('keydown', { ...opts, repeat: true })), 30
  );
  await sleep(ms);
  clearInterval(ri);
  target.dispatchEvent(new KeyboardEvent('keyup', { ...opts, repeat: false }));
  log('released:', key);
}

// ── Key aliases for tutorial parsing ────────────────────────
const KEY_MAP = {
  'space':' ','spacebar':' ','space bar':' ',
  'enter':'Enter','return':'Enter',
  'backspace':'Backspace','back space':'Backspace',
  'shift':'Shift','left shift':'Shift','right shift':'Shift',
  'caps lock':'CapsLock','capslock':'CapsLock',
  'tab':'Tab',
  'period':'.','full stop':'.','dot':'.',
  'comma':',','apostrophe':"'",'quote':"'",
  'semicolon':';','colon':':',
  'slash':'/','backslash':'\\',
  'dash':'-','hyphen':'-','underscore':'_',
  'exclamation':'!','question mark':'?','question':'?',
  // finger names → ignored (not keys themselves)
  'left pinky':null,'right pinky':null,
  'left ring':null,'right ring':null,
  'left middle':null,'right middle':null,
  'left index':null,'right index':null,
  'left thumb':null,'right thumb':null
};

function resolveKey(raw) {
  if (!raw) return null;
  const r = raw.trim().toLowerCase();
  if (r in KEY_MAP) return KEY_MAP[r]; // null = finger name, skip
  if (r.length === 1) return r;
  return null;
}

// ── Extract key from tutorial text ──────────────────────────
function extractKeyFromText(text) {
  if (!text) return null;
  const t = text.toLowerCase();

  const patterns = [
    /press\s+(?:the\s+)?["']?([a-z0-9 _\-]+?)["']?\s+key/i,
    /type\s+(?:the\s+)?["']?([a-z0-9 _\-]+?)["']?\s+key/i,
    /hit\s+(?:the\s+)?["']?([a-z0-9 _\-]+?)["']?\s+key/i,
    /click\s+(?:the\s+)?["']?([a-z0-9 _\-]+?)["']?\s+key/i,
    /tap\s+(?:the\s+)?["']?([a-z0-9 _\-]+?)["']?\s+key/i,
    /find\s+(?:the\s+)?["']?([a-z0-9 _\-]+?)["']?\s+key/i,
    /locate\s+(?:the\s+)?["']?([a-z0-9 _\-]+?)["']?\s+key/i,
    /use\s+(?:the\s+)?["']?([a-z0-9 _\-]+?)["']?\s+key/i,
    /(?:pinky|thumb|index|middle|ring)\s+(?:finger\s+)?(?:to\s+)?(?:press|type|hit|tap)\s+["']?([a-z0-9])/i,
    /press\s+["']?([a-z0-9])["']?\s+with/i,
    /(?:^|\s)(?:type|press)\s+["']([a-z0-9 ])["']/i,
    /[\[{]([a-z0-9 ]{1,10})[\]}]/i,
    /the\s+letter\s+["']?([a-z])["']?/i,
    /now\s+type[:\s]+["']?([a-z0-9])["']?/i,
    /now\s+press[:\s]+["']?([a-z0-9])["']?/i
  ];

  for (const p of patterns) {
    const m = t.match(p);
    if (m?.[1]) {
      const key = resolveKey(m[1]);
      if (key !== undefined) { log('tutorial text match:', key); return key; }
    }
  }
  return null;
}

// ── Find highlighted key on keyboard diagram ─────────────────
function findHighlightedKey() {
  const doc = getDoc();
  const selectors = [
    '[class*="highlight"] [class*="key"]',
    '[class*="active"] [class*="key"]',
    '[class*="key"][class*="highlight"]',
    '[class*="key"][class*="active"]',
    '[class*="key"][class*="current"]',
    '[class*="keyboard"] [class*="active"]',
    '[class*="keyboard"] [class*="highlight"]',
    'kbd[class*="active"]','kbd[class*="highlight"]',
    '[data-key][class*="active"]',
    '[data-char][class*="active"]',
    '[data-key][class*="highlight"]',
    '[class*="key-highlight"]',
    '[class*="pressed"]'
  ];
  for (const sel of selectors) {
    const el = doc.querySelector(sel);
    if (el?.offsetParent !== null) {
      const raw = el.dataset.key || el.dataset.char || el.textContent || '';
      const key = resolveKey(raw.trim());
      if (key) { log('keyboard diagram key:', key); return key; }
    }
  }
  return null;
}

// ── Detect tutorial screen ───────────────────────────────────
function isTutorialScreen() {
  const doc = getDoc();
  try {
    const c = getCore();
    if (c?.state === 'tutorial') return true;
    if (c?.cur_exercise?.type === 'tutorial') return true;
  } catch(e) {}
  const body = doc.body?.innerText || '';
  return /press\s+the|click\s+the|type\s+the|use\s+your|with\s+your\s+(left|right)|find\s+the\s+key|locate\s+the|your\s+(left|right)\s+(pinky|index|middle|ring|thumb)/i.test(body);
}

// ── Detect tutorial key ──────────────────────────────────────
function detectTutorialKey() {
  const doc = getDoc();

  // 1. Text containers
  const textSels = [
    '[class*="instruction"]','[class*="tutorial"]','[class*="prompt"]',
    '[class*="hint"]','[class*="guide"]','[class*="direction"]',
    '[class*="message"]','[class*="overlay"]','[class*="modal"]',
    '[class*="notice"]','[class*="alert"]','[class*="tip"]',
    'p','h2','h3','h4','[class*="label"]'
  ];
  for (const sel of textSels) {
    for (const el of doc.querySelectorAll(sel)) {
      if (!el.offsetParent) continue;
      const text = el.textContent || '';
      if (/press|type|click|hit|tap|finger|pinky|thumb|index|middle|ring|key|letter/i.test(text)) {
        const key = extractKeyFromText(text);
        if (key !== null && key !== undefined) return key;
      }
    }
  }

  // 2. Keyboard diagram highlight
  const hk = findHighlightedKey();
  if (hk) return hk;

  // 3. Core state
  try {
    const c = getCore();
    if (c?.cur_exercise?.type === 'tutorial') return c.cur_exercise.key || c.cur_char?.chr || null;
    if (c?.tutorial_key) return c.tutorial_key;
    if (c?.state === 'tutorial' && c.cur_char?.chr) return c.cur_char.chr;
  } catch(e) {}

  return null;
}

// ── Handle tutorial ──────────────────────────────────────────
async function handleTutorial() {
  log('tutorial handler started');

  for (let i = 0; i < 20; i++) {
    const key = detectTutorialKey();

    if (key) {
      log('pressing tutorial key:', JSON.stringify(key));
      await sleep(500 + CONFIG.humanJitter());
      const doc = getDoc();
      const target = doc.activeElement || doc.body;
      fireKey(key, target);
      await sleep(500);

      if (!isTutorialScreen()) { log('tutorial step done'); return true; }

      // Some need a second press
      await sleep(300);
      fireKey(key, target);
      await sleep(400);

      if (!isTutorialScreen()) { log('tutorial step done (2nd press)'); return true; }

    } else {
      log('no tutorial key found, attempt', i + 1);
      const doc = getDoc();
      const target = doc.activeElement || doc.body;

      if (i === 3) fireKey('Enter', target);
      if (i === 6) fireKey(' ', target);

      if (i === 4 || i === 9) {
        for (const btn of doc.querySelectorAll('button, a, [role="button"]')) {
          if (/^(ok|got it|next|continue|start|begin|go|ready|proceed|done|yes)$/i.test(btn.textContent.trim())) {
            log('clicking:', btn.textContent.trim());
            btn.click();
            break;
          }
        }
      }
    }
    await sleep(CONFIG.tutorialScanInterval);
  }
  return false;
}

// ── Lesson complete ──────────────────────────────────────────
function isLessonComplete() {
  const doc = getDoc();
  try {
    const c = getCore();
    if (c) {
      if (typeof c.cur_char_index === 'number' && c.text && c.cur_char_index >= c.text.length - 1) return true;
      if (c.lesson_complete === true) return true;
      if (['complete','finished','end','result'].includes(c.state)) return true;
    }
  } catch(e) {}

  for (const sel of [
    '[class*="complete"]','[class*="finish"]','[class*="result"]',
    '[class*="score"]','[class*="summary"]','[class*="end-screen"]',
    '[class*="well-done"]','[class*="congrat"]','[class*="great-job"]',
    '.lesson-end','.result-screen'
  ]) {
    const el = doc.querySelector(sel);
    if (el?.offsetParent !== null) return true;
  }

  const top = document.querySelector('.navbar-continue, a.continue, button.continue, [data-action="continue"]');
  if (top?.offsetParent !== null) return true;

  return false;
}

// ── Auto-advance ─────────────────────────────────────────────
async function tryAdvance() {
  if (!CONFIG.autoAdvance) return false;
  await sleep(CONFIG.advanceDelay);
  log('advancing...');

  const doc = getDoc();
  const win = getWin();
  const target = doc.activeElement || doc.body;
  const enterOpts = { key:'Enter', code:'Enter', keyCode:13, which:13, bubbles:true, cancelable:true, view:win };
  target.dispatchEvent(new KeyboardEvent('keydown', enterOpts));
  target.dispatchEvent(new KeyboardEvent('keyup', enterOpts));

  await sleep(400);

  const sels = [
    '.navbar-continue','a.continue','button.continue',
    '[data-action="continue"]','[class*="continue"]',
    '[class*="next-lesson"]','[class*="next-step"]',
    'a[href*="next"]','button[class*="next"]','[class*="proceed"]'
  ];

  for (const d of [document, doc]) {
    for (const sel of sels) {
      const el = d.querySelector(sel);
      if (el?.offsetParent !== null) { log('continue:', sel); el.click(); return true; }
    }
  }

  for (const btn of [...doc.querySelectorAll('button, a, [role="button"]'), ...document.querySelectorAll('button, a, [role="button"]')]) {
    if (/continue|next|proceed|advance|start|begin/i.test(btn.textContent) && btn.offsetParent !== null) {
      log('text-matched continue:', btn.textContent.trim());
      btn.click();
      return true;
    }
  }

  return false;
}

// ── Current char ─────────────────────────────────────────────
function getCurrentChar() {
  const doc = getDoc();

  try {
    const c = getCore();
    if (c?.cur_char?.chr) return { char: c.cur_char.chr, via: 'core' };
  } catch(e) {}

  for (const sel of [
    'span.active','span.token.active','span.letter.active','span.char.active',
    'span.current','span[class*="active"]','span[class*="current"]',
    '.active > span','span.cursor','[class*="cursor"]',
    'span[data-cursor]','[data-active="true"]',
    'span[class*="highlight"]','span[class*="pending"]:first-of-type'
  ]) {
    const el = doc.querySelector(sel);
    if (el?.textContent?.length >= 1) return { char: el.textContent[0], via: sel };
  }

  try {
    for (const el of doc.querySelectorAll('*')) {
      const fk = Object.keys(el).find(k => k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));
      if (!fk) continue;
      let f = el[fk], d = 0;
      while (f && d++ < 30) {
        const p = f.memoizedProps || f.pendingProps;
        if (p?.char && p?.active === true) return { char: p.char, via: 'react-fiber' };
        if (p?.character && p?.isCurrent === true) return { char: p.character, via: 'react-fiber-2' };
        f = f.child || f.sibling || f.return?.sibling;
      }
    }
  } catch(e) {}

  return null;
}

// ── Hold key detection ───────────────────────────────────────
function detectHoldKey() {
  const doc = getDoc();
  for (const sel of ['[class*="hold"]','[data-type="hold"]','[class*="press-hold"]','.key-hold','[class*="sustained"]']) {
    const el = doc.querySelector(sel);
    if (el?.offsetParent !== null) {
      const kEl = el.querySelector('[class*="key"],[class*="letter"],kbd');
      return kEl?.textContent?.trim() || el.dataset.key || null;
    }
  }
  try {
    const c = getCore();
    if (c?.cur_exercise?.type === 'hold') return c.cur_exercise.key || c.cur_char?.chr || null;
  } catch(e) {}
  return null;
}

// ── Lesson type ──────────────────────────────────────────────
function detectLessonType() {
  const doc = getDoc();
  if (doc.querySelector('video')) return 'video';
  if (detectHoldKey()) return 'hold';
  if (isTutorialScreen()) return 'tutorial';
  try { const c = getCore(); if (c?.text) return 'classic'; } catch(e) {}
  if ([...doc.querySelectorAll('span')].filter(s => s.textContent.length === 1 && !s.children.length).length > 3) return 'typing';
  if (doc.querySelector('canvas')) return 'game';
  return 'unknown';
}

// ── Video ────────────────────────────────────────────────────
async function handleVideo() {
  const doc = getDoc();
  log('video lesson');
  const v = doc.querySelector('video');
  if (v) {
    try { v.playbackRate = 16; v.currentTime = v.duration - 0.5; await sleep(1500); return; } catch(e) {}
  }
  for (const sel of ['[class*="skip"]','[class*="next"]','button[class*="continue"]']) {
    const el = doc.querySelector(sel);
    if (el?.offsetParent !== null) { el.click(); return; }
  }
  await sleep(5000);
}

// ── Typing engine ────────────────────────────────────────────
let running = false;
let cheatInterval = null;

async function runTyping() {
  running = true;
  log('typing started');
  const doc = getDoc();
  const area = doc.querySelector('.textline,.tl-text,#typingArea,.typing-area,[class*="typing"],main,.lesson-content') || doc.body;
  area.click?.();
  area.focus?.();

  const delay = 12000 / (CONFIG.wpm + Math.floor(Math.random() * CONFIG.variation) - CONFIG.variation / 2);
  clearInterval(cheatInterval);

  cheatInterval = setInterval(async () => {
    if (!running) { clearInterval(cheatInterval); return; }

    if (isLessonComplete()) {
      log('complete!');
      clearInterval(cheatInterval);
      running = false;
      await tryAdvance();
      await sleep(3500);
      masterLoop();
      return;
    }

    if (isTutorialScreen()) {
      clearInterval(cheatInterval);
      await handleTutorial();
      await sleep(500);
      runTyping();
      return;
    }

    const hk = detectHoldKey();
    if (hk) {
      clearInterval(cheatInterval);
      await doHoldKey(hk, 2500);
      await sleep(500);
      runTyping();
      return;
    }

    const r = getCurrentChar();
    if (!r) return;
    log('type:', JSON.stringify(r.char), 'via', r.via);
    setTimeout(() => fireKey(r.char, area), CONFIG.humanJitter());
  }, delay);
}

// ── Game engine ──────────────────────────────────────────────
async function runGame() {
  running = true;
  log('game started');
  const doc = getDoc();
  clearInterval(cheatInterval);

  cheatInterval = setInterval(() => {
    if (!running) { clearInterval(cheatInterval); return; }
    if (isLessonComplete()) {
      clearInterval(cheatInterval);
      running = false;
      tryAdvance().then(() => sleep(3500).then(masterLoop));
      return;
    }
    const r = getCurrentChar();
    if (!r) return;
    setTimeout(() => fireKey(r.char, doc.activeElement || doc.body), CONFIG.humanJitter());
  }, 12000 / (CONFIG.wpm * 1.5));
}

// ── Master loop ──────────────────────────────────────────────
async function masterLoop() {
  if (running) return;
  await sleep(1500);
  const type = detectLessonType();
  log('type:', type);

  if (type === 'tutorial') {
    await handleTutorial();
    await sleep(800);
    masterLoop();
  } else if (type === 'video') {
    await handleVideo();
    await tryAdvance();
    await sleep(3500);
    masterLoop();
  } else if (type === 'hold') {
    running = true;
    const hk = detectHoldKey();
    if (hk) await doHoldKey(hk, 3000);
    running = false;
    await tryAdvance();
    await sleep(3500);
    masterLoop();
  } else if (type === 'game') {
    await runGame();
  } else {
    await runTyping();
  }
}

// ── Navigation watchers ──────────────────────────────────────
let lastUrl = location.href;
setInterval(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    log('URL changed');
    running = false;
    clearInterval(cheatInterval);
    setTimeout(masterLoop, 2000);
  }
}, 1000);

setInterval(() => {
  const f = document.querySelector('iframe');
  if (f?.src && f.src !== lastUrl) {
    log('iframe changed');
    running = false;
    clearInterval(cheatInterval);
    setTimeout(masterLoop, 2500);
  }
}, 1500);

log('EdClub Cheat Suite v4.0 by EGF — armed 🦆');
masterLoop();

})();
