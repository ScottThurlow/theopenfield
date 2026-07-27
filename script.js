(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile nav toggle
  var navToggle = document.querySelector('.nav-toggle');
  var siteNav = document.querySelector('.site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll-reveal
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      );
      revealEls.forEach(function (el) { observer.observe(el); });
    }
  }

  // Back-to-top
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    var toggleBackToTop = function () {
      backToTop.classList.toggle('is-visible', window.scrollY > 600);
    };
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();
  }

  // Visit counter — fails silently (hides itself) if unreachable, e.g. on PPE
  var counterEl = document.querySelector('[data-visit-counter]');
  if (counterEl) {
    var endpoint = counterEl.getAttribute('data-visit-counter');
    var controller = ('AbortController' in window) ? new AbortController() : null;
    var timeoutId = controller ? setTimeout(function () { controller.abort(); }, 2500) : null;

    fetch(endpoint, { method: 'GET', signal: controller ? controller.signal : undefined })
      .then(function (res) {
        if (!res.ok) { throw new Error('bad status'); }
        return res.json();
      })
      .then(function (data) {
        if (!data || typeof data.count !== 'number') { throw new Error('bad payload'); }
        counterEl.textContent = data.count.toLocaleString() + ' reads so far';
      })
      .catch(function () {
        counterEl.remove();
      })
      .finally(function () {
        if (timeoutId) { clearTimeout(timeoutId); }
      });
  }
})();
