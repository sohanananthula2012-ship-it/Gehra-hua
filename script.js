// ════════════════════════════════════════════
//  GEHRA HUA — script.js
// ════════════════════════════════════════════

// ── Elements ──
const f1 = document.getElementById('f1');
const f2 = document.getElementById('f2');
const f3 = document.getElementById('f3');
const f4 = document.getElementById('f4');

const enterBtn    = document.getElementById('enterBtn');
const twText      = document.getElementById('tw-text');
const twDots      = document.getElementById('tw-dots');
const snippetAudio= document.getElementById('snippetAudio');

const mainAudio   = document.getElementById('mainAudio');
const playBtn     = document.getElementById('playBtn');
const backBtn     = document.getElementById('backBtn');
const fwdBtn      = document.getElementById('fwdBtn');
const progBar     = document.getElementById('progBar');
const progFill    = document.getElementById('progFill');
const progThumb   = document.getElementById('progThumb');
const timeCur     = document.getElementById('timeCur');
const timeTotal   = document.getElementById('timeTotal');
const volSlider   = document.getElementById('volSlider');
const lyricHi     = document.getElementById('lyricHi');
const lyricEn     = document.getElementById('lyricEn');
const ghostUp     = document.getElementById('ghostUp');
const ghostDn     = document.getElementById('ghostDn');
const lyricNote   = document.getElementById('lyricNote');
const replayBtn   = document.getElementById('replayBtn');
const f4date      = document.getElementById('f4date');

// ── Frame transition ──
function showFrame(target) {
  [f1, f2, f3, f4].forEach(f => f.classList.remove('active'));
  setTimeout(() => target.classList.add('active'), 40);
}

// ════════════════════════════════════════════
//  FRAME 2 — TYPEWRITER MEMORIES
// ════════════════════════════════════════════
const memories = [
  "Yaad hai... pehli baar jab humne baat ki thi?",
  "Wo raat, wo hasi, wo bewajah ki batein...",
  "Tab nahi pata tha ki tu itni khaas ho jayegi.",
  "Har gaana ab thoda sa tera lagta hai.",
  "Aur ye gaana... sirf tere liye hai, Cutie. 🌸",
];

let memIdx = 0, charIdx = 0;
const TYPE_SPEED = 46, LINE_PAUSE = 1500;

memories.forEach((_, i) => {
  const d = document.createElement('span');
  d.className = 'dot'; d.id = `dot${i}`;
  twDots.appendChild(d);
});

function typeChar() {
  if (memIdx >= memories.length) {
    setTimeout(() => showFrame(f3), 900);
    return;
  }
  const dot = document.getElementById(`dot${memIdx}`);
  dot.classList.add('active');
  const line = memories[memIdx];
  if (charIdx < line.length) {
    twText.textContent = line.substring(0, charIdx + 1);
    charIdx++;
    setTimeout(typeChar, TYPE_SPEED);
  } else {
    dot.classList.remove('active'); dot.classList.add('done');
    memIdx++; charIdx = 0;
    setTimeout(() => { twText.textContent = ''; typeChar(); }, LINE_PAUSE);
  }
}

enterBtn.addEventListener('click', () => {
  showFrame(f2);
  snippetAudio.currentTime = 2;
  snippetAudio.volume = 0.3;
  snippetAudio.play().catch(() => {});
  snippetAudio.addEventListener('timeupdate', () => {
    if (snippetAudio.currentTime >= 10) snippetAudio.currentTime = 2;
  });
  setTimeout(typeChar, 700);
});

// Stop snippet when f3 becomes active
new MutationObserver(() => {
  if (f3.classList.contains('active')) {
    snippetAudio.pause();
    snippetAudio.currentTime = 0;
  }
}).observe(f3, { attributes: true, attributeFilter: ['class'] });

// ════════════════════════════════════════════
//  SRT PARSER
// ════════════════════════════════════════════
function srtTime(t) {
  const [h, m, rest] = t.split(':');
  const [s, ms] = rest.split(',');
  return +h*3600 + +m*60 + +s + +ms/1000;
}
function parseSRT(raw) {
  return raw.trim().split(/\n\s*\n/).map(block => {
    const lines = block.split('\n').filter(l => l.trim());
    const tl = lines.find(l => l.includes('-->'));
    if (!tl) return null;
    const [start, end] = tl.split('-->').map(t => srtTime(t.trim()));
    const text = lines.slice(lines.indexOf(tl) + 1).join(' ');
    return { start, end, text };
  }).filter(Boolean);
}

// ════════════════════════════════════════════
//  ENGLISH TRANSLATIONS (parallel to SRT)
// ════════════════════════════════════════════
const translations = [
  "If you were mine, these winds are yours",
  "If you were mine, every path is yours",
  "If you were mine, I am yours",
  "If you were mine, this light is yours",
  "If you were mine, this heart belongs to you",
  "If you were mine, I am yours",
  "You are love's restless revolution",
  "My whole world is a dream in your arms",
  "Deeper, deeper...",
  "The color of love has gone deeper",
  "Deeper, deeper...",
  "The river of prayers has gone deeper",
  "I have become yours",
  "If you were mine, these winds are yours",
  "If you were mine, every path is yours",
  "If you were mine, I am yours",
  "The sky blinks in wonder",
  "You are the life of a million angels",
  "They ask — where does she live?",
  "Tell them — she lives in my arms",
  "The sky blinks in wonder",
  "Where has it seen someone like you?",
  "There is light wherever you are",
  "To stay in my arms — that's my only prayer",
  "If you were mine, your story is mine too",
  "If you were mine, the whole world is yours",
  "If you were mine, I am yours",
  "You are love's restless revolution",
  "My whole world is a dream in your arms",
  "Deeper, deeper...",
  "The color of love has gone deeper",
  "Deeper, deeper...",
  "The river of prayers has gone deeper",
  "I have to burn in your love",
  "And yet be careful around you",
  "I have to change some colors of mine",
  "I will always mold into your colors",
  "You are a moon that beats like a heart",
  "Secretly looking only at me",
  "Shining brighter held close to my chest",
  "You became the only path to my heaven",
  "If you were mine, these winds are yours",
  "If you were mine, every path is yours",
  "If you were mine, I am yours",
  "You are love's restless revolution",
  "My whole world is a dream in your arms",
  "Deeper, deeper...",
  "The color of love has gone deeper",
  "Deeper, deeper — the river of prayers",
];

// ════════════════════════════════════════════
//  PERSONAL NOTES (keyed to SRT line index)
// ════════════════════════════════════════════
const notes = {
  2:  "...waise hi jaise main hoon tera, Cutie. ✦",
  9:  "har din thoda aur gehra hota hai ye rang.",
  19: "tu poochegi kahaan? bata dena — yahin, mere paas.",
  29: "khwaab nahi. sach hai ye.",
  40: "tu chaand hai... aur main bas dekhta reh jaata hoon.",
};

// ════════════════════════════════════════════
//  BUILD LYRICS DOM
// ════════════════════════════════════════════
let lyricsData = [];

fetch('gehra_hua_lyrics.srt')
  .then(r => r.text())
  .then(raw => { lyricsData = parseSRT(raw); })
  .catch(() => {});

// ── Drive the lyric card: ghost-up, Hinglish, English caption, ghost-down, note ──
let curLineIdx = -1;

function updateLyrics(time) {
  if (!lyricsData.length) return;

  // Find current or nearest line with tolerance
  let idx = lyricsData.findIndex(l => time >= l.start && time <= l.end + 1.0);
  if (idx === -1) {
    idx = lyricsData.findIndex(l => l.start > time);
    if (idx > 0) idx--;
  }

  if (idx === curLineIdx || idx < 0) return;
  curLineIdx = idx;

  ghostUp.textContent = idx > 0 ? lyricsData[idx - 1].text : '';
  lyricHi.textContent  = lyricsData[idx].text;
  lyricEn.textContent  = idx < translations.length ? translations[idx] : '';
  ghostDn.textContent  = idx < lyricsData.length - 1 ? lyricsData[idx + 1].text : '';

  const note = notes[idx];
  lyricNote.textContent = note || '';
  lyricNote.classList.toggle('show', !!note);
}

// ════════════════════════════════════════════
//  AUDIO PLAYER CONTROLS
// ════════════════════════════════════════════
function fmt(s) {
  if (isNaN(s)) return '0:00';
  return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
}

mainAudio.addEventListener('loadedmetadata', () => {
  timeTotal.textContent = fmt(mainAudio.duration);
});

playBtn.addEventListener('click', () => {
  if (mainAudio.paused) {
    mainAudio.play();
    playBtn.textContent = '❚❚';
  } else {
    mainAudio.pause();
    playBtn.textContent = '▶';
  }
});

mainAudio.addEventListener('timeupdate', () => {
  const pct = (mainAudio.currentTime / mainAudio.duration) * 100 || 0;
  progFill.style.width = pct + '%';
  progThumb.style.left = pct + '%';
  timeCur.textContent = fmt(mainAudio.currentTime);
  updateLyrics(mainAudio.currentTime);
});

// Song ended → go to Frame 4
mainAudio.addEventListener('ended', () => {
  playBtn.textContent = '▶';
  setTimeout(() => goToF4(), 1200);
});

backBtn.addEventListener('click', () => { mainAudio.currentTime = Math.max(0, mainAudio.currentTime - 10); });
fwdBtn.addEventListener('click', () => { mainAudio.currentTime = Math.min(mainAudio.duration, mainAudio.currentTime + 10); });

progBar.addEventListener('click', e => {
  const r = progBar.getBoundingClientRect();
  mainAudio.currentTime = ((e.clientX - r.left) / r.width) * mainAudio.duration;
});

volSlider.addEventListener('input', () => { mainAudio.volume = volSlider.value; });

document.addEventListener('keydown', e => {
  if (e.code === 'Space' && f3.classList.contains('active')) {
    e.preventDefault(); playBtn.click();
  }
});

// ════════════════════════════════════════════
//  FRAME 4 — LOVE LETTER REVEAL
// ════════════════════════════════════════════
function goToF4() {
  showFrame(f4);
  // Set date
  const now = new Date();
  f4date.textContent = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  // Stagger reveal
  const items = f4.querySelectorAll('.reveal');
  items.forEach((el, i) => {
    setTimeout(() => el.classList.add('show'), 400 + i * 420);
  });
}

replayBtn.addEventListener('click', () => {
  // Reset everything
  mainAudio.currentTime = 0;
  mainAudio.pause();
  playBtn.textContent = '▶';
  curLineIdx = -1;
  // Reset frame 4 reveals
  f4.querySelectorAll('.reveal').forEach(el => el.classList.remove('show'));
  showFrame(f1);
});
