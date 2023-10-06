import initializeFlatpickr from './calendar';

const radioInputs = document.querySelectorAll('.js-input');
const loanPrecentageAmount = document.querySelector('.js-amount-precentage');
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

export const loanDate = () => {
  initializeFlatpickr('.js-date', {
    disableMobile: true,
    dateFormat: 'd/m/Y',
    defaultDate: 'today',
    minDate: 'today',
    onChange: handleDateChange,
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

  updateLoanPercentage();
  updateMonthlyPayment();
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

radioInputs.forEach((radio) => {
  radio.addEventListener('input', handleRadioInput);
});

const handleDateChange = (selectedDates) => {
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + 3);

  if (selectedDates[0] > currentDate) {
    interestRate = 6.8;
  } else {
    interestRate = 4.95;
  }
  updateLoanPercentage();
  updateMonthlyPayment();
};

const updateLoanPercentage = () => {
  loanPrecentageAmount.textContent = `${interestRate.toLocaleString('ru-RU')}%`;
};
