const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);
console.log(searchParams.get("userId"));

// Select elements from HTML
// Fetch data of the user with a given id, then prefill the form with this data
// When form is submitted, read and validate form data, then send UPDATE request to update user information https://dummyjson.com/docs/users#users-update
// Once you get response, show a success or error message on the page