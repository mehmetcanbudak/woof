/**
 * Main entry point — import all modules
 */
import { isOpen as mobileNavOpen, closeMobileNav } from './mobile-nav.js';
import { isActive as modalActive, closeModal } from './modal.js';

import './navbar.js';
import './theme.js';
import './slideshow.js';
import './form.js';
import './cursor-hover.js';
import './smooth-scroll.js';
import './scroll-reveal.js';
import './lazy-map.js';
import './page-load.js';
import './scroll-progress.js';
import './magnetic-btn.js';
import './gallery-tilt.js';

// Shared keyboard handler — Escape closes topmost overlay
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modalActive()) closeModal();
    else if (mobileNavOpen()) closeMobileNav();
  }
});
