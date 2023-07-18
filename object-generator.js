const h = require('hasard');

// https://stackoverflow.com/a/54949738/97964
module.exports = (function () {
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