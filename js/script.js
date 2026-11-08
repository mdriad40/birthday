/**
 * ========================================================
 * MASTER JAVASCRIPT: A DREAMY BIRTHDAY CELEBRATION
 * Dedicated to: Umme Habiba Mim
 * Created with love by: Mohammed Riad Hasan
 * Pure Vanilla JavaScript (ES6+)
 * ========================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ========================================================
     0. LIVE BIRTHDAY COUNTDOWN CONTROLLER
     (Only runs if birthdayDate is set. Never invents date!)
     ======================================================== */
  const BIRTHDAY_CONFIG = {
    // 9 November is Habiba's Birthday (Born 2004)
    birthdayDate: "2026-11-09T00:00:00",
  };

  const countdownContainer = document.getElementById('countdownContainer');
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMinutes = document.getElementById('cdMinutes');
  const cdSeconds = document.getElementById('cdSeconds');

  if (countdownContainer && BIRTHDAY_CONFIG.birthdayDate) {
    const targetTime = new Date(BIRTHDAY_CONFIG.birthdayDate).getTime();

    if (!isNaN(targetTime)) {
      countdownContainer.classList.remove('hidden');

      const updateCountdown = () => {
        const now = Date.now();
        const diff = targetTime - now;

        if (diff <= 0) {
          countdownContainer.innerHTML = '<div class="countdown-heading">🎉 শুভ জন্মদিন, উম্মে হাবিবা মিম! ❤️</div>';
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
        if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
        if (cdMinutes) cdMinutes.textContent = String(minutes).padStart(2, '0');
        if (cdSeconds) cdSeconds.textContent = String(seconds).padStart(2, '0');
      };

      updateCountdown();
      setInterval(updateCountdown, 1000);
    }
  }

  /* ========================================================
     1. AUDIO SYSTEM & SOUND EFFECTS (Web Audio API Synthesizer)
     ======================================================== */
  class SoundController {
    constructor() {
      this.audio = document.getElementById('birthdayAudio');
      this.ctx = null;
      this.isPlaying = false;
      this.isMuted = false;
      this.synthInterval = null;
      this.hasLocalAudio = false;

      this.initElements();
      this.checkLocalAudio();
    }

    initElements() {
      this.btnPlay = document.getElementById('btnPlayPause');
      this.playIcon = document.getElementById('playIcon');
      this.btnMute = document.getElementById('btnMuteToggle');
      this.volumeIcon = document.getElementById('volumeIcon');
      this.disc = document.getElementById('playerDisc');
      this.progressFill = document.getElementById('progressFill');
      this.progressContainer = document.getElementById('progressBarContainer');

      if (this.btnPlay) {
        this.btnPlay.addEventListener('click', () => this.togglePlay());
      }
      if (this.btnMute) {
        this.btnMute.addEventListener('click', () => this.toggleMute());
      }
      if (this.audio) {
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => {
          this.isPlaying = false;
          this.updateUI();
        });
      }
      if (this.progressContainer) {
        this.progressContainer.addEventListener('click', (e) => this.seek(e));
      }
    }

    getAudioContext() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    }

    checkLocalAudio() {
      if (!this.audio) return;
      this.audio.addEventListener('canplaythrough', () => {
        this.hasLocalAudio = true;
      });
      this.audio.addEventListener('error', () => {
        this.hasLocalAudio = false;
      });
    }

    // Play a procedurally generated soft romantic chime / lullaby note
    playSynthNote(freq, duration = 1.2, type = 'sine') {
      if (this.isMuted) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    }

    // Soft procedural music loop if local MP3 is not added yet
    startProceduralMelody() {
      if (this.synthInterval) return;
      // Romantic pentatonic frequencies (G4, A4, B4, D5, E5, G5)
      const melodyNotes = [392.00, 440.00, 493.88, 587.33, 659.25, 587.33, 493.88, 440.00];
      let step = 0;

      this.synthInterval = setInterval(() => {
        if (!this.isPlaying) return;
        const note = melodyNotes[step % melodyNotes.length];
        this.playSynthNote(note, 1.4, 'triangle');
        step++;
      }, 750);
    }

    stopProceduralMelody() {
      if (this.synthInterval) {
        clearInterval(this.synthInterval);
        this.synthInterval = null;
      }
    }

    // Sound effect for candle blow / pop
    playPopSound() {
      if (this.isMuted) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    }

    // Sound effect for gift box opening / magic chime
    playChimeSound() {
      if (this.isMuted) return;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        setTimeout(() => this.playSynthNote(freq, 0.8, 'sine'), idx * 90);
      });
    }

    togglePlay() {
      this.getAudioContext();
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    }

    play() {
      this.isPlaying = true;
      this.updateUI();

      if (this.audio && this.hasLocalAudio) {
        this.audio.play().catch(() => {
          this.startProceduralMelody();
        });
      } else {
        this.startProceduralMelody();
      }
    }

    pause() {
      this.isPlaying = false;
      this.updateUI();
      if (this.audio) this.audio.pause();
      this.stopProceduralMelody();
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.audio) this.audio.muted = this.isMuted;
      if (this.volumeIcon) {
        this.volumeIcon.textContent = this.isMuted ? '🔇' : '🔊';
      }
    }

    updateUI() {
      if (this.playIcon) {
        this.playIcon.textContent = this.isPlaying ? '❚❚' : '▶';
      }
      if (this.disc) {
        if (this.isPlaying) {
          this.disc.classList.add('playing');
        } else {
          this.disc.classList.remove('playing');
        }
      }
    }

    updateProgress() {
      if (!this.audio || !this.progressFill || !this.audio.duration) return;
      const pct = (this.audio.currentTime / this.audio.duration) * 100;
      this.progressFill.style.width = `${pct}%`;
    }

    seek(e) {
      if (!this.audio || !this.audio.duration) return;
      const rect = this.progressContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = clickX / rect.width;
      this.audio.currentTime = pct * this.audio.duration;
    }
  }

  const sound = new SoundController();


  /* ========================================================
     2. FULLSCREEN CONFETTI CANNON ENGINE
     ======================================================== */
  class ConfettiEngine {
    constructor() {
      this.canvas = document.getElementById('confettiCanvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.animId = null;

      this.colors = ['#FFF0F3', '#F8DDE5', '#FFF8EF', '#EDE7F6', '#E7F0E8', '#C58B83', '#A85C73', '#E5A93B'];

      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    burst(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 80) {
      if (!this.canvas) return;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          size: Math.random() * 8 + 5,
          color: this.colors[Math.floor(Math.random() * this.colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          opacity: 1,
          gravity: 0.22,
          drag: 0.96
        });
      }

      if (!this.animId) {
        this.render();
      }
    }

    render() {
      if (!this.ctx || !this.canvas) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.009;

        if (p.opacity <= 0 || p.y > this.canvas.height + 50) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = Math.max(0, p.opacity);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
        this.ctx.restore();
      }

      if (this.particles.length > 0) {
        this.animId = requestAnimationFrame(() => this.render());
      } else {
        this.animId = null;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }

  const confetti = new ConfettiEngine();


  /* ========================================================
     3. PRE-LOADER & "DO YOU LOVE ME?" EXPERIENCE
     ======================================================== */
  const preloader = document.getElementById('preloader');
  const loadingProgress = document.getElementById('loadingProgress');
  const welcomeOverlay = document.getElementById('welcomeOverlay');
  const welcomeCard = document.getElementById('welcomeCard');
  const welcomeHeading = document.getElementById('welcomeTitle');
  const welcomeMessage = document.getElementById('welcomeMessage');
  const loveButtonsArea = document.getElementById('loveButtonsArea');
  const btnSayYes = document.getElementById('btnSayYes');
  const btnSayNo = document.getElementById('btnSayNo');
  const loveSuccessMsg = document.getElementById('loveSuccessMsg');

  let progressVal = 0;
  const loadInterval = setInterval(() => {
    progressVal += Math.floor(Math.random() * 25) + 10;
    if (progressVal >= 100) {
      progressVal = 100;
      clearInterval(loadInterval);

      setTimeout(() => {
        if (preloader) {
          preloader.classList.add('fade-out');
        }
        if (welcomeOverlay) {
          welcomeOverlay.classList.add('active');
        }
      }, 400);
    }
    if (loadingProgress) {
      loadingProgress.style.width = `${progressVal}%`;
    }
  }, 120);

  // Playful Slippery Runaway "No" Button Logic (Smooth, Playful & Bounded)
  let isDodging = false;
  let dodgeCount = 0;
  let currentTx = 0;
  let currentTy = 0;

  const funPhrases = [
    'No 🙈',
    'Nope! 😜',
    'Are you sure? 🥺',
    'Try again! 🏃',
    'Still No? 🥺',
    'Can\'t catch me! 😋',
    'Just say Yes! 🥰',
    'Never! 💖'
  ];

  function dodgeNoButton() {
    if (!btnSayNo || isDodging) return;
    isDodging = true;

    // Carefully chosen smooth offsets so it slides smoothly to different spots inside the card
    const offsets = [
      { x: 120, y: -40 },
      { x: -120, y: -40 },
      { x: 130, y: 30 },
      { x: -120, y: 30 },
      { x: 140, y: 0 },
      { x: -140, y: 0 },
      { x: 0, y: -50 },
      { x: 0, y: 40 }
    ];

    // Pick an offset that moves it clearly away from where it currently is
    let chosen;
    let attempts = 0;
    do {
      chosen = offsets[Math.floor(Math.random() * offsets.length)];
      attempts++;
    } while (
      attempts < 12 &&
      Math.hypot(chosen.x - currentTx, chosen.y - currentTy) < 70
    );

    currentTx = chosen.x;
    currentTy = chosen.y;

    btnSayNo.style.transform = `translate(${currentTx}px, ${currentTy}px)`;

    dodgeCount++;
    const labelSpan = btnSayNo.querySelector('span');
    if (labelSpan) {
      labelSpan.textContent = funPhrases[dodgeCount % funPhrases.length];
    }

    // Short cooldown prevents rapid-fire jittering while cursor is moving
    setTimeout(() => {
      isDodging = false;
    }, 280);
  }

  if (btnSayNo) {
    // 1. Proximity detection: when mouse gets within 55px of the button center, it slips away smoothly
    window.addEventListener('mousemove', (e) => {
      if (!welcomeOverlay || !welcomeOverlay.classList.contains('active') || isDodging) return;

      const noRect = btnSayNo.getBoundingClientRect();
      const noCenterX = noRect.left + noRect.width / 2;
      const noCenterY = noRect.top + noRect.height / 2;

      const dist = Math.hypot(e.clientX - noCenterX, e.clientY - noCenterY);
      if (dist < 55) {
        dodgeNoButton();
      }
    });

    // 2. Direct hover or focus triggers smooth slip
    btnSayNo.addEventListener('mouseenter', dodgeNoButton);
    btnSayNo.addEventListener('mouseover', dodgeNoButton);
    btnSayNo.addEventListener('focus', dodgeNoButton);

    // 3. Mobile touch defense - slips away immediately before tap registers
    btnSayNo.addEventListener('touchstart', (e) => {
      e.preventDefault();
      dodgeNoButton();
    }, { passive: false });

    btnSayNo.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      dodgeNoButton();
    });
  }

  // "YES" Button Clicked -> Instant celebration & entry!
  if (btnSayYes) {
    btnSayYes.addEventListener('click', () => {
      sound.playChimeSound();
      sound.play(); // Play romantic celebration background melody
      confetti.burst(window.innerWidth / 2, window.innerHeight * 0.45, 120);

      // Hide question elements and reveal celebratory confirmation
      if (loveButtonsArea) loveButtonsArea.style.display = 'none';
      if (welcomeHeading) welcomeHeading.style.display = 'none';
      if (welcomeMessage) welcomeMessage.style.display = 'none';
      if (loveSuccessMsg) loveSuccessMsg.classList.remove('hidden');

      // Smoothly dismiss modal into the website
      setTimeout(() => {
        if (welcomeOverlay) {
          welcomeOverlay.classList.remove('active');
        }
      }, 1300);
    });
  }


  /* ========================================================
     4. STICKY HEADER & MOBILE NAVIGATION
     ======================================================== */
  const mainHeader = document.getElementById('mainHeader');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      mainHeader?.classList.add('scrolled');
    } else {
      mainHeader?.classList.remove('scrolled');
    }
  });

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // Smooth scroll and active state management on click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        const targetElem = document.getElementById(targetId);
        if (targetElem) {
          e.preventDefault();

          // Immediately update active styling on clicked link
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');

          // Close mobile drawer if open
          if (navMenu) navMenu.classList.remove('open');
          if (navToggle) {
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
          }

          // Smooth scroll accounting for fixed header height
          const headerHeight = 75;
          const targetTop = targetElem.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Active section indicator via IntersectionObserver
  const sections = document.querySelectorAll('section[id], #videoSection');
  const observerOptions = {
    threshold: 0.25,
    rootMargin: '-70px 0px -45% 0px'
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => navObserver.observe(section));


  /* ========================================================
     5. SECTION 03: THE BIRTHDAY CELEBRATION (INTERACTIVE CAKE)
     ======================================================== */
  const btnCutCake = document.getElementById('btnCutCake');
  const birthdayCake = document.getElementById('birthdayCake');
  const candleFlame = document.getElementById('candleFlame');
  const cakeSlicePiece = document.getElementById('cakeSlicePiece');
  const cakeCutSeam = document.getElementById('cakeCutSeam');
  const virtualKnife = document.getElementById('virtualKnife');
  const cakeWishBanner = document.getElementById('cakeWishBanner');
  const cakeBtnText = document.getElementById('cakeBtnText');

  let cakeIsCut = false;

  if (btnCutCake) {
    btnCutCake.addEventListener('click', () => {
      if (cakeIsCut) {
        // Additional celebration burst on repeated clicks
        confetti.burst(window.innerWidth / 2, window.innerHeight * 0.4, 70);
        sound.playChimeSound();
        return;
      }

      cakeIsCut = true;

      // 1. Blow out candle flame with sound
      if (candleFlame) {
        candleFlame.classList.add('out');
      }
      sound.playPopSound();

      // 2. Animate the pastry knife slicing down
      if (virtualKnife) {
        virtualKnife.classList.add('cutting');
      }

      // 3. Knife reaches mid-cake: show cut line and celebratory bounce
      setTimeout(() => {
        if (cakeCutSeam) {
          cakeCutSeam.classList.add('active');
        }
        if (birthdayCake) {
          birthdayCake.classList.add('joy-bounce');
        }
      }, 500);

      // 4. Cake splits open: main tiers reveal cut gap and slice slides out!
      setTimeout(() => {
        if (birthdayCake) {
          birthdayCake.classList.add('is-cut');
        }
        if (cakeSlicePiece) {
          cakeSlicePiece.classList.add('sliced');
        }

        // Explode festive confetti & chime sound
        const rect = btnCutCake.getBoundingClientRect();
        confetti.burst(rect.left + rect.width / 2, rect.top - 60, 120);
        sound.playChimeSound();

        // Reveal heartwarming wish banner
        if (cakeWishBanner) {
          cakeWishBanner.classList.remove('hidden');
        }
        if (cakeBtnText) {
          cakeBtnText.textContent = 'আবার সেলিব্রেট করো! 🎉';
        }
      }, 780);
    });
  }


  /* ========================================================
     6. SECTION 06 & 07: MEMORY GALLERY & LIGHTBOX
     ======================================================== */
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');

  // Collect all gallery items
  const galleryItems = [];
  const galleryCards = document.querySelectorAll('.polaroid-card, .portrait-card');

  galleryCards.forEach((card, index) => {
    const img = card.querySelector('img');
    const caption = card.getAttribute('data-caption') || card.querySelector('.polaroid-caption, .portrait-caption')?.textContent || '';
    const src = img ? img.getAttribute('src') : '';

    galleryItems.push({ src, caption, card });

    card.addEventListener('click', () => {
      openLightbox(index);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  let currentLightboxIndex = 0;

  function openLightbox(index) {
    if (!lightboxModal || !galleryItems[index]) return;
    currentLightboxIndex = index;
    updateLightboxContent();
    lightboxModal.removeAttribute('hidden');
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('hidden', '');
    if (lightboxImg) lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = galleryItems[currentLightboxIndex];
    if (!item) return;

    if (lightboxImg) {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.caption;
      lightboxImg.onerror = () => {
        // Fallback for modal image if local asset missing
        lightboxImg.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect fill="%23FFF0F3" width="600" height="400"/><text fill="%23A85C73" font-family="sans-serif" font-size="22" font-weight="bold" x="50%" y="50%" text-anchor="middle">Photo Placeholder: ' + encodeURIComponent(item.caption) + '</text></svg>';
      };
    }
    if (lightboxCaption) {
      lightboxCaption.textContent = item.caption;
      lightboxCaption.style.display = item.caption ? 'block' : 'none';
    }
  }

  function nextLightbox() {
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryItems.length;
    updateLightboxContent();
  }

  function prevLightbox() {
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightboxContent();
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target === lightboxBackdrop) {
        closeLightbox();
      }
    });
  }
  if (lightboxNext) lightboxNext.addEventListener('click', nextLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightbox);

  window.addEventListener('keydown', (e) => {
    if (lightboxModal && !lightboxModal.hasAttribute('hidden')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    }
  });

  // Mobile Touch Swipe Navigation for Lightbox
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
        nextLightbox(); // Swiped left -> Next
      } else if (touchEndX > touchStartX + swipeThreshold) {
        prevLightbox(); // Swiped right -> Prev
      }
    }, { passive: true });
  }


  /* ========================================================
     7. SECTION 10: INTERACTIVE 3D GIFT BOX
     ======================================================== */
  const interactiveGiftBox = document.getElementById('interactiveGiftBox');
  const btnOpenGift = document.getElementById('btnOpenGift');
  const giftRevealCard = document.getElementById('giftRevealCard');

  let giftOpened = false;

  function triggerOpenGift() {
    if (giftOpened) return;
    giftOpened = true;

    if (interactiveGiftBox) {
      interactiveGiftBox.classList.add('opened');
    }

    sound.playChimeSound();

    setTimeout(() => {
      if (giftRevealCard) {
        giftRevealCard.classList.remove('hidden');
      }
      if (btnOpenGift) {
        btnOpenGift.innerHTML = '<span>উপহারটি খোলা হয়েছে 💝</span>';
        btnOpenGift.style.opacity = '0.85';
      }

      const rect = interactiveGiftBox ? interactiveGiftBox.getBoundingClientRect() : null;
      if (rect) {
        confetti.burst(rect.left + rect.width / 2, rect.top, 70);
      }
    }, 450);
  }

  if (btnOpenGift) btnOpenGift.addEventListener('click', triggerOpenGift);
  if (interactiveGiftBox) {
    interactiveGiftBox.addEventListener('click', triggerOpenGift);
    interactiveGiftBox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerOpenGift();
      }
    });
  }


  /* ========================================================
     8. SECTION 11: MAKE A WISH (STARRY SKY INTERACTION)
     ======================================================== */
  const wishNightSky = document.getElementById('wishNightSky');
  const btnMakeWish = document.getElementById('btnMakeWish');
  const wishSuccessBox = document.getElementById('wishSuccessBox');
  const wishPrompt = document.getElementById('wishPrompt');
  const wishFlame = document.getElementById('wishFlame');

  // Generate twinkling stars in the night sky
  if (wishNightSky) {
    const starCount = 55;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star-particle';
      const size = Math.random() * 3 + 1.5;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 4}s`;
      star.style.animationDuration = `${Math.random() * 2 + 2}s`;
      wishNightSky.appendChild(star);
    }
  }

  if (btnMakeWish) {
    btnMakeWish.addEventListener('click', () => {
      sound.playChimeSound();

      if (wishFlame) {
        wishFlame.style.boxShadow = '0 0 45px rgba(255, 234, 167, 1), 0 0 70px rgba(253, 121, 168, 0.9)';
      }

      if (wishPrompt) {
        wishPrompt.style.opacity = '0.6';
      }

      if (wishSuccessBox) {
        wishSuccessBox.classList.remove('hidden');
      }

      btnMakeWish.innerHTML = '<span>তোমার ইচ্ছা নক্ষত্রে পৌঁছে গেছে ⭐</span>';
      btnMakeWish.disabled = true;
      btnMakeWish.style.opacity = '0.9';

      confetti.burst(window.innerWidth / 2, window.innerHeight * 0.45, 60);
    });
  }


  /* ========================================================
     9. SECTION 13: FINAL BIG BEATING HEART INTERACTION
     ======================================================== */
  const btnBigHeart = document.getElementById('btnBigHeart');

  if (btnBigHeart) {
    btnBigHeart.addEventListener('click', (e) => {
      sound.playChimeSound();

      // Launch floating hearts upwards
      const rect = btnBigHeart.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;

      for (let i = 0; i < 15; i++) {
        createFloatingHeart(originX, originY);
      }

      confetti.burst(originX, originY, 80);
    });
  }

  function createFloatingHeart(x, y) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.fontSize = `${Math.random() * 20 + 16}px`;
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9999';
    heart.style.transition = 'transform 1.8s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 1.8s ease';
    document.body.appendChild(heart);

    const destX = (Math.random() - 0.5) * 220;
    const destY = -(Math.random() * 280 + 120);

    requestAnimationFrame(() => {
      heart.style.transform = `translate(${destX}px, ${destY}px) scale(${Math.random() * 0.8 + 0.6}) rotate(${(Math.random() - 0.5) * 50}deg)`;
      heart.style.opacity = '0';
    });

    setTimeout(() => {
      heart.remove();
    }, 1800);
  }


  /* ========================================================
     10. AMBIENT FLOATING FLOWER PETALS & HEARTS GENERATOR
     ======================================================== */
  const ambientDecor = document.getElementById('ambientDecor');
  if (ambientDecor) {
    const elements = ['🌸', '✨', '🤍', '🌷', '🌿'];
    const totalAmbient = 14;

    for (let i = 0; i < totalAmbient; i++) {
      const el = document.createElement('div');
      el.className = 'floating-petal';
      el.textContent = elements[Math.floor(Math.random() * elements.length)];
      el.style.left = `${Math.random() * 100}vw`;
      el.style.top = `${Math.random() * 100}vh`;
      el.style.fontSize = `${Math.random() * 14 + 14}px`;
      el.style.animation = `floatBalloon ${Math.random() * 10 + 10}s ease-in-out infinite alternate`;
      el.style.animationDelay = `${Math.random() * 5}s`;
      ambientDecor.appendChild(el);
    }
  }


  /* ========================================================
     11. SECTION 14: BACK TO TOP BUTTON
     ======================================================== */
  const btnBackToTop = document.getElementById('btnBackToTop');
  if (btnBackToTop) {
    btnBackToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  /* ========================================================
     12. DEDICATED TO MIM: SCROLL REVEAL & CASCADE ANIMATION
     ======================================================== */
  const portraitGrid = document.getElementById('mimPhotoGrid');
  if (portraitGrid) {
    const portraitCards = portraitGrid.querySelectorAll('.portrait-card');

    portraitCards.forEach((card, index) => {
      card.classList.add('scroll-reveal-card');
      // Stagger animations based on 3x3 grid column and row
      const colDelay = (index % 3) * 0.12;
      const rowDelay = Math.floor(index / 3) * 0.08;
      card.style.transitionDelay = `${colDelay + rowDelay}s`;
    });

    const portraitScrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          portraitScrollObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    portraitCards.forEach(card => portraitScrollObserver.observe(card));
  }


  /* ========================================================
     13. SECTION 11.5: RAPID MEMORY REEL & AUDIO SYNC
     ======================================================== */
  // All 84 images combined from assets/images and assets/images/single_img
  const allReelImages = [
    "assets/images/1st_picture.jpeg",
    "assets/images/2nd_picture.jpg",
    "assets/images/3rd_picture.jpg",
    "assets/images/4th_image.jpg",
    "assets/images/5th_image.jpeg",
    "assets/images/6th_picture.jpg",
    "assets/images/7th_picture.jpg",
    "assets/images/IMG-20251019-WA0018.jpg",
    "assets/images/IMG-20251025-WA0011.jpg",
    "assets/images/IMG-20251206-WA0017.jpg",
    "assets/images/IMG-20251211-WA0011.jpg",
    "assets/images/IMG-20251215-WA0075.jpg",
    "assets/images/IMG-20251216-WA0050.jpg",
    "assets/images/IMG-20260121-WA0014.jpg",
    "assets/images/IMG-20260121-WA0020.jpg",
    "assets/images/IMG-20260121-WA0026.jpg",
    "assets/images/IMG-20260305-WA0026.jpg",
    "assets/images/IMG_20251016_114809.jpg",
    "assets/images/IMG_20251016_114913.jpg",
    "assets/images/IMG_20251029_155529.jpg",
    "assets/images/IMG_20251029_155539.jpg",
    "assets/images/IMG_20251030_163801.jpg",
    "assets/images/IMG_20251126_182731.jpg",
    "assets/images/IMG_20251128_184045.jpg",
    "assets/images/IMG_20251129_134149.jpg",
    "assets/images/IMG_20260112_175400.jpg",
    "assets/images/IMG_20260309_181347.jpg",
    "assets/images/IMG_20260330_172923.jpg",
    "assets/images/IMG_20260330_173003.jpg",
    "assets/images/IMG_20260330_175925.jpg",
    "assets/images/IMG_20260330_180114.jpg",
    "assets/images/IMG_20260330_180137.jpg",
    "assets/images/IMG_20260410_183536.jpg",
    "assets/images/IMG_20260410_183618.jpg",
    "assets/images/LMC_10 Jan 17_30 (2).jpg",
    "assets/images/LMC_12 Dec 19_12.jpg",
    "assets/images/LMC_14 Apr 11_16.jpg",
    "assets/images/LMC_14 Apr 17_32.PORTRAIT (1).jpg",
    "assets/images/LMC_14 Apr 18_35 (2).jpg",
    "assets/images/LMC_14 Apr 19_07 (1).jpg",
    "assets/images/LMC_14 Feb 17_41 (2).jpg",
    "assets/images/LMC_14 Feb 17_45 (2).jpg",
    "assets/images/LMC_14 Feb 17_56 (3).jpg",
    "assets/images/LMC_15 Dec 10_50 (1).jpg",
    "assets/images/LMC_16 Dec 16_51.jpg",
    "assets/images/LMC_16 Dec 16_52 (4).jpg",
    "assets/images/LMC_16 Dec 17_55 (1).jpg",
    "assets/images/LMC_16 Dec 17_55 (3).jpg",
    "assets/images/LMC_16 Feb 18_34.PORTRAIT.ORIGINAL.jpg",
    "assets/images/LMC_17 Jan 10_29 (2).jpg",
    "assets/images/LMC_18 Jan 10_08 (1).jpg",
    "assets/images/LMC_18 Jan 10_08 (4).jpg",
    "assets/images/LMC_18 Jan 10_08.jpg",
    "assets/images/LMC_2 Apr 18_31.PORTRAIT.ORIGINAL (2).jpg",
    "assets/images/LMC_2 Apr 18_33.PORTRAIT (2).jpg",
    "assets/images/LMC_22 Apr 16_30.PORTRAIT.ORIGINAL.jpg",
    "assets/images/LMC_26 Nov 18_26.PORTRAIT.jpg",
    "assets/images/LMC_28 Mar 18_32 (1).jpg",
    "assets/images/LMC_28 Mar 18_33 (1).jpg",
    "assets/images/LMC_3 Apr 19_30.PORTRAIT.ORIGINAL (2).jpg",
    "assets/images/LMC_30 Jan 16_15.jpg",
    "assets/images/LMC_30 Jan 16_27.jpg",
    "assets/images/LMC_30 Jan 16_51.PORTRAIT.jpg",
    "assets/images/LMC_30 Jan 16_53.jpg",
    "assets/images/LMC_30 Jan 18_08.jpg",
    "assets/images/LMC_30 Jan 18_09 (1).jpg",
    "assets/images/LMC_30 Mar 17_28.jpg",
    "assets/images/LMC_7 Apr 18_33.PORTRAIT (3).jpg",
    "assets/images/LMC_7 Apr 19_32.jpg",
    "assets/images/LMC_8 Apr 14_00.PORTRAIT.jpg",
    "assets/images/Snapchat-1238250476.jpg",
    "assets/images/Snapchat-2006604484.jpg",
    "assets/images/first_bday_celebration in varsity.jpg",
    "assets/images/foot_image.jpg",
    "assets/images/orca-image--471168965.jpeg.jpeg",
    "assets/images/single_img/IMG-20251024-WA0014.jpg",
    "assets/images/single_img/IMG-20251126-WA0004.jpg",
    "assets/images/single_img/IMG-20251130-WA0005.jpg",
    "assets/images/single_img/IMG-20251130-WA0008.jpg",
    "assets/images/single_img/IMG-20251215-WA0005.jpg",
    "assets/images/single_img/IMG-20251215-WA0056.jpg",
    "assets/images/single_img/IMG-20260118-WA0008.jpg",
    "assets/images/single_img/LMC_14 Apr 11_12 (5).jpg",
    "assets/images/single_img/Screenshot_2025-10-11-19-42-50-493_com.facebook.orca.jpg"
  ];

  // Fisher-Yates array shuffler for complete randomness
  function shuffleReelImages(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // Active randomized image pool
  let randomizedReel = shuffleReelImages(allReelImages);

  // Preload all images so rapid transitions are buttery smooth with zero delay
  allReelImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  const reelMainImg = document.getElementById('reelMainImg');
  const reelCurrentNum = document.getElementById('reelCurrentNum');
  const reelTotalNum = document.getElementById('reelTotalNum');
  const btnToggleReel = document.getElementById('btnToggleReel');
  const reelBtnIcon = document.getElementById('reelBtnIcon');
  const reelBtnText = document.getElementById('reelBtnText');
  const reelTimerDisplay = document.getElementById('reelTimerDisplay');
  const reelProgressFill = document.getElementById('reelProgressFill');
  const fastMemoriesReel = document.getElementById('fastMemoriesReel');
  const reelLocalAudio = document.getElementById('reelLocalAudio');
  const audioVinylDisc = document.getElementById('audioVinylDisc');
  const audioBars = document.getElementById('audioBars');

  if (reelTotalNum) {
    reelTotalNum.textContent = allReelImages.length;
  }

  // Set initial image from the randomized pool
  if (reelMainImg && randomizedReel.length > 0) {
    reelMainImg.src = randomizedReel[0];
  }

  let reelIndex = 0;
  let reelSlideInterval = null;
  let reelSyncInterval = null;
  let isReelPlaying = false;
  let reelElapsed = 0; // seconds from 0 to 48
  const START_SEC = 214; // 3:34
  const END_SEC = 262;   // 4:22
  const TOTAL_DURATION = END_SEC - START_SEC; // 48 seconds

  // Initialize audio start time
  if (reelLocalAudio) {
    reelLocalAudio.addEventListener('loadedmetadata', () => {
      reelLocalAudio.currentTime = START_SEC;
    });
  }

  function startReel() {
    if (isReelPlaying) return;
    isReelPlaying = true;

    // Pause ambient background music if playing
    if (sound && sound.audio && !sound.audio.paused) {
      sound.audio.pause();
    }

    if (reelBtnIcon) reelBtnIcon.textContent = '⏸';
    if (reelBtnText) reelBtnText.textContent = 'Pause Rapid Reel';
    if (audioVinylDisc) audioVinylDisc.classList.add('spinning');
    if (audioBars) audioBars.classList.add('active');

    // Seek to exact position (3:34) and play audio
    if (reelLocalAudio) {
      if (reelLocalAudio.currentTime < START_SEC || reelLocalAudio.currentTime >= END_SEC) {
        reelLocalAudio.currentTime = START_SEC + reelElapsed;
      }
      const playPromise = reelLocalAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Playback gesture needed:', err);
        });
      }
    }

    // Rapid slide: 10 images per second (100ms per image)
    if (!reelSlideInterval) {
      reelSlideInterval = setInterval(() => {
        reelIndex = (reelIndex + 1) % randomizedReel.length;
        if (reelMainImg) {
          reelMainImg.src = randomizedReel[reelIndex];
        }
        if (reelCurrentNum) {
          reelCurrentNum.textContent = reelIndex + 1;
        }
      }, 100);
    }

    // Audio & progress timer (from 3:34 up to 4:22)
    if (!reelSyncInterval) {
      reelSyncInterval = setInterval(() => {
        if (reelLocalAudio && !reelLocalAudio.paused) {
          const cur = reelLocalAudio.currentTime;
          if (cur >= START_SEC) {
            reelElapsed = cur - START_SEC;
          } else {
            reelLocalAudio.currentTime = START_SEC;
            reelElapsed = 0;
          }
        } else {
          reelElapsed += 0.25;
        }

        const currentSecTotal = Math.min(Math.floor(START_SEC + reelElapsed), END_SEC);
        const mins = Math.floor(currentSecTotal / 60);
        const secs = currentSecTotal % 60;
        if (reelTimerDisplay) {
          reelTimerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        const pct = Math.min((reelElapsed / TOTAL_DURATION) * 100, 100);
        if (reelProgressFill) {
          reelProgressFill.style.width = `${pct}%`;
        }

        // Reached 4:22 (262s) -> Pause automatically as requested!
        if (reelElapsed >= TOTAL_DURATION || (reelLocalAudio && reelLocalAudio.currentTime >= END_SEC)) {
          stopReel(true);
        }
      }, 250);
    }
  }

  function stopReel(completed = false) {
    isReelPlaying = false;

    // Pause audio
    if (reelLocalAudio && !reelLocalAudio.paused) {
      reelLocalAudio.pause();
    }

    if (audioVinylDisc) audioVinylDisc.classList.remove('spinning');
    if (audioBars) audioBars.classList.remove('active');

    if (reelSlideInterval) {
      clearInterval(reelSlideInterval);
      reelSlideInterval = null;
    }
    if (reelSyncInterval) {
      clearInterval(reelSyncInterval);
      reelSyncInterval = null;
    }

    if (completed) {
      reelElapsed = 0;
      reelIndex = 0;
      // Reshuffle for a completely new randomized order on replay!
      randomizedReel = shuffleReelImages(allReelImages);
      if (reelMainImg && randomizedReel.length > 0) {
        reelMainImg.src = randomizedReel[0];
      }
      if (reelCurrentNum) {
        reelCurrentNum.textContent = 1;
      }
      if (reelLocalAudio) {
        reelLocalAudio.currentTime = START_SEC;
      }
      if (reelBtnIcon) reelBtnIcon.textContent = '↺';
      if (reelBtnText) reelBtnText.textContent = 'Replay Rapid Reel & Song ✨';
      confetti.burst(window.innerWidth / 2, window.innerHeight * 0.45, 90);
    } else {
      if (reelBtnIcon) reelBtnIcon.textContent = '▶';
      if (reelBtnText) reelBtnText.textContent = 'Resume Rapid Reel';
    }
  }

  if (btnToggleReel) {
    btnToggleReel.addEventListener('click', () => {
      if (isReelPlaying) {
        stopReel(false);
      } else {
        startReel();
      }
    });
  }

  if (fastMemoriesReel) {
    let hasAutoTriggered = false;
    const reelObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAutoTriggered) {
          hasAutoTriggered = true;
          startReel();
        } else if (!entry.isIntersecting && isReelPlaying) {
          stopReel(false);
        }
      });
    }, { threshold: 0.35 });

    reelObserver.observe(fastMemoriesReel);
  }

});

