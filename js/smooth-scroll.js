/**
 * Smooth scroll for anchor links
 */
import { $, $$, prefersReducedMotion } from './utils.js';

const SCROLL_OFFSET = 80;

$$('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#' || href === '#booking') return;

    const target = $(href);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
      window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }
  });
});

// Logo scrolls to top
const logo = $('.navbar__logo');
if (logo) {
  logo.addEventListener('click', (e) => {
    if (logo.getAttribute('href') === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }
  });
}
