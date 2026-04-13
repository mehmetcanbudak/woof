/**
 * Hero background slideshow
 */
import { $$, prefersReducedMotion } from './utils.js';

const slides = $$('.hero__slide');
let currentSlide = 0;
let interval;

const next = () => {
  slides[currentSlide].classList.remove('hero__slide--active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('hero__slide--active');
};

const start = () => {
  if (prefersReducedMotion()) return;
  interval = setInterval(next, 6200);
};

const stop = () => clearInterval(interval);

window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
  if (prefersReducedMotion()) stop(); else start();
});

// Pause slideshow when tab is hidden, resume when visible
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stop();
  else if (!prefersReducedMotion()) start();
});

if (slides.length) start();

// Pause slideshow when hero is off-screen
if (slides.length && 'IntersectionObserver' in window) {
  const hero = document.querySelector('.hero');
  if (hero) {
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!prefersReducedMotion()) start();
        } else {
          stop();
        }
      },
      { threshold: 0 }
    );
    heroObserver.observe(hero);
  }
}
