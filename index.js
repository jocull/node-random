const express = require('express');
const _ = require('lodash');
const randomObjectPool = require('./object-pool');

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  await randomDelay();
  res.contentType('application/json').send(_.sample(randomObjectPool));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

async function randomDelay() {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.round(Math.random() * 1000));
  });
}
