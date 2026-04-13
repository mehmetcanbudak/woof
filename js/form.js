/**
 * Booking form with validation UX
 */
import { $, isValidEmail } from './utils.js';

const form = $('#bookingForm');
const submitBtn = $('#submitBtn');
const successEl = $('#formSuccess');
const dateInput = $('#prefDate');
const modal = $('#bookingModal');

if (form && submitBtn && successEl) {

  // Set date min to today
  if (dateInput) {
    const today = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
    dateInput.setAttribute('min', formatter.format(today));
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 90);
    dateInput.setAttribute('max', formatter.format(maxDate));
  }

  const showFieldError = (field) => {
    const wrapper = field.closest('.form-field');
    if (wrapper) wrapper.classList.add('form-field--error');
    field.setAttribute('aria-invalid', 'true');
  };

  const clearFieldError = (field) => {
    const wrapper = field.closest('.form-field');
    if (wrapper) wrapper.classList.remove('form-field--error');
    field.removeAttribute('aria-invalid');
  };

  // Clear errors on input
  form.addEventListener('input', (e) => {
    if (e.target.matches('input, select, textarea')) {
      clearFieldError(e.target);
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Custom validation — check required fields + email format
    const emailField = form.elements.email;
    if (emailField && emailField.value && !isValidEmail(emailField.value)) {
      emailField.setCustomValidity('Please enter a valid email address (e.g. hello@woofbox.nyc)');
    } else if (emailField) {
      emailField.setCustomValidity('');
    }

    if (!form.checkValidity()) {
      let firstInvalid = null;
      for (const el of form.elements) {
        if (el.validity && !el.validity.valid) {
          showFieldError(el);
          if (!firstInvalid) firstInvalid = el;
        }
      }
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span>Sending\u2026';

    // TODO: Replace with real backend submission (Shopify integration pending)
    // Simulate async submission
    setTimeout(() => {
      form.reset();
      submitBtn.innerHTML = 'Request Appointment';
      submitBtn.disabled = false;

      if (modal) modal.classList.add('booking-modal--sent');
      successEl.classList.add('form-success--visible');

      // Clear all error states and aria-invalid
      form.querySelectorAll('.form-field--error').forEach((el) => {
        el.classList.remove('form-field--error');
      });
      form.querySelectorAll('[aria-invalid]').forEach((el) => {
        el.removeAttribute('aria-invalid');
      });

      // Auto-hide success after 4 seconds
      setTimeout(() => {
        successEl.classList.remove('form-success--visible');
        if (modal) modal.classList.remove('booking-modal--sent');
      }, 4000);
    }, 1500);
  });
}
