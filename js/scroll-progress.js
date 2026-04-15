import { $, prefersReducedMotion } from './utils.js';
import { throttleRAF } from './utils/throttle.js';
import { watchReducedMotion } from './utils/accessibility.js';

const bar = $('#scrollProgress');

if (bar) {
  let listenerActive = false;

  const update = () => {
    const scrolled = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = height > 0 ? (scrolled / height) * 100 : 0;
    bar.style.width = `${progress}%`;
  };

  const onScroll = throttleRAF(update);

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

  watchReducedMotion(stop, start);

  if (!prefersReducedMotion()) start();
  else bar.style.display = 'none';
}
