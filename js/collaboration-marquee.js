(function () {
  'use strict';

  var marquee = document.querySelector('[data-collaboration-marquee]');
  if (!marquee) return;

  if (window.location.protocol === 'file:') {
    marquee.classList.add('is-local');
  }

  var track = marquee.querySelector('.collaboration-track');
  if (!track || !track.firstElementChild) return;

  var deferredFrames = track.querySelectorAll('iframe[data-src]');

  function loadFrame(frame) {
    if (!frame || !frame.dataset.src || frame.src) return;
    frame.src = frame.dataset.src;
    frame.removeAttribute('data-src');
  }

  if (window.location.protocol !== 'file:' && deferredFrames.length) {
    if ('IntersectionObserver' in window) {
      var frameObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          loadFrame(entry.target);
          frameObserver.unobserve(entry.target);
        });
      }, { root: marquee, rootMargin: '0px 720px' });
      deferredFrames.forEach(function (frame) { frameObserver.observe(frame); });
    } else {
      deferredFrames.forEach(loadFrame);
    }
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var speed = window.innerWidth < 700 ? 66 : 78;
  var offset = 0;
  var step = 0;
  var lastTime = 0;
  var isVisible = true;

  function measureStep() {
    var card = track.querySelector('.collaboration-card');
    if (!card) return;
    var styles = window.getComputedStyle(track);
    step = card.getBoundingClientRect().width + parseFloat(styles.columnGap || styles.gap || 0);
  }

  function render() {
    track.style.transform = 'translate3d(' + (-offset).toFixed(2) + 'px, 0, 0)';
  }

  function recycleCards() {
    if (!step) return;
    while (offset >= step && track.firstElementChild) {
      offset -= step;
      track.appendChild(track.firstElementChild);
    }
  }

  function tick(time) {
    if (!lastTime) lastTime = time;
    var elapsed = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;

    if (!reduceMotion && isVisible && document.visibilityState === 'visible') {
      offset += speed * elapsed;
      recycleCards();
      render();
    }

    window.requestAnimationFrame(tick);
  }

  function refreshMeasurements() {
    speed = window.innerWidth < 700 ? 66 : 78;
    measureStep();
    recycleCards();
    render();
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      isVisible = entries[0] ? entries[0].isIntersecting : true;
    }, { rootMargin: '180px 0px' }).observe(marquee);
  }

  window.addEventListener('resize', refreshMeasurements, { passive: true });
  window.addEventListener('load', refreshMeasurements, { once: true });
  measureStep();
  render();
  window.requestAnimationFrame(tick);
})();
