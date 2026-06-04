const button = document.getElementById('clickMeBtn');
button.addEventListener('click', () => printHello('Furkan'));


function printHello(name = 'Guest') {
  console.log('Hello', name);
}