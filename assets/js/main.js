/* ═══════════════════════════════════════════════════════════════════
   NATAN CAVALCANTE ADVOCACIA — MAIN JAVASCRIPT
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ── DOM Ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initLucideIcons();
  initHeader();
  initVideoPlayer();
  initMobileMenu();
  initParticles();
  initRevealObserver();
  initCounters();
  initSlider();
  initBackToTop();
  initFooterYear();
  initActiveNav();
  initGSAP();
  initSmoothLinks();
});

/* ── Lucide Icons Init ── */
function initLucideIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
    // Re-run after dynamic content
    setTimeout(() => lucide.createIcons(), 500);
  }
}

/* ── Header Scroll Effect ── */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Mobile Menu ── */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav    = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px); z-index: 998;
    opacity: 0; pointer-events: none;
    transition: opacity 0.3s ease;
  `;
  document.body.appendChild(overlay);

  const open = () => {
    toggle.classList.add('open');
    nav.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    toggle.classList.remove('open');
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    nav.classList.contains('open') ? close() : open();
  });

  overlay.addEventListener('click', close);

  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', close);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
}

/* ── Particles ── */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = window.innerWidth < 768 ? 12 : 24;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const duration = Math.random() * 12 + 8;
    const delay = Math.random() * 8;
    const drift = (Math.random() - 0.5) * 100;

    p.style.cssText = `
      left: ${x}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      --drift: ${drift}px;
      opacity: ${Math.random() * 0.5 + 0.2};
    `;
    container.appendChild(p);
  }
}

/* ── Reveal on Scroll (IntersectionObserver) ── */
function initRevealObserver() {
  const targets = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-left, .reveal-right');
  if (!targets.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  targets.forEach(t => io.observe(t));
}

/* ── Animated Counters ── */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(ease(progress) * target);
      el.textContent = value.toLocaleString('pt-BR');

      if (progress < 1) requestAnimationFrame(update);
      else {
        el.textContent = target.toLocaleString('pt-BR');
        el.closest('.numero-item')?.classList.add('counted');
      }
    };

    requestAnimationFrame(update);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
}

/* ── Testimonials Slider ── */
function initSlider() {
  const slider = document.getElementById('testimonials-slider');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const dotsContainer = document.getElementById('slider-dots');

  if (!slider) return;

  const cards = Array.from(slider.querySelectorAll('.testimonial-card'));
  const isMobile = () => window.innerWidth < 900;
  const isTablet = () => window.innerWidth >= 900 && window.innerWidth < 1100;

  let current = 0;
  let perView = isMobile() ? 1 : isTablet() ? 2 : 3;
  let total = Math.ceil(cards.length / perView);
  let autoTimer = null;

  const buildDots = () => {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.setAttribute('aria-label', `Grupo de depoimentos ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  };

  const updateSlider = () => {
    perView = isMobile() ? 1 : isTablet() ? 2 : 3;
    total = Math.ceil(cards.length / perView);
    current = Math.min(current, total - 1);

    cards.forEach((card, i) => {
      const group = Math.floor(i / perView);
      card.style.display = group === current ? '' : 'none';
      card.setAttribute('aria-hidden', group !== current ? 'true' : 'false');
    });

    // Layout
    if (perView === 1) {
      slider.style.gridTemplateColumns = '1fr';
    } else if (perView === 2) {
      slider.style.gridTemplateColumns = 'repeat(2, 1fr)';
    } else {
      slider.style.gridTemplateColumns = 'repeat(3, 1fr)';
    }

    dotsContainer?.querySelectorAll('.slider__dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
      dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  };

  const goTo = (index) => {
    current = (index + total) % total;
    updateSlider();
    resetAuto();
  };

  const startAuto = () => {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  };

  const resetAuto = () => {
    clearInterval(autoTimer);
    startAuto();
  };

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));

  // Touch/swipe support
  let touchStartX = 0;
  slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) goTo(delta > 0 ? current + 1 : current - 1);
  });

  // Keyboard
  slider.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // Pause on hover
  slider.addEventListener('mouseenter', () => clearInterval(autoTimer));
  slider.addEventListener('mouseleave', () => startAuto());

  const init = () => {
    buildDots();
    updateSlider();
    startAuto();
  };

  init();

  window.addEventListener('resize', () => {
    const newPerView = isMobile() ? 1 : isTablet() ? 2 : 3;
    if (newPerView !== perView) {
      perView = newPerView;
      total = Math.ceil(cards.length / perView);
      current = 0;
      buildDots();
      updateSlider();
    }
  }, { passive: true });
}

/* ── Back to Top ── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Footer Year ── */
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ── Active Nav Link ── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav__link');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(link => {
          const matches = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('active', matches);
        });
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });

  sections.forEach(s => io.observe(s));
}

/* ── Smooth Scroll for Anchor Links ── */
function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('header')?.offsetHeight || 80;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    });
  });
}

/* ── GSAP Animations ── */
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Fallback: ensure reveal classes fire
    document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-left, .reveal-right')
      .forEach(el => el.classList.add('in-view'));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Hero stagger
  const heroItems = document.querySelectorAll('.hero__content .reveal-fade');
  if (heroItems.length) {
    gsap.fromTo(heroItems,
      { opacity: 0, y: 30, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out', delay: 0.3 }
    );
    heroItems.forEach(el => el.classList.add('in-view'));
  }

  // Hero visual
  const heroVisual = document.querySelector('.hero__visual');
  if (heroVisual) {
    gsap.fromTo(heroVisual,
      { opacity: 0, x: 50, scale: 0.95 },
      { opacity: 1, x: 0, scale: 1, duration: 1.1, ease: 'power3.out', delay: 0.5 }
    );
    heroVisual.classList.add('in-view');
  }

  // Parallax on hero bg
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    gsap.to(heroBg, {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // Section parallax subtle on areas
  gsap.utils.toArray('.area-card, .diferencial-card, .numero-item').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          once: true
        },
        delay: i * 0.05
      }
    );
    el.classList.add('in-view');
  });

  // sobre__visual parallax
  const sobreVisual = document.querySelector('.sobre__visual');
  if (sobreVisual) {
    gsap.to(sobreVisual, {
      y: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.sobre',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
  }
}

/* ── Vídeo Institucional Player ── */
function initVideoPlayer() {
  const video       = document.getElementById('video-inst');
  const overlay     = document.getElementById('video-overlay');
  const placeholder = document.getElementById('video-placeholder');
  const playBtn     = document.getElementById('vid-play');
  const muteBtn     = document.getElementById('vid-mute');
  const fullBtn     = document.getElementById('vid-fullscreen');
  const progressBar = document.getElementById('video-progress');
  const progressFill= document.getElementById('progress-fill');
  const progressThumb = document.getElementById('progress-thumb');
  const currentTime = document.getElementById('vid-current');
  const durationEl  = document.getElementById('vid-duration');
  const playIcon    = document.getElementById('play-icon');
  const muteIcon    = document.getElementById('mute-icon');
  const playerWrap  = document.getElementById('video-player');
  const controls    = document.getElementById('video-controls');

  if (!video) return;

  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  const fmt = s => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const setPlayIcon = playing => {
    if (!playIcon) return;
    playIcon.setAttribute('data-lucide', playing ? 'pause' : 'play');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  };

  /* ── Mostrar / esconder controles no mobile ── */
  let ctrlTimer = null;
  const showControls = () => {
    if (!controls) return;
    controls.style.opacity = '1';
    controls.style.transform = 'translateY(0)';
    clearTimeout(ctrlTimer);
    if (!video.paused) {
      ctrlTimer = setTimeout(hideControls, 3000);
    }
  };
  const hideControls = () => {
    if (!controls || video.paused) return;
    controls.style.opacity = '0';
    controls.style.transform = 'translateY(6px)';
  };

  /* ── Play / Pause ── */
  const play = () => {
    const promise = video.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          if (overlay) overlay.classList.add('hidden');
          playerWrap?.classList.add('playing');
          setPlayIcon(true);
          showControls();
        })
        .catch(err => {
          // Autoplay bloqueado ou erro — mantém overlay visível
          console.warn('Video play failed:', err);
          if (overlay) overlay.classList.remove('hidden');
          playerWrap?.classList.remove('playing');
          setPlayIcon(false);
        });
    } else {
      if (overlay) overlay.classList.add('hidden');
      playerWrap?.classList.add('playing');
      setPlayIcon(true);
      showControls();
    }
  };

  const pause = () => {
    video.pause();
    if (overlay) overlay.classList.remove('hidden');
    playerWrap?.classList.remove('playing');
    setPlayIcon(false);
    showControls();
  };

  const togglePlay = () => {
    if (video.paused) play(); else pause();
  };

  /* ── Eventos de clique / toque ── */
  // Overlay (botão play central)
  const addTouchClick = (el, fn) => {
    if (!el) return;
    el.addEventListener('click', fn);
    el.addEventListener('touchend', e => { e.preventDefault(); fn(); });
  };

  addTouchClick(overlay, togglePlay);
  addTouchClick(playBtn, e => { e?.stopPropagation(); togglePlay(); });

  // Toque no player quando vídeo está tocando → mostra/oculta controles
  playerWrap?.addEventListener('touchstart', () => {
    if (!video.paused) showControls();
  }, { passive: true });

  // Teclado
  overlay?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePlay(); }
  });

  /* ── Mute ── */
  addTouchClick(muteBtn, () => {
    video.muted = !video.muted;
    if (muteIcon) {
      muteIcon.setAttribute('data-lucide', video.muted ? 'volume-x' : 'volume-2');
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    showControls();
  });

  /* ── Fullscreen ── */
  addTouchClick(fullBtn, () => {
    const el = playerWrap;
    if (!el) return;
    const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen;
    const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen;
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      exit.call(document);
    } else {
      req.call(el);
    }
    showControls();
  });

  /* ── Barra de progresso — clique e toque ── */
  const seek = clientX => {
    if (!video.duration) return;
    const rect = progressBar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    video.currentTime = pct * video.duration;
    showControls();
  };

  progressBar?.addEventListener('click', e => seek(e.clientX));
  progressBar?.addEventListener('touchstart', e => {
    e.preventDefault();
    seek(e.touches[0].clientX);
  }, { passive: false });

  /* ── Atualiza progresso ── */
  video.addEventListener('timeupdate', () => {
    if (!video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    if (progressFill) progressFill.style.width = pct + '%';
    if (progressThumb) progressThumb.style.left = pct + '%';
    if (currentTime) currentTime.textContent = fmt(video.currentTime);
  });

  /* ── Metadata carregada ── */
  video.addEventListener('loadedmetadata', () => {
    if (placeholder) placeholder.style.display = 'none';
    if (durationEl) durationEl.textContent = fmt(video.duration);
  });

  /* ── Erro de carregamento ── */
  video.addEventListener('error', () => {
    if (placeholder) placeholder.style.display = 'flex';
    if (overlay) overlay.style.display = 'none';
  });

  /* ── Fim do vídeo ── */
  video.addEventListener('ended', () => {
    pause();
    video.currentTime = 0;
    if (progressFill) progressFill.style.width = '0%';
    if (progressThumb) progressThumb.style.left = '0%';
  });

  /* ── Placeholder se vídeo não carregou após 2s ── */
  setTimeout(() => {
    if (video.readyState === 0 && placeholder) {
      placeholder.style.display = 'flex';
    }
  }, 2000);
}

/* ── Cursor Glow (desktop) ── */
if (window.matchMedia('(hover: hover)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,106,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
}
