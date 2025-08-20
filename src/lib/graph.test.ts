import { describe, it, expect } from 'vitest';
import { buildAdjacencyMap, bfs, getDistances } from './graph';

describe('graph', () => {
  describe('buildAdjacencyMap', () => {
    it('should build an adjacency map from borders', () => {
      const adjMap = buildAdjacencyMap(false);
      expect(adjMap['usa']).toContain('mex');
      expect(adjMap['usa']).toContain('can');
    });

    it('should include crossings when specified', () => {
      const adjMap = buildAdjacencyMap(true);
      expect(adjMap['gbr']).toContain('fra');
    });
  });

  describe('bfs', () => {
    it('should find the shortest path between two countries', () => {
      const adjMap = buildAdjacencyMap(true);
      const { path, distance } = bfs(adjMap, 'usa', 'mex');
      expect(path).toEqual(['usa', 'mex']);
      expect(distance).toBe(1);
    });

    it('should find a longer path', () => {
        const adjMap = buildAdjacencyMap(true);
        const { path, distance } = bfs(adjMap, 'fra', 'pol');
        expect(path).toEqual(['fra', 'deu', 'pol']);
        expect(distance).toBe(2);
    });
  });

  describe('getDistances', () => {
    it('should return a map of distances from the start node', () => {
      const adjMap = buildAdjacencyMap(true);
      const distances = getDistances(adjMap, 'usa');
      expect(distances['usa']).toBe(0);
      expect(distances['mex']).toBe(1);
      expect(distances['can']).toBe(1);
    });
  });
});
