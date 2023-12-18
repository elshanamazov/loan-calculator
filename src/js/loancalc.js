const radioInputs = document.querySelectorAll('.js-input');
const loanPercentageAmount = document.querySelector('.js-amount-percentage');
const calculatorFieldset = document.querySelector('.calculator__fieldset');
const customRanges = document.querySelectorAll('.js-slider-range');

let interestRate = 4.95;
let isCash = false;

const updateProgressBar = (e) => {
  const rangeProgressesValue = document.querySelectorAll('.js-progress-value');
  const borrowAmount = document.querySelectorAll('.js-borrow-amount');
  const yearsAmount = document.querySelector('.js-year-amount');

  const value = parseInt(e.value);
  const min = parseInt(e.min);
  const max = parseInt(e.max);
  const clampedValue = Math.min(Math.max(value, min), max);
  const getValue = ((e.value - e.min) / (e.max - e.min)) * 100;
  const index = getIndexOfRange(e);

  rangeProgressesValue[index].style.width = getValue + '%';

  if (e.classList.contains('js-range-money')) {
    borrowAmount.forEach((e) => {
      e.innerHTML = `£${clampedValue.toFixed(2)}`;
    });
  }
  if (e.classList.contains('js-range-years')) {
    yearsAmount.innerHTML = `${clampedValue} years`;
  }
};

const getIndexOfRange = (e) => {
  const index = Array.from(customRanges).indexOf(e);
  return index;
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

export const handleDateChange = (selectedDates) => {
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + 3);

  if (selectedDates[0] > currentDate) {
    interestRate = 6.8;
  } else {
    interestRate = 4.95;
  }

  isCash = false;
  radioInputs.forEach((e) => {
    e.value === 'cash' ? (e.checked = false) : (e.checked = true);
  });

  updateLoanPercentage();
  updateMonthlyPayment();
};

const updateLoanPercentage = () => {
  loanPercentageAmount.textContent = `${interestRate.toLocaleString('ru-RU')}%`;
};

calculatorFieldset.addEventListener('input', ({ target }) => {
  if (target.classList.contains('js-slider-range')) {
    const index = getIndexOfRange(target);
    updateProgressBar(target, index);
    updateMonthlyPayment();
  }
});
