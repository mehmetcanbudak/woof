/**
 * Mobile navigation overlay
 */
import { $, $$, trapFocus, lockScroll, unlockScroll } from './utils.js';

const toggle = $('#mobileToggle');
const nav = $('#mobileNav');
const closeBtn = $('#mobileClose');
const links = $$('.mobile-nav__link');

const open = () => {
  nav.classList.add('mobile-nav--active');
  nav.setAttribute('aria-hidden', 'false');
  toggle.classList.add('active');
  toggle.setAttribute('aria-expanded', 'true');
  toggle.setAttribute('aria-label', 'Close menu');
  lockScroll();
  closeBtn.focus();
};

const close = () => {
  nav.classList.remove('mobile-nav--active');
  nav.setAttribute('aria-hidden', 'true');
  toggle.classList.remove('active');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
  unlockScroll();
  toggle.focus();
};

if (toggle && nav && closeBtn) {
  toggle.addEventListener('click', open);
  closeBtn.addEventListener('click', close);

  for (const link of links) {
    link.addEventListener('click', close);
  }

  nav.addEventListener('keydown', (e) => trapFocus(nav, e));
}

export const isOpen = () => nav?.classList.contains('mobile-nav--active') ?? false;
export const closeMobileNav = close;
