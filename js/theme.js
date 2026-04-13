/**
 * Light/dark theme toggle with localStorage persistence.
 * Respects system preference on first visit.
 */
import { $ } from './utils.js';

const STORAGE_KEY = 'theme';
const toggle = $('#themeToggle');

const THEME_COLOR_LIGHT = '#3a322a';
const THEME_COLOR_DARK = '#1a1612';

const setTheme = (dark) => {
  document.documentElement.classList.toggle('dark', dark);
  if (toggle) toggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  const region = document.getElementById('liveRegion');
  if (region) region.textContent = dark ? 'Switched to dark theme' : 'Switched to light theme';

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = dark ? THEME_COLOR_DARK : THEME_COLOR_LIGHT;
};

const getStored = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark') return true;
  if (stored === 'light') return false;
  // No preference stored — follow system
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

if (toggle) {
  // Set initial aria-label to match current state
  toggle.setAttribute('aria-label', getStored() ? 'Switch to light theme' : 'Switch to dark theme');

  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    document.documentElement.classList.add('theme-transitioning');
    setTheme(!isDark);
    localStorage.setItem(STORAGE_KEY, isDark ? 'light' : 'dark');
    setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 400);
  });
}

// Sync if system preference changes and no manual override stored
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    setTheme(e.matches);
  }
});
