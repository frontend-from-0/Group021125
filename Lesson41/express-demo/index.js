const express = require('express');

const app = express();

const myLogger = function (req, res, next) {
  console.log(`[${new Date().toISOString()}] Incoming request from ${req.ip} ${req.method} ${req.originalUrl}`);
  next();
};

app.use(myLogger);


app.get('/greet/:word', (req, res) => {
  console.log(req.params.word);
  const incomingWord = req.params.word;
  if (incomingWord) {
    res.send(`${incomingWord} world!`);
  } else {
    res.send('Hello World!');
  }
});

app.post('/greet', (req, res) => {
  console.log(req.body);
  res.status(201).json({
    status: 'success',
    greeting: {
      word: 'created',
    },
  });
});

app.listen(8000);
