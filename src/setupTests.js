import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock global fetch for SVG or other network requests in tests
vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({
    ok: true,
    text: () => Promise.resolve('<svg></svg>')
  })
));
