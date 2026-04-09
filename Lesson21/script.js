const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phonePattern = /^\+?\d(?:\s?\d){9,19}$/;

const namePattern = /^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ' \-]*[a-zA-ZÀ-ÿ]$/;
/*
1. Select elements (inputs, error elements, form)

2. Add event listeners (submit, blur)

3. [blur events] Get the value and use if statement to compare value to patter or rules
3a. - value is correct -> move on to the next field
3b. - value is not correct -> show error message (add text to the corresponding error element and remove class hidden)

4. [form submit event] Define variable that keeps information about if the form is correct on now.
Trigger another validation, if no error -> show success message.
*/

const emailInput = document.getElementById('email');
const emailErrorParagraph = document.getElementById('emailError');
const phoneInput = document.getElementById('phone');
const phoneErrorParagraph = document.getElementById('phoneError');
const firstNameInput = document.getElementById('firstName');
const firstNameErrorParagraph = document.getElementById('firstNameError');
const formElement = document.getElementById('checkoutForm');
const successElement = document.getElementById('success');
let formCorrect = true;

function validateEmail(email) {
  if (email.length < 1) {
    emailErrorParagraph.textContent =
      'An email address is required so we can contact you.';
    emailErrorParagraph.classList.remove('hidden');
  } else if (!emailPattern.test(email)) {
    emailErrorParagraph.textContent =
      'That doesn’t look like a valid email address (e.g. name@gmail.com).';
    emailErrorParagraph.classList.remove('hidden');
  } else {
    emailErrorParagraph.textContent = '';
    emailErrorParagraph.classList.add('hidden');
  }
}

function validatePhone(phone) {
  if (phone.length < 1) {
    phoneErrorParagraph.textContent =
      'A phone number is required so we can contact you.';
    phoneErrorParagraph.classList.remove('hidden');
    formCorrect = false;
  } else if (!phonePattern.test(phone)) {
    phoneErrorParagraph.textContent =
      'That doesn’t look like a valid phone number (e.g. +905554443322). Max 20 digits allowed.';
    phoneErrorParagraph.classList.remove('hidden');
    formCorrect = false;
  } else {
    phoneErrorParagraph.textContent = '';
    phoneErrorParagraph.classList.add('hidden');
  }
}

function validateFirstName(firstName) {
  if (firstName.length < 1) {
    firstNameErrorParagraph.textContent = 'First name is required.';
    firstNameErrorParagraph.classList.remove('hidden');
    formCorrect = false;
  } else if (firstName.length > 50) {
    firstNameErrorParagraph.textContent =
      'First name can be 50 characters max.';
    firstNameErrorParagraph.classList.remove('hidden');
    formCorrect = false;
  } else if (!namePattern.test(firstName)) {
    firstNameErrorParagraph.textContent =
      'Names can only contain letters and standard punctuation like hyphens or spaces.';
    firstNameErrorParagraph.classList.remove('hidden');
    formCorrect = false;
  } else {
    firstNameErrorParagraph.textContent = '';
    firstNameErrorParagraph.classList.add('hidden');
  }
}

emailInput.addEventListener('change', () => {
  const emailValue = emailInput.value.trim();
  validateEmail(emailValue);
});

phoneInput.addEventListener('change', () => {
  const phoneValue = phoneInput.value.trim();
  validatePhone(phoneValue);
});

firstNameInput.addEventListener('change', () => {
  const firstNameValue = firstNameInput.value.trim();
  validateFirstName(firstNameValue);
});


formElement.addEventListener('submit', (event) => {
  event.preventDefault();

  // TODO: Find error that prevents error message from showing up
  validateEmail(emailValue);
  validatePhone(phoneValue);
  validateFirstName(firstNameValue);

  if (formCorrect){
    successElement.classList.remove('hidden');
    formElement.classList.add('hidden');
  }
})


