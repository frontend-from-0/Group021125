const secondaryHeading = document.getElementById('secondaryHeading');
secondaryHeading.classList.add('text-accent');

const secondaryTextElements = document.getElementsByClassName('text-secondary');
console.log(secondaryTextElements);

for (const secondaryTextElement of secondaryTextElements) {
  setTimeout(() => {
    secondaryTextElement.style.color = 'pink';
  }, 1000);
}

const spanElements = document.getElementsByTagName('span');
for (const spanElement of spanElements) {
  spanElement.classList.toggle('text-underline');
}

const lastParagraph = document.querySelector('p:last-of-type');
lastParagraph.classList.add('text-large', 'text-secondary');


const allParagraphs = document.querySelectorAll('p');
allParagraphs[1].textContent = 'This is the second paragraph';


const secondParapraph = document.querySelector('p:nth-of-type(2)');
secondParapraph.textContent = 'Second p another time!!!';


const conditionsCheckBoxElements = document.getElementsByName("accepted-conditions");
conditionsCheckBoxElements[0].value = 'off'
