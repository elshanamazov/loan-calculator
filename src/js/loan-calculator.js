import initializeFlatpickr from './calendar';

const loanPrecentageAmount = document.querySelector('.js-precentage');
const radioInputs = document.querySelectorAll('.js-input');

let interestRate = 4.95;
let isCash = false;

export const rangeValue = () => {
  const customRanges = document.querySelectorAll('.js-slider-range');
  const rangeProgressesValue = document.querySelectorAll('.js-progress-value');

  customRanges.forEach((e, i) => {
    const updateProgressBar = () => {
      const borrowAmount = document.querySelectorAll('.js-borrow-amount');
      const yearsAmount = document.querySelector('.js-year-amount');
      const value = parseInt(e.value);
      const min = parseInt(e.min);
      const max = parseInt(e.max);
      const clampedValue = Math.min(Math.max(value, min), max);

      const getValue = ((e.value - e.min) / (e.max - e.min)) * 100;
      rangeProgressesValue[i].style.width = getValue + '%';
      if (e.classList.contains('js-range-money')) {
        borrowAmount.forEach((e) => {
          e.innerHTML = `£${clampedValue.toFixed(2)}`;
        });
      }
      if (e.classList.contains('js-range-years')) {
        yearsAmount.innerHTML = `${clampedValue} years`;
      }
    };

    e.addEventListener('input', () => {
      updateProgressBar();
      updateMonthlyPayment();
    });
  });
};

const updateMonthlyPayment = () => {
  const borrowAmount = parseInt(
    document.querySelector('.js-range-money').value
  );
  const yearsAmount = parseInt(document.querySelector('.js-range-years').value);
  const monthPayment = document.querySelector('.js-monthly-payment');

  const monthlyInterestRate = interestRate / 12 / 100;
  const numberOfMonths = yearsAmount * 12;
  const monthlyPayment =
    (borrowAmount * monthlyInterestRate) /
    (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths));

  monthPayment.innerHTML = `£${monthlyPayment.toFixed(2)}`;

  const totalRepay = monthlyPayment * numberOfMonths;
  document.querySelector('.js-repay').innerHTML = `£${totalRepay.toFixed(2)}`;
};

export const loanPrecentage = () => {
  initializeFlatpickr('.js-date', {
    dateFormat: 'd/m/Y',
    defaultDate: 'today',
    minDate: 'today',
    onChange: (selectedDates) => {
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() + 3);
      if (selectedDates[0] > currentDate) {
        interestRate = 6.8;
        radioInputs.forEach((radio) => {
          if (radio.value === 'bank') {
            radio.checked = true;
          } else {
            radio.checked = false;
          }
        });
      } else {
        interestRate = 4.95;
      }

      loanPrecentageAmount.textContent = `${interestRate.toLocaleString(
        'ru-RU'
      )}%`;
      updateMonthlyPayment();
    },
  });
};

const handleRadioInput = (event) => {
  radioInputs.forEach((radio) => {
    if (radio !== event.target) {
      radio.checked = false;
    }
  });

  if (event.target.value === 'cash' && !isCash) {
    interestRate -= 0.5;
    isCash = true;
  } else if (event.target.value === 'bank' && isCash) {
    interestRate += 0.5;
    isCash = false;
  }

  loanPrecentageAmount.textContent = `${interestRate.toLocaleString('ru-RU')}%`;
  updateMonthlyPayment();
};

radioInputs.forEach((radio) => {
  radio.addEventListener('input', handleRadioInput);
});
