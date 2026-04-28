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

// Waitlist form
const waitlistForm = $('#waitlistForm');
const waitlistEmail = $('#waitlistEmail');
const waitlistMsg = $('#waitlistMsg');

if (waitlistForm) {
  waitlistForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = waitlistEmail.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!email) {
      waitlistMsg.textContent = 'Please enter your email.';
      waitlistMsg.className = 'waitlist-form__msg waitlist-form__msg--error';
      waitlistEmail.focus();
      return;
    }

    if (!emailRegex.test(email)) {
      waitlistMsg.textContent = 'Please enter a valid email.';
      waitlistMsg.className = 'waitlist-form__msg waitlist-form__msg--error';
      waitlistEmail.focus();
      return;
    }

    const btn = waitlistForm.querySelector('.waitlist-form__btn');
    btn.textContent = '...';
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');

    // Simulate submission (replace with real endpoint)
    setTimeout(() => {
      waitlistMsg.textContent = "You're on the list! We'll be in touch.";
      waitlistMsg.className = 'waitlist-form__msg waitlist-form__msg--success';
      waitlistEmail.value = '';
      btn.textContent = 'Notified ✓';
      btn.disabled = false;
      btn.removeAttribute('aria-busy');
    }, 800);
  });
}
