// Arrays 
// Basic Example
const numbers = ['hello', null, true, undefined, function () {console.log(hello);}];

// Without destructuring

// With destructuring



// Skipping Elements
// const [first, , , fourth] = [0, 0, 0];
// console.log(first); 
// console.log(fourth);
// console.log('--------'); // 4


// Using Rest Parameters to Capture the Rest of the Elements
const [first, second, ...remaningElementsArray] = numbers;
console.log(first, second, remaningElementsArray);


// Default Values



// Objects
// Basic Usage

const person = {
  name: 'Alice',
  age: 30,
  job: 'Engineer',
  isStudent: true
};

// Without destructuring


// With destructuring


// Renaming Variables



// Default Values


// Nested Objects

const personWithContactInfo = {
  name: 'Dave',
  age: 32,
  contact: {
    email: 'dave@example.com',
    phone: '123456789',
    address: {
      line1: "Kungstagatan 1",
      postcode: '444222'
    }
  }
};



// Rest Properties




