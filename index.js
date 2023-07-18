const express = require('express');
const _ = require('lodash');
const objectGenerator = require('./object-generator');

const app = express();
const port = 3000;

console.log(`Generating random object pool...`);
const randomObjectPool = _.range(0, 1000)
  .map(i => {
    while (true) {
      try {
        const obj = objectGenerator.runOnce();
        const str = JSON.stringify(obj, null, 2);
        return str;
      } catch (err) {
        // TODO: Kind of gross. Can we fix with by limiting max depth?
        console.error('Generation error - will skip this one', err);
      }
    }
  });

app.get('/', (req, res) => {
  const randomElement = randomObjectPool[Math.floor(Math.random() * randomObjectPool.length)];
  res.contentType('application/json').send(randomElement);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

async function randomDelay() {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.round(Math.random() * 1000));
  });
}
