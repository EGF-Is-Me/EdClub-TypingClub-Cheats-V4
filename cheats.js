(async function() {

// ============================================================
// EdClub TypingClub Cheat Suite v5.0 — By EGF
// ============================================================

var CONFIG = {
  wpm: 80,
  variation: 8,
  autoAdvance: true,
  advanceDelay: 2200,
  debug: true
};

function log() {
  if (!CONFIG.debug) return;
  var args = Array.prototype.slice.call(arguments);
  args.unshift('[TC-CHEAT]');
  console.log.apply(console, args);
}

function sleep(ms) {
  return new Promise(function(r) { setTimeout(r, ms); });
}

function jitter() {
  return Math.floor(Math.random() * 20) + 8;
}

// ── WPM prompt ───────────────────────────────────────────────
var inputWpm = parseInt(prompt('EdClub Cheat Suite v5.0 — By EGF\n\nHow many WPM? (recommended: 60-120)'));
if (isNaN(inputWpm) || inputWpm <= 0) {
  alert('Invalid WPM. Exiting.');
  return;
}
if (inputWpm > 200) {
  if (!confirm('Above 200 WPM is very detectable. Continue?')) return;
}
CONFIG.wpm = inputWpm;
alert('EdClub Cheat Suite v5.0 started! Leave the tab open.');

// ── Safe document/window getters ─────────────────────────────
function getDoc() {
  try {
    var frames = document.querySelectorAll('iframe');
    for (var i = 0; i < frames.length; i++) {
      try {
        var d = frames[i].contentDocument || (frames[i].contentWindow && frames[i].contentWindow.document);
        if (d && d.body) return d;
      } catch(e) {}
    }
  } catch(e) {}
  return document;
}

function getWin() {
  try {
    var frames = document.querySelectorAll('iframe');
    for (var i = 0; i < frames.length; i++) {
      try {
        var w = frames[i].contentWindow;
        if (w && w.document && w.document.body) return w;
      } catch(e) {}
    }
  } catch(e) {}
  return window;
}

function getCore() {
  try {
    var w = getWin();
    if (!w) return null;
    return w.core || w.Core || null;
  } catch(e) {
    return null;
  }
}

function safeQS(sel, root) {
  try {
    if (!root) root = getDoc();
    if (!root) return null;
    return root.querySelector(sel);
  } catch(e) {
    return null;
  }
}

function safeQSA(sel, root) {
  try {
    if (!root) root = getDoc();
    if (!root) return [];
    return Array.prototype.slice.call(root.querySelectorAll(sel));
  } catch(e) {
    return [];
  }
}

// ── Fire keyboard event ──────────────────────────────────────
function fireKey(char, target) {
  try {
    var doc = getDoc();
    var win = getWin();
    if (!doc || !win) return;
    if (!target) target = doc.activeElement || doc.body;
    if (!target) return;

    var code, keyCode;

    if (char === ' ' || char === 'Space') {
      code = 'Space';
      keyCode = 32;
      char = ' ';
    } else if (char === 'Enter') {
      code = 'Enter';
      keyCode = 13;
    } else if (char === 'Backspace') {
      code = 'Backspace';
      keyCode = 8;
    } else if (char === 'Tab') {
      code = 'Tab';
      keyCode = 9;
    } else if (char === 'Shift') {
      code = 'ShiftLeft';
      keyCode = 16;
    } else {
      code = 'Key' + char.toUpperCase();
      keyCode = char.charCodeAt(0);
    }

    var opts = {
      key: char,
      code: code,
      charCode: keyCode,
      keyCode: keyCode,
      which: keyCode,
      bubbles: true,
      cancelable: true,
      view: win
    };

    target.dispatchEvent(new KeyboardEvent('keydown', opts));
    target.dispatchEvent(new KeyboardEvent('keypress', opts));
    target.dispatchEvent(new KeyboardEvent('keyup', opts));

    try {
      target.dispatchEvent(new InputEvent('input', {
        data: char,
        inputType: 'insertText',
        bubbles: true,
        cancelable: true
      }));
    } catch(e) {}

    try {
      var c = getCore();
      if (c && c.bound_keypress_handler) {
        c.bound_keypress_handler({ key: char });
      } else if (c && c.keypress) {
        c.keypress({ key: char });
      }
    } catch(e) {}

    log('fired:', JSON.stringify(char));
  } catch(e) {
    log('fireKey error:', e.message);
  }
}

// ── Hold key ─────────────────────────────────────────────────
function doHoldKey(key, ms) {
  return new Promise(function(resolve) {
    try {
      if (!ms) ms = 2800;
      var doc = getDoc();
      var win = getWin();
      if (!doc || !win) { resolve(); return; }
      var target = doc.activeElement || doc.body;
      if (!target) { resolve(); return; }
      log('holding:', key, ms + 'ms');

      var opts = {
        key: key,
        code: 'Key' + key.toUpperCase(),
        keyCode: key.charCodeAt(0),
        which: key.charCodeAt(0),
        bubbles: true,
        cancelable: true,
        view: win,
        repeat: false
      };

      target.dispatchEvent(new KeyboardEvent('keydown', opts));

      var repeatOpts = {
        key: key,
        code: 'Key' + key.toUpperCase(),
        keyCode: key.charCodeAt(0),
        which: key.charCodeAt(0),
        bubbles: true,
        cancelable: true,
        view: win,
        repeat: true
      };

      var ri = setInterval(function() {
        try { target.dispatchEvent(new KeyboardEvent('keydown', repeatOpts)); } catch(e) {}
      }, 30);

      setTimeout(function() {
        clearInterval(ri);
        try {
          var upOpts = {
            key: key,
            code: 'Key' + key.toUpperCase(),
            keyCode: key.charCodeAt(0),
            which: key.charCodeAt(0),
            bubbles: true,
            cancelable: true,
            view: win,
            repeat: false
          };
          target.dispatchEvent(new KeyboardEvent('keyup', upOpts));
        } catch(e) {}
        log('released:', key);
        resolve();
      }, ms);
    } catch(e) {
      log('doHoldKey error:', e.message);
      resolve();
    }
  });
}

// ── Key aliases ───────────────────────────────────────────────
var KEY_MAP = {
  'space': ' ',
  'spacebar': ' ',
  'space bar': ' ',
  'enter': 'Enter',
  'return': 'Enter',
  'backspace': 'Backspace',
  'back space': 'Backspace',
  'shift': 'Shift',
  'left shift': 'Shift',
  'right shift': 'Shift',
  'caps lock': 'CapsLock',
  'capslock': 'CapsLock',
  'tab': 'Tab',
  'period': '.',
  'full stop': '.',
  'dot': '.',
  'comma': ',',
  'apostrophe': "'",
  'quote': "'",
  'semicolon': ';',
  'colon': ':',
  'slash': '/',
  'backslash': '\\',
  'dash': '-',
  'hyphen': '-',
  'underscore': '_',
  'exclamation': '!',
  'question mark': '?',
  'question': '?',
  'left pinky': null,
  'right pinky': null,
  'left ring': null,
  'right ring': null,
  'left middle': null,
  'right middle': null,
  'left index': null,
  'right index': null,
  'left thumb': null,
  'right thumb': null
};

function resolveKey(raw) {
  if (!raw) return undefined;
  var r = raw.trim().toLowerCase();
  if (Object.prototype.hasOwnProperty.call(KEY_MAP, r)) return KEY_MAP[r];
  if (r.length === 1) return r;
  return undefined;
}

// ── Extract key from tutorial text ───────────────────────────
function extractKeyFromText(text) {
  if (!text) return null;
  var t = text.toLowerCase();

  var patterns = [
    /press\s+(?:the\s+)?([a-z0-9 _-]+?)\s+key/i,
    /type\s+(?:the\s+)?([a-z0-9 _-]+?)\s+key/i,
    /hit\s+(?:the\s+)?([a-z0-9 _-]+?)\s+key/i,
    /click\s+(?:the\s+)?([a-z0-9 _-]+?)\s+key/i,
    /tap\s+(?:the\s+)?([a-z0-9 _-]+?)\s+key/i,
    /find\s+(?:the\s+)?([a-z0-9 _-]+?)\s+key/i,
    /locate\s+(?:the\s+)?([a-z0-9 _-]+?)\s+key/i,
    /use\s+(?:the\s+)?([a-z0-9 _-]+?)\s+key/i,
    /(?:pinky|thumb|index|middle|ring)\s+(?:finger\s+)?(?:to\s+)?(?:press|type|hit|tap)\s+([a-z0-9])/i,
    /press\s+([a-z0-9])\s+with/i,
    /the\s+letter\s+([a-z])/i,
    /now\s+type[:\s]+([a-z0-9])/i,
    /now\s+press[:\s]+([a-z0-9])/i
  ];

  for (var i = 0; i < patterns.length; i++) {
    var m = t.match(patterns[i]);
    if (m && m[1]) {
      var key = resolveKey(m[1]);
      if (key !== undefined) {
        log('tutorial key found:', key);
        return key;
      }
    }
  }
  return null;
}

// ── Find highlighted key on keyboard diagram ──────────────────
function findHighlightedKey() {
  var doc = getDoc();
  if (!doc) return null;

  var sels = [
    '[class*="highlight"] [class*="key"]',
    '[class*="active"] [class*="key"]',
    '[class*="key"][class*="highlight"]',
    '[class*="key"][class*="active"]',
    '[class*="key"][class*="current"]',
    '[class*="keyboard"] [class*="active"]',
    '[class*="keyboard"] [class*="highlight"]',
    'kbd',
    '[data-key]',
    '[data-char]',
    '[class*="key-highlight"]',
    '[class*="pressed"]'
  ];

  for (var i = 0; i < sels.length; i++) {
    try {
      var el = doc.querySelector(sels[i]);
      if (el && el.offsetParent !== null) {
        var raw = (el.dataset && (el.dataset.key || el.dataset.char)) || el.textContent || '';
        var key = resolveKey(raw.trim());
        if (key) {
          log('diagram key:', key);
          return key;
        }
      }
    } catch(e) {}
  }
  return null;
}

// ── Tutorial screen detection ────────────────────────────────
function isTutorialScreen() {
  try {
    var c = getCore();
    if (c && c.state === 'tutorial') return true;
    if (c && c.cur_exercise && c.cur_exercise.type === 'tutorial') return true;
  } catch(e) {}
  try {
    var doc = getDoc();
    if (!doc || !doc.body) return false;
    var body = doc.body.innerText || '';
    return /press\s+the|click\s+the|type\s+the|use\s+your|with\s+your\s+(left|right)|find\s+the\s+key|locate\s+the|your\s+(left|right)\s+(pinky|index|middle|ring|thumb)/i.test(body);
  } catch(e) {
    return false;
  }
}

// ── Detect tutorial key ───────────────────────────────────────
function detectTutorialKey() {
  var doc = getDoc();
  if (!doc) return null;

  var textSels = [
    '[class*="instruction"]',
    '[class*="tutorial"]',
    '[class*="prompt"]',
    '[class*="hint"]',
    '[class*="guide"]',
    '[class*="direction"]',
    '[class*="message"]',
    '[class*="overlay"]',
    '[class*="modal"]',
    '[class*="notice"]',
    '[class*="alert"]',
    '[class*="tip"]',
    'p', 'h2', 'h3', 'h4'
  ];

  for (var i = 0; i < textSels.length; i++) {
    try {
      var els = doc.querySelectorAll(textSels[i]);
      for (var j = 0; j < els.length; j++) {
        var el = els[j];
        if (!el.offsetParent) continue;
        var text = el.textContent || '';
        if (/press|type|click|hit|tap|finger|pinky|thumb|index|middle|ring|key|letter/i.test(text)) {
          var key = extractKeyFromText(text);
          if (key !== null && key !== undefined) return key;
        }
      }
    } catch(e) {}
  }

  var hk = findHighlightedKey();
  if (hk) return hk;

  try {
    var c = getCore();
    if (c) {
      if (c.cur_exercise && c.cur_exercise.type === 'tutorial') {
        return c.cur_exercise.key || (c.cur_char && c.cur_char.chr) || null;
      }
      if (c.tutorial_key) return c.tutorial_key;
      if (c.state === 'tutorial' && c.cur_char && c.cur_char.chr) return c.cur_char.chr;
    }
  } catch(e) {}

  return null;
}

// ── Handle tutorial ───────────────────────────────────────────
async function handleTutorial() {
  log('tutorial handler started');
  for (var i = 0; i < 20; i++) {
    try {
      var key = detectTutorialKey();
      if (key) {
        log('pressing tutorial key:', JSON.stringify(key));
        await sleep(500 + jitter());
        var doc = getDoc();
        var target = (doc && (doc.activeElement || doc.body)) || null;
        if (target) {
          fireKey(key, target);
          await sleep(500);
          if (!isTutorialScreen()) { log('tutorial done'); return true; }
          await sleep(300);
          fireKey(key, target);
          await sleep(400);
          if (!isTutorialScreen()) { log('tutorial done (2nd press)'); return true; }
        }
      } else {
        log('no tutorial key, attempt ' + (i + 1));
        var doc2 = getDoc();
        var target2 = (doc2 && (doc2.activeElement || doc2.body)) || null;
        if (i === 3 && target2) fireKey('Enter', target2);
        if (i === 6 && target2) fireKey(' ', target2);
        if ((i === 4 || i === 9) && doc2) {
          var btns = doc2.querySelectorAll('button, a, [role="button"]');
          for (var b = 0; b < btns.length; b++) {
            var btnText = (btns[b].textContent || '').trim();
            if (/^(ok|got it|next|continue|start|begin|go|ready|proceed|done|yes)$/i.test(btnText)) {
              log('clicking button:', btnText);
              btns[b].click();
              break;
            }
          }
        }
      }
    } catch(e) {
      log('tutorial loop error:', e.message);
    }
    await sleep(400);
  }
  return false;
}

// ── Lesson complete ───────────────────────────────────────────
function isLessonComplete() {
  try {
    var c = getCore();
    if (c) {
      if (typeof c.cur_char_index === 'number' && c.text && c.cur_char_index >= c.text.length - 1) return true;
      if (c.lesson_complete === true) return true;
      var doneStates = ['complete', 'finished', 'end', 'result'];
      if (doneStates.indexOf(c.state) !== -1) return true;
    }
  } catch(e) {}

  try {
    var doc = getDoc();
    if (!doc) return false;
    var doneSels = [
      '[class*="complete"]',
      '[class*="finish"]',
      '[class*="result"]',
      '[class*="score"]',
      '[class*="summary"]',
      '[class*="end-screen"]',
      '[class*="well-done"]',
      '[class*="congrat"]',
      '[class*="great-job"]',
      '.lesson-end',
      '.result-screen'
    ];
    for (var i = 0; i < doneSels.length; i++) {
      try {
        var el = doc.querySelector(doneSels[i]);
        if (el && el.offsetParent !== null) return true;
      } catch(e) {}
    }
  } catch(e) {}

  try {
    var top = document.querySelector('.navbar-continue, a.continue, button.continue, [data-action="continue"]');
    if (top && top.offsetParent !== null) return true;
  } catch(e) {}

  return false;
}

// ── Auto advance ──────────────────────────────────────────────
async function tryAdvance() {
  if (!CONFIG.autoAdvance) return false;
  await sleep(CONFIG.advanceDelay);
  log('advancing...');

  try {
    var doc = getDoc();
    var win = getWin();
    if (!doc || !win) return false;

    var target = doc.activeElement || doc.body;
    if (target) {
      var enterOpts = {
        key: 'Enter', code: 'Enter',
        keyCode: 13, which: 13,
        bubbles: true, cancelable: true,
        view: win
      };
      target.dispatchEvent(new KeyboardEvent('keydown', enterOpts));
      target.dispatchEvent(new KeyboardEvent('keyup', enterOpts));
    }

    await sleep(400);

    var sels = [
      '.navbar-continue', 'a.continue', 'button.continue',
      '[data-action="continue"]', '[class*="continue"]',
      '[class*="next-lesson"]', '[class*="next-step"]',
      'a[href*="next"]', 'button[class*="next"]', '[class*="proceed"]'
    ];

    var docs = [document, doc];
    for (var d = 0; d < docs.length; d++) {
      if (!docs[d]) continue;
      for (var s = 0; s < sels.length; s++) {
        try {
          var el = docs[d].querySelector(sels[s]);
          if (el && el.offsetParent !== null) {
            log('clicking continue:', sels[s]);
            el.click();
            return true;
          }
        } catch(e) {}
      }
    }

    var allBtns = safeQSA('button, a, [role="button"]', doc).concat(
      safeQSA('button, a, [role="button"]', document)
    );
    for (var i = 0; i < allBtns.length; i++) {
      var btn = allBtns[i];
      var t = (btn.textContent || '').toLowerCase();
      if (/continue|next|proceed|advance|start|begin/.test(t) && btn.offsetParent !== null) {
        log('text continue:', btn.textContent.trim());
        btn.click();
        return true;
      }
    }
  } catch(e) {
    log('tryAdvance error:', e.message);
  }
  return false;
}

// ── Current char ──────────────────────────────────────────────
function getCurrentChar() {
  try {
    var c = getCore();
    if (c && c.cur_char && c.cur_char.chr) {
      return { char: c.cur_char.chr, via: 'core' };
    }
  } catch(e) {}

  try {
    var doc = getDoc();
    if (!doc) return null;

    var spanSels = [
      'span.active', 'span.token.active', 'span.letter.active',
      'span.char.active', 'span.current', 'span[class*="active"]',
      'span[class*="current"]', '.active > span', 'span.cursor',
      '[class*="cursor"]', 'span[data-cursor]', '[data-active="true"]',
      'span[class*="highlight"]'
    ];

    for (var i = 0; i < spanSels.length; i++) {
      try {
        var el = doc.querySelector(spanSels[i]);
        if (el && el.textContent && el.textContent.length >= 1) {
          return { char: el.textContent[0], via: spanSels[i] };
        }
      } catch(e) {}
    }

    // React fiber scan
    var allEls = doc.querySelectorAll('*');
    for (var j = 0; j < allEls.length; j++) {
      try {
        var elem = allEls[j];
        var keys = Object.keys(elem);
        var fk = null;
        for (var k = 0; k < keys.length; k++) {
          if (keys[k].indexOf('__reactFiber') === 0 || keys[k].indexOf('__reactInternalInstance') === 0) {
            fk = keys[k];
            break;
          }
        }
        if (!fk) continue;
        var fiber = elem[fk];
        var depth = 0;
        while (fiber && depth < 30) {
          var p = fiber.memoizedProps || fiber.pendingProps;
          if (p && typeof p.char === 'string' && p.active === true) {
            return { char: p.char, via: 'fiber' };
          }
          if (p && typeof p.character === 'string' && p.isCurrent === true) {
            return { char: p.character, via: 'fiber2' };
          }
          fiber = fiber.child || fiber.sibling || (fiber.return && fiber.return.sibling) || null;
          depth++;
        }
      } catch(e) {}
    }
  } catch(e) {}

  return null;
}

// ── Hold key detection ────────────────────────────────────────
function detectHoldKey() {
  try {
    var doc = getDoc();
    if (!doc) return null;

    var holdSels = [
      '[class*="hold"]',
      '[data-type="hold"]',
      '[class*="press-hold"]',
      '.key-hold',
      '[class*="sustained"]'
    ];

    for (var i = 0; i < holdSels.length; i++) {
      try {
        var el = doc.querySelector(holdSels[i]);
        if (el && el.offsetParent !== null) {
          var kEl = el.querySelector('[class*="key"],[class*="letter"],kbd');
          return (kEl && kEl.textContent && kEl.textContent.trim()) ||
                 (el.dataset && el.dataset.key) || null;
        }
      } catch(e) {}
    }

    var c = getCore();
    if (c && c.cur_exercise && c.cur_exercise.type === 'hold') {
      return c.cur_exercise.key || (c.cur_char && c.cur_char.chr) || null;
    }
  } catch(e) {}
  return null;
}

// ── Lesson type ───────────────────────────────────────────────
function detectLessonType() {
  try {
    var doc = getDoc();
    if (!doc) return 'unknown';

    if (safeQS('video', doc)) return 'video';
    if (detectHoldKey()) return 'hold';
    if (isTutorialScreen()) return 'tutorial';

    try {
      var c = getCore();
      if (c && c.text) return 'classic';
    } catch(e) {}

    var spans = safeQSA('span', doc).filter(function(s) {
      return s.textContent && s.textContent.length === 1 && s.children.length === 0;
    });
    if (spans.length > 3) return 'typing';

    if (safeQS('canvas', doc)) return 'game';
  } catch(e) {
    log('detectLessonType error:', e.message);
  }
  return 'unknown';
}

// ── Video handler ─────────────────────────────────────────────
async function handleVideo() {
  try {
    var doc = getDoc();
    if (!doc) return;
    log('video lesson');
    var v = doc.querySelector('video');
    if (v) {
      try {
        v.playbackRate = 16;
        v.currentTime = v.duration - 0.5;
        await sleep(1500);
        return;
      } catch(e) {}
    }
    var skipSels = ['[class*="skip"]', '[class*="next"]', 'button[class*="continue"]'];
    for (var i = 0; i < skipSels.length; i++) {
      try {
        var el = doc.querySelector(skipSels[i]);
        if (el && el.offsetParent !== null) { el.click(); return; }
      } catch(e) {}
    }
    await sleep(5000);
  } catch(e) {
    log('handleVideo error:', e.message);
  }
}

// ── Typing engine ─────────────────────────────────────────────
var running = false;
var cheatInterval = null;

async function runTyping() {
  running = true;
  log('typing started');

  try {
    var doc = getDoc();
    if (!doc) { running = false; return; }

    var areaSels = [
      '.textline', '.tl-text', '#typingArea',
      '.typing-area', '[class*="typing"]', 'main', '.lesson-content'
    ];
    var area = null;
    for (var i = 0; i < areaSels.length; i++) {
      area = safeQS(areaSels[i], doc);
      if (area) break;
    }
    if (!area) area = doc.body;

    try { area.click(); } catch(e) {}
    try { area.focus(); } catch(e) {}

    var wpmNow = CONFIG.wpm + Math.floor(Math.random() * CONFIG.variation) - Math.floor(CONFIG.variation / 2);
    var delay = Math.max(50, Math.floor(12000 / wpmNow));

    clearInterval(cheatInterval);

    cheatInterval = setInterval(function() {
      (async function() {
        try {
          if (!running) { clearInterval(cheatInterval); return; }

          if (isLessonComplete()) {
            log('lesson complete!');
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

          var hk = detectHoldKey();
          if (hk) {
            clearInterval(cheatInterval);
            await doHoldKey(hk, 2500);
            await sleep(500);
            runTyping();
            return;
          }

          var r = getCurrentChar();
          if (!r) return;

          log('type:', JSON.stringify(r.char), 'via', r.via);

          var currentDoc = getDoc();
          var currentArea = null;
          for (var i = 0; i < areaSels.length; i++) {
            currentArea = safeQS(areaSels[i], currentDoc);
            if (currentArea) break;
          }
          if (!currentArea && currentDoc) currentArea = currentDoc.body;

          setTimeout(function() {
            fireKey(r.char, currentArea);
          }, jitter());

        } catch(e) {
          log('typing tick error:', e.message);
        }
      })();
    }, delay);

  } catch(e) {
    log('runTyping error:', e.message);
    running = false;
  }
}

// ── Game engine ───────────────────────────────────────────────
async function runGame() {
  running = true;
  log('game started');

  try {
    var delay = Math.max(30, Math.floor(12000 / (CONFIG.wpm * 1.5)));
    clearInterval(cheatInterval);

    cheatInterval = setInterval(function() {
      (async function() {
        try {
          if (!running) { clearInterval(cheatInterval); return; }

          if (isLessonComplete()) {
            clearInterval(cheatInterval);
            running = false;
            await tryAdvance();
            await sleep(3500);
            masterLoop();
            return;
          }

          var r = getCurrentChar();
          if (!r) return;

          var doc = getDoc();
          var target = (doc && (doc.activeElement || doc.body)) || null;
          setTimeout(function() { fireKey(r.char, target); }, jitter());
        } catch(e) {
          log('game tick error:', e.message);
        }
      })();
    }, delay);
  } catch(e) {
    log('runGame error:', e.message);
    running = false;
  }
}

// ──
