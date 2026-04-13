/**
 * Scroll reveal via IntersectionObserver
 */
import { $$, prefersReducedMotion } from './utils.js';

const REVEAL_SELECTOR = '.reveal, .reveal--left, .reveal--scale, .reveal--clip, .reveal--parallax, .reveal-stagger, .divider--animated';

if (!prefersReducedMotion() && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  $$(REVEAL_SELECTOR).forEach((el) => observer.observe(el));
} else {
  $$(REVEAL_SELECTOR).forEach((el) => el.classList.add('is-visible'));
}

// Hero W watermark parallax
const hero = document.querySelector('.hero');
if (hero && !prefersReducedMotion()) {
  let heroTicking = false;
  let heroDone = false;
  const onHeroScroll = () => {
    if (heroDone) return;
    if (!heroTicking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;
        if (scrollY < heroHeight) {
          const offset = scrollY * 0.08;
          hero.style.setProperty('--hero-w-offset', `${offset}px`);
        } else {
          // Scrolled past hero — clean up listener
          heroDone = true;
          window.removeEventListener('scroll', onHeroScroll);
        }
        heroTicking = false;
      });
      heroTicking = true;
    }
  };
  window.addEventListener('scroll', onHeroScroll, { passive: true });
}
