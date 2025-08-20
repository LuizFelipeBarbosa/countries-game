import borders from '../data/borders.json';
import crossings from '../data/crossings.json';

export const buildAdjacencyMap = (includeCrossings: boolean): Record<string, string[]> => {
  const adjacencyMap: Record<string, string[]> = { ...borders };

  if (includeCrossings) {
    for (const [country1, country2] of crossings) {
      adjacencyMap[country1] = [...(adjacencyMap[country1] || []), country2];
      adjacencyMap[country2] = [...(adjacencyMap[country2] || []), country1];
    }
  }

  return adjacencyMap;
};

export const bfs = (adjacencyMap: Record<string, string[]>, start: string, end: string) => {
  const queue: (string | null)[] = [start, null];
  const visited = new Set([start]);
  const parentMap: Record<string, string> = {};
  let level = 0;

  while (queue.length > 0) {
    const current = queue.shift();

    if (current === null) {
      if (queue.length > 0) {
        level++;
        queue.push(null);
      }
      continue;
    }

    if (current === end) {
      const path = [end];
      let parent = parentMap[end];
      while (parent) {
        path.unshift(parent);
        parent = parentMap[parent];
      }
      return { path, distance: level };
    }

    const neighbors = adjacencyMap[current] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parentMap[neighbor] = current;
        queue.push(neighbor);
      }
    }
  }

  return { path: [], distance: -1 };
};

export const getDistances = (adjacencyMap: Record<string, string[]>, start: string) => {
  const distances: Record<string, number> = { [start]: 0 };
  const queue: string[] = [start];
  const visited = new Set([start]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = adjacencyMap[current] || [];

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        distances[neighbor] = distances[current] + 1;
        queue.push(neighbor);
      }
    }
  }
  return distances;
};
