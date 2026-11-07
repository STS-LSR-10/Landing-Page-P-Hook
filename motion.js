/**
 * Motion layer for the "ledger notebook" theme.
 * - Reading-progress pen line under the navbar.
 * - Reveal-on-scroll: titles wipe in like ink, cards rise in.
 * - Receipt slips in the hero drift with the pointer.
 */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initProgress() {
    const bar = document.getElementById('readProgress');
    if (!bar) return;
    let ticking = false;
    const paint = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.setProperty('--p', p.toFixed(4));
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(paint); }
    }, { passive: true });
    window.addEventListener('resize', paint);
    paint();
  }

  function initReveal() {
    const groups = [
      '.section-header > *', '.sim-presets', '.sim-device-container', '.sim-info-box',
      '.feature-card', '.webapp-tabs', '.webapp-phone-mockup', '.webapp-detail-card',
      '.persona-tab', '.persona-preview-box', '.explorer-controls',
      '.pricing-card', '.faq-item', '.support-bar',
      '.privacy-box > *', '.priv-col', '.cta-content > *', '.cta-mascot',
      '.hero-badge', '.hero-desc', '.hero-cta-group', '.hero-trust', '.hero-phone'
    ];
    const els = [...new Set(document.querySelectorAll(groups.join(',')))];
    const byParent = new Map();
    els.forEach((el) => {
      const k = el.parentElement;
      const n = byParent.get(k) || 0;
      byParent.set(k, n + 1);
      el.style.setProperty('--i', Math.min(n, 8));
      el.setAttribute('data-reveal', '');
    });
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    els.forEach((el) => io.observe(el));
  }

  function initDrift() {
    const hero = document.getElementById('hero');
    const visual = hero && hero.querySelector('.hero-visual');
    if (!visual) return;
    visual.querySelectorAll('.slip').forEach((s, i) => s.style.setProperty('--n', i));
    if (reduce || window.matchMedia('(hover: none)').matches) return;
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const py = ((e.clientY - r.top) / r.height - 0.5) * 2;
      visual.style.setProperty('--px', px.toFixed(3));
      visual.style.setProperty('--py', py.toFixed(3));
    });
    hero.addEventListener('pointerleave', () => {
      visual.style.setProperty('--px', 0);
      visual.style.setProperty('--py', 0);
    });
  }

  function initNav() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  const start = () => { initProgress(); initReveal(); initDrift(); initNav(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
