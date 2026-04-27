import { $$, prefersReducedMotion } from './utils.js';
import { watchReducedMotion } from './utils/accessibility.js';

const STRENGTH = 0.3;
const RADIUS = 60;

const apply = () => {
  $$('.btn:not([disabled])').forEach((btn) => {
    if (btn.dataset.magneticApplied) return;
    btn.dataset.magneticApplied = '1';
    btn.classList.add('btn--magnetic');
    let isPressed = false;

    btn.addEventListener('mousemove', (e) => {
      if (isPressed) return;
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < RADIUS) {
        const pull = 1 - dist / RADIUS;
        btn.style.transform = `translate(${dx * STRENGTH * pull}px, ${dy * STRENGTH * pull}px)`;
      }
    });

    btn.addEventListener('mouseleave', () => {
      isPressed = false;
      btn.style.transform = '';
    });

    btn.addEventListener('mousedown', () => {
      isPressed = true;
      btn.style.transform = 'scale(0.97)';
    });

    btn.addEventListener('mouseup', () => {
      isPressed = false;
      btn.style.transform = '';
    });
  });
};

const remove = () => {
  $$('[data-magnetic-applied]').forEach((btn) => {
    btn.classList.remove('btn--magnetic');
    btn.style.transform = '';
  });
};

if (!prefersReducedMotion()) apply();

watchReducedMotion(remove, apply);
