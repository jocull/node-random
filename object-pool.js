const fs = require('fs');
const _ = require('lodash');
const objectGenerator = require('./object-generator');

let cached = [];
try {
  cached = require('./.cached.json');
} catch (err) {}

if (_.isEmpty(cached)) {
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

    cached = randomObjectPool;
    fs.writeFileSync('.cached.json', JSON.stringify(randomObjectPool, null, 2));
} else {
  console.log(`Using cached object pool`);
}

module.exports = cached;