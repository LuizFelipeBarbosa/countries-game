import countries from '../assets/countries.json';

const seededRandom = (seed) => {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export const generatePuzzle = (adjacencyMap, bfs, seed) => {
  let start, end, path;
  const countryList = countries.map(c => c.alpha3);
  const random = seed ? () => seededRandom(seed++) : Math.random;

  while (!path || path.length < 3 || path.length > 9) {
    start = countryList[Math.floor(random() * countryList.length)];
    end = countryList[Math.floor(random() * countryList.length)];
    if (start !== end) {
      path = bfs(start, end);
    }
  }

  return { start, end, shortest: path.length - 1 };
};
