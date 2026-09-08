/* author: imyzt */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var body = document.body;
  if (!body || !body.classList.contains('shred-motion') || reduce) {
    if (body) body.classList.add('is-ready');
    return;
  }

  function reveal(el) {
    el.classList.add('is-in');
  }

  function boot() {
    body.classList.add('is-ready');
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-shred-item]'));
    if (!items.length) return;

    // 兜底：避免 IO/样式异常时内容一直不可见
    window.setTimeout(function () {
      items.forEach(reveal);
    }, 1200);

    if (!('IntersectionObserver' in window)) {
      items.forEach(reveal);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    items.forEach(function (el, idx) {
      if (!el.style.getPropertyValue('--i')) {
        el.style.setProperty('--i', String(Math.min(idx, 12)));
      }
      io.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
