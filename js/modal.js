/**
 * Booking modal with focus trapping
 */
import { $, $$, trapFocus, lockScroll, unlockScroll } from './utils.js';

const modal = $('#bookingModal');
const closeBtn = $('#closeBooking');

let previousFocus = null;

const open = () => {
  previousFocus = document.activeElement;
  modal.classList.add('booking-modal--active');
  modal.setAttribute('aria-hidden', 'false');
  lockScroll();
  if (closeBtn) closeBtn.focus();
};

const close = () => {
  modal.classList.remove('booking-modal--active');
  modal.setAttribute('aria-hidden', 'true');
  unlockScroll();
  if (previousFocus && document.body.contains(previousFocus)) previousFocus.focus();
};

if (modal) {
  if (closeBtn) {
    closeBtn.addEventListener('click', close);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  $$('[data-booking-trigger]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      open();
    });

    if (!el.matches('a, button')) {
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      });
    }
  });

  modal.addEventListener('keydown', (e) => trapFocus(modal, e));
}

export const isActive = () => modal?.classList.contains('booking-modal--active') ?? false;
export const closeModal = close;
