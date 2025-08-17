import { setCookie, getCookie } from './cookies';

describe('cookie helpers', () => {
  afterEach(() => {
    // Clean up cookies after each test
    document.cookie.split(';').forEach((c) => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });
  });

  it('sets and gets a cookie', () => {
    const key = 'test';
    const value = 'value';
    setCookie(key, value, 1);
    expect(getCookie(key)).toBe(value);
  });

  it('returns null for a non-existent cookie', () => {
    expect(getCookie('nonexistent')).toBeNull();
  });

  it('handles cookies with no expiration', () => {
    const key = 'session-cookie';
    const value = 'session-value';
    setCookie(key, value);
    expect(getCookie(key)).toBe(value);
  });

  it('overwrites an existing cookie', () => {
    const key = 'test';
    const value1 = 'value1';
    const value2 = 'value2';
    setCookie(key, value1, 1);
    setCookie(key, value2, 1);
    expect(getCookie(key)).toBe(value2);
  });
});
