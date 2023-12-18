import flatpickr from 'flatpickr';

export default function initializeFlatpickr(selector, options = {}) {
  const element = document.querySelector(selector);
  if (element) {
    flatpickr(element, options);
  }
}
