// confirmButton.addEventListener('click', () => {
//   alert('Button was clicked!')
// });

/* 
1. Select all necessary elements
2. When user selects a date, show it in the Summary section
  - add event listener with type 'change' / 'blur' to the date input
3. When user clicks on timeslot button, show its value in the Summary section
  - mark clicked button as selected with a different color (add 'selected' class)
  - before selecting an option, remove 'selected' class from all other options
  - only show time that was selected on the last click

4. Make confirm button disabled by default, only when all fields are filled it should be enabled (toggle a css class and disabled property)
*/

const dateInput = document.getElementById('date');
const timeSlotElements = document.getElementsByClassName('slot');
const selectedDateElement = document.getElementById('selected-date');
const selectedTimeElement = document.getElementById('selected-time');
const confirmButton = document.getElementById('confirm');
const data = { date: null, time: null };


dateInput.addEventListener('change', () => {
  if (dateInput.value) {
    selectedDateElement.textContent = dateInput.value;
    data.date = dateInput.value;
  } else {
    selectedDateElement.textContent = '-';
    data.date=null;
  }
  allowSubmit();
});

[...timeSlotElements].forEach((element) => {
  element.addEventListener('click', () => {
    deselectTimeSlots();

    selectedTimeElement.textContent = element.textContent;
    element.classList.add('selected');
    data.time = element.textContent;
    allowSubmit();
  });
});

function deselectTimeSlots() {
  [...timeSlotElements].forEach((element) =>
    element.classList.remove('selected'),
  );
}

function allowSubmit() {
  if (data.date && data.time) {
    confirmButton.removeAttribute('disabled');
  } else {
    confirmButton.setAttribute('disabled', true);
  }
}

