// ═══════════════════════════════════════════════════
//  GEHRA HUA — Personal Page Logic
// ═══════════════════════════════════════════════════

// ---------- ELEMENTS ----------
const frame1 = document.getElementById('frame-1');
const frame2 = document.getElementById('frame-2');
const frame3 = document.getElementById('frame-3');

const enterBtn   = document.getElementById('enterBtn');
const typewriterText = document.getElementById('typewriter-text');
const memDots    = document.getElementById('mem-dots');
const snippetAudio = document.getElementById('snippet-audio');

const mainAudio  = document.getElementById('main-audio');
const playBtn    = document.getElementById('playBtn');
const seekBackBtn= document.getElementById('seekBackBtn');
const seekFwdBtn = document.getElementById('seekFwdBtn');
const progressBar   = document.getElementById('progressBar');
const progressFill  = document.getElementById('progressFill');
const progressThumb = document.getElementById('progressThumb');
const timeCurrent = document.getElementById('time-current');
const timeTotal   = document.getElementById('time-total');
const volumeSlider = document.getElementById('volumeSlider');
const lyricsInner = document.getElementById('lyricsInner');
const leftMemEl  = document.getElementById('left-memories');
const rightMemEl = document.getElementById('right-memories');


// ═══════════════════════════════════════════════════
//  MEMORIES — TYPEWRITER (Frame 2)
//  Edit these freely — short lines, pause, next line.
// ═══════════════════════════════════════════════════
const memories = [
  "Yaad hai... pehli baar jab humne baat ki thi?",
  "Wo raat, wo hasi, wo bewajah ki batein...",
  "Tab nahi pata tha ki tu itni khaas ho jayegi.",
  "Har gaana ab thoda sa tera lagta hai.",
  "Aur ye gaana... ye sirf tere liye hai, Cutie.",
];

let memIndex = 0;
let charIndex = 0;
const TYPE_SPEED = 45;      // ms per character
const LINE_PAUSE = 1400;    // pause after a line finishes

// Build progress dots
memories.forEach((_, i) => {
  const dot = document.createElement('span');
  dot.className = 'mem-dot';
  dot.id = `dot-${i}`;
  memDots.appendChild(dot);
});

function typeNextChar() {
  if (memIndex >= memories.length) {
    // All memories done — move to Frame 3
    setTimeout(() => goToFrame(frame3), 1200);
    return;
  }

  const currentDot = document.getElementById(`dot-${memIndex}`);
  currentDot.classList.add('active');

  const line = memories[memIndex];

  if (charIndex < line.length) {
    typewriterText.textContent = line.substring(0, charIndex + 1);
    charIndex++;
    setTimeout(typeNextChar, TYPE_SPEED);
  } else {
    // Line done
    currentDot.classList.remove('active');
    currentDot.classList.add('done');
    memIndex++;
    charIndex = 0;
    setTimeout(() => {
      typewriterText.textContent = '';
      typeNextChar();
    }, LINE_PAUSE);
  }
}


// ═══════════════════════════════════════════════════
//  FRAME TRANSITIONS
// ═══════════════════════════════════════════════════
function goToFrame(target) {
  document.querySelectorAll('.frame').forEach(f => {
    if (f !== target) f.classList.remove('active');
  });
  setTimeout(() => target.classList.add('active'), 50);
}

enterBtn.addEventListener('click', () => {
  goToFrame(frame2);

  // Start looping snippet (2-10s window of the song)
  snippetAudio.currentTime = 2;
  snippetAudio.volume = 0.35;
  const playPromise = snippetAudio.play();
  if (playPromise) playPromise.catch(() => {});

  snippetAudio.addEventListener('timeupdate', () => {
    if (snippetAudio.currentTime >= 10) {
      snippetAudio.currentTime = 2;
    }
  });

  // Start typewriter
  setTimeout(typeNextChar, 600);
});

// When entering Frame 3, stop the snippet loop
function enterFrame3() {
  snippetAudio.pause();
  snippetAudio.currentTime = 0;
}

// Watch for frame3 becoming active
const observer = new MutationObserver(() => {
  if (frame3.classList.contains('active')) {
    enterFrame3();
  }
});
observer.observe(frame3, { attributes: true, attributeFilter: ['class'] });


// ═══════════════════════════════════════════════════
//  SRT PARSING
// ═══════════════════════════════════════════════════
function srtTimeToSeconds(t) {
  const [h, m, sRest] = t.split(':');
  const [s, ms] = sRest.split(',');
  return (+h) * 3600 + (+m) * 60 + (+s) + (+ms) / 1000;
}

function parseSRT(raw) {
  const blocks = raw.trim().split(/\n\s*\n/);
  return blocks.map(block => {
    const lines = block.split('\n').filter(l => l.trim() !== '');
    const timeLine = lines.find(l => l.includes('-->'));
    const [start, end] = timeLine.split('-->').map(t => srtTimeToSeconds(t.trim()));
    const textLines = lines.slice(lines.indexOf(timeLine) + 1);
    return { start, end, text: textLines.join(' ') };
  });
}


// ═══════════════════════════════════════════════════
//  ENGLISH TRANSLATIONS (aligned to SRT lines)
//  index matches the line number in the SRT (0-based)
// ═══════════════════════════════════════════════════
const translations = [
  "If you become mine, these winds are yours",
  "If you become mine, every path is yours",
  "If you become mine, I am yours",
  "If you become mine, this light is yours",
  "If you become mine, this heart is entrusted to you",
  "If you become mine, I am yours",
  "You're love's restless revolution",
  "My whole world is a dream in your arms",
  "Deeper, deeper",
  "the color of love has deepened",
  "Deeper, deeper",
  "the river of prayers has deepened",
  "I have become yours",
  "If you become mine, these winds are yours",
  "If you become mine, every path is yours",
  "If you become mine, I am yours",
  "The sky blinks in wonder",
  "you're the life of a million angels",
  "They ask me, 'where does she live?'",
  "I tell them — she lives in my arms",
  "The sky blinks in wonder",
  "where has it seen someone like you?",
  "There's light wherever you are",
  "to stay in your arms — that's my only prayer",
  "If you become mine, your story is mine",
  "if you become mine, the whole world is mine",
  "If you become mine, I am yours",
  "You're love's restless revolution",
  "My whole world is a dream in your arms",
  "Deeper, deeper",
  "the color of love has deepened",
  "Deeper, deeper",
  "the river of prayers has deepened",
  "I have to burn in your love too",
  "and be careful around you too",
  "I have to change some of my colors too",
  "I'll always mold into your colors",
  "You're a moon that beats like a heart",
  "secretly, only looking at me",
  "shining, held close to my chest",
  "you became the only path to my heaven",
  "If you become mine, these winds are yours",
  "If you become mine, every path is yours",
  "If you become mine, I am yours",
  "You're love's restless revolution",
  "My whole world is a dream in your arms",
  "Deeper, deeper",
  "the color of love has deepened",
  "Deeper, deeper — the river of prayers has deepened",
];


// ═══════════════════════════════════════════════════
//  PERSONAL MESSAGES — tied to specific lyric lines
//  key = SRT line index (0-based), value = your note
// ═══════════════════════════════════════════════════
const lyricMessages = {
  2:  "...waise hi jaise main hoon tera, Cutie.",
  9:  "har din thoda aur gehra hota hai ye ehsaas.",
  19: "tu poochegi kahaan rehti hoon? bata dena — yahin, mere paas.",
  29: "khwaab nahi, sach hai ye.",
  40: "tu chaand hai, aur main bas tujhe dekhta reh jaata hoon.",
};


// ═══════════════════════════════════════════════════
//  SIDE MEMORIES (cursive, fades in/out, left of player)
//  Right side = translation list (built dynamically)
// ═══════════════════════════════════════════════════
const sideMemories = [
  "wo pehli call, 3 ghante ki, aur lagta tha 3 minute hue hain.",
  "tera hasna... sabse pyaara sound hai duniya ka.",
  "tu door hai, par har gaane mein tu hi sunayi deti hai.",
  "kabhi kabhi sochta hoon, kitna lucky hoon main.",
  "tera naam aate hi, sab kuch thoda sa better lagta hai.",
  "ye gaana sunte hue, tu yaad aati hai — har baar.",
];

let lastSideMemoryIndex = -1;
let sideMemoryTimer = null;

function showSideMemory() {
  let idx;
  do {
    idx = Math.floor(Math.random() * sideMemories.length);
  } while (idx === lastSideMemoryIndex && sideMemories.length > 1);
  lastSideMemoryIndex = idx;

  leftMemEl.innerHTML = `<p class="side-memory-text">${sideMemories[idx]}</p>`;
  const el = leftMemEl.querySelector('.side-memory-text');
  requestAnimationFrame(() => el.classList.add('visible'));

  // Hide after a while, then show another
  sideMemoryTimer = setTimeout(() => {
    el.classList.remove('visible');
    setTimeout(() => {
      if (!mainAudio.paused) showSideMemory();
    }, 1000);
  }, 7000);
}


// ═══════════════════════════════════════════════════
//  LYRICS + TRANSLATIONS SYNC
// ═══════════════════════════════════════════════════
let lyricsData = [];

fetch('gehra_hua_lyrics.srt')
  .then(res => res.text())
  .then(raw => {
    lyricsData = parseSRT(raw);
    buildLyricsDOM();
    buildTranslationsDOM();
  })
  .catch(() => {
    lyricsInner.innerHTML = '<p class="lyric-line active">गाना शुरू करो...</p>';
  });

function buildLyricsDOM() {
  lyricsInner.innerHTML = '';
  lyricsData.forEach((line, i) => {
    const p = document.createElement('p');
    p.className = 'lyric-line';
    p.dataset.index = i;
    p.textContent = line.text;
    lyricsInner.appendChild(p);

    // Personal message under this line, if any
    if (lyricMessages[i]) {
      const note = document.createElement('p');
      note.className = 'lyric-note';
      note.dataset.index = i;
      note.textContent = '✦ ' + lyricMessages[i];
      lyricsInner.appendChild(note);
    }
  });
}

function buildTranslationsDOM() {
  rightMemEl.innerHTML = '';
  translations.forEach((line, i) => {
    const p = document.createElement('p');
    p.className = 'translation-line';
    p.dataset.index = i;
    p.textContent = line;
    rightMemEl.appendChild(p);
  });
}

let currentLineIndex = -1;

function updateLyrics(currentTime) {
  const idx = lyricsData.findIndex(l => currentTime >= l.start && currentTime < l.end);
  if (idx === currentLineIndex) return;
  currentLineIndex = idx;

  // Update left lyrics (Hinglish) + show/hide personal notes
  document.querySelectorAll('.lyric-line').forEach(el => {
    const i = +el.dataset.index;
    el.classList.remove('active', 'prev', 'next');
    if (i === idx) el.classList.add('active');
    else if (i === idx - 1) el.classList.add('prev');
    else if (i === idx + 1) el.classList.add('next');
  });

  document.querySelectorAll('.lyric-note').forEach(el => {
    const i = +el.dataset.index;
    el.classList.toggle('visible', i === idx);
  });

  // Scroll active lyric into view (center)
  const activeLyric = lyricsInner.querySelector('.lyric-line.active');
  if (activeLyric) {
    activeLyric.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  // Update right translation list — glow current
  document.querySelectorAll('.translation-line').forEach(el => {
    const i = +el.dataset.index;
    el.classList.toggle('active', i === idx);
    if (i === idx) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  });
}


// ═══════════════════════════════════════════════════
//  AUDIO PLAYER CONTROLS
// ═══════════════════════════════════════════════════
function formatTime(sec) {
  if (isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

mainAudio.addEventListener('loadedmetadata', () => {
  timeTotal.textContent = formatTime(mainAudio.duration);
});

playBtn.addEventListener('click', () => {
  if (mainAudio.paused) {
    mainAudio.play();
    playBtn.textContent = '❚❚';
    showSideMemory();
  } else {
    mainAudio.pause();
    playBtn.textContent = '▶';
    clearTimeout(sideMemoryTimer);
  }
});

mainAudio.addEventListener('timeupdate', () => {
  const pct = (mainAudio.currentTime / mainAudio.duration) * 100 || 0;
  progressFill.style.width = pct + '%';
  progressThumb.style.left = pct + '%';
  timeCurrent.textContent = formatTime(mainAudio.currentTime);
  updateLyrics(mainAudio.currentTime);
});

mainAudio.addEventListener('ended', () => {
  playBtn.textContent = '▶';
  clearTimeout(sideMemoryTimer);
});

progressBar.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const ratio = (e.clientX - rect.left) / rect.width;
  mainAudio.currentTime = ratio * mainAudio.duration;
});

seekBackBtn.addEventListener('click', () => {
  mainAudio.currentTime = Math.max(0, mainAudio.currentTime - 10);
});

seekFwdBtn.addEventListener('click', () => {
  mainAudio.currentTime = Math.min(mainAudio.duration, mainAudio.currentTime + 10);
});

volumeSlider.addEventListener('input', () => {
  mainAudio.volume = volumeSlider.value;
});

// Spacebar play/pause (only when Frame 3 active)
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && frame3.classList.contains('active')) {
    e.preventDefault();
    playBtn.click();
  }
});
