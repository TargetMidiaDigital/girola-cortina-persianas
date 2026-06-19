/* ============================================
   Girola Cortinas e Persianas — Landing Page
   script.js — reveal, FAQ accordion, smooth scroll, header
   ============================================ */

// ── Vídeo de fundo do Hero: força autoplay; se bloqueado, mostra a imagem ──
(function () {
  const v = document.querySelector('.hero-video');
  if (!v) return;

  // garante muted/inline antes de tentar tocar (exigência de iOS/Android)
  v.muted = true;
  v.defaultMuted = true;
  v.setAttribute('muted', '');
  v.playsInline = true;

  let settled = false;
  function showImage() {
    if (settled) return;
    settled = true;
    v.classList.add('is-hidden'); // revela o background-image do #hero
  }
  function markPlaying() { settled = true; }

  function attempt() {
    if (settled) return;
    const p = v.play();
    if (p && typeof p.then === 'function') {
      p.then(markPlaying).catch(() => {
        // tenta de novo no primeiro toque/scroll; se nem assim, mostra a imagem
        const retry = () => { v.play().then(markPlaying).catch(showImage); cleanup(); };
        const cleanup = () => ['touchstart', 'pointerdown', 'scroll'].forEach(ev => window.removeEventListener(ev, retry));
        ['touchstart', 'pointerdown', 'scroll'].forEach(ev => window.addEventListener(ev, retry, { passive: true, once: true }));
        // fallback final: se continuar pausado, troca pela imagem
        setTimeout(() => { if (v.paused) showImage(); }, 1500);
      });
    }
  }

  if (v.readyState >= 2) attempt();
  else v.addEventListener('canplay', attempt, { once: true });
})();

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

  const stage = showcase.querySelector('.showcase-stage');
  const panels = Array.from(showcase.querySelectorAll('.showcase-panel'));
  const thumbs = Array.from(showcase.querySelectorAll('.showcase-thumb'));
  let current = 0;

  function select(i, scrollThumb) {
    current = (i + panels.length) % panels.length;
    panels.forEach((p, pi) => p.classList.toggle('active', pi === current));
    thumbs.forEach((t, ti) => {
      const on = ti === current;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    if (scrollThumb && thumbs[current]) {
      thumbs[current].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  thumbs.forEach((thumb, i) => {
    thumb.setAttribute('role', 'tab');
    thumb.addEventListener('click', () => select(i, true));
  });

  // Swipe no painel (mobile) para passar entre modelos
  if (stage) {
    let startX = 0, startY = 0;
    stage.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX; startY = e.touches[0].clientY;
    }, { passive: true });
    stage.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        select(current + (dx < 0 ? 1 : -1), true);
      }
    }, { passive: true });
  }
})();

// ── Header com sombra ao rolar ──
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 4) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }, { passive: true });
}
