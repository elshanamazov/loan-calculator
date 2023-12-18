import '../scss/style.scss';
import initializeFlatpickr from './flatpickr.js';
import './form.js';
import { handleDateChange } from './loancalc';

initializeFlatpickr('.js-date', {
  disableMobile: true,
  dateFormat: 'd/m/Y',
  defaultDate: 'today',
  minDate: 'today',
  onChange: handleDateChange,
});
