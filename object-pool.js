const fs = require('fs');
const os = require('os');
const readline = require('readline');

const _ = require('lodash');
const objectGenerator = require('./object-generator');
const CACHE_FILENAME = '.cached';

let cached = [];
if (fs.existsSync(CACHE_FILENAME)) {
  try {
    cached = fs.readFileSync(CACHE_FILENAME).toString().split('\n').map(line => JSON.parse(line));
  } catch (err) {
    console.error('Failed to read from cache', err);
  }
}

if (_.isEmpty(cached)) {
  console.log(`Generating new random object pool, this may take a bit...`);
  const randomObjectPool = _.range(0, 1000)
    .map(i => {
      while (true) {
        try {
          const obj = objectGenerator.runOnce();
          obj.randomDouble = Math.random(); // Attach a known random field worth parsing
          const str = JSON.stringify(obj, null, 2);
          return str;
        } catch (err) {
          // TODO: Kind of gross. Can we fix with by limiting max depth?
          console.error('Generation error - will skip this one', err);
        }
      }
    });

  cached = randomObjectPool;
  fs.writeFileSync(CACHE_FILENAME, '');
  randomObjectPool.forEach((obj, idx) => fs.appendFileSync(CACHE_FILENAME, (idx > 0 ? os.EOL : '') + JSON.stringify(obj)));
} else {
  console.log(`Using cached object pool`);
}

module.exports = cached;