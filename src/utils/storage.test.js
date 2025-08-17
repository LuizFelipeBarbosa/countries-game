/* eslint-env jest */
/* eslint-disable no-undef */
import { setItem, getItem } from './storage';

describe('storage helpers', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('sets and gets a value', () => {
    setItem('test', 'value');
    expect(getItem('test')).toBe('value');
  });

  it('returns null for missing key', () => {
    expect(getItem('missing')).toBeNull();
  });

  it('handles numeric values', () => {
    setItem('number', 42);
    expect(getItem('number')).toBe(42);
  });
});
