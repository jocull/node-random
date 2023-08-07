// https://stackoverflow.com/a/54949738/97964
const h = require('hasard');

const randomInteger = h.integer(10, 30);
const randomNumber = h.number([0, 100_000]);
const randomKeyString = h.string({
  size: h.integer(5, 30),
  value: h.value('abcdefghijklmnopqrstuvwxyz_'.split('')),
});
const randomValueString = h.string({
  size: h.integer(20, 1_000),
  value: h.value('abcdefghijklmnopqrstuvwxyz1234567890'.split('')),
});

const randomKeys = h.array({
  size: randomInteger,
  value: randomKeyString,
});
const randomValue = h.value([
  randomValueString,
  randomNumber,
  randomInteger,
]);
const randomObject = h.object(
  randomKeys,
  randomValue,
);

module.exports = function generate() {
  const l3 = randomObject.runOnce();
  const l2 = randomObject.runOnce();
  const l1 = randomObject.runOnce();

  const keys = randomKeys.runOnce();
  l1.set = randomObject.run(randomInteger.runOnce());
  l2.set = randomObject.run(randomInteger.runOnce());
  l3.set = randomObject.run(randomInteger.runOnce());

  l1[keys[0]] = l2;
  l2[keys[1]] = l3;

  return l1;
}
