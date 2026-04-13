/**
 * Navbar scroll effect + active section tracking
 */
import { $, $$ } from './utils.js';

const navbar = $('#navbar');
const links = $$('.navbar__link[href^="#"]');
const sections = $$('section[id]');
const SCROLL_THRESHOLD = 80;

const handleScroll = () => {
  navbar.classList.toggle('navbar--scrolled', window.scrollY > SCROLL_THRESHOLD);
};

const updateActiveLink = () => {
  let current = '';
  const offset = 100;

  for (const section of sections) {
    const top = section.offsetTop - offset;
    if (window.scrollY >= top) {
      current = section.id;
    }
  }

  for (const link of links) {
    const href = link.getAttribute('href').slice(1);
    link.classList.toggle('navbar__link--active', href === current);
    if (href === current) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  }
};

// Throttle scroll handler via requestAnimationFrame
let ticking = false;
const onScroll = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      handleScroll();
      updateActiveLink();
      ticking = false;
    });
    ticking = true;
  }
};

if (navbar) {
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
