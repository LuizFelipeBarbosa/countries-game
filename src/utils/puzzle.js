import countries from '../assets/countries.json';

const seededRandom = (seed) => {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export const generatePuzzle = (adjacencyMap, seed) => {
  let start, end, path;
  const countryList = countries.map(c => c.alpha3);
  const random = seed ? () => seededRandom(seed++) : Math.random;

  const bfs = (startNode, endNode) => {
    const queue = [[startNode, [startNode]]];
    const visited = new Set([startNode]);

    while (queue.length > 0) {
      const [currentNode, currentPath] = queue.shift();

      if (currentNode === endNode) {
        return currentPath;
      }

      const neighbors = adjacencyMap.get(currentNode) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          const newPath = [...currentPath, neighbor];
          queue.push([neighbor, newPath]);
        }
      }
    }
    return null; // No path found
  };

  while (!path || path.length < 3 || path.length > 9) {
    start = countryList[Math.floor(random() * countryList.length)];
    end = countryList[Math.floor(random() * countryList.length)];
    if (start !== end) {
      path = bfs(start, end);
    }
  }

  return { start, end, shortest: path.length - 1 };
};
