/* eslint-env node */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const countriesPath = path.resolve(
  __dirname,
  '../src/assets/countries_with_continents.json'
);
const outlinesDir = path.resolve(__dirname, '../public/quality_outlines');
const outputPath = path.resolve(
  __dirname,
  '../src/assets/quality_outline_map.json'
);

const countries = JSON.parse(fs.readFileSync(countriesPath, 'utf8'));
const files = fs.readdirSync(outlinesDir).map((f) => f.replace(/\.svg$/, ''));

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '_');
}

const special = {
  ci: 'ca_te_d_ivoire',
  gq: 'eq_guinea',
  vc: 'st_vin_and_gren',
  st: 'sao_toma_and_principe',
  ss: 's_sudan',
};

const mapping = {};
const unmatched = [];

countries.forEach((country) => {
  let file = null;
  const candidates = country.name.map(slugify);

  for (const cand of candidates) {
    file = files.find((f) => f.startsWith(cand)) || files.find((f) => cand.startsWith(f));
    if (!file) {
      const cand2 = cand
        .replace(
          /_(the|of|and|republic|democratic|islamic|kingdom|state|federation|people_s|people|arab|united|commonwealth|independent|socialist)_/g,
          '_'
        )
        .replace(/^_+|_+$/g, '');
      file = files.find((f) => f.startsWith(cand2)) || files.find((f) => cand2.startsWith(f));
    }
    if (file) break;
  }

  if (!file && special[country.alpha2]) {
    file = special[country.alpha2];
  }

  if (!file) {
    unmatched.push(country.alpha2);
  } else {
    mapping[country.alpha2] = `${file}.svg`;
  }
});

if (unmatched.length) {
  console.error('Unmatched countries:', unmatched.join(', '));
  process.exit(1);
}

fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2), 'utf8');
console.log(
  'Generated quality outline map for',
  Object.keys(mapping).length,
  'countries.'
);
