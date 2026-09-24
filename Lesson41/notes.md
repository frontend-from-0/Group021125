# Node.js, Express and API

## Node.js 
A runtime that lets us execute JavaScript outside the browser.

Browser
  └── JavaScript
      ├── document
      ├── window
      └── DOM

Node.js
  └── JavaScript
      ├── filesystem
      ├── network
      ├── processes
      └── servers


## Express
A library/framework running on Node that makes creating HTTP servers and APIs much easier.

Node itself can do this:
```JS
http.createServer(...)
````

Express turns that low-level work into:
```JS
app.get('/users', ...)
```

Express defines routes by combining an HTTP method, path, and handler.

## API
The interface through which another application communicates with our backend.

An API is not Express. And Node isn't an API.



# A backend is a running program waiting for requests

```JS
console.log('hello')
```

runs and exits

```JS
app.listen(5000)
````

Start a server and keep this program alive. Wait for requests.

`http://localhost:5000`
localhost = my computer
5000      = which application on my computer

Connect to the application listening on port 5000 on my machine.



# Request → Response

Every HTTP interaction can initially be simplified to:
Request -> Server Code -> Response


A request contains roughly:
- Method
- URL
- Headers
- Body

A response contains:
Status code
Headers
Body


Example (expressJS):
```JS
app.get('/greet', (req, res) => {
  res.send('Hello World!')
})
```


# The 4 places input can come from

## Route params

```HTTP
GET /users/123
```

```JS
req.params.id
```
Use when identifying a resource.

## Query params
```HTML
GET /users?role=admin&page=2
```


```JS
req.query.role
req.query.page
```

Use for filtering, sorting, pagination, optional modifiers.

## Body
```HTTP
POST /users
Content-Type: application/json

{
  "name": "Anna",
  "email": "anna@example.com"
}
```

```JS
req.body
````


## Headers
```
Content-Type=application/json
Authorization=Bearer key_1234514213213
```

