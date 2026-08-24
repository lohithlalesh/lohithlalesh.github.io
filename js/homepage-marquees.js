(function () {
  'use strict';

  var hosts = document.querySelectorAll('.brands-marquee__scroll, .clients__marquee');
  if (!hosts.length) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var marquees = [];
  var marqueeByHost = new Map();
  var lastTime = 0;
  var loopRunning = false;

  function measure(item) {
    var children = item.track.children;
    var half = Math.floor(children.length / 2);
    if (!half || children.length % 2 !== 0) {
      item.shift = item.track.scrollWidth / 2;
      return;
    }

    item.shift = children[half].offsetLeft - children[0].offsetLeft;
    if (item.shift <= 0) item.shift = item.track.scrollWidth / 2;
  }

  hosts.forEach(function (host) {
    var track = host.querySelector('.brands-marquee__track, .clients__track');
    if (!track || track.children.length < 2) return;

    host.classList.add('is-js-marquee-host');
    track.classList.add('is-js-marquee', 'is-marquee-ready');
    host.style.direction = 'ltr';
    track.style.direction = 'ltr';

    var item = {
      host: host,
      track: track,
      offset: 0,
      shift: 0,
      speed: reducedMotion ? 0 : (window.innerWidth < 700 ? 52 : 72),
      active: false
    };

    marquees.push(item);
    marqueeByHost.set(host, item);

    track.querySelectorAll('img').forEach(function (image) {
      if (!image.complete) image.addEventListener('load', function () {
        if (item.active) measure(item);
      }, { once: true });
    });
  });

  if ('IntersectionObserver' in window) {
    var visibilityObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var item = marqueeByHost.get(entry.target);
        if (!item) return;
        item.active = entry.isIntersecting;
        if (item.active) {
          measure(item);
          startLoop();
        }
      });
    }, { rootMargin: '220px 0px', threshold: 0 });

    marquees.forEach(function (item) { visibilityObserver.observe(item.host); });
  } else {
    marquees.forEach(function (item) {
      item.active = true;
      measure(item);
    });
    startLoop();
  }

  function startLoop() {
    if (loopRunning || reducedMotion) return;
    loopRunning = true;
    lastTime = 0;
    window.requestAnimationFrame(tick);
  }

  function tick(time) {
    if (!lastTime) lastTime = time;
    var elapsed = Math.min((time - lastTime) / 1000, .08);
    lastTime = time;

    if (document.visibilityState === 'visible') {
      marquees.forEach(function (item) {
        if (!item.active || item.speed <= 0) return;
        if (item.shift <= 0) measure(item);
        if (item.shift <= 0) return;

        item.offset += item.speed * elapsed;
        if (item.offset >= item.shift) item.offset %= item.shift;
        item.track.style.transform = 'translate3d(' + (-item.offset) + 'px, 0, 0)';
      });
    }

    if (marquees.some(function (item) { return item.active && item.speed > 0; })) {
      window.requestAnimationFrame(tick);
    } else {
      loopRunning = false;
      lastTime = 0;
    }
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      marquees.forEach(function (item) {
        item.speed = reducedMotion ? 0 : (window.innerWidth < 700 ? 52 : 72);
        if (item.active) measure(item);
        if (item.shift > 0) item.offset %= item.shift;
      });
    }, 180);
  });

  window.addEventListener('load', function () {
    marquees.forEach(function (item) {
      if (item.active) measure(item);
    });
  }, { once: true });

})();
