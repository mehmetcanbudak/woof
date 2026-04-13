/**
 * Shared utilities
 */

// Cache reduced-motion preference and update on change
let _reducedMotion = false;
try {
  const _mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  _reducedMotion = _mq.matches;
  if (_mq.addEventListener) _mq.addEventListener('change', (e) => { _reducedMotion = e.matches; });
  else if (_mq.addListener) _mq.addListener((e) => { _reducedMotion = e.matches; });
} catch {}
export const prefersReducedMotion = () => _reducedMotion;

export const $ = (sel, ctx = document) => ctx.querySelector(sel);
export const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

export const getFocusableElements = (container) =>
  $$('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', container);

export const trapFocus = (container, event) => {
  const focusable = getFocusableElements(container);
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.key === 'Tab') {
    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }
};

/**
 * Shared scroll-lock with reference counting.
 * Prevents premature unlock when modal and mobile nav overlap.
 */
const scrollLock = {
  _count: 0,
  _saved: '',
  _savedPadding: '',
  lock() {
    if (this._count === 0) {
      this._saved = document.body.style.overflow;
      this._savedPadding = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }
    this._count++;
    document.body.style.overflow = 'hidden';
  },
  unlock() {
    this._count = Math.max(0, this._count - 1);
    if (this._count === 0) {
      document.body.style.overflow = this._saved;
      document.body.style.paddingRight = this._savedPadding;
    }
  },
};

export const lockScroll = () => scrollLock.lock();
export const unlockScroll = () => scrollLock.unlock();

/**
 * Basic email format check (covers 99% of real addresses).
 */
export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
