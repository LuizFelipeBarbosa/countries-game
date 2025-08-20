/* eslint-env node */
import fs from 'fs/promises';
import process from 'process';

async function main() {
  const countries = JSON.parse(
    await fs.readFile('src/data/countries.json', 'utf8')
  );
  const borders = JSON.parse(
    await fs.readFile('src/data/borders.json', 'utf8')
  );
  const crossings = JSON.parse(
    await fs.readFile('src/data/crossings.json', 'utf8')
  );

  const iso3 = Object.keys(countries);
  const iso3Set = new Set(iso3);

  // validate country codes and structure
  for (const code of iso3) {
    if (!/^[A-Z]{3}$/.test(code)) {
      throw new Error(`Invalid ISO3 code: ${code}`);
    }
    const entry = countries[code];
    if (typeof entry.name !== 'string' || !Array.isArray(entry.aliases)) {
      throw new Error(`Invalid country entry for ${code}`);
    }
  }

  function checkPairs(pairs, label) {
    const seen = new Set();
    for (const pair of pairs) {
      if (!Array.isArray(pair) || pair.length !== 2) {
        throw new Error(`${label}: invalid pair ${JSON.stringify(pair)}`);
      }
      const [a, b] = pair;
      if (!iso3Set.has(a) || !iso3Set.has(b)) {
        throw new Error(`${label}: unknown code in ${pair}`);
      }
      const key = [a, b].sort().join('-');
      if (seen.has(key)) {
        throw new Error(`${label}: duplicate pair ${pair}`);
      }
      seen.add(key);
    }
  }

  checkPairs(borders, 'borders');
  checkPairs(crossings, 'crossings');

  console.log('Data validation passed');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
