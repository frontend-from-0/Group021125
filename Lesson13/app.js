const name = 'John';


function sayName () {
  const name = 'Jane';

  console.log('The name inside sayName function is', name);

  function sayNameOneMoreTime() {
    console.log('The name inside sayNameOneMoreTime function is', name);
  }

  sayNameOneMoreTime();
}

sayName ();

console.log('The name inside global scope is', name);
