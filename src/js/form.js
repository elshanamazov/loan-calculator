const form = document.getElementById('form');
const successMessage = document.getElementById('success-message');

const handleForm = (event) => {
  event.preventDefault();
  successMessage.style.display = 'block';
  setTimeout(() => {
    successMessage.style.display = 'none';
  }, 2000);
};

form.addEventListener('submit', handleForm);
