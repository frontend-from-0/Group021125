// Inline comment

/* 
This 
is a

 multi 
 line 
 comment
 */

// Variable(s)
// Const is a keyword that we use to declare a variable that cannot be changed
const name = 'John';

// let is a keyword that we use to declare a variable that can be changed
let surname = 'Doe';

// var is a keyword that we used to declare variables but it should not be used for new code
var oldVariable = 'xyz';

// Function(s) - reusable "recipes"
function greet() {
  const myPrivateVarible = 'something';

  console.log('Hello!');
}

const myNumber = 901;

let city = 'NewYork';

let boolean = true;

const address = {
  city: 'istanbul',
  postcode: '34200',
};

let colors = ['yellow', 'black', 'green'];
const birtday = new Date('2020-05-20'); // Wed May 20 2020 02:00:00 GMT+0200 (Central European Summer Time)

let color = 'red';

let undefinedVariable; // value is undefined
const someEmptyVariable = undefined; // when using const, you MUST use equality sign

let empty = null;

console.log("This is the value of the variable called 'empty'", empty);
// This is the value of the variable called 'empty' null

const user = {
  username: 'johndoe',
  email: 'john@gmail.com',
  password: 'XFASJSAFJSALDINSALDNSALNDLSANL',
  thumb: null,
};



