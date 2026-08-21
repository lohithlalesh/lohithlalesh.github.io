(function () {
  'use strict';

  var root = document.getElementById('signatureSlideshow');
  if (!root) return;

  var slides = Array.prototype.slice.call(root.querySelectorAll('.signature__slide'));
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var delay = 5200;
  var index = 0;
  var timer = 0;
  var visible = false;


  function primeImage(slide) {
    var image = slide && slide.querySelector('img');
    if (!image) return;
    image.loading = 'eager';
    if (typeof image.decode === 'function') image.decode().catch(function () {});
  }


  function show(next) {
    index = (next + slides.length) % slides.length;
    if (visible) {
      primeImage(slides[index]);
      primeImage(slides[(index + 1) % slides.length]);
    }

    slides.forEach(function (slide, slideIndex) {
      var active = slideIndex === index;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

  }

  function stop() {
    window.clearTimeout(timer);
    timer = 0;
  }

  function schedule() {
    stop();
    if (!visible || document.hidden || reduceMotion || slides.length < 2) return;
    timer = window.setTimeout(function () {
      show(index + 1);
      schedule();
    }, delay);
  }

  function setVisible(isVisible) {
    visible = isVisible;
    if (visible) {
      primeImage(slides[index]);
      primeImage(slides[(index + 1) % slides.length]);
      schedule();
    } else {
      stop();
    }
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else schedule();
  });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        setVisible(entry.isIntersecting && entry.intersectionRatio > 0.08);
      });
    }, { threshold: [0, 0.08, 0.2] });
    observer.observe(root);
  } else {
    setVisible(true);
  }

  show(0);
})();
