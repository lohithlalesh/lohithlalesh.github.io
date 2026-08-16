/* =========================================================================
   MOTTO AUTOMOTIVE - Front-end interactivity
   ========================================================================= */

(function () {
  'use strict';

  const isArabic = document.documentElement.lang.toLowerCase().startsWith('ar');
  const uiText = (english, arabic) => isArabic ? arabic : english;

  /* ---------- 1. NAV: transparent → solid on scroll ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 80) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2. MOBILE NAV DRAWER ---------- */
  const toggle = document.getElementById('navToggle');
  const drawer = document.getElementById('navDrawer');

  if (toggle && drawer) {
    const setDrawerOpen = isOpen => {
      drawer.classList.toggle('is-open', isOpen);
      toggle.classList.toggle('is-open', isOpen);
      nav?.classList.toggle('is-menu-open', isOpen);
      document.body.classList.toggle('is-locked', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen
        ? uiText('Close menu', 'إغلاق القائمة')
        : uiText('Open menu', 'فتح القائمة'));
    };

    toggle.addEventListener('click', () => {
      setDrawerOpen(!drawer.classList.contains('is-open'));
    });

    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        setDrawerOpen(false);
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') setDrawerOpen(false);
    });
  }

  /* ---------- 3. SCROLL REVEAL via IntersectionObserver ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- 4. SUBTLE PARALLAX on Experience section ---------- */
  const parallaxTargets = document.querySelectorAll('[data-parallax-target]');
  const parallaxSection = document.querySelector('[data-parallax]');
  if (parallaxTargets.length && parallaxSection && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const parallaxUpdate = () => {
      const rect = parallaxSection.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) return;
      const progress = (vh - rect.top) / (vh + rect.height);
      const offset = (progress - 0.5) * 100;
      parallaxTargets.forEach(t => {
        t.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0) scale(1.06)`;
      });
    };
    window.addEventListener('scroll', parallaxUpdate, { passive: true });
    window.addEventListener('resize', parallaxUpdate);
    parallaxUpdate();
  }

  /* ---------- 5. SMOOTH SCROLL fallback for older browsers ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- 6. LAZY LOAD HINT for older browsers ---------- */
  if (!('loading' in HTMLImageElement.prototype)) {
    const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      const lazyIO = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) img.src = img.dataset.src;
            lazyIO.unobserve(img);
          }
        });
      }, { rootMargin: '200px' });
      lazyImgs.forEach(i => lazyIO.observe(i));
    }
  }

  /* ---------- 7. SEAMLESS MARQUEE - fast, continuous, no restart jump ---------- */
  function measureMarqueeLoop(track) {
    const count = track.children.length;
    if (count < 2 || count % 2 !== 0) return 0;

    const totalWidth = track.scrollWidth;
    const loopWidth = totalWidth / 2;
    if (loopWidth <= 0) return 0;

    const half = count / 2;
    const first = track.children[0];
    const loopStart = track.children[half];
    const offsetWidth = loopStart && first
      ? loopStart.offsetLeft - first.offsetLeft
      : 0;

    /* Prefer scrollWidth/2; fall back to offset when subpixel differs */
    const shift = Math.abs(offsetWidth - loopWidth) < 3
      ? loopWidth
      : offsetWidth || loopWidth;

    return Math.round(shift);
  }

  function applyMarqueeShift(track) {
    const shift = measureMarqueeLoop(track);
    if (shift <= 0) {
      /* Measurement failed (odd child count / zero width) -
         fall back to the CSS -50% shift so the loop still runs */
      track.classList.add('is-marquee-ready');
      return false;
    }

    const next = `-${shift}px`;
    if (track.dataset.marqueeShift === next) return true;

    track.dataset.marqueeShift = next;
    track.style.setProperty('--marquee-shift', next);
    track.classList.add('is-marquee-ready');
    return true;
  }

  function waitForMarqueeImages(track) {
    const imgs = [...track.querySelectorAll('img')];
    if (!imgs.length) return Promise.resolve();

    return Promise.all(
      imgs.map(
        img =>
          new Promise(resolve => {
            if (img.complete) {
              resolve();
              return;
            }
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
          })
      )
    );
  }

  async function initSeamlessMarquee(track) {
    if (!track) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      track.classList.add('is-marquee-ready');
      return;
    }

    if (track.children.length < 2) return;

    track.classList.remove('is-marquee-ready');

    /* Reveal as soon as images load OR after a short timeout - never let one
       slow image keep the whole strip hidden (opacity:0 until is-marquee-ready). */
    const imagesLoaded = waitForMarqueeImages(track);
    const safetyTimeout = new Promise(r => setTimeout(r, 150));
    await Promise.race([imagesLoaded, safetyTimeout]);

    /* Layout after fonts/images */
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    applyMarqueeShift(track);

    /* Re-measure once every image has fully loaded, in case the timeout won the
       race above and widths were not final yet. */
    imagesLoaded.then(() =>
      requestAnimationFrame(() => applyMarqueeShift(track))
    );

    if (!track.dataset.marqueeBound) {
      track.dataset.marqueeBound = '1';

      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => applyMarqueeShift(track), 250);
      });
    }
  }

  function initAllMarquees() {
    document.querySelectorAll('.clients__track, .brands-marquee__track').forEach(initSeamlessMarquee);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllMarquees);
  } else {
    initAllMarquees();
  }

  window.addEventListener('load', () => initAllMarquees());
})();
