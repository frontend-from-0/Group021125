// 1. Convert the function below into asyncrounous function using async/await and try/catch syntax.
// function fetchPosts () {
//   fetch('https://jsonplaceholder.typicode.com/posts')
//     .then((response) => response.json())
//     .then((posts) => console.log(posts))
//     .catch((error) => console.error(error));
// };

async function fetchPosts() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    // if (!response.ok) {
    //   throw Error(`Failed fetching data, status code ${response.status}`);
    // }
    const posts = await response.json();
    console.log(posts);
  } catch (error) {
    console.error(error);
  }
}

// 2. Convert the function below into asyncrounous function using async/await and try/catch syntax.
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Data fetched successfully!');
    }, 2000);
  });
};

// fetchData()
//   .then((result) => console.log(result))
//   .catch((error) => console.error(error));
const main = async () => {
  try {
    const result = await fetchData();
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

main();

// IIFE example
(async () => {
  try {
    const result = await fetchData();
    console.log(result);
  } catch (error) {
    console.log(error);
  }
})();

// 3. Convert the function below into asyncrounous function using async/await and try/catch syntax.
// const fetchUsers = () => {
//   return fetch('https://jsonplaceholder.typicode.com/users')
//     .then((response) => response.json())
//     .then((users) => {
//       console.log(users);
//       return users;
//     });
// };

// fetchUsers()
//   .then((users) => console.log('Total users:', users.length))
//   .catch((error) => console.error(error));

const fetchUsers = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const users = await response.json();
  console.log(users);
  return users;
};

async function logUsersTotal() {
  try {
    const users = await fetchUsers();
    console.log('Total users:', users.length);
  } catch (error) {
    console.error(error);
  }
}
logUsersTotal();

// 4. Convert the function below into asyncrounous function using async/await and try/catch syntax.
const fetchUserData = async () => {
  try {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/posts/1',
    );
    const user = await response.json();
    return user;
  } catch (error) {
    throw error;
  }
};

async function logUser() {
  try {
    const user = await fetchUserData();
    console.log('User data:', user);
  } catch (error) {
    console.error('Error:', error);
  }
}
logUser();

// 5. Convert the function below into asyncrounous function using async/await and try/catch syntax.
// const getPostsAndComments = () => {
//   fetch('https://jsonplaceholder.typicode.com/posts/1')
//     .then((response) => response.json())
//     .then((post) => {
//       return fetch(
//         `https://jsonplaceholder.typicode.com/comments?postId=${post.id}`,
//       );
//     })
//     .then((response) => response.json())
//     .then((comments) => console.log(comments))
//     .catch((error) => console.error(error));
// };

const getPostsAndComments = async () => {
  try {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/posts/1',
    );
    const post = await response.json();
    const commentsResponse = await fetch(
      `https://jsonplaceholder.typicode.com/comments?postId=${post.id}`,
    );
    const comments = await response.json();
    console.log(comments);
  } catch (error) {
    console.error(error);
  }
};

// 6.Convert the function below into asyncrounous function using async/await and try/catch syntax.

const fetchWithTimeout = (url, timeout) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const response = await fetch(url);
        resolve(response.json());
      } catch (error) {
        reject(error);
      }
    }, timeout);
  });
};

const fetchWithTimeout = (url, timeout) => {
  setTimeout(() => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(url);
        resolve(response.json());
      } catch (error) {
        reject(error);
      }
    });
  }, timeout);
};

async function fetchPostsWithDelay() {
  try {
    const posts = await fetchWithTimeout(
      'https://jsonplaceholder.typicode.com/posts',
      2000,
    );
    console.log(posts);
  } catch (error) {
    console.error(error);
  }
}

fetchPostsWithDelay();
