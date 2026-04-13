/**
 * Booking modal with focus trapping
 */
import { $, $$, trapFocus, lockScroll, unlockScroll } from './utils.js';

const modal = $('#bookingModal');
const openBtn = $('#openBooking');
const closeBtn = $('#closeBooking');
const form = $('#bookingForm');

let previousFocus = null;

const resetFormState = () => {
  if (!form) return;
  modal.classList.remove('booking-modal--sent');
  const successEl = $('#formSuccess');
  if (successEl) successEl.classList.remove('form-success--visible');
  form.querySelectorAll('.form-field--error').forEach((el) => {
    el.classList.remove('form-field--error');
  });
};

const open = () => {
  previousFocus = document.activeElement;
  resetFormState();
  modal.classList.add('booking-modal--active');
  modal.setAttribute('aria-hidden', 'false');
  lockScroll();
  closeBtn.focus();
};

const close = () => {
  modal.classList.remove('booking-modal--active');
  modal.setAttribute('aria-hidden', 'true');
  unlockScroll();
  resetFormState();
  if (previousFocus && document.body.contains(previousFocus)) previousFocus.focus();
};

if (modal && openBtn && closeBtn) {
  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);

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
