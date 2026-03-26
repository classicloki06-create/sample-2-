/* ============================================================
   NOIR CAFÉ — PREMIUM JAVASCRIPT
   GSAP Cinematic Intro + Routing + Animations
   ============================================================ */

(function () {
  'use strict';

  /* ── GSAP PLUGIN REGISTRATION ────────────────────────── */
  gsap.registerPlugin(ScrollTrigger);

  /* ── GLOBALS ─────────────────────────────────────────── */
  let currentSection = 'home';
  let isTransitioning = false;

  /* ─────────────────────────────────────────────────────
     1. CUSTOM CURSOR
  ───────────────────────────────────────────────────── */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    gsap.to(cursor, { x: mx, y: my, duration: 0.08, ease: 'none' });
  });

  (function animateFollower() {
    fx += (mx - fx) * 0.1;
    fy += (my - fy) * 0.1;
    gsap.set(follower, { x: fx, y: fy });
    requestAnimationFrame(animateFollower);
  })();

  /* Cursor grow on interactive elements */
  document.addEventListener('mouseover', (e) => {
    if (e.target.matches('a, button, .featured-item, .menu-card, .mg-item, .nav-link')) {
      gsap.to(follower, { scale: 1.8, duration: 0.3 });
      gsap.to(cursor, { scale: 0.5, duration: 0.3 });
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.matches('a, button, .featured-item, .menu-card, .mg-item, .nav-link')) {
      gsap.to(follower, { scale: 1, duration: 0.3 });
      gsap.to(cursor, { scale: 1, duration: 0.3 });
    }
  });

  /* ─────────────────────────────────────────────────────
     2. PRELOADER
  ───────────────────────────────────────────────────── */
  function runPreloader(onComplete) {
    const bar = document.getElementById('preloaderBar');
    const pct = document.getElementById('preloaderPercent');
    let progress = 0;

    const interval = setInterval(() => {
      const step = Math.random() * 8 + 3;
      progress = Math.min(progress + step, 100);
      bar.style.width = progress + '%';
      pct.textContent = Math.floor(progress) + '%';

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          gsap.to('#preloader', {
            opacity: 0, duration: 0.6, ease: 'power2.inOut',
            onComplete: () => {
              document.getElementById('preloader').style.display = 'none';
              onComplete();
            }
          });
        }, 300);
      }
    }, 60);
  }

  /* ─────────────────────────────────────────────────────
     3. CINEMATIC INTRO SEQUENCE
  ───────────────────────────────────────────────────── */
  function runCinematicIntro(onComplete) {
    // Pizza slow-spin runs independently so it NEVER blocks the main timeline.
    // The main tl's onComplete fires reliably at its natural end point.
    let pizzaSpinTween = null;

    const tl = gsap.timeline({
      onComplete: () => {
        // Kill the detached spin tween before handing off
        if (pizzaSpinTween) pizzaSpinTween.kill();
        onComplete();
      }
    });

    /* ── SCENE 1: COFFEE POUR ── */
    tl
      .to('.coffee-cup',      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'expo.out' }, 0)
      .to('.cup-liquid',      { height: '70%', duration: 1.2, ease: 'power2.inOut' }, 0.4)
      .to('.cup-foam',        { scaleY: 1, duration: 0.5, ease: 'back.out(2)' }, 1.2)
      .to('.pour-stream',     { height: 90, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.08 }, 0.2)
      .to('.pour-stream',     { height: 0, opacity: 0, duration: 0.4, ease: 'power2.in',  stagger: 0.06 }, 1.1)
      .to('.steam-container', { opacity: 1, duration: 0.4 }, 1.0)
      .to('#scene-coffee .scene-label', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.8)
      .to('#scene-coffee',    { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, 2.2)

    /* ── SCENE 2: BURGER BUILD ── */
      .to('#scene-burger',    { opacity: 1, duration: 0.01 }, 2.4)
      .to('.bun-bottom',      { opacity: 1, y: 0, scaleX: 1, duration: 0.35, ease: 'back.out(2)'   }, 2.4)
      .to('.sauce-drip',      { opacity: 1, y: 0, scaleX: 1, duration: 0.3,  ease: 'power2.out'   }, 2.65)
      .to('.patty',           { opacity: 1, y: 0, scaleX: 1, duration: 0.35, ease: 'back.out(1.5)' }, 2.85)
      .to('.cheese',          { opacity: 1, y: 0, scaleX: 1, duration: 0.3,  ease: 'power3.out'   }, 3.05)
      .to('.tomato',          { opacity: 1, y: 0, scaleX: 1, duration: 0.3,  ease: 'power2.out'   }, 3.2)
      .to('.lettuce',         { opacity: 1, y: 0, scaleX: 1, duration: 0.3,  ease: 'power2.out'   }, 3.35)
      .to('.bun-top',         { opacity: 1, y: 0, scaleX: 1, duration: 0.4,  ease: 'back.out(2)'  }, 3.5)
      .to('#scene-burger .scene-label', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 3.5)
      .to('#scene-burger',    { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, 4.4)

    /* ── SCENE 3: PIZZA REVEAL (no repeat: -1 on the main tl) ── */
      .to('#scene-pizza',     { opacity: 1, duration: 0.01 }, 4.5)
      // Reveal: scale + rotation snap in
      .to('.pizza-whole',     { opacity: 1, scale: 1, rotation: 0, duration: 1.0, ease: 'expo.out' }, 4.5)
      // Kick off the infinite spin on a SEPARATE tween that won't block tl.onComplete
      .call(() => {
        pizzaSpinTween = gsap.to('.pizza-whole', {
          rotation: '+=360', duration: 8, ease: 'none', repeat: -1
        });
      }, null, 5.2)
      .to('#scene-pizza .scene-label', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 5.0)
      .to('#scene-pizza',     { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 6.0)

    /* ── BRAND REVEAL ── */
      .to('#introBrand',        { opacity: 1, duration: 0.8, ease: 'power2.out'  }, 6.0)
      .to('.intro-brand-name',  { letterSpacing: '0.35em', duration: 1.2, ease: 'expo.out' }, 6.0)

    /* ── EXIT: wipe the intro overlay upward, then onComplete fires ── */
      .to('#introBrand',      { opacity: 0, y: -30, duration: 0.5, ease: 'power2.in'  }, 7.5)
      .to('#cinematicIntro',  { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, 7.6);

    return tl;
  }

  /* ─────────────────────────────────────────────────────
     4. SITE ENTRANCE ANIMATIONS
  ───────────────────────────────────────────────────── */
  function animateSiteEntrance() {
    const site = document.getElementById('mainSite');

    // Force the element fully into the render tree BEFORE GSAP touches it.
    // Both visibility AND display must be set synchronously so the browser
    // paints the element; only then does the opacity tween have something to show.
    site.style.visibility = 'visible';
    site.style.display     = 'block';
    site.style.opacity     = '0';        // start transparent (controlled by JS, not CSS)

    gsap.to(site, { opacity: 1, duration: 0.7, ease: 'power2.out',
      onStart: () => {
        // Double-guard: ensure visibility can't be overridden mid-tween
        site.style.visibility = 'visible';
      }
    });

    // Nav slide in
    gsap.from('#mainNav', { y: -80, opacity: 0, duration: 1, ease: 'expo.out', delay: 0.2 });

    // Hero content cascade
    const heroTl = gsap.timeline({ delay: 0.4 });
    heroTl
      .to('.hero-eyebrow',   { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' })
      .from('.hero-line',    { y: 80, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12 }, '-=0.3')
      .to('.hero-sub',       { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, '-=0.4')
      .to('.hero-cta-wrap',  { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, '-=0.3')
      .to('.hero-scroll-cue',{ opacity: 1, duration: 0.5 }, '-=0.2')
      .to('.hero-stats',     { opacity: 1, duration: 0.6 }, '-=0.3');

    // Featured cards stagger
    gsap.from('.featured-item', { y: 60, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.15, delay: 1.2 });

    setupScrollAnimations();
  }

  /* ─────────────────────────────────────────────────────
     5. SCROLL ANIMATIONS
  ───────────────────────────────────────────────────── */
  function setupScrollAnimations() {
    // Reveal on scroll utility
    const reveals = document.querySelectorAll('.reveal, .reveal-left');
    reveals.forEach(el => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => el.classList.add('visible')
      });
    });

    // Add reveal classes to elements
    document.querySelectorAll('.value-card, .about-para, .cd-item').forEach((el, i) => {
      el.classList.add('reveal');
      el.style.animationDelay = (i * 0.1) + 's';
    });
  }

  /* ─────────────────────────────────────────────────────
     6. SECTION NAVIGATION (SPA ROUTING)
  ───────────────────────────────────────────────────── */
  function navigateTo(sectionName) {
    if (sectionName === currentSection || isTransitioning) return;
    isTransitioning = true;

    const transition = document.getElementById('pageTransition');
    const oldSection = document.getElementById('section-' + currentSection);
    const newSection = document.getElementById('section-' + sectionName);
    const footer = document.getElementById('mainFooter');

    if (!newSection) { isTransitioning = false; return; }

    // Update nav
    document.querySelectorAll('.nav-link, .mob-link').forEach(l => {
      l.classList.toggle('active', l.dataset.section === sectionName);
    });

    // Transition animation
    const tl = gsap.timeline({
      onComplete: () => {
        isTransitioning = false;
        window.scrollTo(0, 0);
        currentSection = sectionName;
        animateSectionIn(sectionName);
      }
    });

    tl
      .to(transition, {
        scaleY: 1, transformOrigin: 'bottom', duration: 0.45, ease: 'expo.inOut'
      })
      .call(() => {
        if (oldSection) oldSection.style.display = 'none';
        newSection.style.display = 'block';
        // Show/hide footer
        if (footer) footer.style.display = ['home', 'contact'].includes(sectionName) ? 'block' : 'block';
      })
      .to(transition, {
        scaleY: 0, transformOrigin: 'top', duration: 0.55, ease: 'expo.inOut', delay: 0.1
      });
  }

  function animateSectionIn(sectionName) {
    // Kill old scroll triggers
    ScrollTrigger.getAll().forEach(st => st.kill());

    const sectionMap = {
      home: animateHome,
      menu: animateMenu,
      about: animateAbout,
      gallery: animateGallery,
      contact: animateContact
    };

    if (sectionMap[sectionName]) sectionMap[sectionName]();
    setupScrollAnimations();
  }

  function animateHome() {
    const tl = gsap.timeline();
    tl
      .from('.hero-eyebrow', { opacity: 0, y: 30, duration: 0.7, ease: 'expo.out' })
      .from('.hero-line', { y: 80, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12 }, '-=0.3')
      .from('.hero-sub', { opacity: 0, y: 20, duration: 0.7, ease: 'expo.out' }, '-=0.4')
      .from('.hero-cta-wrap', { opacity: 0, y: 20, duration: 0.6, ease: 'expo.out' }, '-=0.3')
      .from('.hero-scroll-cue', { opacity: 0, duration: 0.5 }, '-=0.2')
      .from('.hero-stats', { opacity: 0, x: 20, duration: 0.6, ease: 'expo.out' }, '-=0.3')
      .from('.featured-item', { y: 60, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.15 }, '-=0.4');
  }

  function animateMenu() {
    gsap.from('.sh-content', { opacity: 0, y: 40, duration: 0.8, ease: 'expo.out' });
    gsap.from('.menu-tabs', { opacity: 0, y: 20, duration: 0.6, ease: 'expo.out', delay: 0.3 });
    gsap.from('.menu-card', {
      opacity: 0, y: 40, duration: 0.7, ease: 'expo.out', stagger: 0.08, delay: 0.5
    });
  }

  function animateAbout() {
    gsap.from('.about-hero-text', { opacity: 0, y: 60, duration: 1, ease: 'expo.out', delay: 0.3 });
    gsap.from('.about-pull-quote', { opacity: 0, x: -40, duration: 0.9, ease: 'expo.out', delay: 0.5 });
    gsap.from('.about-para', { opacity: 0, y: 30, duration: 0.8, ease: 'expo.out', stagger: 0.15, delay: 0.7 });

    ScrollTrigger.create({
      trigger: '.about-values',
      start: 'top 80%',
      onEnter: () => {
        gsap.from('.value-card', {
          opacity: 0, y: 50, duration: 0.8, ease: 'expo.out', stagger: 0.15
        });
      }
    });

    ScrollTrigger.create({
      trigger: '.about-image-row',
      start: 'top 80%',
      onEnter: () => {
        gsap.from('.air-img', {
          opacity: 0, scale: 0.95, duration: 0.9, ease: 'expo.out', stagger: 0.15
        });
      }
    });
  }

  function animateGallery() {
    gsap.from('.gallery-header', { opacity: 0, y: 40, duration: 0.8, ease: 'expo.out' });
    gsap.from('.mg-item', {
      opacity: 0, scale: 0.95, duration: 0.8, ease: 'expo.out', stagger: {
        amount: 0.8, grid: 'auto', from: 'center'
      }, delay: 0.4
    });
  }

  function animateContact() {
    gsap.from('.contact-left > *', {
      opacity: 0, x: -40, duration: 0.8, ease: 'expo.out', stagger: 0.1, delay: 0.2
    });
    gsap.from('.contact-form-wrap', {
      opacity: 0, x: 40, duration: 0.8, ease: 'expo.out', delay: 0.4
    });
    gsap.from('.form-group', {
      opacity: 0, y: 20, duration: 0.6, ease: 'expo.out', stagger: 0.08, delay: 0.7
    });
  }

  /* ─────────────────────────────────────────────────────
     7. MENU TABS
  ───────────────────────────────────────────────────── */
  function initMenuTabs() {
    const tabs = document.querySelectorAll('.menu-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        if (tab.classList.contains('active')) return;

        const cat = tab.dataset.cat;
        const activeGrid = document.querySelector('.menu-grid.active');
        const newGrid = document.getElementById('cat-' + cat);

        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        if (activeGrid) {
          gsap.to(activeGrid, {
            opacity: 0, y: 20, duration: 0.3, ease: 'power2.in',
            onComplete: () => {
              activeGrid.style.display = 'none';
              activeGrid.classList.remove('active');
              newGrid.style.display = 'grid';
              newGrid.classList.add('active');
              gsap.from(newGrid.querySelectorAll('.menu-card'), {
                opacity: 0, y: 30, duration: 0.6, ease: 'expo.out', stagger: 0.08
              });
              gsap.set(newGrid, { opacity: 1, y: 0 });
            }
          });
        }
      });
    });
  }

  /* ─────────────────────────────────────────────────────
     8. NAV SCROLL BEHAVIOR
  ───────────────────────────────────────────────────── */
  function initNavScroll() {
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('mainNav');
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  /* ─────────────────────────────────────────────────────
     9. MOBILE NAV
  ───────────────────────────────────────────────────── */
  function initMobileNav() {
    const ham = document.getElementById('navHamburger');
    const mobileNav = document.getElementById('mobileNav');
    let mobileOpen = false;

    if (!ham) return;

    ham.addEventListener('click', () => {
      mobileOpen = !mobileOpen;
      mobileNav.classList.toggle('open', mobileOpen);
      const spans = ham.querySelectorAll('span');
      if (mobileOpen) {
        gsap.to(spans[0], { rotation: 45, y: 6, duration: 0.3 });
        gsap.to(spans[1], { opacity: 0, duration: 0.2 });
        gsap.to(spans[2], { rotation: -45, y: -6, duration: 0.3 });
      } else {
        gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
        gsap.to(spans[1], { opacity: 1, duration: 0.2 });
        gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3 });
      }
    });

    document.querySelectorAll('.mob-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        mobileOpen = false;
        mobileNav.classList.remove('open');
        const spans = ham.querySelectorAll('span');
        gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
        gsap.to(spans[1], { opacity: 1, duration: 0.2 });
        gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3 });
        setTimeout(() => navigateTo(section), 300);
      });
    });
  }

  /* ─────────────────────────────────────────────────────
     10. CLICK ROUTING (all nav links, CTAs, footer)
  ───────────────────────────────────────────────────── */
  function initRouting() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-section]');
      if (!target) return;
      e.preventDefault();
      const section = target.dataset.section;
      if (section) navigateTo(section);
    });

    // Logo click → home
    document.querySelector('.nav-logo')?.addEventListener('click', () => navigateTo('home'));
    document.querySelector('.footer-logo')?.addEventListener('click', () => navigateTo('home'));

    // Skip intro
    document.getElementById('introSkip')?.addEventListener('click', skipIntro);

    // Nav reserve button → contact
    document.querySelector('.nav-reserve')?.addEventListener('click', () => navigateTo('contact'));
  }

  /* ─────────────────────────────────────────────────────
     11. SKIP INTRO
  ───────────────────────────────────────────────────── */
  function skipIntro() {
    // Kill only the intro timeline's tweens, NOT everything (which would
    // also kill the site-entrance tweens that are about to start).
    gsap.killTweensOf('#cinematicIntro');
    gsap.killTweensOf('.pizza-whole');
    gsap.killTweensOf('.coffee-cup');
    gsap.killTweensOf('.pour-stream');
    gsap.killTweensOf('.steam-container');
    gsap.killTweensOf('.layer');
    gsap.killTweensOf('#introBrand');
    gsap.killTweensOf('#scene-coffee');
    gsap.killTweensOf('#scene-burger');
    gsap.killTweensOf('#scene-pizza');

    const intro = document.getElementById('cinematicIntro');
    gsap.to(intro, {
      opacity: 0, duration: 0.4, ease: 'power2.inOut',
      onComplete: () => {
        intro.style.display = 'none';
        animateSiteEntrance();
        initGalleryEffects();
      }
    });
  }

  /* ─────────────────────────────────────────────────────
     12. PARALLAX (hero image)
  ───────────────────────────────────────────────────── */
  function initParallax() {
    window.addEventListener('scroll', () => {
      const heroImg = document.querySelector('.hero-img');
      if (heroImg && currentSection === 'home') {
        const scrollY = window.scrollY;
        heroImg.style.transform = `scale(1.05) translateY(${scrollY * 0.15}px)`;
      }
    });
  }

  /* ─────────────────────────────────────────────────────
     13. CONTACT FORM
  ───────────────────────────────────────────────────── */
  function initContactForm() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('submit-btn')) {
        const btn = e.target;
        const origText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.style.opacity = '0.7';
        btn.style.pointerEvents = 'none';

        setTimeout(() => {
          btn.textContent = '✓ Reservation Confirmed';
          btn.style.background = '#2d6a1f';
          btn.style.opacity = '1';

          setTimeout(() => {
            btn.textContent = origText;
            btn.style.background = '';
            btn.style.pointerEvents = '';
          }, 3000);
        }, 1500);
      }
    });
  }

  /* ─────────────────────────────────────────────────────
     14. AMBIENT GOLD GLOW ON HERO (mouse track)
  ───────────────────────────────────────────────────── */
  function initHeroGlow() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const overlay = hero.querySelector('.hero-overlay');
      if (overlay) {
        overlay.style.background = `
          radial-gradient(ellipse 50% 50% at ${x}% ${y}%, rgba(201,168,76,0.06) 0%, transparent 60%),
          linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.75) 100%)
        `;
      }
    });
  }

  /* ─────────────────────────────────────────────────────
     15. GALLERY ITEM STAGGER ON HOVER
  ───────────────────────────────────────────────────── */
  function initGalleryEffects() {
    document.querySelectorAll('.mg-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, { scale: 1.02, zIndex: 5, duration: 0.4, ease: 'expo.out' });
      });
      item.addEventListener('mouseleave', () => {
        gsap.to(item, { scale: 1, zIndex: 1, duration: 0.5, ease: 'expo.out' });
      });
    });
  }

  /* ─────────────────────────────────────────────────────
     16. FEATURED ITEM CLICK → MENU
  ───────────────────────────────────────────────────── */
  function initFeaturedItems() {
    document.querySelectorAll('.featured-item').forEach(item => {
      item.style.cursor = 'pointer';
    });
  }

  /* ─────────────────────────────────────────────────────
     INIT — BOOT SEQUENCE
  ───────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    // Set initial GSAP states
    gsap.set('.coffee-cup', { opacity: 0, y: 40, scale: 0.9 });
    gsap.set('.layer', { opacity: 0, y: -30, scaleX: 0.5 });
    gsap.set('.pizza-whole', { opacity: 0, scale: 0, rotation: -180 });
    gsap.set('#introBrand', { opacity: 0 });
    gsap.set('#scene-coffee .scene-label', { opacity: 0, y: 10 });
    gsap.set('#scene-burger .scene-label', { opacity: 0, y: 10 });
    gsap.set('#scene-pizza .scene-label', { opacity: 0, y: 10 });
    gsap.set('#cinematicIntro', { clipPath: 'inset(0 0 0% 0)' });

    // Hero elements reset
    gsap.set(['.hero-eyebrow', '.hero-sub', '.hero-cta-wrap', '.hero-scroll-cue', '.hero-stats'], {
      opacity: 0, y: 20
    });

    // Init routing & interactions
    initRouting();
    initNavScroll();
    initMobileNav();
    initMenuTabs();
    initContactForm();
    initParallax();
    initFeaturedItems();

    // Slight delay then init gallery & hero glow when on home
    setTimeout(() => {
      initHeroGlow();
    }, 500);

    // BOOT: Preloader → Cinematic Intro → Site
    // Safety net: if something goes wrong in the intro (e.g. a browser that
    // doesn't support a particular GSAP feature), force-reveal the site after
    // a maximum of 11 seconds so users are never left on a blank screen.
    const safetyTimer = setTimeout(() => {
      const intro = document.getElementById('cinematicIntro');
      if (intro && intro.style.display !== 'none') {
        console.warn('NOIR: safety fallback triggered — forcing site reveal.');
        intro.style.display = 'none';
        animateSiteEntrance();
        initGalleryEffects();
      }
    }, 11000);

    runPreloader(() => {
      setTimeout(() => {
        runCinematicIntro(() => {
          clearTimeout(safetyTimer); // intro completed normally — cancel the fallback
          const intro = document.getElementById('cinematicIntro');
          if (intro) intro.style.display = 'none';
          animateSiteEntrance();
          initGalleryEffects();
        });
      }, 200);
    });
  });

})();
