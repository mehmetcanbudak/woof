import { $$, prefersReducedMotion } from './utils.js';

const MAX_TILT = 6;

const items = $$('.gallery__item');
let active = !prefersReducedMotion();

const enable = () => {
  if (active) return;
  active = true;
  items.forEach((item) => {
    item.addEventListener('mousemove', onMove);
    item.addEventListener('mouseleave', onLeave);
    item.addEventListener('mouseenter', onEnter);
  });
};

const disable = () => {
  if (!active) return;
  active = false;
  items.forEach((item) => {
    item.removeEventListener('mousemove', onMove);
    item.removeEventListener('mouseleave', onLeave);
    item.removeEventListener('mouseenter', onEnter);
    item.style.transform = '';
    item.style.transition = '';
  });
};

function onMove(e) {
  const rect = this.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  this.style.transform = `perspective(800px) rotateY(${x * MAX_TILT}deg) rotateX(${-y * MAX_TILT}deg) translateY(-2px)`;
}

function onLeave() {
  this.style.transform = '';
  this.style.transition = 'transform 0.5s ease-out';
  setTimeout(() => { this.style.transition = ''; }, 500);
}

function onEnter() {
  this.style.transition = 'none';
}

if (active) enable();

window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
  if (prefersReducedMotion()) disable(); else enable();
});
