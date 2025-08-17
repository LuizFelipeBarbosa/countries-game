import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgPath = path.resolve(__dirname, '../src/assets/map.svg');
const countriesPath = path.resolve(
  __dirname,
  '../src/assets/countries_with_continents.json'
);
const outputDir = path.resolve(__dirname, '../public/outlines');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

let svgContent;
try {
  svgContent = fs.readFileSync(svgPath, 'utf8');
} catch (err) {
  console.error(`Error reading SVG file at ${svgPath}: ${err.message}`);
  process.exit(1);
}
const dom = new JSDOM(svgContent, { contentType: 'image/svg+xml' });
const document = dom.window.document;

const rootSvg = document.querySelector('svg');
const viewBox = rootSvg.getAttribute('viewBox');
const width = rootSvg.getAttribute('width');
const height = rootSvg.getAttribute('height');
const svgAttributes = viewBox
  ? `viewBox="${viewBox}"`
  : `viewBox="0 0 ${width} ${height}"`;

let countries;
try {
  const countriesJson = fs.readFileSync(countriesPath, 'utf8');
  countries = JSON.parse(countriesJson);
} catch (err) {
  if (err.code === 'ENOENT') {
    console.error(`Error: Countries JSON file not found at ${countriesPath}`);
  } else if (err instanceof SyntaxError) {
    console.error(`Error: Countries JSON file at ${countriesPath} is not valid JSON.`);
  } else {
    console.error(`Error reading or parsing countries JSON file at ${countriesPath}:`, err.message);
  }
  process.exit(1);
}

const specialCases = {
  fr: 'frx',
  nl: 'nlx',
  us: 'United_States_lower_48',
  ru: 'path2924',
  ki: 'ki_',
  cl: 'path6470',
  dk: 'Denmark_mainland',
  pt: 'Portugal_mainland',
  es: 'Spain_mainland',
  au: 'Australia_mainland',
  ec: 'Ecuador_mainland',
  cr: 'Costa_Rica_mainland',
  it: 'Italy_mainland',
  ca: 'Canada_mainland',
};

countries.forEach(({ alpha2 }) => {
  const mapId = specialCases[alpha2] || alpha2;
  const element = document.getElementById(mapId);
  if (!element) {
    console.warn(`Element with id '${mapId}' not found for country '${alpha2}'`);
    return;
  }

  const clone = element.cloneNode(true);
  clone.setAttribute('id', alpha2);

  const standaloneSvg = `<svg xmlns="http://www.w3.org/2000/svg" ${svgAttributes}>${clone.outerHTML}</svg>`;
  fs.writeFileSync(path.join(outputDir, `${alpha2}.svg`), standaloneSvg, 'utf8');
});

console.log('Country SVG outlines generated in', outputDir);
