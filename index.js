const express = require('express');
const h = require('hasard');

const app = express();
const port = 3000;

// https://stackoverflow.com/a/54949738/97964
const randomObjectGenerator = (function () {
  const randomInteger = h.integer({ type: 'poisson', lambda: 4 });

  const randomString = h.string({
    size: h.add(randomInteger, 5),
    value: h.value('abcdefghijklmnopqrstuvwxyz'.split('')),
  });

  const randomNumber = h.number([0, 100]);

  const randomKeys = h.array({
    size: randomInteger,
    value: randomString,
  });

  // we first define it, to use it as reference into randomObject
  const randomValue = h.value();

  const randomObject = h.object(
    randomKeys,
    randomValue,
  );

  // And we set recursivity by setting his values afterward
  randomValue.set([
    randomString,
    randomNumber,
    randomInteger,
    randomObject, // TODO: Can cause stack overflow because we keep nesting deeper objects
  ]);

  return randomObject;
})();

console.log(`Generating random object pool...`);
const randomObjectPool = [];
for (let i = 0; i < 1000; i++) {
  try {
    const obj = randomObjectGenerator.runOnce();
    const str = JSON.stringify(obj, null, 2);
    randomObjectPool.push(str);
  } catch (err) {
    // TODO: Kind of gross. Can we fix with by limiting max depth?
    console.error('Generation error - will skip this one', err);
  }
}

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
