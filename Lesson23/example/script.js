const fetchButton = document.getElementById('fetchDataBtn');
const errorMsg = document.getElementById('errorMsg');
const randomImage = document.getElementById('randomImage');

function getPosts() {
  fetch('https://jsonplaceholder.typicode.com/posts')
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `An error occured when fetching posts. Status: ${response.status}, status text: ${response.statusText}`,
        );
      }
      console.log('Right after the error!');
      return response.json();
    })
    .then((resultOfResponseJson) => console.log(resultOfResponseJson))
    .catch((error) => {
      console.error('An error occured.', error);
      errorMsg.textContent = 'An error occured when fetching posts.';
    })
    .finally(() => {
      document.getElementsByTagName('body')[0].classList.toggle('bg-dark');
    });
}

/*
When fetching data, we call fetch() function. If we print the result directly, it gives us a Promise. If we apply .then(), then we can see the actual result inside .then() function.

*/

function getRandomPhoto() {
  fetch(`https://api.unsplash.com/photos/random?client_id=${UNSPLASH_CLIENT_ID}`)
    .then(
      (response) => {
      if (!response.ok) {
        throw new Error(
          `An error occured when fetching random photo. Status: ${response.status}, status text: ${response.statusText}`,
        );
      }
      return response.json();
    }
  )
    .then((data) => {
      console.log(data);
      randomImage.src = data.urls.regular;
      randomImage.alt = data.alt_description;
      return false;
    })
    .then(somethinElse => console.log('Something else is', somethinElse))
    .catch((error) => {
      console.error('An error occured.', error);
      errorMsg.textContent = 'An error occured when fetching random photo.';
    });
}

fetchButton.addEventListener('click', getRandomPhoto);
