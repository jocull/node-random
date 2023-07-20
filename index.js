const express = require('express');
const _ = require('lodash');
const objectPoolPromise = require('./object-pool');

const app = express();
const port = 3000;

async function randomDelay() {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.round(Math.random() * 50));
  });
}

(async function main() {
  const objectPool = await objectPoolPromise;

  app.get('/', async (req, res) => {
    res.contentType('application/json').send(_.sample(objectPool));
  });

  app.get('/slow', async (req, res) => {
    await randomDelay();
    res.contentType('application/json').send(_.sample(objectPool));
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
})();
