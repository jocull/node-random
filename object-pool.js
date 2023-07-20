const _ = require('lodash');
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: '.cache.db',
  },
  useNullAsDefault: false,
});
// process.on('SIGINT', () => knex.destroy());
// process.on('SIGTERM', () => knex.destroy());

const objectGenerator = require('./object-generator');

function generateObjectString() {
  while (true) {
    try {
      const obj = objectGenerator.runOnce();
      obj.randomDouble = Math.random(); // Attach a known random field worth parsing
      return JSON.stringify(obj);
    } catch (err) {
      // TODO: Kind of gross. Can we fix with by limiting max depth?
      console.error('Generation error - will skip this one', err);
    }
  }
}

async function createTableIfNotExists() {
  try {
    const tableExists = await knex.schema.hasTable('object_cache');
    if (!tableExists) {
      await knex.schema.createTable('object_cache', (table) => {
        table.increments('id').primary();
        table.string('value');
      });
      console.log('Cache table created');
    } else {
      console.log('Cache table already exists');
    }
    return (await knex.raw(`SELECT COUNT(*) as count FROM object_cache`))[0].count;
  } catch (err) {
    console.error('Error creating cache table:', err.message);
    throw err;
  }
}

module.exports = (async function () {
  const poolSize = 1000;
  let existingRows = await createTableIfNotExists();
  if (existingRows < poolSize) {
    console.log("Generating + writing random objects...");
    for (let i = 1; i <= poolSize; i++) {
      const objStr = generateObjectString();
      await knex.raw(`INSERT INTO object_cache (value) VALUES (:value)`, { value: objStr });
      if (i % 250 == 0 && i > 0) {
        console.log(`${i}...`);
      }
    }
  } else {
    console.log("Using objects from cache");
  }
  const results = (await knex.raw(`SELECT id, value FROM object_cache ORDER BY RANDOM()`))
    .map(row => JSON.parse(row.value));

  knex.destroy(); // Close it, we're done

  console.log("Random object pool is ready");
  return results;
})();
