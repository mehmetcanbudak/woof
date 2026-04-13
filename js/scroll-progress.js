import { $, prefersReducedMotion } from './utils.js';

const bar = $('#scrollProgress');

if (bar) {
  let ticking = false;
  let listenerActive = false;

  const update = () => {
    const scrolled = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = height > 0 ? (scrolled / height) * 100 : 0;
    bar.style.width = `${progress}%`;
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };

  const start = () => {
    if (listenerActive) return;
    listenerActive = true;
    bar.style.display = '';
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  };

  const stop = () => {
    if (!listenerActive) return;
    listenerActive = false;
    window.removeEventListener('scroll', onScroll);
    bar.style.width = '0%';
    bar.style.display = 'none';
  };

  // React to runtime changes in reduced-motion preference
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
    if (prefersReducedMotion()) stop(); else start();
  });

  if (!prefersReducedMotion()) start();
  else bar.style.display = 'none';
}
