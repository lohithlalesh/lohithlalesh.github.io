/* Scroll-scrub the pre-rendered manufacturing sequence without autoplaying it. */
(function () {
  'use strict';

  const sections = document.querySelectorAll('[data-experience-video]');
  if (!sections.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  sections.forEach(section => {
    const video = section.querySelector('[data-scroll-video]');
    const steps = [...section.querySelectorAll('[data-experience-step]')];
    if (!video) return;

    let metadataReady = false;
    let seekPending = false;
    let targetTime = 0;
    let frameQueued = false;

    const loadVideo = () => {
      if (video.src || !video.dataset.src || reducedMotion) return;
      video.preload = 'auto';
      video.src = video.dataset.src;
      video.load();
    };

    const setStep = progress => {
      const index = progress < .31 ? 0 : progress < .66 ? 1 : 2;
      steps.forEach((step, stepIndex) => {
        step.classList.toggle('is-active', stepIndex === index);
        step.setAttribute('aria-current', stepIndex === index ? 'step' : 'false');
      });
    };

    const seekToTarget = () => {
      if (!metadataReady || seekPending || !Number.isFinite(video.duration)) return;
      if (Math.abs(video.currentTime - targetTime) < .025) return;
      seekPending = true;
      try {
        video.currentTime = targetTime;
      } catch (error) {
        seekPending = false;
      }
    };

    const update = () => {
      frameQueued = false;
      const rect = section.getBoundingClientRect();
      const scrollRange = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / scrollRange));

      section.style.setProperty('--experience-progress', progress.toFixed(4));
      setStep(progress);

      if (metadataReady && Number.isFinite(video.duration)) {
        targetTime = progress * Math.max(.01, video.duration - .06);
        seekToTarget();
      }
    };

    const requestUpdate = () => {
      if (frameQueued) return;
      frameQueued = true;
      requestAnimationFrame(update);
    };

    video.addEventListener('loadedmetadata', () => {
      metadataReady = true;
      update();
    }, { once: true });

    video.addEventListener('seeked', () => {
      seekPending = false;
      seekToTarget();
    });

    if (!reducedMotion) {
      if ('IntersectionObserver' in window) {
        const loader = new IntersectionObserver(entries => {
          if (entries.some(entry => entry.isIntersecting)) {
            loadVideo();
            loader.disconnect();
          }
        }, { rootMargin: '100% 0px' });
        loader.observe(section);
      } else {
        loadVideo();
      }

      window.addEventListener('scroll', requestUpdate, { passive: true });
      window.addEventListener('resize', requestUpdate);
    }

    update();
  });
})();
