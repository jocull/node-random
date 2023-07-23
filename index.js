const express = require('express');
const _ = require('lodash');
const objectPoolPromise = require('./object-pool');

const app = express();
const port = parseInt(process.argv[2] || 3000);
console.log("Using port", port);

async function randomDelay() {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.round(Math.random() * 50));
  });
}

(async function main() {
  const objectPool = await objectPoolPromise;

  function sendRandomObject(req, res) {
    if (req.accepts('json')) {
      res.type('json').send(_.sample(objectPool));
    } else {
      res.type('txt').send(_.sample(objectPool))
    }
  }

  app.get('/', async (req, res) => {
    sendRandomObject(req, res);
  });

  app.get('/slow', async (req, res) => {
    await randomDelay();
    sendRandomObject(req, res);
  });

  app.post('/', async (req, res) => {
    res.status(204).send();
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
})();
