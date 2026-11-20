/* ==========================================================================
   MAISHA'S BIRTHDAY CELEBRATION — INTERACTIVE PARTY ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initConfettiSystem();
  initAudioControls();
  initHeroExperience();
  initCakeCutting();
  initFunnyQuotes();
  initPhotoLightbox();
  initFriendshipFunZone();
  initFinalGiftSurprise();
});

/* --------------------------------------------------------------------------
   1. SMOOTH SCROLL REVEAL ON VIEWPORT ENTRY
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-up');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   2. CUSTOM CONFETTI PARTICLE ENGINE (CANVAS)
   -------------------------------------------------------------------------- */
let confettiParticles = [];
let confettiAnimationId = null;

function initConfettiSystem() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const colors = ['#ff6b9d', '#a855f7', '#fbbf24', '#38bdf8', '#ff9e7d', '#34d399'];

  window.launchConfetti = function (amount = 110, originX = window.innerWidth / 2, originY = window.innerHeight * 0.45) {
    for (let i = 0; i < amount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 4 + Math.random() * 10;
      confettiParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 4,
        size: 6 + Math.random() * 7,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.25 + Math.random() * 0.1,
        drag: 0.98,
        alpha: 1,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      });
    }

    if (!confettiAnimationId) {
      animateConfetti();
    }
  };

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiParticles.forEach((p, index) => {
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.alpha -= 0.008;

      if (p.alpha <= 0 || p.y > canvas.height + 30) {
        confettiParticles.splice(index, 1);
        return;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    if (confettiParticles.length > 0) {
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
      confettiAnimationId = null;
    }
  }
}

/* --------------------------------------------------------------------------
   3. SOUND EFFECTS (WEB AUDIO API) & OPTIONAL BACKGROUND MUSIC
   -------------------------------------------------------------------------- */
let sfxEnabled = true;
let musicPlaying = false;

function initAudioControls() {
  const musicToggle = document.getElementById('music-toggle');
  const musicIcon = document.getElementById('music-icon');
  const musicLabel = document.getElementById('music-label');
  const bgMusic = document.getElementById('bg-music');

  const sfxToggle = document.getElementById('sfx-toggle');
  const sfxIcon = document.getElementById('sfx-icon');
  const sfxLabel = document.getElementById('sfx-label');

  // Safe background music toggle (never breaks if mp3 is missing)
  musicToggle.addEventListener('click', async () => {
    if (!musicPlaying) {
      try {
        await bgMusic.play();
        musicPlaying = true;
        musicIcon.textContent = '🎶';
        musicLabel.textContent = 'Music: On';
      } catch (err) {
        // Fallback if local audio file isn't added yet
        musicLabel.textContent = 'No MP3 Found';
        setTimeout(() => {
          musicLabel.textContent = 'Music: Off';
        }, 2000);
      }
    } else {
      bgMusic.pause();
      musicPlaying = false;
      musicIcon.textContent = '🎵';
      musicLabel.textContent = 'Music: Off';
    }
  });

  // Toggle synthesized party sound effects
  sfxToggle.addEventListener('click', () => {
    sfxEnabled = !sfxEnabled;
    sfxIcon.textContent = sfxEnabled ? '🔊' : '🔇';
    sfxLabel.textContent = sfxEnabled ? 'SFX: On' : 'SFX: Off';
  });
}

// Lightweight Web Audio API party chime (no external audio files needed)
function playPartyChime(type = 'pop') {
  if (!sfxEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const notes = type === 'celebrate' ? [523.25, 659.25, 783.99, 1046.5] : [587.33, 880];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.12, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.36);
    });
  } catch (e) {
    // Ignore if browser blocks audio context
  }
}

/* --------------------------------------------------------------------------
   4. HERO SECTION — START THE PARTY BUTTON
   -------------------------------------------------------------------------- */
function initHeroExperience() {
  const startBtn = document.getElementById('start-party-btn');
  const cakeSection = document.getElementById('cake-section');

  startBtn.addEventListener('click', (e) => {
    const rect = e.target.getBoundingClientRect();
    launchConfetti(140, rect.left + rect.width / 2, rect.top);
    playPartyChime('celebrate');

    setTimeout(() => {
      cakeSection.scrollIntoView({ behavior: 'smooth' });
    }, 350);
  });
}

/* --------------------------------------------------------------------------
   5. BIRTHDAY CAKE CUTTING CELEBRATION 🎂
   -------------------------------------------------------------------------- */
function initCakeCutting() {
  const cutBtn = document.getElementById('cut-cake-btn');
  const cakeContainer = document.getElementById('interactive-cake');
  const flames = document.querySelectorAll('.flame');
  const revealCard = document.getElementById('cake-reveal-card');
  const cakeSky = document.getElementById('cake-celebration-sky');
  const cakeInstruction = document.getElementById('cake-instruction');

  let isCut = false;

  cutBtn.addEventListener('click', () => {
    if (isCut) {
      // Allow re-triggering celebratory confetti if clicked again
      launchConfetti(130);
      playPartyChime('celebrate');
      spawnFloatingCakeDecor(cakeSky);
      return;
    }

    isCut = true;
    cutBtn.disabled = true;
    cutBtn.textContent = 'SLICING CAKE... 🔪✨';
    playPartyChime('celebrate');

    // Step 1: Knife slicing animation
    cakeContainer.classList.add('cutting');

    // Step 2: Extinguish candle flames & split cake into two halves
    setTimeout(() => {
      flames.forEach((flame) => flame.classList.add('extinguished'));
      cakeContainer.classList.add('cut');

      // Step 3: Massive confetti explosion + floating balloons/stars
      const rect = cakeContainer.getBoundingClientRect();
      launchConfetti(180, rect.left + rect.width / 2, rect.top + rect.height / 2);
      spawnFloatingCakeDecor(cakeSky);
    }, 550);

    // Step 4: Reveal funny celebration message & heartfelt birthday wish
    setTimeout(() => {
      revealCard.classList.remove('hidden');
      cakeInstruction.textContent = 'Woohoo! Happy Birthday Maisha!! 🎉🎂';
      cutBtn.disabled = false;
      cutBtn.textContent = 'CELEBRATE AGAIN 🎉';
    }, 1050);
  });
}

function spawnFloatingCakeDecor(container) {
  const emojis = ['🎈', '⭐', '✨', '🎀', '💖', '🎂', '🥳'];
  for (let i = 0; i < 16; i++) {
    const item = document.createElement('span');
    item.className = 'sky-floater';
    item.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    item.style.left = `${8 + Math.random() * 84}%`;
    item.style.animationDelay = `${Math.random() * 0.7}s`;
    container.appendChild(item);

    setTimeout(() => item.remove(), 4200);
  }
}

/* --------------------------------------------------------------------------
   6. FUNNY BIRTHDAY QUOTES (NO-REPEAT CYCLE) 😂
   -------------------------------------------------------------------------- */
function initFunnyQuotes() {
  const quotes = [
    {
      text: "Congratulations! You're now one year closer to becoming a professional adult. Still not qualified though. 😂",
      emoji: "😂",
      theme: "theme-pink"
    },
    {
      text: "Today's official rule: Maisha is always right. Even when she is obviously wrong.",
      emoji: "👑",
      theme: "theme-lilac"
    },
    {
      text: "Calories don't count on birthdays. Neither do responsibilities.",
      emoji: "🍰",
      theme: "theme-yellow"
    },
    {
      text: "Growing older is mandatory. Growing up is completely optional.",
      emoji: "🧸",
      theme: "theme-sky"
    },
    {
      text: "Your birthday is the only day when everyone pretends your dramatic behavior is adorable.",
      emoji: "🎭",
      theme: "theme-pink"
    },
    {
      text: "May your WiFi be strong, your phone battery stay at 100%, and your problems forget your address.",
      emoji: "🔋",
      theme: "theme-lilac"
    }
  ];

  const quoteCard = document.getElementById('quote-card');
  const quoteText = document.getElementById('quote-text');
  const quoteEmoji = document.getElementById('quote-emoji');
  const quoteCounter = document.getElementById('quote-counter');
  const nextQuoteBtn = document.getElementById('next-quote-btn');

  // Track unseen indices so quotes never repeat until all have been shown
  let remainingIndices = [1, 2, 3, 4, 5]; // Index 0 is shown initially
  let lastShownIndex = 0;

  nextQuoteBtn.addEventListener('click', () => {
    if (remainingIndices.length === 0) {
      // Refill pool excluding the currently displayed quote
      remainingIndices = quotes
        .map((_, idx) => idx)
        .filter((idx) => idx !== lastShownIndex);
    }

    const randomPick = Math.floor(Math.random() * remainingIndices.length);
    const nextIndex = remainingIndices.splice(randomPick, 1)[0];
    lastShownIndex = nextIndex;

    const selected = quotes[nextIndex];
    playPartyChime('pop');

    quoteCard.classList.add('swap-out');
    setTimeout(() => {
      quoteCard.className = `quote-card ${selected.theme}`;
      quoteText.textContent = `"${selected.text}"`;
      quoteEmoji.textContent = selected.emoji;
      quoteCounter.textContent = `Fact #${nextIndex + 1} of ${quotes.length}`;
      quoteCard.classList.remove('swap-out');
    }, 220);
  });
}

/* --------------------------------------------------------------------------
   7. FOUR PHOTO MEMORY GALLERY & LIGHTBOX 📸
   -------------------------------------------------------------------------- */
const galleryMemories = [
  { src: 'photos/photo1.jpg', caption: 'Main character energy ✨' },
  { src: 'photos/photo2.jpg', caption: 'Certified chaos.' },
  { src: 'photos/photo3.jpg', caption: 'A moment worth keeping.' },
  { src: 'photos/photo4.jpg', caption: 'Just Maisha being Maisha.' }
];

// Graceful placeholder if local photo files are not yet placed in /photos
window.handleImageError = function (imgEl, title, hint) {
  const placeholder = document.createElement('div');
  placeholder.className = 'photo-placeholder';
  placeholder.innerHTML = `<span>📸</span><strong>${title}</strong><small>${hint}</small>`;
  imgEl.replaceWith(placeholder);
};

function initPhotoLightbox() {
  const photoCards = document.querySelectorAll('.photo-card');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxView();
    lightbox.classList.remove('hidden');
    playPartyChime('pop');
  }

  function updateLightboxView() {
    const item = galleryMemories[currentIndex];
    lightboxImg.src = item.src;
    lightboxCaption.textContent = item.caption;
  }

  photoCards.forEach((card) => {
    card.addEventListener('click', () => {
      const idx = Number(card.dataset.index);
      openLightbox(idx);
    });
  });

  closeBtn.addEventListener('click', () => lightbox.classList.add('hidden'));

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + galleryMemories.length) % galleryMemories.length;
    updateLightboxView();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % galleryMemories.length;
    updateLightboxView();
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.add('hidden');
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') lightbox.classList.add('hidden');
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });
}

/* --------------------------------------------------------------------------
   8. FRIENDSHIP FUN ZONE 🎮
   -------------------------------------------------------------------------- */
function initFriendshipFunZone() {
  // A. Random Compliment Generator
  const compliments = [
    "Your smile has its own fan club.",
    "You're 50% sunshine and 50% trouble.",
    "You deserve a standing ovation for simply being yourself.",
    "Your energy is rare. Your chaos is legendary.",
    "Honestly, life would be 10x more boring without you.",
    "10/10 bestie, would definitely celebrate every year."
  ];
  const complimentBtn = document.getElementById('compliment-btn');
  const complimentBox = document.getElementById('compliment-box');
  let lastComplimentIdx = 0;

  complimentBtn.addEventListener('click', () => {
    let idx;
    do {
      idx = Math.floor(Math.random() * compliments.length);
    } while (idx === lastComplimentIdx);
    lastComplimentIdx = idx;

    complimentBox.textContent = `"${compliments[idx]}"`;
    triggerPopAnimation(complimentBox);
    playPartyChime('pop');
  });

  // B. Birthday Mood Buttons
  const moodMessages = {
    cute: "🎀 Cute Mode Activated: Too adorable to handle. Handle with extra compliments and gifts!",
    sleepy: "😴 Sleepy Queen Alert: Nap first, party second. You've earned horizontal time.",
    dramatic: "🎭 Oscar-Worthy Performance: And the award for Best Dramatic Entrance goes to... MAISHA!",
    hungry: "🍕 Emergency Snack Protocol: Feed the birthday girl immediately before the sass levels peak!"
  };

  const moodButtons = document.querySelectorAll('.mood-btn');
  const moodResponse = document.getElementById('mood-response');

  moodButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      moodButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const mood = btn.dataset.mood;
      moodResponse.textContent = moodMessages[mood];
      triggerPopAnimation(moodResponse);
      playPartyChime('pop');
    });
  });

  // C. Secret Button
  const secretBtn = document.getElementById('secret-btn');
  const secretReveal = document.getElementById('secret-reveal');

  secretBtn.addEventListener('click', (e) => {
    secretReveal.classList.remove('hidden');
    triggerPopAnimation(secretReveal);
    const rect = e.target.getBoundingClientRect();
    launchConfetti(65, rect.left + rect.width / 2, rect.top);
    playPartyChime('celebrate');
  });
}

function triggerPopAnimation(el) {
  el.classList.remove('pop-anim');
  void el.offsetWidth; // Force reflow
  el.classList.add('pop-anim');
}

/* --------------------------------------------------------------------------
   9. FINAL SURPRISE GIFT BOX 🎁
   -------------------------------------------------------------------------- */
function initFinalGiftSurprise() {
  const giftBox = document.getElementById('gift-box');
  const finalCard = document.getElementById('final-surprise-card');
  const giftHint = document.getElementById('gift-hint');
  let opened = false;

  giftBox.addEventListener('click', () => {
    const rect = giftBox.getBoundingClientRect();
    launchConfetti(180, rect.left + rect.width / 2, rect.top + 40);
    playPartyChime('celebrate');

    if (!opened) {
      opened = true;
      giftBox.classList.add('opened');
      giftHint.textContent = 'Surprise unlocked! Happy Birthday Maisha! 🎀✨';
      setTimeout(() => {
        finalCard.classList.remove('hidden');
      }, 450);
    }
  });
}
