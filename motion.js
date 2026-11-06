/**
 * Scroll & motion layer for the "paper sheets" theme.
 * - Stacked sticky sheets: each section sticks, the next one slides over it,
 *   and the covered sheet dims slightly.
 * - Reveal-on-scroll for headers, cards, phones.
 * - Paper scraps in the hero drift with the pointer.
 * - Nav pill tightens after scrolling.
 */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initStack() {
    const stacks = [...document.querySelectorAll('main .stack')];
    if (!stacks.length) return;
    stacks.forEach((s) => {
      if (!s.querySelector(':scope > .stack__shade')) {
        const shade = document.createElement('div');
        shade.className = 'stack__shade';
        shade.setAttribute('aria-hidden', 'true');
        s.appendChild(shade);
      }
    });
    if (reduce) return;

    const measure = () => {
      const vh = window.innerHeight;
      stacks.forEach((s) => {
        s.style.setProperty('--stick', Math.min(0, vh - s.offsetHeight) + 'px');
      });
      paint();
    };

    let ticking = false;
    const paint = () => {
      ticking = false;
      const vh = window.innerHeight;
      for (let i = 0; i < stacks.length; i++) {
        const next = stacks[i + 1];
        let cover = 0;
        if (next) {
          const top = next.getBoundingClientRect().top;
          cover = Math.min(1, Math.max(0, (vh - top) / vh));
        }
        stacks[i].style.setProperty('--shade', (cover * 0.32).toFixed(3));
      }
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(paint); }
    }, { passive: true });
    window.addEventListener('resize', measure);
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(() => measure());
      stacks.forEach((s) => ro.observe(s));
    }
    window.addEventListener('load', measure);
    measure();
  }

  function initReveal() {
    const groups = [
      '.section-header', '.sim-presets', '.sim-device-container', '.sim-phone', '.sim-info-box',
      '.feature-card', '.webapp-tabs', '.webapp-phone-mockup', '.webapp-detail-card',
      '.persona-tab', '.persona-preview-box', '.explorer-controls',
      '.billing-toggle-wrapper', '.pricing-card', '.faq-item', '.support-bar',
      '.privacy-box > *', '.priv-col', '.cta-content > *', '.cta-mascot',
      '.hero-badge', '.hero-desc', '.hero-cta-group', '.hero-trust', '.hero-phone'
    ];
    const els = [...document.querySelectorAll(groups.join(','))];
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
    visual.querySelectorAll('.scrap').forEach((s, i) => s.style.setProperty('--n', i));
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

  const start = () => { initStack(); initReveal(); initDrift(); initNav(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
