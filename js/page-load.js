import { $, prefersReducedMotion } from './utils.js';

const loader = $('#pageLoader');

if (loader) {
  const hide = () => {
    document.documentElement.classList.add('page-loaded');
    setTimeout(() => loader.remove(), 700);
  };

  if (prefersReducedMotion()) {
    hide();
  } else {
    Promise.race([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise((r) => setTimeout(r, 2000)),
    ]).then(() => setTimeout(hide, 300));
  }
}
