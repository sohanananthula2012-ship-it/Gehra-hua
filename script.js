// script.js - Interactive Love Letter Experience for Su

document.addEventListener('DOMContentLoaded', () => {
  // Frame navigation
  const frame1 = document.getElementById('frame-1');
  const frame2 = document.getElementById('frame-2');
  const frame3 = document.getElementById('frame-3');
  const enterBtn = document.getElementById('enterBtn');

  let currentFrame = 1;

  function switchFrame(from, to) {
    from.classList.remove('active');
    from.classList.add('fade-out');
    
    setTimeout(() => {
      from.classList.remove('fade-out');
      to.classList.add('active');
      currentFrame = parseInt(to.id.split('-')[1]);
    }, 700);
  }

  enterBtn.addEventListener('click', () => {
    switchFrame(frame1, frame2);
    startTypewriter();
  });

  // ========================
  // FRAME 2 - TYPEWRITER MEMORIES
  // ========================
  const typewriterText = document.getElementById('typewriter-text');
  const memDots = document.getElementById('mem-dots');
  const memories = [
    "Teri muskurahat dekh kar dil ko sukoon milta hai...",
    "Wo raatein jab hum dono baatein karte the, waqt ruk jaata tha.",
    "Tere haath pakad ke chalna, duniya bhool jaana.",
    "Har lamha tere saath, jaise koi sapna sach ho gaya.",
    "Tu hi meri duniya hai, Su. Gehra hua pyaar."
  ];

  function createDots() {
    const dotsHTML = memories.map((_, i) => 
      `<span class="mem-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`
    ).join('');
    memDots.innerHTML = dotsHTML;
  }

  function typeMemory(text, callback) {
    typewriterText.innerHTML = '';
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        typewriterText.innerHTML += text.charAt(i) === '\n' ? '<br>' : text.charAt(i);
        i++;
      } else {
        clearInterval(typeInterval);
        if (callback) callback();
      }
    }, 60);
  }

  function updateDots() {
    const dots = memDots.querySelectorAll('.mem-dot');
    dots.forEach((dot, idx) => {
      dot.classList.remove('active', 'done');
      if (idx < currentMemIndex) dot.classList.add('done');
      if (idx === currentMemIndex) dot.classList.add('active');
    });
  }

  let currentMemIndex = 0;

  function startTypewriter() {
    createDots();
    let memIndex = 0;

    const cycleMemories = () => {
      if (memIndex < memories.length) {
        currentMemIndex = memIndex;
        updateDots();
        
        typeMemory(memories[memIndex], () => {
          setTimeout(() => {
            memIndex++;
            cycleMemories();
          }, 2200);
        });
      } else {
        setTimeout(() => {
          switchFrame(frame2, frame3);
          initMusicPlayer();
        }, 1800);
      }
    };

    cycleMemories();
  }

  // ========================
  // FRAME 3 - MUSIC PLAYER + SRT LYRICS
  // ========================
  const audio = document.getElementById('main-audio');
  const playBtn = document.getElementById('playBtn');
  const progressBar = document.getElementById('progressBar');
  const progressFill = document.getElementById('progressFill');
  const progressThumb = document.getElementById('progressThumb');
  const timeCurrent = document.getElementById('time-current');
  const timeTotal = document.getElementById('time-total');
  const volumeSlider = document.getElementById('volumeSlider');
  const seekBackBtn = document.getElementById('seekBackBtn');
  const seekFwdBtn = document.getElementById('seekFwdBtn');
  const lyricsInner = document.getElementById('lyricsInner');

  let lyrics = []; // Will hold parsed SRT data

  // Side memories
  const leftMemories = [
    "Pehli baar jab dekha tha tujhe ❤️",
    "Teri woh shy smile",
    "Rainy day coffee ☕",
    "Tere jokes pe hasna"
  ];

  const rightMemories = [
    "Tere saath long drives 🚗",
    "Midnight calls 🌙",
    "Tera haath pakadna",
    "Forever with you"
  ];

  function populateSideMemories() {
    const leftContainer = document.getElementById('left-memories');
    const rightContainer = document.getElementById('right-memories');

    leftMemories.forEach(mem => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.innerHTML = `<span class="mem-emoji">💌</span>${mem}`;
      leftContainer.appendChild(card);
    });

    rightMemories.forEach(mem => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.innerHTML = `<span class="mem-emoji">🌹</span>${mem}`;
      rightContainer.appendChild(card);
    });

    setTimeout(() => {
      document.querySelectorAll('.memory-card').forEach((card, i) => {
        setTimeout(() => card.classList.add('visible'), i * 120);
      });
    }, 800);
  }

  // SRT Parser
  function parseSRT(text) {
    const entries = [];
    const blocks = text.trim().split(/\n\s*\n/);
    
    for (let block of blocks) {
      const lines = block.trim().split('\n');
      if (lines.length < 3) continue;

      const timeLine = lines[1];
      const timeMatch = timeLine.match(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/);
      
      if (timeMatch) {
        const startTime = timeToSeconds(timeMatch[1]);
        const textLines = lines.slice(2).join('\n').trim();
        
        entries.push({
          time: startTime,
          text: textLines
        });
      }
    }
    return entries;
  }

  function timeToSeconds(timeStr) {
    const [h, m, s] = timeStr.split(':');
    const [seconds, ms] = s.split(',');
    return parseInt(h)*3600 + parseInt(m)*60 + parseInt(seconds) + parseInt(ms)/1000;
  }

  // Load SRT file
  async function loadLyrics() {
    try {
      const response = await fetch('gehra_hua_lyrics.srt');
      if (!response.ok) throw new Error('SRT not found');
      const srtText = await response.text();
      lyrics = parseSRT(srtText);
      console.log(`✅ Loaded ${lyrics.length} subtitle entries`);
    } catch (e) {
      console.warn('⚠️ SRT file not found, using fallback lyrics');
      lyrics = [
        { time: 0, text: "♪ gaana shuru karo..." },
        { time: 12, text: "Tu agar meri, yeh hawayein teri" },
        { time: 22, text: "Tu agar meri, saari raahein teri" },
        { time: 32, text: "Tu agar meri, main hoon tera" },
        { time: 42, text: "Tu agar meri, yeh ujaale tere" },
        { time: 52, text: "Tu agar meri, dil hawale tere" },
        { time: 62, text: "Tu agar meri, main hoon tera" },
        { time: 78, text: "Betaab sa mohabbat ka tu inqalaab hai" },
        { time: 90, text: "Mera jahan teri baahon mein khwaab khwaab hai" },
        { time: 105, text: "Gehra hua... gehra hua" },
        { time: 115, text: "Rang aashiqi gehra hua" },
        { time: 125, text: "Gehra hua... gehra hua" },
        { time: 135, text: "Dariya dua gehra hua" },
        { time: 148, text: "Tera hua..." }
      ];
    }
  }

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }

  function updateProgress() {
    if (!audio.duration) return;
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${progressPercent}%`;
    progressThumb.style.left = `${progressPercent}%`;
    timeCurrent.textContent = formatTime(audio.currentTime);
  }

  function updateLyrics(currentTime) {
    if (lyrics.length === 0) return;

    let currentLyric = lyrics[0];
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= lyrics[i].time) {
        currentLyric = lyrics[i];
        break;
      }
    }

    lyricsInner.innerHTML = `<p class="lyric-line active">${currentLyric.text}</p>`;
  }

  async function initMusicPlayer() {
    await loadLyrics();
    populateSideMemories();

    audio.addEventListener('timeupdate', () => {
      updateProgress();
      updateLyrics(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
      timeTotal.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('ended', () => {
      playBtn.innerHTML = '▶';
    });

    // Play/Pause
    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        playBtn.innerHTML = '❚❚';
      } else {
        audio.pause();
        playBtn.innerHTML = '▶';
      }
    });

    // Progress seek
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audio.currentTime = pos * audio.duration;
    });

    volumeSlider.addEventListener('input', () => {
      audio.volume = parseFloat(volumeSlider.value);
    });

    seekBackBtn.addEventListener('click', () => {
      audio.currentTime = Math.max(0, audio.currentTime - 10);
    });

    seekFwdBtn.addEventListener('click', () => {
      audio.currentTime = Math.min(audio.duration || 999, audio.currentTime + 10);
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (currentFrame !== 3) return;
      if (e.code === 'Space') {
        e.preventDefault();
        playBtn.click();
      }
      if (e.code === 'ArrowRight') audio.currentTime += 5;
      if (e.code === 'ArrowLeft') audio.currentTime -= 5;
    });

    // Auto-play
    setTimeout(() => {
      audio.play().catch(() => {});
    }, 800);
  }

  // Touch drag support for progress bar
  let isDragging = false;
  progressBar.addEventListener('mousedown', () => { isDragging = true; });
  document.addEventListener('mouseup', () => { isDragging = false; });
  progressBar.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const rect = progressBar.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pos * audio.duration;
  });

  console.log('%c❤️ Gehra Hua • For Su ❤️', 'color:#f2a0b0; font-family:Caveat; font-size:18px');
});
