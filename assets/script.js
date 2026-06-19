/* ============================================
   Girola Cortinas e Persianas — Landing Page
   script.js — reveal, FAQ accordion, smooth scroll, header
   ============================================ */

// ── Reveal on scroll ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── FAQ accordion ──
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      if (openItem !== item) openItem.classList.remove('open');
    });

    item.classList.toggle('open', !isOpen);
  });
});

// ── Smooth scroll para âncoras internas ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#' || href.length < 2) return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const headerOffset = 80;
    const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Showcase de modelos (todos visíveis + destaque) ──
(function () {
  const showcase = document.getElementById('modelos-showcase');
  if (!showcase) return;

  const panels = Array.from(showcase.querySelectorAll('.showcase-panel'));
  const thumbs = Array.from(showcase.querySelectorAll('.showcase-thumb'));

  function select(i) {
    panels.forEach((p, pi) => p.classList.toggle('active', pi === i));
    thumbs.forEach((t, ti) => {
      const on = ti === i;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }

  thumbs.forEach((thumb, i) => {
    thumb.setAttribute('role', 'tab');
    thumb.addEventListener('click', () => select(i));
  });
})();

// ── Header com sombra ao rolar ──
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 4) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }, { passive: true });
}
