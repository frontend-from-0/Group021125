// const http = require('node:http');
import http from 'node:http';

const hostname = '127.0.0.1';
const port = 3333;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const greeting = url.searchParams.get('greeting');
  console.log('The role is', greeting);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(`${greeting}, World!\n`);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
