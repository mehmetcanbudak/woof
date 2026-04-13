/**
 * Cursor hover image system
 */
import { $, $$, prefersReducedMotion } from './utils.js';

const cursorImg = $('#cursorImg');
const cursorLabel = $('#cursorImgLabel');

const hoverData = {
  'espresso':       { src: 'assets/espresso.webp', label: 'Espresso Shot' },
  'americano':      { src: 'assets/americano.webp', label: 'Americano' },
  'cappuccino':     { src: 'assets/cappuccino.webp', label: 'Cappuccino' },
  'latte':          { src: 'assets/latte.webp', label: 'Latte Art' },
  'matcha':         { src: 'assets/matcha.webp', label: 'Matcha Latte' },
  'iced-coffee':    { src: 'assets/iced-coffee.webp', label: 'Iced Coffee' },
  'croissant':      { src: 'assets/croissant.webp', label: 'Croissant' },
  'banana-bread':   { src: 'assets/banana-bread.webp', label: 'Banana Bread' },
  'bath-brush':     { src: 'assets/woofcut.webp', label: 'Bath & Brush' },
  'full-groom':     { src: 'assets/woofcut.webp', label: 'Full Groom' },
  'nail-trim':      { src: 'assets/woofcut.webp', label: 'Nail Trim' },
  'ear-cleaning':   { src: 'assets/woofcut.webp', label: 'Ear Cleaning' },
  'teeth-brushing': { src: 'assets/woofcut.webp', label: 'Teeth Brushing' },
  'puppy-intro':    { src: 'assets/woofcut.webp', label: 'Puppy Intro' },
};

let hoverActive = false;
let rafRunning = false;
let mouseX = 0;
let mouseY = 0;
let imgX = 0;
let imgY = 0;

const animate = () => {
  imgX += (mouseX - imgX) * 0.15;
  imgY += (mouseY - imgY) * 0.15;
  cursorImg.style.left = `${imgX}px`;
  cursorImg.style.top = `${imgY}px`;

  if (hoverActive) {
    requestAnimationFrame(animate);
  } else {
    rafRunning = false;
  }
};

const FALLBACK_COLOR = '#bfb6ab';

const show = (key) => {
  const item = hoverData[key];

  if (item) {
    cursorImg.style.background = '';
    cursorLabel.replaceChildren();
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.label;
    img.width = 180;
    img.height = 180;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:var(--radius-sm);';
    cursorLabel.appendChild(img);
  } else {
    cursorImg.style.background = FALLBACK_COLOR;
    cursorLabel.textContent = `${key}\nPhoto`;
  }

  hoverActive = true;
  cursorImg.classList.add('cursor-img--visible');
  if (!rafRunning) {
    rafRunning = true;
    requestAnimationFrame(animate);
  }
};

const hide = () => {
  hoverActive = false;
  cursorImg.classList.remove('cursor-img--visible');
};

const enable = () => {
  if (!cursorImg || !cursorLabel) return;
  $$('[data-hover-img]').forEach((el) => {
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('mousemove', onMove);
  });
};

const disable = () => {
  if (!cursorImg || !cursorLabel) return;
  hide();
  $$('[data-hover-img]').forEach((el) => {
    el.removeEventListener('mouseenter', onEnter);
    el.removeEventListener('mouseleave', onLeave);
    el.removeEventListener('mousemove', onMove);
  });
};

function onEnter() { show(this.dataset.hoverImg); }
function onLeave() { hide(); }
function onMove(e) {
  mouseX = e.clientX + 16;
  mouseY = e.clientY - 90;
  if (mouseX + 190 > window.innerWidth) mouseX = e.clientX - 196;
  if (mouseY < 10) mouseY = e.clientY + 20;
}

if (!prefersReducedMotion()) enable();

// Preload hover images after page load
const preloadImages = () => {
  for (const { src } of Object.values(hoverData)) {
    const img = new Image();
    img.src = src;
  }
};
if (document.readyState === 'complete') preloadImages();
else window.addEventListener('load', preloadImages);

// React to runtime reduced-motion changes
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
  if (prefersReducedMotion()) disable(); else enable();
});
