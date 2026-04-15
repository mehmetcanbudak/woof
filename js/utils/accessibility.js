import { prefersReducedMotion } from '../utils.js';

export const watchReducedMotion = (onEnable, onDisable) => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handler = (e) => (e.matches ? onDisable?.() : onEnable?.());
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
};

export const initReducedMotion = (initialEnable, initialDisable) => {
  if (prefersReducedMotion()) {
    initialDisable?.();
  } else {
    initialEnable?.();
  }
};

export const watchColorScheme = (onEnable, onDisable) => {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (e) => (e.matches ? onEnable?.() : onDisable?.());
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
};